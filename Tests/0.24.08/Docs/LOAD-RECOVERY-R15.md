# 0.24.08-r15 — stable boot and automatic load recovery

The r14 launcher registered the r14 worker while the game still required r13. That mismatch caused repeated navigation. The launcher and presentation preparation now share one stable worker URL. The game's direct-link guard compares the router path rather than alternating revision strings, and repeated bootstrap navigation is blocked.

Loading failures show the actual message, resource URL when available, HTTP status and loading phase. Connection loss displays a visible notice and resumes on the browser's online event. Transient resource failures retry automatically with backoff; persistent connection failures retry in place at a slower interval. No Retry or Reload button is required.

Cached startup state can request one automatic page rebuild, with the Arcade checkpoint retained. The rebuild allowance is persisted across page loads and is cleared only after successful recovery. Persistent errors stop with the cause visible rather than refreshing indefinitely. Program errors are not blindly retried.

The presentation-media pack remains unchanged and uses the existing r12 cache. Targeted validation covered stable boot, migration from a versioned worker, temporary stage-loading errors, offline/online recovery, no manual retry buttons and preserving a final-opponent Arcade checkpoint. These are loading/boot tests, not a full character gameplay audit.
