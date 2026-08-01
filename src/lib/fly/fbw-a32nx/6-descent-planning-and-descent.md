# 6 · Descent Planning and Descent

Cruise to the ILS intercept.

## Descent and Approach Planning

Start about **200 NM** out — on a short flight, before the flight. Descent
planning is the pilot's job, not ATC's: they will often give descent
instructions, but you must know where your top of descent is and ask for the
clearance if it has not come.

What drives the plan: the cruise level, the STAR's altitude constraints, its
speed constraints — slowing down while descending is hard — and passenger
comfort, since −4000 ft/min is nobody's idea of a good time.

| Step | Action | Condition |
| --- | --- | --- |
| STAR chart | read the **altitude and speed constraints** | – |
| STAR chart | identify the **first constraint you must meet** | a waypoint, the FAF altitude, or field elevation |
| [PERFORMANCE](controls.md#performance-and-charts) page | compute the **descent distance** | flyPad, 3° path |
| [PROG](controls.md#progress) page | read the **BRG/DIST** to that waypoint | – |
| [FIX INFO](controls.md#flight-plan) page | draw a **distance ring** at the descent distance | shows the TOD on the ND |

> [!NOTE]
> Rule of thumb, without the flyPad: *distance = altitude difference × 3 ÷ 1000,
> plus about 10 % margin*. FL320 down to FL140 is 18 000 ft → 54 NM → about
> 59 NM. Take less margin into a headwind, more into a tailwind.

> [!NOTE]
> Treat the STAR and approach as optional. ATC may vector you to a different
> runway or shortcut the arrival — but only if you are low enough by then.

### Approach Data

About 50 NM before the descent, reconfirm the landing runway and fill in
`PERF APPR`. QNH, temperature, magnetic wind and transition level come from the
destination ATIS; minima come from the approach chart.

| Page / field | Action | Source |
| --- | --- | --- |
| [ATIS](controls.md#atsu-and-aoc) page | request the **destination ATIS** | MCDU ATSU/AOC, or your network client |
| [APPROACH](controls.md#performance) page | enter **QNH**, **TEMP** and **MAG WIND** | ATIS |
| [APPROACH](controls.md#performance) page | enter the **TRANS ALT** | the transition **level**, despite the label |
| [APPROACH](controls.md#performance) page | enter **BARO** minima | CAT I — the DA or MDA from the chart |
| [APPROACH](controls.md#performance) page | enter **RADIO** minima | CAT II/III — the RA or DH; `NO DH` where none is published |
| [F-PLN](controls.md#flight-plan) page | **confirm** the landing runway | ATIS |

> [!NOTE]
> The A320neo is CAT IIIB capable and approach category C. BARO minima are
> barometric; RADIO minima are radio altitude above the ground.

> [!NOTE]
> If the chart says the transition level is "by ATC" and you are offline, use
> the real-world D-ATIS, or the transition altitude plus 1000 ft. A SimBrief
> import fills it in for you.

## Starting the Descent

Ask for the descent a few minutes before the calculated TOD. **Do not start
down without a clearance.** The A320 draws a downward arrow at its own computed
TOD, but the number remains yours to validate.

| Control | Action | Condition |
| --- | --- | --- |
| ATC | **request descent** | a few minutes before TOD |
| [ALT](controls.md#flight-control-unit-fcu) knob | dial the **cleared level** | – |
| [ALT](controls.md#flight-control-unit-fcu) knob | **push** for DES, or **pull** for OP DES | – |
| [FMA](controls.md#displays) | verify the mode is **green** in the second column | – |

> [!NOTE]
> Managed descent (DES) flies the computed vertical profile and can produce
> surprisingly high and low vertical speeds. If you are new to it, pull for
> **OP DES** instead — it gives the linear descent most people expect.

> [!NOTE]
> ATC rarely clears you all the way down in one step, and still expects the
> STAR's constraints to be met even under a lower clearance. Managed descent
> handles exactly this: it levels off at the constraint and continues once the
> constraint no longer applies.

> [!NOTE]
> Avoid V/S. Its guidance outranks speed guidance, so an unachievable rate makes
> the aircraft trade speed for it until a protection intervenes.

### At 10,000 ft

| Control | Action | Condition |
| --- | --- | --- |
| [LAND L & R](controls.md#exterior-lighting) switches | set as required | they extend from under the wing and add drag |
| [SEAT BELTS](controls.md#signs) sign | set **ON** | – |
| [CSTR](controls.md#efis-control-panel) pushbutton | select on **both sides** | – |
| [LS](controls.md#efis-control-panel) pushbutton | set **ON** | for an ILS, GLS or LOC approach |
| [LS](controls.md#efis-control-panel) pushbutton | check the **identification** on the PFD | LOC and G/S scales appear with a valid signal |
| [RAD NAV (LS / FREQ)](controls.md#radio-navigation) page | verify the navaids are **tuned and identified** | select the reference navaid by hand for an NDB approach |

> [!NOTE]
> flyPad: perform the **APPROACH** checklist. This is also when the cabin crew
> are asked to secure the cabin — they answer with CABIN READY.

## Flying the STAR

Laterally this is just more flight plan: let the autopilot fly it and manage
altitude and speed to the chart or to ATC. Expect to be handed to Approach, and
expect vectors off the published route — for separation in heavy traffic, or as
a shortcut when there is none.

| Control | Action | Condition |
| --- | --- | --- |
| [HDG / TRK](controls.md#flight-control-unit-fcu) knob | dial and **pull** | on a radar vector |
| [SPD / MACH](controls.md#flight-control-unit-fcu) knob | dial and **pull** | on an assigned speed |
| [ALT](controls.md#flight-control-unit-fcu) knob | descend only to the **constraint** | if it is above the cleared altitude |

## Intercepting the ILS

The approach — or ATC's vectors — puts you on a path to the final approach fix
and onto the localizer, then the glideslope.

| Control | Action | Condition |
| --- | --- | --- |
| Intercept heading | keep the angle **under 30°** | – |
| Intercept altitude | be **at the platform altitude** | from the approach chart |

---

Previous: [5 · Takeoff, Climb, and Cruise](5-takeoff-climb-and-cruise.md) ·
Next: [7 · Approach and ILS Landing](7-approach-and-ils-landing.md)
