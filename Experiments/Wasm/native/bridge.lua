local config=palaceConfig()
function loop() end
function menuReset() end
function menuInit() end
function menuRun() return false end
hook={run=function(name)palaceEmit('engineHook','"'..name..'"')end}
setPlayers(2)
loadMotif('data/host.def')
loadFightScreen('data/host-fight.def')
clearSelected()
setTeamMode(1,0,1)
setTeamMode(2,0,1)
for i=1,2 do
    addChar('chars/'..config.players[i]..'/host.def')
    selectChar(i,i-1,1)
    setCom(i,config.mode=='watch' and config.difficulty or (i==2 and config.mode=='arcade' and config.difficulty or 0))
end
addStage('stages/'..config.stage..'.def')
selectStage(1)
setGameMode(config.mode)
setMatchWins(1,2)
setMatchWins(2,2)
setRoundTime(config.timer=='infinite' and -1 or tonumber(config.timer)*60)
loadStart()
palaceEmit('loading','{}')
local winner=game()
palaceEmit('winner', tostring(winner))
palaceEmit('matchEnded',getGameStatsJson())
while true do refresh() end
