print('PALACE_WASM_READY')
setPlayers(2)
playBgm({bgm='data/tone.wav', loop=1, volume=25})
local box = rectNew()
rectSetLocalcoord(box, 1280, 720)
rectSetWindow(box, 480, 280, 800, 440)
rectSetColor(box, 255, 62, 167)
rectSetAlpha(box, 255, 0)
local tick = 0
while true do
    clearColor(24, 16, 36)
    rectDraw(box)
    local key = getKey()
    if key ~= '' then
        print('PALACE_KEY:' .. key)
        resetKey()
    end
    if getInput(1, 'a') then print('PALACE_P1_A') end
    if getInput(2, 'a') then print('PALACE_P2_A') end
    tick = tick + 1
    if tick % 60 == 0 then print('PALACE_TICK:' .. tick) end
    refresh()
end
