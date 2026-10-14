# Flight companion notes

Each aircraft in `src/params/aircraft.ts` has a notes directory,
`src/lib/fly/<slug>/`, that is the source of truth for
`src/lib/fly/<slug>.json`. Edit the markdown, run `pnpm fly`, and commit the
regenerated payload alongside the notes. CI reruns `pnpm fly` and fails if a
committed payload is stale.

```sh
pnpm fly            # -> src/lib/fly/<slug>.json for every registered aircraft
```

`scripts/build-companion.mjs` builds every registered aircraft in one run. The
settings that differ per aircraft (shorter phase rail titles, the lights
columns each phase shows, control label aliases) live in its `AIRCRAFT` map,
keyed by slug, and a registered aircraft with no entry fails the build. Each
aircraft's own `README.md` says where its notes come from.

## The notes

The generator finds the procedure notes by their numeric prefix, which sets
both their order and the digit that opens each one, so the prefixes must run
from 1 with no gaps or repeats. Nine is the ceiling: the companion binds the
digits 1-9 to phases, and the generator throws if a tenth is added.

Any other file is looked up in the aircraft's directory first, then in
`shared/`, so a sheet every aircraft uses lives once in `shared/` and an
aircraft overrides it by carrying its own copy under the same name.

The three reference sheets:

- `lights.md` — the light state matrix, one per aircraft.
- `shared/abbreviations.md` — the sole source of the Abbreviations sheet, a
  **verbatim copy** of FlyByWire's
  [Airbus Terms and Abbreviations](https://docs.flybywiresim.com/pilots-corner/airliner/abbreviations/)
  page. Refresh it by re-downloading, never by editing:

  ```sh
  curl -sS https://raw.githubusercontent.com/flybywiresim/docs/primary/docs/pilots-corner/airliner/abbreviations.md \
    > src/lib/fly/shared/abbreviations.md
  ```

- `shared/atc-communications.md` — VATSIM call-and-response scripts. Not
  FlyByWire sourced, and the only note that is written from scratch.

Two supporting indexes, one per aircraft:

- `controls.md` — maps every control label to its deep link into the
  aircraft's flight deck docs. Every `[LABEL](controls.md#section)` in a
  procedure note resolves through here; the generator prints anything it
  cannot resolve. Its "What it is" column is prose for a human reader, not
  build input.
- `names.md` — the full-name map, and the only one. It fills the line under
  each checklist control and the tooltip on a bolded setting, in
  `abbreviations.md`'s own style (`EXT PWR` → `EXTernal PoWeR`), with `–` for
  labels that read plainly on their own. Nothing resolves from it into
  `abbreviations.md` at build time: that page is an airline-wide glossary,
  refreshed by re-download, and it reads `RET` as *return* where a speed brake
  lever means *retracted*. The generator prints any `controls.md` label with no
  row here, and any two rows that disagree.

## Row conventions

Procedure tables read **control → action → condition**:

| Control | Action | Condition |
| --- | --- | --- |
| [EXT PWR](controls.md#electrical) pushbutton | set **ON** | if AVAIL |

- The first word of the action decides the row's `kind`, which the companion
  shows. `verify` means it should already be in that position: look, do not
  touch. Its value renders green under a VERIFY badge. `act` means touch
  something, and its value renders cyan. The generator lower-cases the word,
  strips trailing punctuation, and looks it up in two closed lists:
  `VERIFY_VERBS` (verify, check, checked, confirm, crosscheck, scan, look,
  identify, read, note, monitor, review) and `ACT_VERBS` (everything else in
  use today). A word in neither list counts as `act`, and `pnpm fly` prints it
  until it is added to one of them. `kind` is not part of the item id, so moving a verb between
  lists keeps every tick.
- The bold value is the target state, and picks up a tooltip if `names.md`
  has it.
- `–` in the condition column means unconditional.
- The third heading is free text and shows through to the rendered column:
  `Condition`, `Trigger`, `Wait for`, `Source` are all in use.
- The first heading decides whether a table is a checklist at all. It must
  contain one of `Control`, `Page / field`, `Field`, `Page`, `Step` or
  `Indication`.
- `> [!NOTE]` blocks, numbered lists and plain paragraphs all render; the first
  paragraph of a note becomes the phase lede.
- `V~1~`, `V~FE~` and friends render as real subscripts.

Each phase's lights strip comes from `lights.md`, not from the procedure
note. The aircraft's `phaseLightColumns` in the `AIRCRAFT` map names the
matrix columns each phase shows, by their exact header text. The generator
collects those columns from every matrix in `lights.md` and skips `–` cells.
Renaming a column header means updating `phaseLightColumns`, or the build
throws.

Item ids are derived from the phase, control and action text, and tick state
persists against them — so editing a row's control or action clears that row's
tick, while inserting or reordering rows elsewhere does not.
