export function nativeAttackActivity(moveType,reversal){return moveType!=='I'||reversal?1:0}

export function reversalPriorityDecision(enemy,recipient,{attributeAllowed=true,alreadyHit=false,valid=true,counterContact=false,projectile=false}={}){
 if(!attributeAllowed)return {handled:true,enemyLoses:false,enemyTemporaryActive:enemy.temporaryActive};
 if(alreadyHit||!valid)return {handled:true,enemyLoses:true,enemyTemporaryActive:enemy.temporaryActive};
 const counter=!projectile&&counterContact;
 if(enemy.reversal){
  if(recipient.reversal){
   if(counter)return {handled:true,enemyLoses:recipient.temporaryActive<0,enemyTemporaryActive:-1};
   return {handled:true,enemyLoses:true,enemyTemporaryActive:enemy.temporaryActive};
  }
  return {handled:true,enemyLoses:!counter,enemyTemporaryActive:enemy.temporaryActive};
 }
 if(recipient.reversal)return {handled:true,enemyLoses:true,enemyTemporaryActive:enemy.temporaryActive};
 return {handled:false};
}
