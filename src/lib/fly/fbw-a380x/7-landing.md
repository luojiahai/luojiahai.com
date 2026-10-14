# 7 · Landing

Localizer intercept to runway vacated, landed by hand.

## Intercepting the ILS Localizer

Still in the DES phase and set up for flight below 10,000 ft, seat belt signs and
landing lights on. Either inside the instrument approach at the chart altitude
and speed (the final approach fix altitude and 250 kt if the chart sets no other
limit), or on a heading, altitude and speed from ATC. Approach's last instruction
is usually to call Tower once established on the localizer.

### During Instrument Approach

| Page / field | Action | Condition |
| --- | --- | --- |
| [LS IDENT](controls.md#navaids) field | verify the **ILS frequency** | NAVAIDS page, against the approach chart |

| Control | Action | Condition |
| --- | --- | --- |
| [LS](controls.md#efis-control-panel) pushbutton | check **ON** | press it if not already on; one on each side |
| [PFD](controls.md#displays) | verify the **altitude** from the chart | intercept angle no more than 30° |

### After ATC Clearance

Passing the DECEL pseudo waypoint (`D`) switches the FMS to the APPR phase on
its own.

| Control | Action | Condition |
| --- | --- | --- |
| ATC | obtain the **approach clearance** | – |

| Page / field | Action | Condition |
| --- | --- | --- |
| [PERF](controls.md#performance) page | verify the **APPR** tab is active | green tab |
| [ACTIVATE APPR](controls.md#performance) | press to activate the **APPR** phase | only if the tab is not green |

| Control | Action | Condition |
| --- | --- | --- |
| [SPD/MACH](controls.md#afs-control-panel) knob | push for **managed** speed | decelerates to green dot |
| [APPR](controls.md#afs-control-panel) pushbutton | press to arm the **localizer** | **LOC** blue on the FMA; heading held until capture |
| [AP1 / AP2](controls.md#afs-control-panel) pushbuttons | set both **ON** | redundancy in case of a failure |
| [FMA](controls.md#displays) | check the **approach capability** | CAT2, CAT3 SINGLE, CAT3 DUAL or AUTOLAND |
| [FLAPS](controls.md#flaps-and-speed-brake) lever | set **1** | at about V~FE~ − 15, never above V~FE~ |

| Page / field | Action | Condition |
| --- | --- | --- |
| [TCAS](controls.md#surveillance) field | set **TA/RA** | SURV page |

| Control | Action | Condition |
| --- | --- | --- |
| [FMA](controls.md#displays) | verify **LOC** green | LOC deviation inside the scale on the PFD and ND |
| ATC | report **established** to Tower | call sign and runway |

Check in with Tower,
[ATC Communications › Tower (Landing)](../shared/atc-communications.md#6--tower-landing).
Their clearance for the ILS approach is the clearance to descend on the
glideslope.

> [!NOTE]
> `APPR` arms the glideslope as well, so the aircraft will start down the moment
> it captures. Do not descend without a clearance, and only when directly on the
> localizer path, where obstacle clearance is guaranteed. To split the two, press
> **LOC** first for the localizer alone and **APPR** once cleared for the
> approach.

> [!NOTE]
> In APPR phase with managed speed, the aircraft targets S speed after FLAPS 1,
> F speed after FLAPS 2, and V~app~ once the landing flap is selected. Aim to be
> in CONF 1 at S speed by the time FLAPS 2 is due, before the glideslope
> intercept.

## Intercepting the ILS Glideslope

Cleared for the ILS approach.

| Control | Action | Condition |
| --- | --- | --- |
| [APPR](controls.md#afs-control-panel) pushbutton | verify **active** | – |
| [AP1 / AP2](controls.md#afs-control-panel) pushbuttons | verify both **ON** | – |
| [FMA](controls.md#displays) | verify **LOC** captured | established on the localizer |
| [FLAPS](controls.md#flaps-and-speed-brake) lever | verify **1** | – |
| [SD STS page](controls.md#system-pages) | verify **normal** | – |
| [BARO REF](controls.md#efis-control-panel) window | verify **QNH** set | in hPa |

| Page / field | Action | Condition |
| --- | --- | --- |
| [BARO / RADIO](controls.md#performance) field | verify the **minima** set | PERF APPR |

| Control | Action | Condition |
| --- | --- | --- |
| [SEAT BELTS](controls.md#signs) sign | verify **ON** | – |

### ILS Glideslope

| Control | Action | Condition |
| --- | --- | --- |
| [APPR](controls.md#afs-control-panel) pushbutton | check it is **on** | arms the glideslope descent |
| [FMA](controls.md#displays) | verify **G/S** blue | – |
| [FMA](controls.md#displays) | verify **G/S** green | descent starts once the deviation marker centres |
| [ALT](controls.md#afs-control-panel) knob | set the **go-around altitude** | missed approach altitude from the chart |
| [FLAPS](controls.md#flaps-and-speed-brake) lever | set **2** | about 2,500 ft, below V~FE~ |

> [!NOTE]
> The radio altimeter comes alive at 2,500 ft above the ground.

> [!NOTE]
> If ATC assigns a speed ("160 kt until 5 NM"), pull the **SPD/MACH** knob for
> selected speed until that point, then push back to managed and take the gear,
> FLAPS 3 and FLAPS FULL from there.

> [!NOTE]
> With FLAPS 2 set, check the aircraft is decelerating toward F speed. If the
> glideslope intercept is below 2,000 ft above the ground, set FLAPS 2 at one dot
> below the glideslope. Above the glideslope, or not slowing down, extend the
> landing gear. The speed brakes do little at low speed.

## Preparation and Checklist for Landing

Established on the localizer and glideslope, FLAPS 2 set. Fully configured and
**stable by 1,000 ft** above the ground.

| Control | Action | Condition |
| --- | --- | --- |
| [FMA](controls.md#displays) | verify **LOC** and **G/S** green | established |
| [FLAPS](controls.md#flaps-and-speed-brake) lever | verify **2** | – |

### 2000 Feet and Below

| Control | Action | Condition |
| --- | --- | --- |
| [LANDING GEAR](controls.md#landing-gear-and-brakes) lever | set **DOWN** | – |
| [AUTO BRK](controls.md#landing-gear-and-brakes) selector | confirm the **setting** | as set during descent |
| [SPEED BRAKE](controls.md#flaps-and-speed-brake) lever | pull up to **ARM** | – |
| [LAND](controls.md#exterior-lighting) switch | check **ON** | on since 10,000 ft |
| [NOSE](controls.md#exterior-lighting) switch | set **T.O** | – |
| [RWY TURN OFF](controls.md#exterior-lighting) switch | set **ON** | – |
| [FLAPS](controls.md#flaps-and-speed-brake) lever | set **3** | gear down, below V~FE~ |
| [SD WHEEL page](controls.md#system-pages) | check all five gears **green** | at least one green triangle per gear |
| [FLAPS](controls.md#flaps-and-speed-brake) lever | set **FULL** | below V~FE~ |
| [A/THR](controls.md#afs-control-panel) pushbutton | check **SPEED** mode, or off | – |
| [LDG MEMO](controls.md#ewd) | check **no blue line** | – |
| CABIN READY | confirm it is **received** | – |
| [C/L](controls.md#ecam-control-panel) key | run **LANDING checklist** on EWD | – |

> [!NOTE]
> The SD WHEEL page comes up by itself below 800 ft above the ground or when the
> gear goes down. Stable at 1,000 ft means flaps fully extended, autothrust in
> SPEED mode or off, and the landing checklist complete.

> [!NOTE]
> On the checklist, `UP` and `DOWN` on the ECP move the box and the check-mark
> keys tick an item. Some items are sensed by the aircraft and tick themselves.

> [!NOTE]
> Keep a hand on the thrust levers from here for a possible go-around, but do not
> move them until the last seconds before landing.

## Landing

FLAPS FULL at about 1,000 ft above the ground, calm wind. The A380 can autoland;
this is a manual landing.

| Control | Action | Condition |
| --- | --- | --- |
| [LANDING GEAR](controls.md#landing-gear-and-brakes) lever | verify **DOWN** | – |
| [NOSE](controls.md#exterior-lighting) switch | verify **T.O** | – |
| [RWY TURN OFF](controls.md#exterior-lighting) switch | verify **ON** | – |
| [AUTO BRK](controls.md#landing-gear-and-brakes) selector | verify the **setting** | – |
| [SPEED BRAKE](controls.md#flaps-and-speed-brake) lever | verify **ARM** | – |
| [LAND](controls.md#exterior-lighting) switch | verify **ON** | – |
| [FLAPS](controls.md#flaps-and-speed-brake) lever | verify **FULL** | – |
| [A/THR](controls.md#afs-control-panel) pushbutton | verify **SPEED** mode, or off | – |
| ATC | obtain the **landing clearance** | without it, go around before touching the runway |
| [SIDESTICK](controls.md#lateral-console) pushbutton | press twice to set the autopilot **OFF** | about 500 ft; second press at least 1.8 s after the first |
| [A/THR](controls.md#afs-control-panel) pushbutton | leave **ON** | – |
| PAPI | fly **two white, two red** | correct gently, very little stick is needed |
| Touchdown zone | aim for the **markers and the centre line** | – |
| [FMA](controls.md#displays) | check **LAND mode** | at 350 ft |
| [PFD](controls.md#displays) | check the **ILS course** | – |
| Callout | check **ONE HUNDRED ABOVE** | – |
| Callout | check **MINIMUM** | – |
| Decision | check **landing** or **go-around** | not stable at 100 ft above the ground: go around |
| [SIDESTICK](controls.md#lateral-console) | pull back gently to **flare** | about 40 ft; over the threshold at about 50 ft |
| [SIDESTICK](controls.md#lateral-console) | hold the **attitude** until it settles | never push the nose down once flared |
| [THRUST](controls.md#thrust) levers | set **IDLE** | – |
| [SIDESTICK](controls.md#lateral-console) | set the **nose gear** down gently | hold the centre line, watch the speed on the PFD |
| [REVERSER](controls.md#thrust) levers | pull to **MAX REV** | at touchdown; **IDLE REV** to taxi speed if reverse use is limited |
| [PFD](controls.md#displays) | check the **ground spoilers** extended | slats/flaps display |
| [EWD](controls.md#ewd) | check the **reversers** deployed | – |
| [AUTO BRK](controls.md#landing-gear-and-brakes) selector | check the autobrake **active** | autobrake annunciators; **BTV** green on the FMA if BTV was set |
| [REVERSER](controls.md#thrust) levers | set **IDLE** | below 80 kt |

> [!NOTE]
> Over the threshold, look toward the far end of the runway to judge the pitch.
> The flare needs only a few degrees of positive pitch: too much floats the
> aircraft down the runway, too little lands it hard.

> [!NOTE]
> If the ground spoilers do not extend, check that all thrust levers are at the
> IDLE detent. Still no spoilers: both reversers to MAX REV and press the brake
> pedals.

## Vacate Runway

On the centre line, below 40 kt.

### At Taxi Speed

| Control | Action | Condition |
| --- | --- | --- |
| [REVERSER](controls.md#thrust) levers | push down to **STOWED** | – |
| [A/THR instinctive disconnect](controls.md#thrust) pushbutton | press to **DISARM** the autobrake | pilot's discretion; BTV disarms itself at 10 kt |

### Vacate the Runway

| Control | Action | Condition |
| --- | --- | --- |
| Next exit | slow to about **10 kt** before turning off | – |
| Runway entry marker | roll past it by the **full length** of the aircraft | – |
| ATC | report **runway vacated** | if Ground has not called first; they pass taxi instructions |

Flying alone, it is perfectly fine to stop clear of the runway and work through
the after-landing tasks one at a time before moving again.

---

Previous: [6 · Descent](6-descent.md) ·
Next: [8 · After Landing and Taxi to Gate](8-after-landing-and-taxi-to-gate.md)
