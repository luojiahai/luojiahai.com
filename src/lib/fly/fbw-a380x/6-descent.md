# 6 · Descent

Cruise to the ILS intercept.

## Base Knowledge

> [!NOTE]
> The arrival mirrors the departure. A STAR leads from the last en-route
> waypoint to the initial approach fix, with levels, speed limits and often a
> clearance limit you may not pass without ATC, holding there if you must. The
> instrument approach takes you on to the final approach fix, though with light
> traffic, and on online networks especially, ATC often vectors you straight
> there. The ILS then guides you down: the localizer laterally, the glideslope
> vertically. Fly from real charts, not MSFS's planner. Navigraph is built into
> the flyPad, and ChartFox is free with a VATSIM account.

## Planning the Descent and Approach

Start about **200 NM** out, and on a short flight before the flight. Descent
planning is the pilot's job, not ATC's. They will often give descent
instructions, but you must know where your top of descent is and ask for the
clearance if it has not come.

What drives the plan: the cruise level, the STAR's altitude constraints, its
speed constraints, since slowing down while descending is hard, and passenger
comfort.

| Step | Action | Condition |
| --- | --- | --- |
| STAR chart | read the **altitude and speed constraints** | – |
| STAR chart | identify the **first constraint you must meet** | a STAR waypoint, the FAF altitude, or the field elevation |
| [PERFORMANCE](controls.md#dashboard-and-charts) page | compute the **descent distance** | flyPad, 3° path |
| [DIR TO](controls.md#flight-plan) page | read the **distance** to that waypoint | F-PLN: press the waypoint, then DIR TO |

> [!NOTE]
> Treat the STAR and approach as optional. ATC may vector you to a different
> runway or shortcut the arrival, but only if you are low enough by then.

> [!NOTE]
> Rule of thumb, without the flyPad: *distance = altitude difference × 3 ÷ 1000,
> plus about 10 % margin*. FL320 down to FL140 is 18,000 ft, so 54 NM, so about
> 59 NM. Take less margin into a headwind and more with a tailwind. The later
> descents in a STAR are usually designed for a 3° path and need less planning,
> and ATC will often assign levels that differ from the chart.

> [!NOTE]
> DIR TO is the only way to read the distance to a waypoint short of adding up
> the legs on the F-PLN page. The ND distance rings can show it too.

### Arrival Planning

About 50 NM before the descent, reconfirm the landing runway and fill in
PERF APPR. QNH, temperature, magnetic wind and transition level come from the
destination ATIS; the minima come from the approach chart.

| Page / field | Action | Source |
| --- | --- | --- |
| [F-PLN](controls.md#flight-plan) | confirm the **destination runway** | ATIS |
| [PERF APPR](controls.md#performance) | enter **QNH**, **TEMP** and **MAG WIND** | ATIS |
| [TRANS LVL](controls.md#performance) | enter the transition level | ATIS, or the approach chart |
| [BARO / RADIO](controls.md#performance) | enter **BARO** minima | CAT I: the DA or MDA, 528 for the guide's EDDF 07C |
| [BARO / RADIO](controls.md#performance) | enter **RADIO** minima | CAT II/III: the RA or DH |

> [!NOTE]
> The A380 is CAT IIIB capable with autoland and approach category C, but the
> guide lands by hand, so it uses CAT I BARO minima. BARO is barometric altitude;
> RADIO is radio altitude above the ground.

> [!NOTE]
> MSFS's built-in ATC only offers the destination ATIS once you are close; on an
> online network you can request it now. If the chart gives the transition level
> as "By ATC" and you are offline, use the real-world D-ATIS, or the transition
> altitude plus 1000 ft. A SimBrief import fills it in for you.

| Control | Action | Condition |
| --- | --- | --- |
| [WEATHER](controls.md#dashboard-and-charts) widget | obtain the **weather and landing information** | flyPad METAR, or the ATIS |
| Landing elevation | check | – |
| [BARO selector](controls.md#efis-control-panel) | preset the destination **QNH** | – |

> [!NOTE]
> Skipped as INOP in the A380X: the landing performance check, since "there is no
> landing performance calculator for the A380X yet"; FIX INFO, which the A380X
> "does not yet have implemented"; and the weather radar at 20,000 ft, "currently
> not available in the A380X".

### FMS Checks

Insert the APPR, STAR, TRANS and APPR VIA if they are not in the active flight
plan yet.

| Page / field | Action | Condition |
| --- | --- | --- |
| [ARRIVAL](controls.md#flight-plan) | check or insert the **APPR, VIA, STAR and TRANS** | – |
| [PERF DES](controls.md#performance) | check or insert | – |
| [PERF APPR](controls.md#performance) | check or insert | – |
| [PERF GA](controls.md#performance) | check | – |
| [NAVAIDS](controls.md#navaids) | check | – |
| FMS | crosscheck | – |

### OANS and BTV

If available, set up the airport map and brake to vacate for the destination.
OANS draws the airport on the ND at range ZOOM. BTV picks the runway exit and
brakes to make it.

| Control | Action | Condition |
| --- | --- | --- |
| [OANS](controls.md#displays) | set the **runway shift** as required | – |
| [ND mode](controls.md#efis-control-panel) selector | set **PLAN** | – |
| [ND range](controls.md#efis-control-panel) selector | set **ZOOM** | – |
| [OANS](controls.md#displays) | select the **runway** | – |
| [OANS](controls.md#displays) | select the **runway exit** | after the wet line; mind the gate and turnaround time |
| [AUTO BRK](controls.md#landing-gear-and-brakes) selector | select as required, or **BTV** | **3** on a contaminated runway; **HI** on a short one or without BTV |
| [OANS](controls.md#displays) | crosscheck the **runway length** against the chart | – |
| Landing briefing | perform | – |

> [!NOTE]
> Autobrake gives even brake pressure and keeps the brakes from overheating. Pick
> the mode for the weight, runway length, conditions and wind. For BTV, set the
> mode before you take the airport map off the ND.

## Descent

A few minutes before the calculated TOD, ask for the descent if ATC has not
already given it:
[ATC Communications › Request descent](../shared/atc-communications.md#request-descent).
**Do not start down without a clearance.** The A380 draws a downward arrow at
its own TOD, but the number remains yours to validate.

| Control | Action | Condition |
| --- | --- | --- |
| ATC clearance | obtain **descent** clearance | – |
| [ALT](controls.md#afs-control-panel) knob | set the **cleared altitude** | – |
| [ENG ANTI ICE](controls.md#anti-ice) pushbuttons | set as required | – |
| [WING ANTI ICE](controls.md#anti-ice) pushbutton | set as required | – |

### Starting the Descent

| Control | Action | Condition |
| --- | --- | --- |
| [ALT](controls.md#afs-control-panel) knob | **push** for DES, or **pull** for OP DES | starts the descent |
| [BARO selector](controls.md#efis-control-panel) | set **QNH** in hPa | – |
| Cabin crew | advise | – |
| [FMA](controls.md#displays) | check the mode **green** in the second column | – |
| Descent | monitor | – |
| Rate of descent | adjust as required | – |
| [SPEED BRAKE](controls.md#flaps-and-speed-brake) lever | set as required | – |

> [!NOTE]
> Managed descent (DES) keeps the constraints; it flies a computed vertical
> profile and can give very high and very low vertical speeds. Selected descent
> (OP DES) ignores the constraints and gives the steady descent most people
> expect, so start with it if DES is new to you.

> [!NOTE]
> ATC rarely clears you all the way down at once, and still expects the STAR's
> constraints to be met under a lower clearance. Managed descent handles this:
> it levels off at a constraint and continues once it no longer applies.
> Otherwise descend only to the constraint, and repeat.

> [!NOTE]
> Avoid V/S. Its guidance outranks speed guidance, so a rate the aircraft cannot
> hold makes it speed up or slow down until the speed limit is reached.

Some airline SOPs order the next steps differently.

### At 20,000 ft

| Control | Action | Condition |
| --- | --- | --- |
| Cabin crew | advise | – |
| [TERR](controls.md#efis-control-panel) pushbutton | set as required | – |

### At 10,000 ft

| Control | Action | Condition |
| --- | --- | --- |
| [LAND](controls.md#exterior-lighting) switch | set **ON** | – |
| [PERF APPR](controls.md#performance) page | set the **landing data** | – |
| [SEAT BELTS](controls.md#signs) sign | set **ON** | – |
| [CSTR](controls.md#efis-control-panel) pushbutton | set **ON** | – |
| [LS](controls.md#efis-control-panel) pushbutton | set as required | **ON** for the ILS |
| [NAVAIDS](controls.md#navaids) page | check as required | – |
| [C/L](controls.md#ecam-control-panel) key | run **APPROACH checklist** on EWD | – |

> [!NOTE]
> In real life the cabin crew are asked to prepare the cabin during the descent,
> mostly when the seat belt signs come on. They answer with the CABIN READY call
> once they are strapped in themselves, usually by final approach.

## Flying the STAR and Approach

Laterally this is just more flight plan: let the autopilot fly it, and set the
altitude and speed to the chart or to ATC. Expect to be handed to Approach:
[ATC Communications › Approach](../shared/atc-communications.md#5--approach).
Expect vectors off the published route too, for separation in heavy traffic or
as a shortcut when there is none, until you intercept the localizer.

| Control | Action | Condition |
| --- | --- | --- |
| [HDG/TRK](controls.md#afs-control-panel) knob | dial and **pull** | on a radar vector |
| [SPD/MACH](controls.md#afs-control-panel) knob | dial and **pull** | on an assigned speed |
| [ALT](controls.md#afs-control-panel) knob | descend only to the **constraint** | if it is above the cleared altitude |
| [DIR TO](controls.md#flight-plan) page | select the **IAF** | offline, to shortcut the STAR |

## Intercepting the ILS

The approach, or ATC's vectors, puts you on a path to the final approach fix and
onto the localizer, then the glideslope.

| Control | Action | Condition |
| --- | --- | --- |
| Intercept angle | keep **under 30°** | – |
| Intercept altitude | be at the **correct altitude** | from the approach chart |
| [LS](controls.md#efis-control-panel) pushbutton | check **ON** on both sides | – |
| [ACTIVATE APPR](controls.md#performance) | check or activate the **approach phase** | activates by itself at DECEL with NAV engaged |
| Managed speed | check | slows at DECEL in NAV, LOC\* or LOC |
| [SPEED BRAKE](controls.md#flaps-and-speed-brake) lever | set as required | – |

---

Previous: [5 · Takeoff, Climb, and Cruise](5-takeoff-climb-and-cruise.md) ·
Next: [7 · Landing](7-landing.md)
