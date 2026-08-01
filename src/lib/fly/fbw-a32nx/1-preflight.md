# 1 · Preflight

Before you touch the aircraft: nav data, a flight plan, and a loaded cabin.

## Nav Data

MSFS ships its own AIRAC cycle and updates it with the sim. If the cycle your
planning tool used is older than the one in the sim, the import fails or the
flight plan comes in with `NOT IN DATABASE` and `AWY/WPT MISMATCH` entries. A
Navigraph subscription keeps both ends on the same cycle.

| Step | Action | Condition |
| --- | --- | --- |
| [A/C STATUS](controls.md#data) page | note the **AIRAC** cycle | MCDU, once the aircraft has power |
| Planning tool | **match** it to the sim's cycle | SimBrief, Navigraph or Little Nav Map |

## Flight Planning

Plan on [SimBrief](https://www.simbrief.com/) rather than the MSFS world map:
the routing is better, and it is the only planner the MCDU can import directly.
[Little Nav Map](https://albar965.github.io/littlenavmap.html) and
[ChartFox](https://chartfox.org/) cover charts for free;
[Navigraph](https://navigraph.com/) covers both, by subscription.

| Step | Action | Condition |
| --- | --- | --- |
| SimBrief | **generate** the OFP | route, cruise level, payload and fuel |
| Charts | have the **departure and arrival plates** to hand | SID, STAR and approach |

## Flight Plan Import

| Step | Action | Condition |
| --- | --- | --- |
| MSFS world map | leave the **arrival airport blank** | before loading in |
| [OFP](controls.md#dispatch) page | **display** the SimBrief flight plan | flyPad, `Ctrl+0` |

> [!NOTE]
> Setting a destination on the MSFS world map initialises the `FROM/TO` field,
> which removes `INIT REQUEST` from the `INIT A` page — and with it the SimBrief
> import. The flight plan then has to be typed in by hand.

The route itself goes into the MCDU in
[3 · Preparing the MCDU](3-preparing-the-mcdu.md), which also covers typing it
in by hand and clearing the discontinuities that appear as you do.

## Payload and Fuel

Load the aircraft before starting it, so the zero fuel weight and block fuel you
type into `INIT B` are the ones actually on board.

| Step | Action | Condition |
| --- | --- | --- |
| [PAYLOAD](controls.md#ground) page | load **passengers and cargo** | flyPad, to match the OFP |
| [FUEL](controls.md#ground) page | load the **block fuel** | flyPad, to match the OFP |
| [CHARTS](controls.md#performance-and-charts) page | **link** your Navigraph account | flyPad, optional |

---

Next: [2 · Starting the Aircraft](2-starting-the-aircraft.md)
