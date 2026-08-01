# FlyByWire A32NX — companion notes

The source of truth for `src/lib/fly/fbw-a32nx.json`. Edit the markdown, run
`pnpm fly`, and commit the regenerated payload alongside the notes.

```sh
pnpm fly            # -> src/lib/fly/fbw-a32nx.json
```

## Where the content comes from

The nine procedure notes follow FlyByWire's own
[A32NX beginner guide](https://docs.flybywiresim.com/pilots-corner/a32nx/a32nx-beginner-guide/overview/),
one note per phase, in its order. Where a source page and an older note
disagree, the guide wins.

| Note | Source page |
| --- | --- |
| `1-preflight.md` | `preflight/` |
| `2-starting-the-aircraft.md` | `starting-the-aircraft/` |
| `3-preparing-the-mcdu.md` | `preparing-mcdu/` |
| `4-engine-start-and-taxi.md` | `engine-start-taxi/` |
| `5-takeoff-climb-and-cruise.md` | `takeoff-climb-cruise/` |
| `6-descent-planning-and-descent.md` | `descent/` |
| `7-approach-and-ils-landing.md` | `landing/` |
| `8-after-landing-and-taxi-to-gate.md` | `after-landing/` |
| `9-powering-down.md` | `powering-down/` |

Nine is the ceiling: the companion binds the digits 1-9 to phases, and the
generator throws if a tenth is added.

The three reference sheets:

- `lights.md` — the light state matrix, from the beginner guide's per-phase
  calls plus the `ovhd/ext-lt`, `ovhd/int-lt` and `ovhd/signs` briefing pages.
- `abbreviations.md` — a **verbatim copy** of FlyByWire's
  [Airbus Terms and Abbreviations](https://docs.flybywiresim.com/pilots-corner/airliner/abbreviations/)
  page. Refresh it by re-downloading, never by editing:

  ```sh
  curl -sS https://raw.githubusercontent.com/flybywiresim/docs/primary/docs/pilots-corner/airliner/abbreviations.md \
    > src/lib/fly/fbw-a32nx/abbreviations.md
  ```

- `atc-communications.md` — VATSIM call-and-response scripts. Not FlyByWire
  sourced, and the only note that is written from scratch.

Two supporting indexes:

- `controls.md` — maps every control label to its deep link into the
  `a32nx-briefing/flight-deck/**` pages, plus a plain-English name. Every
  `[LABEL](controls.md#section)` in a procedure note resolves through here; the
  generator prints anything it cannot resolve.
- `terms.md` — the tooltip glossary, deliberately narrow. It covers only the
  positions and settings the notes actually bold. `abbreviations.md` is *not*
  used for tooltips: it is an airline-wide glossary where `RET` means *return*,
  which is the wrong reading for a speed brake lever.

## Row conventions

Procedure tables read **control → action → condition**:

| Control | Action | Condition |
| --- | --- | --- |
| [EXT PWR](controls.md#electrical) pushbutton | set **ON** | if AVAIL |

- **verify** means it should already be in that position — look, do not touch.
- **set** / **adjust** / **press** means act.
- The bold value is the target state, and picks up a tooltip if `terms.md`
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

Item ids are derived from the phase, control and action text, and tick state
persists against them — so editing a row's control or action clears that row's
tick, while inserting or reordering rows elsewhere does not.
