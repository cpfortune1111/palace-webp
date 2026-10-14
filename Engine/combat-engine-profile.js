export function powerTimingProfile(profile){
 if(profile==='mugen11')return 'mugen';
 if(profile==='ikemen')return 'ikemen';
 throw Error('Unsupported combat engine profile '+profile);
}
