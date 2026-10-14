# 3 · Preparing the FMS

INIT, the flight plan, navaids, fuel and load, then takeoff performance. The
Source column carries the guide's sample flight, Munich (EDDM) to Frankfurt
(EDDF); use your own OFP's values.

## Prerequisites

| Step | Action | Condition |
| --- | --- | --- |
| [EXT 1 & 2 & 3 & 4](controls.md#electrical) pushbuttons | verify the aircraft is **powered** | external power or the APU |
| [IR MODE 1 & 2 & 3](controls.md#adirs) selectors | verify **NAV** | – |
| [OFP](controls.md#dispatch) page | check for a valid **flight plan** | flyPad |
| ATC clearance | verify it is **obtained** | IFR clearance |

## Using Keyboard and Mouse

The MFD runs entirely on mouse and keyboard. Buttons are grey boxes: a
downward triangle marks a dropdown, greyed-out text marks a disabled button,
and tabs are buttons too. The mouse pointer is a yellow `X` with a dot in the
middle, and a selected button or field gets a blue border. Click a field for a
blue typing cursor, type on your keyboard, and press `ENTER` to confirm.

## Data & Status

| Page / field | Action | Condition |
| --- | --- | --- |
| [DATA/STATUS](controls.md#data-and-status) page | check the **nav database** dates | the FMS start-up page |

> [!NOTE]
> The start-up page also shows the aircraft and engine type, the nav database
> serial number, and the pilot-stored waypoints, routes, navaids and runways.

## Init & Flight Plan Initialization

The flight number, the airports, the cruise level, the cost index and the route
are the basis the FMS manages the flight from.

### FMS Initialization

| Page / field | Action | Source |
| --- | --- | --- |
| [INIT](controls.md#init) page | select **INIT** from the **ACTIVE** menu | – |
| [FLT NBR](controls.md#init) | type the **flight number** | FBW388 |
| [FROM](controls.md#init) | type the **departure** airport | EDDM |
| [TO](controls.md#init) | type the **destination** airport | EDDF |
| [ALTN](controls.md#init) | type the **alternate** airport | optional; EDDL |
| [CI](controls.md#init) | type the **cost index** | OFP; 10 |
| [CRZ FL](controls.md#init) | type the **cruise level** | OFP, listed as `0240`; 240 |

> [!NOTE]
> The cost index trades fuel against time. A high one favours time, a low one
> favours fuel.

### Inputting a SID

| Page / field | Action | Source |
| --- | --- | --- |
| [INIT](controls.md#init) page | select **DEPARTURE** | opens F-PLN/DEPARTURE |
| [DEPARTURE](controls.md#flight-plan) page | select the **RUNWAY** | 08L 4000M ILS |
| [DEPARTURE](controls.md#flight-plan) page | select the **SID** | GIVM6Q |
| [DEPARTURE](controls.md#flight-plan) page | select the **TRANS** | grey if the SID has none |
| [TMPY F-PLN](controls.md#flight-plan) | select **TMPY F-PLN** | yellow until inserted |
| [F-PLN](controls.md#flight-plan) page | scroll to the **SID's last waypoint** | arrow keys at the bottom; GIVMI |

> [!NOTE]
> Waypoint, SID and STAR names can differ between SimBrief and the simulator
> when their nav databases or AIRAC cycles differ.

### En Route Flight Plan

| Page / field | Action | Source |
| --- | --- | --- |
| [F-PLN](controls.md#flight-plan) page | select the **SID terminating waypoint** | GIVMI |
| [AIRWAYS](controls.md#flight-plan) | select **AIRWAYS** from the waypoint menu | – |
| [AIRWAYS](controls.md#flight-plan) page | type the **airway** in VIA, the **waypoint** in TO | OFP route; Y101, ERNAS |
| [AIRWAYS](controls.md#flight-plan) page | repeat on each **new line** | T161, DEBHI |
| [TMPY F-PLN](controls.md#flight-plan) | select **TMPY F-PLN** | – |

> [!NOTE]
> A leg written `WAYPOINT DCT WAYPOINT`, or two waypoints with nothing between
> them, has no airway. Select the first waypoint on `F-PLN`, pick
> [INSERT NEXT WPT](controls.md#flight-plan) from its menu, click into the
> dropdown field without choosing from it, type the next waypoint and press
> `ENTER`.

### Planning the Arrival

| Page / field | Action | Source |
| --- | --- | --- |
| [F-PLN](controls.md#flight-plan) page | select the **destination** at the bottom left | opens F-PLN/ARRIVAL; EDDF |
| [ARRIVAL](controls.md#flight-plan) page | select the **RUNWAY** | 07C 4000M |
| [ARRIVAL](controls.md#flight-plan) page | select the **APPR** | ILS07C-Z |
| [ARRIVAL](controls.md#flight-plan) page | select the **VIA** | DF554 |
| [ARRIVAL](controls.md#flight-plan) page | select the **STAR** | DEBH1C |
| [ARRIVAL](controls.md#flight-plan) page | select the **TRANS** | grey if the STAR has none |
| [TMPY F-PLN](controls.md#flight-plan) | select **TMPY F-PLN** | – |

> [!NOTE]
> A suffix such as Y or Z tells apart approaches to the same runway. They are
> similar, but may differ in minima, allowed equipment or other details.

### Verify the Flight Plan

| Page / field | Action | Source |
| --- | --- | --- |
| [F-PLN](controls.md#flight-plan) page | check every **waypoint** | scroll the whole plan |
| [ND mode](controls.md#efis-control-panel) selector | set **PLAN** and follow the scroll | temporary legs dashed yellow, active legs solid green |
| [INSERT TMPY](controls.md#flight-plan) | select **INSERT TMPY \*** | bottom right of F-PLN; the plan goes active |

> [!NOTE]
> Discontinuities are breaks in the plan, often between the SID and the first en
> route waypoint, or between the STAR and the approach, and they reappear when
> you edit the plan. A discontinuity after a MANUAL leg marks a point that needs
> ATC clearance and **cannot and should not be deleted**. FlyByWire's
> [Discontinuities](https://docs.flybywiresim.com/pilots-corner/a32nx/a32nx-advanced-guides/flight-planning/disco/)
> page shows how to handle them; note its Special Case section.

## Navaids

| Page / field | Action | Source |
| --- | --- | --- |
| [NAVAIDS](controls.md#navaids) page | select **NAVAIDS** on the INIT page | INIT from ACTIVE, or the INIT button on F-PLN |
| [VOR1 IDENT](controls.md#navaids) | check the **auto-tuned VOR** suits the departure | before takeoff |
| [VOR1 IDENT](controls.md#navaids) | type the **VOR identifier**, pick the closest | DMN, 116.0 |
| [LS IDENT](controls.md#navaids) | check the **departure ILS** | auto-populated with the SID |
| [LS IDENT](controls.md#navaids) | type the **ILS identifier** | if not auto-populated; IMNE, 109.50 |

> [!NOTE]
> Enter a frequency or an identifier. Within range of the ILS, either one fills
> in the other along with the course. The arrival ILS tunes itself in the climb
> phase or later, within 250 NM of the destination; check it again on the
> approach, in [7 · Landing](7-landing.md).

## Fuel & Payload

The OFP and the flyPad give weights in kilograms; the FMS takes tonnes. Divide
by 1000 and round to one decimal.

| Page / field | Action | Source |
| --- | --- | --- |
| [FUEL&LOAD](controls.md#fuel-and-load) page | select **FUEL&LOAD** on the INIT page | – |
| [ZFW / ZFWCG](controls.md#fuel-and-load) | enter the **ZFW** | flyPad PAYLOAD once boarding starts, or the OFP; 341.5 |
| [ZFW / ZFWCG](controls.md#fuel-and-load) | enter the **ZFWCG** | flyPad PAYLOAD; 35.1 |
| [BLOCK](controls.md#fuel-and-load) | enter the **block fuel** | OFP; 22.6 |
| [TAXI FUEL](controls.md#fuel-and-load) | enter the **taxi fuel** | 1.0 |
| [PAX NBR](controls.md#fuel-and-load) | enter the **passenger number** | flyPad PAYLOAD, or the OFP WEIGHTS; 399 |
| [CI](controls.md#init) | verify the **cost index** | set on INIT; 10 |
| [ALTN](controls.md#fuel-and-load) | enter the **alternate fuel** | OFP; 5.9 |
| [FINAL](controls.md#fuel-and-load) | check the **final reserve** against the OFP | enter the OFP's if not close |
| [MIN FUEL AT DEST](controls.md#fuel-and-load) | check, or enter as appropriate | – |

> [!NOTE]
> Some fields may already hold a value; verify it and correct it if wrong. As
> long as `BLOCK` is right, the FMS counts all the fuel on board. Load the fuel
> itself on the flyPad [FUEL](controls.md#ground) page.

## Performance

TOGA gives full thrust for short runways or adverse conditions. FLEX reduces
thrust against an assumed higher temperature, which lowers engine stress and
saves fuel. The guide takes off on FLEX.

### Performance Calculator

The [SimBrief takeoff performance calculator](https://dispatch.simbrief.com/tools/search?performance=takeoff)
gives the numbers.

| Step | Action | Source |
| --- | --- | --- |
| [TOW](controls.md#fuel-and-load) | read the **takeoff weight** | FUEL&LOAD; the OFP figure is more accurate |
| SimBrief takeoff calculator | compute the **takeoff data** | A388, D8-FBW; EDDM 08L, flaps 2, TOGA/FLEX, populated weather |
| [PAYLOAD](controls.md#ground) page | read the **GW CG** under Current | flyPad, once all loading has finished |

### Take Off Performance

| Page / field | Action | Source |
| --- | --- | --- |
| [T.O PERF](controls.md#performance) page | select **T.O PERF** on the INIT page | – |
| [V1](controls.md#performance) | enter the **V1** speed | calculator; 136 |
| [VR](controls.md#performance) | enter the **VR** speed | calculator; 136 |
| [V2](controls.md#performance) | enter the **V2** speed | calculator; 142 |
| [FLEX](controls.md#performance) | select **FLEX** and enter the **temperature** | calculator; 66 |
| [FLAPS](controls.md#performance) | select the **takeoff flaps** | calculator; 2 |
| [THS FOR](controls.md#performance) | enter the **GW CG** value | flyPad PAYLOAD; 36.0 |
| [PACKS](controls.md#performance) | set **ON** | or as the calculator suggests |
| [ANTI ICE](controls.md#performance) | set **ENG ONLY** | or as the calculator suggests |
| [THR RED / ACCEL / EO ACCEL](controls.md#performance) | check the **altitudes** | set automatically |
| [TRANS ALT](controls.md#performance) | enter the **transition altitude** | SID chart; 5000 |

> [!NOTE]
> Skipped as INOP in the A380X: `CRZ TEMP` "is not fully implemented yet and
> might not automatically be set"; `RTE RSV` "is grayed out and can not be
> configured at this time"; "DERATED is not yet supported for the A380X."

## A380X simBrief Integration

[CPNY F-PLN REQUEST](controls.md#init) on the INIT page imports the SimBrief
plan and fills in INIT instead of typing it. It does not load the runway, SID,
STAR or approach; select those as above. FlyByWire's
[simBrief Integration](https://docs.flybywiresim.com/aircraft/a380x/feature-guides/simbrief/)
guide covers it.

---

Previous: [2 · Cockpit Preparation](2-cockpit-preparation.md) ·
Next: [4 · Engine Start and Taxi](4-engine-start-and-taxi.md)
