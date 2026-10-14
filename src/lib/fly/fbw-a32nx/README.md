# FlyByWire A32NX — companion notes

The source of truth for `src/lib/fly/fbw-a32nx.json`. The workflow and the
conventions every aircraft shares are in [`../README.md`](../README.md).

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

Its own sheets, beyond the procedures:

- `lights.md` — the light state matrix, from the beginner guide's per-phase
  calls plus the `ovhd/ext-lt`, `ovhd/int-lt` and `ovhd/signs` briefing pages.
- `controls.md` — deep links into the `a32nx-briefing/flight-deck/**` pages.

The Abbreviations and Radio sheets come from `../shared/`.
