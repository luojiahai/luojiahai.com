# 3 · Preparing the MCDU

**D.I.F.S.R.I.P.** — DATA, INIT A, F-PLN, SEC F-PLN, RAD NAV, INIT FUEL PRED,
PERF. Walk the pages in that order and the aircraft ends up programmed.

Line select keys are `LSK1L`–`LSK6L` down the left and `LSK1R`–`LSK6R` down the
right. The horizontal slew keys move between sibling pages (`INIT A` to
`INIT FUEL PRED`); the vertical ones scroll a page such as `F-PLN`.

## Before You Start

Get the IFR clearance first — it fixes the runway, the SID and the squawk you
are about to type in. Read it back with CRAFT: cleared route, initial altitude,
SID or vectors, transponder code, departure frequency.

| Page / field | Action | Condition |
| --- | --- | --- |
| IFR clearance | **obtain and read back** | from delivery, or the built-in ATC menu |
| SimBrief OFP | have it **open** | flyPad or a second screen |

## D · DATA

| Page / field | Action | Condition |
| --- | --- | --- |
| [A/C STATUS](controls.md#data) page | check the **AIRAC** cycle | matches the cycle your OFP was planned on |

> [!NOTE]
> DATA carries the position, IRS and GPS monitors, closest airports, waypoints,
> navaids, runways and routes. Nothing on it needs setting for a normal flight.

## I · INIT A

| Page / field | Action | Source |
| --- | --- | --- |
| [INIT REQUEST](controls.md#init) | press **LSK2R** to import the OFP | SimBrief |
| [FROM/TO](controls.md#init) | type the **city pair**, press **LSK1R** | OFP |
| Company routes | select **RETURN** on **LSK6L** | none stored |
| [FLT NBR](controls.md#init) | type it, press **LSK3L** | OFP |
| [COST INDEX](controls.md#init) | type it, press **LSK5L** | OFP |
| [CRZ FL](controls.md#init) | type the level, press **LSK6L** | OFP; sets the temperature too |
| [ALIGN IRS](controls.md#init) | press **LSK6R** twice | once the position is shown |

> [!NOTE]
> `INIT REQUEST` is missing if you picked both a departure and an arrival on the
> MSFS world map before loading in — that pre-initialises `FROM/TO`. Wind and
> temperature can be imported here too, on **LSK4R**.

## F · Flight Plan

The plan starts as three lines: departure, a discontinuity, arrival.

### Departure

| Page / field | Action | Source |
| --- | --- | --- |
| [F-PLN](controls.md#flight-plan) page | select the **departure airport** on **LSK1L** | – |
| [DEPARTURE](controls.md#flight-plan) page | select **DEPARTURE** on **LSK1L** | – |
| [DEPARTURE](controls.md#flight-plan) page | select the **runway** | clearance |
| [DEPARTURE](controls.md#flight-plan) page | select the **SID** | clearance |
| [DEPARTURE](controls.md#flight-plan) page | press **INSERT\*** on **LSK6R** | review the yellow preview first |

> [!NOTE]
> If the SID pairs with a LOC or ILS frequency in the nav data, RAD NAV is
> populated automatically when you insert it.

### En Route

| Page / field | Action | Source |
| --- | --- | --- |
| [F-PLN](controls.md#flight-plan) page | select the **SID terminating waypoint** | – |
| [AIRWAYS](controls.md#flight-plan) page | select **AIRWAYS** on **LSK5R** | – |
| [AIRWAYS](controls.md#flight-plan) page | type the **airway** on the left, the **waypoint** on the right | OFP route |
| [AIRWAYS](controls.md#flight-plan) page | repeat for each **airway and waypoint pair** | OFP route |
| [AIRWAYS](controls.md#flight-plan) page | press **INSERT\*** on **LSK6R** | – |

> [!NOTE]
> A leg written `WAYPOINT DCT WAYPOINT`, or two waypoints with nothing between
> them, has no airway. Skip the AIRWAYS page: select the first waypoint on
> `F-PLN`, type the next one into the scratchpad, and enter it with **LSK3R** on
> the [LAT REV](controls.md#flight-plan) page.

### Arrival

| Page / field | Action | Source |
| --- | --- | --- |
| [F-PLN](controls.md#flight-plan) page | select the **destination** under **DEST** | – |
| [ARRIVAL](controls.md#flight-plan) page | select **ARRIVAL** on **LSK1R** | – |
| [ARRIVAL](controls.md#flight-plan) page | select the **approach** | by type and runway |
| [ARRIVAL](controls.md#flight-plan) page | select the **STAR** | OFP |
| [ARRIVAL](controls.md#flight-plan) page | select the **VIA**, then any **transition** | chart |
| [ARRIVAL](controls.md#flight-plan) page | press **INSERT\*** on **LSK6R** | – |
| [F-PLN](controls.md#flight-plan) page | **scroll the whole plan** and verify it | vertical slew keys |
| [ND mode](controls.md#efis-control-panel) selector | set **PLAN** and follow the scroll | a second check, visually |

> [!NOTE]
> Waypoint, SID and STAR names can differ between SimBrief and the simulator if
> the AIRAC cycles do not match. Approach suffixes such as Y or Z distinguish
> approaches to the same runway with different minima or equipment.

> [!NOTE]
> Discontinuities are breaks in the plan — usually between the SID and the first
> en-route waypoint, or between the STAR and the approach. They are normal, and
> often re-appear when you edit the plan. A discontinuity **after a MANUAL leg
> must not be deleted**: it is there because ATC has to clear you first.

## S · Secondary Flight Plan

| Page / field | Action | Condition |
| --- | --- | --- |
| [SEC F-PLN](controls.md#secondary-flight-plan) page | **copy the active** flight plan | the usual choice when nothing else is planned |

## R · RAD NAV

| Page / field | Action | Source |
| --- | --- | --- |
| [RAD NAV (LS / FREQ)](controls.md#radio-navigation) page | check the **VOR** autotuned for the SID | chart |
| [RAD NAV (LS / FREQ)](controls.md#radio-navigation) page | enter the **departure ILS** frequency on **LSK3L** | chart, if not autopopulated |
| [RAD NAV (LS / FREQ)](controls.md#radio-navigation) page | enter the **arrival ILS** frequency on **LSK3L** | chart |

> [!NOTE]
> Enter the frequency **or** the identifier, never both — both at once gives a
> `FORMAT ERROR`. Whichever you enter fills in the other, along with the course,
> once you are in range. The arrival ILS also self-tunes from the climb phase
> onward within 250 NM, but verify it again on the approach.

## I · INIT FUEL PRED

Reached from `INIT A` with the horizontal slew keys.

| Page / field | Action | Source |
| --- | --- | --- |
| [ZFW / ZFWCG](controls.md#init) | press **LSK1R** to compute, **LSK1R** again to enter | flyPad, boarding started |
| [BLOCK](controls.md#init) | type the fuel in **tonnes** to one decimal, press **LSK2R** | ECAM FOB or the OFP |

> [!NOTE]
> Fuel and payload must be loaded and boarding at least in progress, or the
> ZFW/ZFWCG comes from the planned figures rather than what is on board. GW only
> appears on the ECAM once this page has a ZFW and one engine is running.

> [!NOTE]
> `LSK3R` computes a recommended block fuel, but it is a reference figure only —
> it does not load anything. Load the fuel on the flyPad
> [FUEL](controls.md#ground) page.

## P · PERF — Takeoff

| Page / field | Action | Source |
| --- | --- | --- |
| [TAKEOFF (FLAPS, FLEX TO TEMP, V1, VR, V2)](controls.md#performance) page | enter **V1**, then **VR**, then **V2** | flyPad PERFORMANCE page |
| [FLAPS/THS](controls.md#performance) | enter the **flaps configuration** on **LSK3R** | flyPad PERFORMANCE page |
| [FLAPS/THS](controls.md#performance) | enter the **THS**, as `/0.4DN` or `/1.5UP` | airline SOP; optional |
| [TAKEOFF (FLAPS, FLEX TO TEMP, V1, VR, V2)](controls.md#performance) page | enter the **FLEX TO TEMP** on **LSK4R** | flyPad PERFORMANCE page |
| [THR RED/ACC](controls.md#performance) | check against the **transition altitude** | SID chart |

> [!NOTE]
> Flex temp lets the engines take off at less than TOGA but not less than CLB,
> which saves engine life. Valid values run from ISA+29 °C (45 °C at sea level,
> or the current OAT if higher) up to ISA+59 °C (74 °C). Lower it when heavy or
> on a short runway.

> [!NOTE]
> Entering THS triggers the `F/CTL PITCH TRIM/MCDU/CG DISAGREE` caution when the
> trim wheel disagrees. Before the engines start, take the CG from the flyPad
> payload page; afterwards use the computed CG on `FUEL PRED` — not ZFWCG — and
> set the wheel to match.

## Squawk Code

| Page / field | Action | Condition |
| --- | --- | --- |
| [ATC mode](controls.md#atc-and-tcas) selector | verify **STBY** | goes to **AUTO** shortly before takeoff |
| [ATC code](controls.md#atc-and-tcas) keypad | **double press CLR**, then key the code | from the clearance |

---

Previous: [2 · Starting the Aircraft](2-starting-the-aircraft.md) ·
Next: [4 · Engine Start and Taxi](4-engine-start-and-taxi.md)
