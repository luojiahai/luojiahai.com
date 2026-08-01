# 2 · Starting the Aircraft

Cold and dark to passengers boarding.

## Cockpit Preparation

A sweep of the pedestal, the main panel and the overhead before anything gets
power. Everything here should already be in position — you are confirming, not
changing.

| Control | Action |
| --- | --- |
| [PARK BRK](controls.md#parking-brake) handle | verify **ON** |
| [SPEED BRAKE](controls.md#flaps-and-speed-brake) lever | verify **RET** |
| [FLAPS](controls.md#flaps-and-speed-brake) lever | verify **0** |
| [WX RADAR MODE](controls.md#radar) selector | verify **OFF** |
| [ENG MASTER 1 & 2](controls.md#engine) switches | verify both **OFF** |
| [ENG MODE](controls.md#engine) selector | verify **NORM** |
| [THRUST](controls.md#thrust-and-trim) levers | verify **IDLE** |
| [LANDING GEAR](controls.md#autobrake-and-gear) lever | verify **DOWN** |
| [WIPER](controls.md#wipers) selector | verify **OFF** |

## Overhead Panel

### Electrical

Batteries alone power only a small part of the aircraft. Everything else needs
ground power, the APU, or a running engine.

| Control | Action | Condition |
| --- | --- | --- |
| [BAT 1 & 2](controls.md#electrical) pushbuttons | set both **ON** | chimes confirm they are live |
| [EXT PWR](controls.md#electrical) pushbutton | set **ON** | if the green **AVAIL** light is lit |

> [!NOTE]
> Not every stand has ground power, and in MSFS smaller airports often do not.
> That is realistic, not a bug — call a GPU if the airport has one, or run the
> APU instead.

### Flight Warning System

| Control | Action | Wait for |
| --- | --- | --- |
| [ECAM](controls.md#ewd) | wait for **FWS FWC 1+2 FAULT** to clear | about 50 s after AC power |

> [!NOTE]
> The FWS starts initialising the moment AC power arrives, from either external
> power or the APU. Do not run the fire tests until the message has gone and the
> alarms have played out.

### Auxiliary Power Unit (APU)

| Control | Action | Condition |
| --- | --- | --- |
| [APU FIRE TEST](controls.md#fire-protection) pushbutton | press and **hold** | before starting the APU |
| [APU MASTER SW](controls.md#auxiliary-power-unit-apu) pushbutton | set **ON** | – |
| [APU START](controls.md#auxiliary-power-unit-apu) pushbutton | set **ON** | starts within about 1 min |
| [APU BLEED](controls.md#auxiliary-power-unit-apu) pushbutton | set **ON** | once the APU is **AVAIL** [^apubleed] |

[^apubleed]: Many airlines now require the packs to be running before passengers
board and until deboarding is complete, so the APU goes on even with ground
power — the packs need APU bleed air whenever the engines are not running. APU
bleed is also required to start the engines.

The real-world flow adds two cool-down waits so APU oil fumes never reach the
air conditioning:

1. Check the [PACK 1 & 2](controls.md#air-conditioning-and-pressurisation)
   pushbuttons are **OFF** before powering the aircraft.
2. [APU MASTER SW](controls.md#auxiliary-power-unit-apu) — set **ON**.
3. [APU START](controls.md#auxiliary-power-unit-apu) — press. The APS3200 arms
   the start signal during its self-test, so there is no need to wait.
4. Wait for **AVAIL**, then wait **1 min**.
5. [APU BLEED](controls.md#auxiliary-power-unit-apu) — set **ON**, then wait
   another **1 min**.
6. [PACK 1 & 2](controls.md#air-conditioning-and-pressurisation) — set **ON**.

### Crew Oxygen Supply

| Control | Action |
| --- | --- |
| [CREW SUPPLY](controls.md#oxygen) pushbutton | set **ON**, white **OFF** light out |

### ADIRS

| Control | Action | Condition |
| --- | --- | --- |
| [ADIR 1 & 2 & 3](controls.md#adirs) selectors | set all three **NAV** | alignment progress is on the ECAM |

### Exterior Lighting

| Control | Action | Condition |
| --- | --- | --- |
| [NAV & LOGO](controls.md#exterior-lighting) switch | set **ON** | shows the aircraft is powered |
| [STROBE](controls.md#exterior-lighting) switch | set **AUTO** | – |

### Interior Lighting and Signs

| Control | Action | Condition |
| --- | --- | --- |
| [DOME](controls.md#interior-lighting) switch | set **DIM** or **BRT** | if the cockpit is too dark |
| [OVHD INTEG LT](controls.md#interior-lighting) knob | adjust the brightness | outlines the overhead panel |
| [SEAT BELTS](controls.md#signs) sign | set **ON** | after fuelling, in the real procedure |
| [NO SMOKING](controls.md#signs) sign | set **AUTO** | – |
| [EMER EXIT LT](controls.md#signs) selector | set **ARM** | – |

### Air Conditioning and Pressurisation

| Control | Action | Condition |
| --- | --- | --- |
| [LDG ELEV](controls.md#air-conditioning-and-pressurisation) knob | set **AUTO** | – |
| [COCKPIT / FWD CABIN / AFT CABIN](controls.md#air-conditioning-and-pressurisation) knobs | adjust all three | as the cabin needs |

### Hydraulics and Fuel

| Control | Action | Condition |
| --- | --- | --- |
| [ECAM HYD page](controls.md#system-pages) | verify **no white lights** on the panel | – |
| [L TK PUMPS 1 & 2](controls.md#fuel) pushbuttons | set both **ON** | white **OFF** light out |
| [CTR TK PUMP 1 & 2](controls.md#fuel) pushbuttons | set both **ON** | white **OFF** light out |
| [R TK PUMPS 1 & 2](controls.md#fuel) pushbuttons | set both **ON** | white **OFF** light out |

### Engine Fire Test

| Control | Action | Condition |
| --- | --- | --- |
| [ENG 1 & 2 FIRE TEST](controls.md#fire-protection) pushbuttons | hold each for **5 s** | lights, aurals and ECAM all respond |

## Main Panel

### Displays

| Control | Action | Condition |
| --- | --- | --- |
| [PFD brightness](controls.md#displays) knob | adjust | left of the PFD |
| [ND brightness](controls.md#displays) knob | adjust | left of the ND |
| [ECAM UPPER / LOWER brightness](controls.md#ecam-control-panel) knobs | adjust both | just ahead of the thrust levers |
| [ISIS](controls.md#isis) display | adjust with **+ / −** | left of the upper ECAM |
| [ISIS BARO](controls.md#isis) | set the current **QNH** | – |

### Radio Panel

| Control | Action | Condition |
| --- | --- | --- |
| [RMP frequency](controls.md#radio-management) | set the active to **ATIS** | – |
| [RMP frequency](controls.md#radio-management) | set the standby to **Ground** | – |
| [BARO selector](controls.md#efis-control-panel) | set **QNH** | pull the knob; inner ring picks inHg or hPa |
| [FD](controls.md#efis-control-panel) pushbutton | set **ON** | green light confirms |

> [!NOTE]
> QNH reads height above sea level; QFE reads height above the field, so the
> altimeter shows zero on the ground. Fly QNH unless the airfield's procedure
> calls for QFE.

### ECAM

| Indication | Action | Condition |
| --- | --- | --- |
| [FOB](controls.md#ewd) | verify **enough fuel** for the flight | refuel on the flyPad [FUEL](controls.md#ground) page if not |

## Boarding Passengers

1. Open **flyPad / Ground / Services**.
2. Request the baggage truck.
3. Request the jet bridge.
4. Request any other services required.
5. Start boarding passengers.

> [!NOTE]
> flyPad: perform the **COCKPIT PREPARATION** checklist. This closes out 5 of
> the 7 items on the **BEFORE START** section of the FlyByWire checklist.

---

Previous: [1 · Preflight](1-preflight.md) ·
Next: [3 · Preparing the MCDU](3-preparing-the-mcdu.md)
