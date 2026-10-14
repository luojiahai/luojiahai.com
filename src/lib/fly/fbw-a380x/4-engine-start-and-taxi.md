# 4 · Engine Start and Taxi

Pushback and engine start to the runway holding point.

## Before Pushback and Start

Start this once the passengers are boarded and the aircraft is secure. You need
the IFR clearance, and the APU running with **AVAIL** showing.

| Control | Action | Condition |
| --- | --- | --- |
| [EXT 1 & 2 & 3 & 4](controls.md#electrical) pushbuttons | press each to disconnect, check **AVAIL** | – |
| Ground crew | request the **external power disconnection** | – |
| [GROUND SERVICES](controls.md#ground) page | check the low pressure ground carts **disconnected** | flyPad |

> [!NOTE]
> Ground power comes off before the push so the ground crew can unplug it. The
> low pressure carts go too: left connected during the start, they can cause
> faulty triggers.

## Pushback Clearance and Preparation

Call ground and tell them you are ready to push and start. They clear you onto a
taxiway and give you a direction to face:

> *Callsign*, Ground. You are clear to push and start onto Whiskey 3 facing north.

Request pushback clearance:
[ATC Communications › Ground](../shared/atc-communications.md#2--ground-pushback-and-taxi).

| Control | Action | Condition |
| --- | --- | --- |
| ATC clearance | obtain **push and start-up** clearance | – |
| [BEACON](controls.md#exterior-lighting) switch | set **ON** | – |
| [SD DOOR page](controls.md#system-pages) | check windows and doors **closed** | – |
| [SD DOOR page](controls.md#system-pages) | check slides **ARMED** | – |
| [THRUST](controls.md#thrust) levers | set **IDLE** | – |
| [PARK BRK](controls.md#parking-brake) handle | set **OFF** | – |
| [C/L](controls.md#ecam-control-panel) key | run **BEFORE START checklist** on EWD | – |

> [!NOTE]
> The checklists live on the EWD. Press C/L on the ECAM control panel to open
> them, move with the UP and DOWN keys, and tick an item with the check-mark key.
> The aircraft senses some items itself and ticks them for you, BEACON among
> them.

## Pushback

| Control | Action | Condition |
| --- | --- | --- |
| [PUSHBACK](controls.md#ground) page | press **Call Tug** | flyPad, after the push clearance |
| [PUSHBACK](controls.md#ground) page | push with the **control buttons or the rudder and elevator** | once the tug is attached |

> [!NOTE]
> Some stands never show a tug. The pushback still works, and it looks like an
> invisible tug is pushing you. MSFS ATC and third-party add-ons can push you
> too; this guide uses the flyPad.

## Engine Start

Wait until you are clear of the terminal, or the ground crew has told you it is
clear to start.

| Control | Action | Condition |
| --- | --- | --- |
| [ENG START](controls.md#engine-start) selector | set **IGN START** | the SD ENG page appears; wait 10 s for the engine tests |
| Engines 1 and 2 | call **START ENGINES 1 AND 2** | two-engine taxi: start **1+4** or **2+3** instead |
| [ENG MASTER 1](controls.md#engine) lever | set **ON** | – |
| [ENG MASTER 2](controls.md#engine) lever | set **ON** | after engine 1 |
| [SD ENG page](controls.md#system-pages) | check the idle parameters **normal** | when **AVAIL** |
| Engines 3 and 4 | call **START ENGINES 3 AND 4** | two-engine taxi: the other pair, started on the way to the runway |
| [ENG MASTER 3](controls.md#engine) lever | set **ON** | – |
| [ENG MASTER 4](controls.md#engine) lever | set **ON** | after engine 3 |
| [SD ENG page](controls.md#system-pages) | check the idle parameters **normal** | when **AVAIL** |

A started engine shows **AVAIL** and settles at roughly **4.2 % THR**,
**21 % N1**, **367 °C EGT**, **63.8 % N2**, **63.1 % N3** and **670 kg/h FF**.

> [!NOTE]
> Any engine can go first, at the pilot's discretion; the guide starts 1, 2, 3,
> then 4. The engines need bleed air to start, so the APU must be available with
> **APU BLEED** on, as set in cockpit preparation. A Ground Air Starter Unit,
> connected from the flyPad Ground Services page, also works. Crossbleed from a
> running engine is for starting the rest during a reduced-engine taxi.
> FlyByWire's
> [Crossbleed Engine Start](https://docs.flybywiresim.com/pilots-corner/a32nx/a32nx-advanced-guides/engines/crossbleed-start/)
> guide covers it, and the A380 procedure is similar.

## After Engine Start

| Control | Action | Condition |
| --- | --- | --- |
| [ENG START](controls.md#engine-start) selector | set **NORM** | – |
| [APU BLEED](controls.md#air-conditioning-and-bleed) pushbutton | set **OFF** | – |
| [ENG ANTI ICE](controls.md#anti-ice) pushbuttons | set as required | icing expected, or water, slush, ice or snow on the ground, below 10 °C OAT |
| [APU MASTER SW](controls.md#auxiliary-power-unit-apu) pushbutton | set **OFF** | – |
| [SPEED BRAKE](controls.md#flaps-and-speed-brake) lever | set **ARM** | arms the ground spoilers |
| [RUDDER TRIM](controls.md#trim) knob | set **ZERO** | – |
| [FLAPS](controls.md#flaps-and-speed-brake) lever | set the **T.O position** | **2** for the guide's flight, from T.O PERF |
| [PITCH TRIM](controls.md#trim) switch | check the **takeoff trim** set | shown on the PFD |
| [SD STS page](controls.md#system-pages) | check the ECAM status | – |
| Ground crew | call **CLEAR TO DISCONNECT** and give hand signals | – |
| [MEMO](controls.md#ewd) | check **N/W STEERING DISC** not displayed | – |

### Flight Controls Check

Do it with the flaps at the takeoff setting. Work pitch, then roll, then yaw,
holding each input long enough for the surfaces to reach full travel.

| Control | Action | Condition |
| --- | --- | --- |
| [SD F/CTL page](controls.md#system-pages) | select on the SD | – |
| [SIDESTICK](controls.md#lateral-console) | deflect **full up, full down, neutral** | mirrored on the F/CTL page |
| [SIDESTICK](controls.md#lateral-console) | deflect **full left, full right, neutral** | mirrored on the F/CTL page |
| [TILLER](controls.md#lateral-console) | press **PEDAL DISC** | takes nosewheel steering off the pedals |
| Rudder pedals | deflect **full left, full right** | while PEDAL DISC is held |

| Control | Action | Condition |
| --- | --- | --- |
| Ground equipment | check **clear** | – |
| [C/L](controls.md#ecam-control-panel) key | run **AFTER START checklist** on EWD | two-engine taxi: wait until all four run |

## Taxi

Have the airport chart or diagram open before you move. Read back the taxi
clearance first:

> *Callsign*, Ground. Runway 08L, taxi via Whiskey 2, hold short of November 3,
> continue via November to Alpha 3, hold short Alpha 3.

Request taxi:
[ATC Communications › Ground](../shared/atc-communications.md#2--ground-pushback-and-taxi).

| Control | Action | Condition |
| --- | --- | --- |
| ATC clearance | obtain **taxi** clearance | read it back |
| [ND range](controls.md#efis-control-panel) selector | set **ZOOM** as appropriate | shows the OANS airport map |
| [ND mode](controls.md#efis-control-panel) selector | set **ARC**, **ROSE** or **PLAN** | pilot's discretion |
| [NOSE](controls.md#exterior-lighting) switch | set **TAXI** | – |
| [RWY TURN OFF](controls.md#exterior-lighting) switch | set as required | lights the taxiway and runway |
| [PARK BRK](controls.md#parking-brake) handle | set **OFF** | – |
| [THRUST](controls.md#thrust) levers | advance as required | add a little to get going when heavy |
| Brakes | check | press the pedals smoothly and release; not in a turn |
| [TILLER](controls.md#lateral-console) | steer as required | – |
| ATC clearance | confirm | – |

Keep **10–20 kt** in a straight line: past that, brake back to 10 kt and let it
accelerate again. Slow to **8–10 kt** for a sharp turn, and expect to need a
little more thrust if one comes straight away.

> [!NOTE]
> The aircraft needs little power. Even heavy and taxiing uphill it takes no
> more than 10 % of the engine thrust, and too much damages airport signs. If you
> need more, add it on the outer engines so the inner ones ingest less debris.
> Ground idle runs higher with engine anti-ice on.

> [!NOTE]
> Skipped as INOP in the A380X: TAXI (ETACS), "currently not available or
> possible to implement in the simulator", and the camera of RWY TURN OFF &
> CAMERA, for the same reason.

### Taxi Limitations

Taxi only on taxiways wide enough for the A380's wingspan, which in practice
means large international airports such as EGLL, EDDF or KJFK. Some publish a
separate A380 taxi chart.

> [!NOTE]
> A two-engine taxi has to use a symmetrical pair: **1+4** on the outer engines
> or **2+3** on the inner ones. Pick 2+3 where the turns are tight, to cut the
> chance of ingesting debris. Run the after start steps for that pair, and hold
> the AFTER START checklist until all four engines are running.

### During Taxi

| Control | Action | Condition |
| --- | --- | --- |
| [TILLER](controls.md#lateral-console) or rudder pedals | steer along the **centre line** | keep the line on the grey bar between the PFD and ND |
| [TILLER](controls.md#lateral-console) | steer slightly **ahead of the line** in turns | slow down while turning |

Check the FMS as you go, and again if the clearance changes on the way out.
Alone in the sim, do it stopped at the holding point, clear of the taxiway if you
are on online ATC.

| Page / field | Action | Condition |
| --- | --- | --- |
| [T.O PERF](controls.md#performance) | check the **selected runway and input data** | – |
| [F-PLN](controls.md#flight-plan) | revise or check the **SID and TRANS** | agrees with the clearance |
| Initial climb speed and speed limit | check or modify | – |

| Control | Action | Condition |
| --- | --- | --- |
| [ALT](controls.md#afs-control-panel) knob | set the **cleared altitude** | – |
| [HDG/TRK](controls.md#afs-control-panel) knob | preset the heading | if required |
| [FD](controls.md#afs-control-panel) pushbutton | check selected **ON** | – |
| [PFD](controls.md#displays) and ND | check | – |
| [MFD](controls.md#displays) | check | – |

| Page / field | Action | Condition |
| --- | --- | --- |
| [V1 / VR / V2](controls.md#performance) | check on **both sides** | – |
| [FLEX](controls.md#performance) | check the **thrust rating** on both sides | – |

| Control | Action | Condition |
| --- | --- | --- |
| Takeoff briefing | confirm | – |
| Flight instruments | confirm | – |
| [SPEED BRAKE](controls.md#flaps-and-speed-brake) lever | check **ARM** | – |
| [FLAPS](controls.md#flaps-and-speed-brake) lever | check **T.O** | – |
| [RTO](controls.md#landing-gear-and-brakes) pushbutton | press for **RTO ARM** | – |
| [SEAT BELTS](controls.md#signs) sign | set as needed | with NO MOBILE |
| [T.O CONFIG](controls.md#ecam-control-panel) pushbutton | press to **test** | – |
| [T.O MEMO](controls.md#ewd) | check **no blue line** | – |
| CABIN READY | check **received** | – |
| [C/L](controls.md#ecam-control-panel) key | run **TAXI checklist** on EWD | the guide's BEFORE TAKEOFF, down to the line |

### Crossing a Runway

Never cross a runway, active or not, without an explicit clearance from ATC and
a readback.

| Control | Action | Condition |
| --- | --- | --- |
| [LAND](controls.md#exterior-lighting) switch | set **ON** | – |
| [STROBE](controls.md#exterior-lighting) switch | set **ON** | – |
| Left and right | look out and **check clear** of aircraft | before entering |
| ATC | report the runway **vacated** | if required |

---

Previous: [3 · Preparing the FMS](3-preparing-the-fms.md) ·
Next: [5 · Takeoff, Climb, and Cruise](5-takeoff-climb-and-cruise.md)
