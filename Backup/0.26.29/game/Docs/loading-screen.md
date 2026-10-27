# Loading screen

Selection preparation and the transition into combat use Engine/loading-screen.js: an opaque black fullscreen overlay with a white progress bar and percentage. No background scene or menu controls remain visible through it.

Selection progress counts decoded artwork plus completion of the 3D stage. Combat progress counts actual ready runtime/character/stage groups, then waits for fight HUD and round view assets before reaching 100%. Percentages reflect completed preparation groups rather than download bytes or an artificial timer. Cached assets can finish immediately.

Combat remains paused while waiting, duplicate start requests are ignored, and the overlay is removed after the prepared combat view has had a frame to draw. Failed preparation retains the black screen with an error and a return button, rather than silently entering an incomplete fight.

Run node Tools/check-loading.cjs, node Tools/check-selection.cjs and node Tools/check-selection-browser.cjs. The browser test checks the black loading overlay, accessible progress bar and its removal after selection is ready.
