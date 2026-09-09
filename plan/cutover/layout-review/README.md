# Layout review — screenshots

The state of the shell at three widths plus the maximised console, captured from the running app
for the review on the cutover PR. They exist because the collapse behaviour is width-dependent and
a diff cannot show it.

| File | What it shows |
|---|---|
| `01-1024-narrow.png` | 1024×768 — timeline and inspector railed, 3D view still ~695px, workspace toggle row hidden below 1150px |
| `02-1280-default.png` | 1280×800 — timeline railed (seeded below 1400px), inspector open |
| `03-1920-full.png` | 1920×1080 — nothing railed |
| `04-console-maximised.png` | Console maximised: all three side regions railed, viewport hidden, the frame never moved in the DOM |

Regenerate with `npm start` and the snippet in the PR thread; they are review artefacts, not
fixtures, and nothing asserts on them.
