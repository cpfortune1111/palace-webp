import re,json,pathlib
ROOT=pathlib.Path(__file__).parent

def clean(s): return s.split(';',1)[0].strip()
def num(s):
    s=clean(s)
    try:return float(s)
    except:return None

def sections(txt):
    out=[]; cur=None
    for raw in txt.splitlines():
        line=raw.strip()
        m=re.match(r'^\[([^\]]+)\]',line)
        if m:
            cur={'header':m.group(1).strip(),'lines':[]};out.append(cur)
        elif cur: cur['lines'].append(raw)
    return out

def kv(lines):
    d={}
    for raw in lines:
        line=clean(raw)
        if '=' in line:
            k,v=line.split('=',1);d[k.strip().lower()]=v.strip()
    return d

def parse_constants(txt):
    sec={s['header'].lower():kv(s['lines']) for s in sections(txt)}
    v=sec.get('velocity',{}); m=sec.get('movement',{}); out={}
    def pair(name, scalar_is_x=True):
        if name not in v:return
        parts=[num(x) for x in v[name].split(',')]
        if len(parts)>1:
            out[f'velocity.{name}.x']=parts[0];out[f'velocity.{name}.y']=parts[1]
        elif scalar_is_x: out[f'velocity.{name}.x']=parts[0]
    for n in ['walk.fwd','walk.back','run.fwd','run.back','jump.neu','jump.fwd','jump.back','runjump.fwd','runjump.back','airjump.neu','airjump.fwd','airjump.back']: pair(n)
    # MUGEN/IKEMEN aliases used by const(velocity.jump.y), etc.
    if 'velocity.jump.neu.y' in out: out['velocity.jump.y']=out['velocity.jump.neu.y']
    if 'velocity.runjump.fwd.y' in out: out['velocity.runjump.y']=out['velocity.runjump.fwd.y']
    if 'velocity.airjump.neu.y' in out: out['velocity.airjump.y']=out['velocity.airjump.neu.y']
    for k,val in m.items():
        n=num(val)
        if n is not None: out['movement.'+k]=n
    return out

def parse_cns(txt):
    states={}; controllers={}
    current_state=None
    for s in sections(txt):
        h=s['header']; low=h.lower()
        mm=re.match(r'statedef\s+(-?\d+)',low)
        if mm:
            current_state=int(mm.group(1)); d=kv(s['lines'])
            states[str(current_state)]={'type':clean(d.get('type','N')).upper(),'physics':clean(d.get('physics','N')).upper()}
            for key in ['anim','ctrl','sprpriority']:
                if key in d:
                    n=num(d[key]); states[str(current_state)][key]=int(n) if n is not None and n.is_integer() else n
            controllers.setdefault(str(current_state),[])
        elif low.startswith('state ') and current_state is not None:
            d=kv(s['lines']); typ=clean(d.get('type','Unknown'))
            controllers[str(current_state)].append({'type':typ,'params':d,'sourceHeader':h})
    return states,controllers

def parse_zss(txt):
    states={}
    # StateDef N; key: val; key: val;]
    for mm in re.finditer(r'\[StateDef\s+(-?\d+)\s*;([^\]]*)\]',txt,re.I):
        n=mm.group(1); body=mm.group(2); d={}
        for part in body.split(';'):
            if ':' in part:
                k,v=part.split(':',1);d[k.strip().lower()]=clean(v)
        states[n]={'type':d.get('type','N').upper(),'physics':d.get('physics','N').upper()}
        for key in ['anim','ctrl','sprpriority']:
            if key in d:
                x=num(d[key]);states[n][key]=int(x) if x is not None and x.is_integer() else x
    return states

def lower(cns_states, ctrls, consts):
    wanted=['0','11','20','40','50','51','52']; out={}
    anim_defaults={'0':0,'11':11,'20':20,'40':40,'50':'JumpByVelocity','51':'Keep','52':47}
    for n in wanted:
        src=cns_states[n]; st={'type':src['type'],'physics':src['physics'],'anim':src.get('anim',anim_defaults[n]),'ctrl':src.get('ctrl',1),'controllers':[]}
        if n=='20': st['controllers']=[{'type':'WalkVelocity','source':'State 20 movement semantics'}]
        elif n=='40': st['controllers']=[{'type':'JumpTakeoff','trigger':'AnimDone','nextState':50,'source':'VelSet + ChangeState'}]
        elif n=='50': st['anim']='JumpByVelocity';st['controllers']=[{'type':'ChangeState','trigger':'VelYPositive','value':51,'source':'runtime phase split'},{'type':'Land','trigger':'PosYAtGround','value':52,'source':'air physics landing'}]
        elif n=='51': st['anim']='Keep';st['controllers']=[{'type':'Land','trigger':'PosYAtGround','value':52,'source':'air physics landing'}]
        elif n=='52': st['controllers']=[
            {'type':'VelSet','trigger':'TimeEquals','time':0,'y':0,'source':'venus_Common.cns State 52 VelSet Time=0'},
            {'type':'PosSet','trigger':'TimeEquals','time':0,'y':0,'source':'venus_Common.cns State 52 PosSet Time=0'},
            {'type':'CtrlSet','trigger':'TimeEqualsOrPrevState','time':3,'prevState':5040,'value':1,'source':'venus_Common.cns State 52 CtrlSet: Time=3 OR PrevStateNo=5040'},
            {'type':'VelSetThreshold','axis':'x','absBelowConst':'movement.stand.friction.threshold','value':0,'source':'venus_Common.cns State 52 VelSet friction threshold'},
            {'type':'ChangeState','trigger':'AnimDone','value':0,'ctrl':1,'source':'venus_Common.cns State 52 ChangeState AnimTime=0'}
        ]
        out[n]=st
    return {'version':'0.17.2-parser-m1-state52-sourcefix','generatedBy':'compile_runtime.py','states':out,'constants':consts}

cns=(ROOT/'venus.cns').read_text(errors='replace')
common=(ROOT/'venus_Common.cns').read_text(errors='replace')
zss=(ROOT/'common1.cns.zss').read_text(errors='replace')
consts=parse_constants(cns); cs,ctrls=parse_cns(common); zs=parse_zss(zss)
ir=lower(cs,ctrls,consts)
(ROOT/'venus_runtime_states.json').write_text(json.dumps(ir,indent=2),encoding='utf-8')
wanted=['0','11','20','40','50','51','52']; parity={}
for n in wanted:
    parity[n]={'cns':cs.get(n),'zss':zs.get(n),'typePhysicsMatch': bool(cs.get(n) and zs.get(n) and cs[n]['type']==zs[n]['type'] and cs[n]['physics']==zs[n]['physics']), 'cnsControllers':[x['type'] for x in ctrls.get(n,[])]}
report={'version':'0.17.2-parser-m1-state52-sourcefix','sourceFiles':['venus.cns','venus_Common.cns','common1.cns.zss'],'parsedConstantCount':len(consts),'parsedCnsStateCount':len(cs),'parsedZssStateCount':len(zs),'movementSliceParity':parity,'scope':'Parser M1 lowers only tested movement states. Unsupported controllers are retained in this report, not silently treated as implemented.'}
(ROOT/'parser_report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps({'constants':len(consts),'cnsStates':len(cs),'zssStates':len(zs),'parity':{k:v['typePhysicsMatch'] for k,v in parity.items()}},indent=2))
