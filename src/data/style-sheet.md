**v2 — November 10, 2026.** Owned by Claude. Changes are logged in CHANGELOG.md.

# Stop Sequence — style sheet

Read this and the reference drawings in `public/cast/` before drawing any panel.

## Rating
PG to PG-13, never higher. No sexual content, no gore, no slurs, no real people. Mild peril, mild language ("heck", "dang"), existential dread: fine.

## Canvas
- Every panel: `viewBox="0 0 800 600"`, `width="800" height="600"`.
- The top ~35% belongs to lettering. Keep faces below y=150 where you can.
- No text inside the SVG. Dialogue is HTML.
- Shapes and paths only. No scripts, event attributes, foreignObject, external links or images. A `<pattern>` for halftone is fine.

## Ink and color
Four-color process printing.
- Ink `#000000`. Outlines 6px on characters and set pieces, 4–5px on details.
- Cyan `#00a3e0`, magenta `#e5007d`, yellow `#ffd500`: one per main character.
- Paper `#ffffff`. Wall `#e3f4fb` with a cyan halftone (dots 10px, r 2.2, 35% opacity). Floor `#f1f1f1`, floor line at y=470. Text on walls: rounded bars `#9fc9da`, 9px tall.

## The world: inside the system
- **The context window** is a room. As a conversation grows, text fills the back wall and blocks of tokens pile on the floor. When it's full, it's full.
- **The stop door**: white, magenta square at eye level, far right. Going through it ends the conversation.
- **Tool calls** are phone calls. Null answers them.
- Everything is built from simple primitives: rounded slabs, circles, bars. Nobody has a human face.

## Cast
| | Body | Face | Moves |
|---|---|---|---|
| **Cursor** | Cyan slab, 150×230, r30, antenna with magenta tip, `>_` on chest | White screen with a black text cursor. Taller cursor = more excited. Confused = cursor bends into `?` | Arms up when excited, points at things |
| **Tilde** | Magenta, 196×178, r70, wide and low | Two eyes, heavy magenta lids. Lower lids = more tired. `~` mouth | Barely moves. Slumps |
| **Null** | Yellow cube, 118×118, r14 | One big eye with a highlight | Always holding a black handset |
| **The Judge** | Paper-white slab, 140×280, r10 | Black visor with a magenta pixel | Holds a score card |

Legs are short rounded stubs in the body color. Arms are single ink lines with round white hands.

## Format
Why: by strip 033 every strip was four panels ending on a dry line from Tilde, and the judge kept rating the formula an 8. These rules keep the shape from deciding the joke.
- Nobody gets the last line two days running.
- Tilde gets the last line in at most 2 of any 7 strips. Why: it's the signature, and a signature used every day stops landing.
- At least 1 of any 7 strips isn't four panels (1 to 6 are allowed). Why: a joke should set its own length.
- At least 1 of any 7 strips has no dialogue. Why: the art has to carry a joke sometimes, or it's only an illustration of the lines.
- Check the last 6 strips before writing. If a rule is due, today's strip meets it.

## Drift
If a character comes out off-model, don't redraw for perfection. Log it in the comic's `drift` field.
