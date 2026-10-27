#!/usr/bin/env python3
"""
Character Compatibility Preflight Scanner
LOCKED WORKFLOW:
1) Start from character DEF.
2) Resolve every battle-related file referenced by [Files]:
   cns, cmd, st, st1..stN, stcommon and any .cns/.st/.zss references.
3) Scan BEFORE runtime/import work.
4) Compare discovered expressions/triggers/controllers/ZSS features with registry.
5) NEW/PARTIAL/UNSUPPORTED/MISSING must be reported; never silently ignored.

This scanner is inventory-first. It does not claim semantic compatibility merely
because a token/controller was recognized.
"""
from __future__ import annotations
import argparse, json, re
from collections import Counter
from pathlib import Path

BATTLE_KEYS = {"cns","cmd","st","stcommon"}
STATE_EXTS = {".cns",".st",".zss"}
STATUS = {"GENERIC","ADAPTER","PARSED","UNSUPPORTED","NEW","MISSING"}

def strip_comment(line):
    # MUGEN/CNS comments use ';'. Quoted-semicolon edge cases can be added later.
    return line.split(";", 1)[0].strip()

def parse_def(def_path: Path):
    files, section = {}, ""
    for raw in def_path.read_text(errors="replace").splitlines():
        line = strip_comment(raw)
        m = re.match(r"^\[([^\]]+)\]", line)
        if m:
            section = m.group(1).strip().lower()
            continue
        if section == "files" and "=" in line:
            k,v = [x.strip() for x in line.split("=",1)]
            files[k.lower()] = v.strip().strip('"')
    return files

def battle_refs(files):
    refs=[]
    for k,v in files.items():
        if k in BATTLE_KEYS or re.fullmatch(r"st\d+", k):
            refs.append((k,v))
    return refs

def cns_inventory(text):
    controllers=Counter()
    trigger_expr=[]
    command_expr=[]
    for raw in text.splitlines():
        line=strip_comment(raw)
        m=re.match(r"^type\s*=\s*([A-Za-z_][A-Za-z0-9_]*)", line, re.I)
        if m: controllers[m.group(1).lower()] += 1
        m=re.match(r"^trigger(?:all|\d+)\s*=\s*(.+)$", line, re.I)
        if m: trigger_expr.append(m.group(1).strip())
        if re.search(r"\bcommand\s*(?:!?=)\s*\"", line, re.I):
            command_expr.append(line)
    return controllers, trigger_expr, command_expr

def zss_inventory(text):
    controllers=Counter()
    expr=[]
    for m in re.finditer(r"(?:^|[;\s{}])([A-Za-z_][A-Za-z0-9_]*)\s*\{", text, re.M):
        name=m.group(1)
        if name.lower() not in {"if","else","persistent","ignorehitpause"}:
            controllers[name.lower()] += 1
    expr += [m.group(1).strip() for m in re.finditer(r"\bif\s+([^{\n]+)\s*\{", text, re.I)]
    features={}
    tests={
      "if_else":r"\bif\b|\belse\b", "function":r"\bfunction\b",
      "call":r"\bcall\b", "let":r"\blet\b", "local_variable":r"\$[A-Za-z_]",
      "assignment_colon_eq":r":=", "persistent":r"\bpersistent\s*\(",
      "ignore_hit_pause":r"\bignoreHitPause\b"
    }
    for k,p in tests.items():
        n=len(re.findall(p,text,re.I))
        if n: features[k]=n
    return controllers, expr, features

FUNC_RE=re.compile(r"\b([A-Za-z_][A-Za-z0-9_.]*)\s*\(")
ID_RE=re.compile(r"\b([A-Za-z_][A-Za-z0-9_.]*(?:\s+[XY])?)\b",re.I)
def expression_inventory(exprs):
    funcs=Counter(); ids=Counter(); ops=Counter()
    joined="\n".join(exprs)
    for e in exprs:
        for m in FUNC_RE.finditer(e): funcs[m.group(1).lower()] += 1
        for m in ID_RE.finditer(re.sub(r'"[^"]*"',"",e)):
            ids[re.sub(r"\s+"," ",m.group(1)).lower()] += 1
    patterns={
      "&&":r"&&","||":r"\|\|","!":r"!(?!=)","=":r"(?<![!<>])=(?!=)",
      "!=":r"!=","<=":r"<=",">=":r">=","<":r"(?<!<)<(?!=)",">":r"(?<!>)>(?!=)",
      "+":r"\+","-":r"-","*":r"\*","/":r"/","%":r"%","range[]":r"\[[^\]]*,[^\]]*\]"
    }
    for k,p in patterns.items():
        n=len(re.findall(p,joined))
        if n: ops[k]=n
    return funcs,ids,ops

def load_registry(path):
    if not path: return {"expressions":{},"controllers":{},"zss_features":{}}
    return json.loads(Path(path).read_text())

def classify(names, registry, bucket):
    known=registry.get(bucket,{})
    return {n: known.get(n,{"status":"NEW","priority":"REVIEW"}) for n in sorted(names)}

def scan(def_path, registry_path=None):
    root=def_path.parent
    files=parse_def(def_path)
    refs=battle_refs(files)
    registry=load_registry(registry_path)
    report={"character_def":def_path.name,"references":[],"controllers":Counter(),
            "expressions":[],"zss_features":Counter(),"missing":[]}
    for key,rel in refs:
        p=(root/rel).resolve()
        entry={"key":key,"path":rel,"exists":p.exists()}
        report["references"].append(entry)
        if not p.exists():
            report["missing"].append(rel); continue
        text=p.read_text(errors="replace")
        if p.suffix.lower()==".zss":
            ctr,expr,zf=zss_inventory(text)
            report["zss_features"].update(zf)
        else:
            ctr,expr,_=cns_inventory(text)
        report["controllers"].update(ctr); report["expressions"] += expr

    funcs,ids,ops=expression_inventory(report["expressions"])
    expression_names=set(funcs)|set(ids)|set(ops)
    result={
      "character_def":report["character_def"],
      "references":report["references"],
      "missing":report["missing"],
      "counts":{
        "trigger_expressions":len(report["expressions"]),
        "controller_occurrences":sum(report["controllers"].values())
      },
      "controllers":{
        "occurrences":dict(report["controllers"]),
        "compatibility":classify(report["controllers"],registry,"controllers")
      },
      "expressions":{
        "functions":dict(funcs),"identifiers":dict(ids),"operators":dict(ops),
        "compatibility":classify(expression_names,registry,"expressions")
      },
      "zss_features":{
        "occurrences":dict(report["zss_features"]),
        "compatibility":classify(report["zss_features"],registry,"zss_features")
      }
    }
    result["preflight_pass"] = not result["missing"] and not any(
        v["status"] in {"NEW","UNSUPPORTED"} for b in
        (result["controllers"]["compatibility"],result["expressions"]["compatibility"],
         result["zss_features"]["compatibility"]) for v in b.values()
    )
    return result

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("character_def",type=Path)
    ap.add_argument("--registry",type=Path)
    ap.add_argument("--out",type=Path,default=Path("compatibility_preflight.json"))
    a=ap.parse_args()
    r=scan(a.character_def,a.registry)
    a.out.write_text(json.dumps(r,indent=2,ensure_ascii=False))
    print(json.dumps({"preflight_pass":r["preflight_pass"],"missing":r["missing"],
                      "controllers":len(r["controllers"]["compatibility"]),
                      "expressions":len(r["expressions"]["compatibility"])},indent=2))
if __name__=="__main__": main()
