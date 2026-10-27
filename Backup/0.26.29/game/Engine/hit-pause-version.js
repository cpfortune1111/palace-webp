export function hitPauseVersionProfile(data){
 const versions=data.engineVersions;
 if(!Array.isArray(versions?.mugen)||versions.mugen.length<2||!Array.isArray(versions.ikemen)||versions.ikemen.length<2)throw Error('Missing native character engine version metadata');
 for(const value of [...versions.mugen,...versions.ikemen])if(!Number.isInteger(value)||value<0||value>65535)throw Error('Invalid native character engine version metadata');
 return {mugenMajor:versions.mugen[0],ikemen:!!(versions.ikemen[0]||versions.ikemen[1])};
}
