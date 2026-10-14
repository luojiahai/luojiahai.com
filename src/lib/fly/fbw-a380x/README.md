# FlyByWire A380X — companion notes

The source of truth for `src/lib/fly/fbw-a380x.json`. The workflow and the
conventions every aircraft shares are in [`../README.md`](../README.md).

## Where the content comes from

The nine procedure notes follow FlyByWire's own
[A380X beginner guide](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/overview/),
one note per chapter, in its order. They were written against the docs build of
2026-10-09 and the stable releases v2024.1.0 (MSFS 2024) and v2020.15.0
(MSFS 2020).

| Note | Source page |
| --- | --- |
| `1-preflight.md` | `01_preflight/` |
| `2-cockpit-preparation.md` | `02_cockpit-preparation/` |
| `3-preparing-the-fms.md` | `03_preparing-fms/` |
| `4-engine-start-and-taxi.md` | `04_engine-start-taxi/` |
| `5-takeoff-climb-and-cruise.md` | `05_takeoff-climb-cruise/` |
| `6-descent.md` | `06_descent/` |
| `7-landing.md` | `07_landing/` |
| `8-after-landing-and-taxi-to-gate.md` | `08_after-landing/` |
| `9-powering-down.md` | `09_powering-down/` |

Its own sheets, beyond the procedures:

- `lights.md` — the light state matrix, from the beginner guide's per-phase
  calls plus the `ovhd/ext-lt`, `ovhd/signs` and `pedestal/cockpit-lighting`
  briefing pages.
- `controls.md` — deep links into the `a380x-briefing/flight-deck/**` pages.
  The MFD has no briefing pages, so its pages and fields link to the beginner
  guide section that walks through them.

The Abbreviations and Radio sheets come from `../shared/`.

## Where the notes depart from the guide

- **INOP items get no row.** Anything the guide or the briefing pages mark
  INOP or not available goes in one `> [!NOTE]` per note, "Skipped as INOP in
  the A380X: …", in FlyByWire's words. That covers the weather radar, the taxi
  cameras, the RMP functions beyond VHF and squawk, and the guide's own
  `(INOP)` items.
- **TCAS is set on the MFD SURV page.** The guide links the pedestal
  surveillance panel, which the briefing and API pages say is not yet
  implemented.
- **Checklist names are the ECL's.** The guide's BEFORE TAKEOFF checklist is
  the ECL's TAXI (down to the line) and LINE-UP (below the line). The guide
  mentions After Takeoff and After Landing checklists that the ECL does not
  have, so they get no row.
- **Labels follow the panel.** `NO MOBILE` for the guide's NO SMOKING, which
  the A380 does not have; `ENG START` for the guide's ENGINE MODE SELECTOR and
  ENGINE STARTER; `ALL BAT` set to **AUTO**, the panel's position, where the
  guide says ON.
- **Two broken links in the guide are corrected.** `pedestal/flaps-lever`
  (chapter 8) is `pedestal/flap-lever/`, and the Flight Deck Overview buttons
  resolve under the beginner guide instead of `a380x-briefing/flight-deck/`.
- **FLEX is kept.** Chapters 3 and 5 take off on FLEX, while the throttle
  briefing page says FLEX takeoff thrust is not yet available on the A380X.
  The notes follow the guide.
