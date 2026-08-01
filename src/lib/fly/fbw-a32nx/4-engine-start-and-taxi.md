# 4 · Engine Start and Taxi

Doors closed to holding point.

## Before Pushback

| Control | Action | Condition |
| --- | --- | --- |
| [GROUND SERVICES](controls.md#ground) page | **arm and secure** all doors | flyPad |
| [EXT PWR](controls.md#electrical) pushbutton | set **OFF**, disconnect | – |
| [APU BLEED](controls.md#auxiliary-power-unit-apu) pushbutton | set **ON** | needed to start the engines |
| [BEACON](controls.md#exterior-lighting) switch | set **ON** | – |

> [!NOTE]
> BEACON goes on at push and start clearance — before anything moves or turns —
> not at takeoff. It is the "stay clear" signal to the ground crew.

## Pushback

Call ground and tell them you are ready to push and start. They clear you onto a
taxiway and give you a direction to face:

> *Callsign*, ground. You are clear to push and start onto Alpha 3 facing east.

Request pushback clearance —
[ATC Communications › Ground](atc-communications.md#2--ground-pushback-and-taxi).

| Control | Action | Condition |
| --- | --- | --- |
| [PUSHBACK](controls.md#ground) page | press **Call Tug** | flyPad |
| [PUSHBACK](controls.md#ground) page | push with the **controls or the rudder** | once the tug is attached |

> [!NOTE]
> Some stands never show a tug. The pushback still works — it simply looks like
> an invisible tug is pushing you.

## Engine Start

Wait until you are clear of the terminal and the ground crew has released you.

| Control | Action | Wait for |
| --- | --- | --- |
| [CHRONO](controls.md#warning-panel) pushbutton | press to **start** the timer | – |
| [ENG MODE](controls.md#engine) selector | set **IGN/START** | packs audibly close, ECAM ENG page appears |
| [ENG MASTER 1](controls.md#engine) switch | set **ON** | **AVAIL**, about 1 min |
| [ENG MASTER 2](controls.md#engine) switch | set **ON** | **AVAIL**, about 1 min |

At ISA sea level a started engine settles at roughly **19 % N1**, **68 % N2**,
**520 °C EGT** and **290 kg/h FF**, with N1 reported **AVAIL**.

> [!NOTE]
> As of January 2025 Airbus SOP starts **engine 1 first**; some airline SOPs
> differ. The engines need bleed air to start, so the APU must be available with
> **APU BLEED** on — cross-bleed starting from the running engine is not
> modelled in the A32NX yet.

## After Engine Start

| Control | Action | Condition |
| --- | --- | --- |
| [ENG MODE](controls.md#engine) selector | set **NORM** | – |
| [FLAPS](controls.md#flaps-and-speed-brake) lever | set the **takeoff position** | as computed on the MCDU |
| [SPEED BRAKE](controls.md#flaps-and-speed-brake) lever | set **ARM** | arms the ground spoilers |
| [APU BLEED](controls.md#auxiliary-power-unit-apu) pushbutton | set **OFF** | – |
| [APU MASTER SW](controls.md#auxiliary-power-unit-apu) pushbutton | set **OFF** | – |
| [ENG ANTI ICE](controls.md#anti-ice) pushbutton | set as required | below 10 °C with visible moisture |
| [WING ANTI ICE](controls.md#anti-ice) pushbutton | set as required | below 10 °C with visible moisture |
| [PITCH TRIM](controls.md#thrust-and-trim) handwheel | set for the **CG** | trim table on the FlyByWire checklist |
| [RUD TRIM](controls.md#thrust-and-trim) indication | reset to **ZERO** | – |

> [!NOTE]
> In icing conditions with rain, slush or snow, leave the flaps retracted until
> the holding point so the slat and flap mechanism stays clean.

> [!NOTE]
> A precise trim value is not critical: anywhere in the green band is a safe
> takeoff as long as the CG is in limits. The neo's rotation law gives a
> consistent rotation rate regardless, and autotrim takes over at liftoff.

> [!NOTE]
> flyPad: perform the **AFTER START** checklist.

## Flight Controls Check

Some SOPs put this before taxi, others during it.

| Control | Action | Condition |
| --- | --- | --- |
| [F/CTL and other system pages](controls.md#ecam-control-panel) button | select the **F/CTL** page | all surfaces shown green |
| Sidestick | deflect **fully in all four directions** | full travel mirrored on the ECAM |
| Sidestick | check the **SPD BRK arrows** | shown while the ailerons move |
| Rudder pedals | deflect **fully both ways** | rudder symbol reaches each stop |

## Taxi

Read back the clearance before you move:

> *Callsign*, ground. Runway 30, taxi via Alpha, hold short of 30 on Alpha 2.

### Moving the Aircraft

| Control | Action | Condition |
| --- | --- | --- |
| [RWY TURN OFF](controls.md#exterior-lighting) switch | set **ON** | – |
| [NOSE](controls.md#exterior-lighting) switch | set **TAXI** | – |
| Ground crew and traffic | look left and right, **check clear** | before releasing the brakes |
| [PARK BRK](controls.md#parking-brake) handle | set **OFF** | – |
| [ECAM WHEEL page](controls.md#system-pages) | check the **brake pressure at zero** | – |
| [THRUST](controls.md#thrust-and-trim) levers | advance to about **25–30 % N1** | only as much as it takes to roll |
| Brakes | perform a **brake check** | no need to stop, just watch the pressure |
| [BRK FAN](controls.md#autobrake-and-gear) pushbutton | set **ON** | if the WHEEL page shows a brake temperature arc |

> [!NOTE]
> Idle thrust is usually enough to taxi, and will slowly accelerate you. Let the
> aircraft run up to about 30 kt, brake back to 10 kt, and repeat. Keep it near
> 15 kt for normal turns and 10 kt for sharp ones, and do not blast N1 near the
> terminal.

### During Taxi

| Control | Action | Condition |
| --- | --- | --- |
| Tiller or rudder pedals | steer along the **centre line** | keep the line between the PFD and ND |
| ATC clearance | **verify** the departure clearance | – |
| [F-PLN](controls.md#flight-plan) page | check the **SID and transition** | agrees with the clearance |
| Initial climb speed and speed limit | **check or modify** | – |
| [ALT](controls.md#flight-control-unit-fcu) knob | set the **cleared altitude** | – |
| [HDG / TRK](controls.md#flight-control-unit-fcu) knob | **preset** the heading | if ATC assigned one; NAV disarms, RWY TRK holds runway track |
| [FD](controls.md#efis-control-panel) pushbuttons | check **both on** | – |
| [FMA](controls.md#displays) and ND | **check** | – |
| Takeoff briefing | **confirm** | – |
| [WX RADAR MODE](controls.md#radar) selector | set **ON**, [SYS](controls.md#radar) **1** | if required for departure |
| [PWS](controls.md#radar) switch | set **AUTO** | – |
| [ATC code](controls.md#atc-and-tcas) | **confirm and set** for takeoff | – |
| [TERR](controls.md#gpws) pushbutton | set as required | – |
| [AUTO/BRK](controls.md#autobrake-and-gear) pushbutton | set **MAX** | – |

If the runway or the takeoff data changes on the way out:

| Step | Action | Condition |
| --- | --- | --- |
| Final takeoff data | **confirm or recompute** | – |
| [F-PLN](controls.md#flight-plan) page | **revise** the runway | – |
| [FLAPS](controls.md#flaps-and-speed-brake) lever | reset the **takeoff position** | – |
| [TAKEOFF](controls.md#performance) page | **reinsert** V1, VR and V2 | – |
| [TAKEOFF](controls.md#performance) page | **reinsert** the FLEX TO temperature | – |
| Revised FMS takeoff data | **crosscheck** | – |

### Crossing a Runway

| Control | Action | Condition |
| --- | --- | --- |
| Left and right | look out and **check visually clear** | before entering |
| [STROBE](controls.md#exterior-lighting) switch | set **ON** | while on the runway |

> [!NOTE]
> flyPad: perform the **TAXI** checklist.

---

Previous: [3 · Preparing the MCDU](3-preparing-the-mcdu.md) ·
Next: [5 · Takeoff, Climb and Cruise](5-takeoff-climb-and-cruise.md)
