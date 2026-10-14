# 1 · Preflight

Before the flight in earnest: nav data, a flight plan, the load and the charts.
Some of these tools need the aircraft powered.

## Nav Data

MSFS updates its AIRAC cycle with the sim's regular updates. If your planning
tool used an older cycle, the import shows errors such as `NOT IN DATABASE` and
`AWY/WPT Mismatch`, or fails outright. A Navigraph subscription adds their nav
data to MSFS, keeps it current, and pairs it with SimBrief.

| Step | Action | Condition |
| --- | --- | --- |
| [DATA/STATUS](controls.md#data-and-status) page | note the **nav database** dates | MFD, once the aircraft has power |
| Planning tool | **match** its AIRAC cycle to the sim's | SimBrief or Navigraph |

## Flight Planning

Plan on [SimBrief](https://www.simbrief.com/), not the built-in MSFS flight
planner (World Map). Other planners work, but they often lack the current AIRAC
cycle, and only SimBrief has the import below.
[Little Nav Map](https://albar965.github.io/littlenavmap.html) covers planning
and charts, [ChartFox](https://chartfox.org/) covers charts, and
[Navigraph](https://navigraph.com/) covers both, by subscription.

| Step | Action | Condition |
| --- | --- | --- |
| SimBrief | **generate** the OFP | not the MSFS world map |

## Flight Plan Import

The FMS imports the SimBrief flight plan, as the real aircraft does from its
airline. The flyPad uses the same plan to show the OFP and to import fuel and
payload. FlyByWire's
[SimBrief A380X Features](https://docs.flybywiresim.com/aircraft/a380x/feature-guides/simbrief/)
guide covers both.

| Step | Action | Condition |
| --- | --- | --- |
| [OFP](controls.md#dispatch) page | **display** the SimBrief flight plan | flyPad |

Typing the route in by hand, and the discontinuities that appear as you do, are
covered in [3 · Preparing the FMS](3-preparing-the-fms.md). Discontinuities are
intended, not a fault.

## Payload Management

The aircraft loads its own fuel, passengers and baggage. FlyByWire's
[Fuel and Weights](https://docs.flybywiresim.com/aircraft/a380x/feature-guides/loading-fuel-weight/)
guide has the advisories.

| Step | Action | Condition |
| --- | --- | --- |
| [FUEL](controls.md#ground) page | load the **fuel** | flyPad |
| [PAYLOAD](controls.md#ground) page | load **passengers and baggage** | flyPad |

## EFB Navigraph Charts

| Step | Action | Condition |
| --- | --- | --- |
| [CHARTS](controls.md#dashboard-and-charts) page | **link** your Navigraph account | flyPad; en route charts for the flight |

---

Next: [2 · Cockpit Preparation](2-cockpit-preparation.md)
