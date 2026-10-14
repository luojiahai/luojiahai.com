# Controls Reference

Every control referenced by the procedures, grouped by where you physically find
it. The procedure pages link here instead of carrying full documentation URLs, so
the checklists stay readable. The generator reads the docs link out of each row;
the full name shown under a control, and the positions and settings it is set to
— `IGN START`, `TA/RA`, `PURS SEL` — come from [Names](names.md).

Links point at the control's own heading on FlyByWire's A380X briefing pages.
Where a page has no heading for the control, or the item is a display, the link
goes to the page. MFD pages and fields have no briefing page yet, so they link to
the beginner guide section that walks through them. `(INOP)` marks what the
A380X does not simulate yet.

| Panel | Sections |
| --- | --- |
| [Overhead (OVHD)](#overhead-panel) | [Overhead Scan](#overhead-scan) · [Electrical](#electrical) · [Recorders, Evacuation and ELT](#recorders-evacuation-and-elt) · [ADIRS](#adirs) · [Fire Protection](#fire-protection) · [APU](#auxiliary-power-unit-apu) · [Air Conditioning and Bleed](#air-conditioning-and-bleed) · [Cargo Air Conditioning](#cargo-air-conditioning) · [Engine Start](#engine-start) · [Fuel](#fuel) · [Anti-Ice](#anti-ice) · [Oxygen](#oxygen) · [Signs](#signs) · [Exterior Lighting](#exterior-lighting) · [Interior Lighting](#interior-lighting) · [Wipers](#wipers) |
| [Glareshield](#glareshield) | [AFS Control Panel](#afs-control-panel) · [EFIS Control Panel](#efis-control-panel) · [Glareshield Side Panels](#glareshield-side-panels) · [Glareshield Lighting](#glareshield-lighting) |
| [Main Panel](#main-panel) | [Displays](#displays) · [Switching](#switching) · [ISIS](#isis) · [Landing Gear and Brakes](#landing-gear-and-brakes) · [Clock](#clock) · [Table and Keyboard](#table-and-keyboard) |
| [Pedestal](#pedestal) | [Parking Brake](#parking-brake) · [Flaps and Speed Brake](#flaps-and-speed-brake) · [Engine](#engine) · [Thrust](#thrust) · [Trim](#trim) · [ECAM Control Panel](#ecam-control-panel) · [Surveillance Panel](#surveillance-panel) · [Radio Management](#radio-management) · [Cockpit Lighting](#cockpit-lighting) · [Cockpit Door](#cockpit-door) |
| [Lateral Consoles](#lateral-consoles) | [Lateral Console](#lateral-console) |
| [MFD](#mfd) | [Data and Status](#data-and-status) · [INIT](#init) · [Flight Plan](#flight-plan) · [Navaids](#navaids) · [Fuel and Load](#fuel-and-load) · [Performance](#performance) · [Surveillance](#surveillance) |
| [ECAM](#ecam) | [EWD](#ewd) · [System Pages](#system-pages) |
| [flyPad EFB](#flypad-efb) | [Dispatch](#dispatch) · [Ground](#ground) · [Dashboard and Charts](#dashboard-and-charts) |

---

## Overhead Panel

### Overhead Scan

| Control | What it is | Docs |
| --- | --- | --- |
| ALL WHITE LIGHTS | The lights-out check: no overhead pushbutton shows a white light | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/overviews/ovhd/) |
| MAINTENANCE PANEL | Maintenance panel at the back of the overhead; every light off | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/maintenance/) |

### Electrical

| Control | What it is | Docs |
| --- | --- | --- |
| ALL BAT | All four battery pushbuttons: BAT 1, ESS BAT, BAT 2, APU BAT | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/elec/#bat12apuess-pb-sw) |
| BAT 1 | Battery 1 pushbutton | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/elec/#bat12apuess-pb-sw) |
| ESS BAT | Essential battery pushbutton | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/elec/#bat12apuess-pb-sw) |
| BAT 2 | Battery 2 pushbutton | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/elec/#bat12apuess-pb-sw) |
| APU BAT | APU battery pushbutton | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/elec/#bat12apuess-pb-sw) |
| EXT 1 & 2 & 3 & 4 | External power pushbuttons (AVAIL / ON) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/elec/#ext-1234-pb) |

### Recorders, Evacuation and ELT

| Control | What it is | Docs |
| --- | --- | --- |
| RCDR GND CTL | Recorder ground control pushbutton (INOP) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/rcdr-evac/#rcdr-gnd-ctl-pb) |
| CAPT & PURS | Evacuation command selector (CAPT / CAPT & PURS) (INOP) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/rcdr-evac/#capt-and-purs-sw) |
| ELT | Emergency locator transmitter selector (INOP) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/elt/#elt-selector) |
| CVR TEST | Cockpit voice recorder test pushbutton, right overhead (INOP) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/cvr/#test-pb) |

### ADIRS

| Control | What it is | Docs |
| --- | --- | --- |
| IR MODE 1 & 2 & 3 | Inertial reference mode selectors (OFF / NAV / ATT), turned 1, 2, then 3 | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/adirs/#operation) |
| PROBE & WINDOW HEAT | Probe and window heat pushbutton (AUTO / ON), beside the ADIRS | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/adirs/) |

### Fire Protection

| Control | What it is | Docs |
| --- | --- | --- |
| APU FIRE | APU fire pushbutton, guarded | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/apu-fire/#apu-fire-pb) |
| APU AGENT | APU extinguisher agent pushbutton | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/apu-fire/#agent-pb) |
| ENG 1 & 2 & 3 & 4 FIRE | Engine fire pushbuttons, guarded | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/eng-fire/#eng-1234-fire-pb) |
| ENG AGENT 1 & 2 | Engine extinguisher agent pushbuttons, two per engine | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/eng-fire/#agent-12-pb) |
| FIRE TEST | Fire test pushbutton: tests the engine, APU and main gear bay fire warnings | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/eng-fire/#test-pb) |

### Auxiliary Power Unit (APU)

| Control | What it is | Docs |
| --- | --- | --- |
| APU MASTER SW | APU master switch pushbutton | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/apu/#master-sw) |
| APU START | APU start pushbutton (ON / AVAIL) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/apu/#start) |

### Air Conditioning and Bleed

| Control | What it is | Docs |
| --- | --- | --- |
| AIR FLOW | Pack air flow selector (MAN / LO / NORM / HI) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/air/#air-flow-selector) |
| PACK 1 & 2 | Air conditioning pack pushbuttons | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/air/#pack-12-pb) |
| CKPT | Cockpit temperature selector (COLD … HOT) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/air/#ckpt-selector) |
| CABIN | Cabin temperature selector (COLD … HOT / PURS SEL) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/air/#cabin-selector) |
| APU BLEED | APU bleed air pushbutton | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/air/#apu-bleed-pb-sw) |
| XBLEED | Crossbleed selector (CLOSE / AUTO / OPEN) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/air/#x-bleed-selector) |

### Cargo Air Conditioning

| Control | What it is | Docs |
| --- | --- | --- |
| CARGO AIR COND | Cargo isolation valves, bulk heater and bulk temperature selector | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/cargo-air/) |

### Engine Start

| Control | What it is | Docs |
| --- | --- | --- |
| ENG START | Engine start selector (CRANK / NORM / IGN START); CRANK is INOP | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/eng-start/#eng-mode-selector) |

### Fuel

| Control | What it is | Docs |
| --- | --- | --- |
| FEED TK 1 & 2 & 3 & 4 MAIN | Feed tank main pump pushbuttons | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/fuel/#feed-tk-1234-main-pb-sw) |
| FEED TK 1 & 2 & 3 & 4 STBY | Feed tank standby pump pushbuttons | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/fuel/#feed-tk-1234-stby-pb-sw) |
| TRIM TK FEED | Trim tank feed selector (ISOL / AUTO / OPEN) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/fuel/#trim-tk-feed-selector) |

### Anti-Ice

| Control | What it is | Docs |
| --- | --- | --- |
| ENG ANTI ICE | Engine anti-ice pushbuttons, ENG 1 to 4 | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/anti-ice/#eng-1234) |
| WING ANTI ICE | Wing anti-ice pushbutton | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/anti-ice/#wing-anti-ice) |

### Oxygen

| Control | What it is | Docs |
| --- | --- | --- |
| CREW SUPPLY | Crew oxygen supply pushbutton | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/oxygen/#crew-supply-pb-sw) |

### Signs

| Control | What it is | Docs |
| --- | --- | --- |
| SEAT BELTS | Seat belts sign selector (ON / AUTO / OFF) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/signs/#seat-belts) |
| NO MOBILE | No mobile phone sign selector (ON / AUTO / OFF); the A380 has no NO SMOKING sign | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/signs/#no-mobile) |
| EMER EXIT LT | Emergency exit lighting selector (ON / ARM / OFF) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/signs/#emer-exit-lt) |

### Exterior Lighting

See [Lights by Phase](lights.md) for the full state matrix.

| Control | What it is | Docs |
| --- | --- | --- |
| STROBE | Strobe light switch (ON / AUTO / OFF) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/ext-lt/#strobe) |
| BEACON | Beacon light switch | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/ext-lt/#beacon) |
| WING | Wing and engine scan light switch | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/ext-lt/#wing) |
| NAV | Navigation light switch | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/ext-lt/#nav) |
| LOGO | Logo light switch (ON / AUTO / OFF) (INOP) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/ext-lt/#logo) |
| RWY TURN OFF | Runway turn off and camera light switch, printed RWY TURN OFF & CAMERA; the camera is INOP | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/ext-lt/#rwy-turn-off) |
| LAND | Landing light switch | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/ext-lt/#land) |
| NOSE | Nose light switch (T.O / TAXI / OFF) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/ext-lt/#nose) |

### Interior Lighting

| Control | What it is | Docs |
| --- | --- | --- |
| STBY COMPASS | Standby compass and ice indicator light switch (ICE IND / OFF) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/int-lt/#stby-compass) |
| STORM | Storm light switch (INOP) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/int-lt/#storm) |
| ANN LT | Annunciator light switch (TEST / BRT / DIM) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/int-lt/#ann-lt) |

### Wipers

| Control | What it is | Docs |
| --- | --- | --- |
| WIPER | Windshield wiper selectors, one per side (OFF / SLOW / FAST) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/wiper/#wiper-selector) |

---

## Glareshield

### AFS Control Panel

The A380's FCU. Push a knob for managed mode, pull it for selected mode.

| Control | What it is | Docs |
| --- | --- | --- |
| SPD/MACH | Speed selector knob — push for managed speed, pull for selected | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/glareshield/afs/#spdmach-knob) |
| HDG/TRK | Heading selector knob — pull for selected heading, push for managed NAV | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/glareshield/afs/#hdgtrk-knob) |
| ALT | Altitude selector knob — push for managed, pull for selected | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/glareshield/afs/#alt-knob) |
| V/S / FPA | Vertical speed / flight path angle knob | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/glareshield/afs/#vs-fpa-knob) |
| LOC | Localizer mode pushbutton | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/glareshield/afs/#loc-pb) |
| APPR | Approach mode pushbutton (arms LOC + G/S) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/glareshield/afs/#appr-pb) |
| AP1 / AP2 | Autopilot pushbuttons | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/glareshield/afs/#ap12-pb) |
| A/THR | Autothrust pushbutton | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/glareshield/afs/#athr-pb) |
| FD | Flight director pushbutton, on the AFS CP | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/glareshield/afs/#fd-pb) |
| TRUE/MAG | North reference pushbutton | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/glareshield/afs/#truemag-pb) |

### EFIS Control Panel

| Control | What it is | Docs |
| --- | --- | --- |
| EFIS CP | EFIS control panel as a whole, one per side | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/glareshield/efis/#electronic-flight-instrument-system-efis-panel) |
| BARO REF | Barometric reference window (QNH / STD) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/glareshield/efis/#barometric-reference-window) |
| BARO selector | Barometric reference knob — push for STD, pull for QNH; outer ring picks inHg or hPa | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/glareshield/efis/#barometric-reference-controls) |
| LS | Landing system pushbutton (localizer and glideslope scales on the PFD) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/glareshield/efis/#ls-pb) |
| CSTR | Constraint pushbutton (ND altitude constraints) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/glareshield/efis/#nd-data-display-pushbuttons) |
| TERR | Terrain pushbutton (terrain on the ND) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/glareshield/efis/#nd-data-display-pushbuttons) |
| TRAF | Traffic pushbutton (TCAS traffic on the ND) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/glareshield/efis/#nd-data-display-pushbuttons) |
| WX | Weather radar pushbutton (INOP) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/glareshield/efis/#nd-data-display-pushbuttons) |
| ND mode | Navigation display mode selector (LS / VOR / NAV / ARC / PLAN) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/glareshield/efis/#nd-mode-selector) |
| ND range | Navigation display range selector; ZOOM shows the airport map (OANS) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/glareshield/efis/#nd-range-selector) |
| TAXI (ETACS) | Taxi camera pushbutton, printed TAXI (INOP) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/glareshield/efis/#taxi-pb) |

### Glareshield Side Panels

| Control | What it is | Docs |
| --- | --- | --- |
| CHRONO | Chronometer pushbutton — start, stop, reset on the ND | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/glareshield/glare-side/#chrono-pb) |
| MASTER WARN | Master warning light and reset | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/glareshield/glare-side/#attention-getters) |
| MASTER CAUT | Master caution light and reset | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/glareshield/glare-side/#attention-getters) |

### Glareshield Lighting

| Control | What it is | Docs |
| --- | --- | --- |
| GLARESHIELD LT | Knobs under the glareshield: panel floodlights, glareshield integral lights, LCD brightness | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/glareshield/glare-underside/#usage) |

---

## Main Panel

### Displays

| Control | What it is | Docs |
| --- | --- | --- |
| PFD | Primary flight display | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/main-panel/pfd/) |
| FMA | Flight mode annunciator, the top strip of the PFD | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/main-panel/pfd/) |
| ND | Navigation display, with the vertical display below it | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/main-panel/nd/) |
| MFD | Multifunction display: the FMS, ATC and surveillance pages, worked by mouse and keyboard | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/main-panel/mfd/) |
| OANS | Onboard airport navigation system, the airport map on the ND at range ZOOM | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-advanced-guides/oans-btv/#airport-navigation) |
| BTV | Brake to vacate: pick a runway exit on the OANS, then set AUTO BRK to BTV | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-advanced-guides/oans-btv/#btv-setup) |

### Switching

| Control | What it is | Docs |
| --- | --- | --- |
| SWITCHING | ATT HDG, AIR DATA and FMS source selectors | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/main-panel/switching/#usage) |

### ISIS

| Control | What it is | Docs |
| --- | --- | --- |
| ISIS | Integrated standby instrument system; only one is simulated | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/main-panel/isis/) |
| ISIS BARO | Standby altimeter setting | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/main-panel/isis/) |

### Landing Gear and Brakes

| Control | What it is | Docs |
| --- | --- | --- |
| LANDING GEAR | Landing gear lever (UP / DOWN) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/main-panel/center-right/#gear-lever) |
| L/G | Landing gear indicator lights, one green triangle per gear | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/main-panel/center-right/#landing-gear-indicator) |
| AUTO BRK | Autobrake selector (DISARM / BTV / LO / 2 / 3 / HI) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/main-panel/center-right/#autobrake-selector) |
| RTO | Rejected takeoff autobrake pushbutton (RTO ARM) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/main-panel/center-right/#rto-rejected-takeoff-button) |
| A-SKID | Anti-skid switch | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/main-panel/center-right/#anti-skid-switch) |
| BODY ACCU | Body gear brake accumulator pressure gauge | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/main-panel/center-right/#body-accumulator-pressure-gauge) |
| L/G GRVTY | Gravity gear extension switch, guarded | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/main-panel/gravity-gear/#lg-grvty-sw) |

### Clock

| Control | What it is | Docs |
| --- | --- | --- |
| CLOCK | Cockpit clock: UTC, chrono, elapsed time and date | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/main-panel/center-right/#clock) |

### Table and Keyboard

| Control | What it is | Docs |
| --- | --- | --- |
| SLIDING TABLE | Sliding table with the keyboard, in front of each pilot | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/main-panel/table-keyboard/#table-and-keyboard) |

---

## Pedestal

### Parking Brake

| Control | What it is | Docs |
| --- | --- | --- |
| PARK BRK | Parking brake handle — pull and turn | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/parking-brake/#parking-brake-handle) |
| ACCUS REINFLATE | Body gear brake accumulator reinflate pushbutton | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/parking-brake/#accus-reinflate) |

### Flaps and Speed Brake

| Control | What it is | Docs |
| --- | --- | --- |
| FLAPS | Flaps lever (0 / 1 / 2 / 3 / FULL) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/flap-lever/) |
| SPEED BRAKE | Speed brake lever (RET / ½ / FULL); pull it up at RET to arm the ground spoilers | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/speed-brake/) |

### Engine

| Control | What it is | Docs |
| --- | --- | --- |
| ENG MASTER 1 & 2 & 3 & 4 | Engine master levers | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/engine-master/#engine-1234-master-lever) |

### Thrust

| Control | What it is | Docs |
| --- | --- | --- |
| THRUST | Thrust levers (IDLE / CL / FLX/MCT / TOGA) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/throttle/#thrust-levers) |
| REVERSER | Thrust reverser levers, engines 2 and 3 only (IDLE REV / MAX REV) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/throttle/#thrust-reverser-23-lever) |
| A/THR instinctive disconnect | Red pushbutton on the thrust levers; disconnects A/THR and disarms the autobrake | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/throttle/#athr-instinctive-disconnect-push-button) |

### Trim

| Control | What it is | Docs |
| --- | --- | --- |
| PITCH TRIM | Pitch trim switch (NOSE DN / NOSE UP); the takeoff trim shows on the PFD | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/trim-panel/#pitch-trim) |
| RUDDER TRIM | Rudder trim knob and position display | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/trim-panel/#rudder-trim) |
| RUDDER TRIM RESET | Rudder trim reset pushbutton | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/trim-panel/#reset-button) |

### ECAM Control Panel

| Control | What it is | Docs |
| --- | --- | --- |
| T.O CONFIG | Takeoff configuration test pushbutton | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/ecam-cp/#to-config) |
| C/L | Checklist key — opens the normal checklist menu on the EWD | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/ecam-cp/#cl) |
| ✓ | Check-mark key — ticks or unticks the boxed checklist item | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/ecam-cp/#_1) |
| UP | Up-arrow key — moves the checklist box up | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/ecam-cp/#up-arrow) |
| DOWN | Down-arrow key — moves the checklist box down | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/ecam-cp/#down-arrow) |
| STS | Status page key | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/ecam-cp/#sts) |
| SD page keys (ENG, APU, BLEED, DOOR, FUEL, WHEEL, F/CTL) | System display page keys | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/ecam-cp/#system-pages-buttons) |

### Surveillance Panel

Not yet implemented in the A380X; set these systems on the MFD [SURV](#surveillance) page.

| Control | What it is | Docs |
| --- | --- | --- |
| TA ONLY | TCAS mode pushbutton; lit for TA ONLY, dark for TA/RA | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/surveillance/#ta-pb) |
| WXR | Weather radar controls (INOP) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/surveillance/#wxr-controls-inop) |

### Radio Management

Only VHF and squawk entry work on the A380X RMPs so far.

| Control | What it is | Docs |
| --- | --- | --- |
| RMP 1 & 2 | Radio management panels, captain and first officer; the BRT/OFF knob turns each on | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/rmp/#brtoff-knob) |
| RMP 3 | Third radio management panel, on the overhead | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/ovhd/rmp/) |
| RMP frequency | Active and standby frequencies on the VHF page | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/rmp/#vhf-page) |
| VHF 1 & 2 & 3 | VHF reception knobs — pull out to listen, turn for volume | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/rmp/#vhf-reception-knobs-vhf-123) |
| VHF transmission keys | Keys that pick the VHF radio to transmit on | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/rmp/#vhf-transmission-keys-vhf-123) |
| INT | Interphone reception knob (INOP) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/rmp/) |
| STBY RAD NAV | Standby radio navigation pushbutton (INOP) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/rmp/) |
| SQWK | Squawk page key | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/rmp/#squawk-page) |

### Cockpit Lighting

| Control | What it is | Docs |
| --- | --- | --- |
| INTEG LT | Main panel integral lighting knob | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/cockpit-lighting/#integ-lt-integral-lighting) |
| MAIN PNL FLOOD LT | Main panel floodlight knob | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/cockpit-lighting/#main-pnl-flood-lt-main-panel-flood-light) |
| PEDESTAL FLOOD LT | Pedestal floodlight knob | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/cockpit-lighting/#pedestal-flood-lt-pedestal-flood-light) |
| AMBIENT LT | Cockpit ambient light knob | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/cockpit-lighting/#ambient-lt-ambient-light) |

### Cockpit Door

| Control | What it is | Docs |
| --- | --- | --- |
| CKPT DOOR | Cockpit door switch (UNLOCK / NORM / LOCK) (INOP) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/pedestal/cockpit-door/#usage) |

---

## Lateral Consoles

### Lateral Console

| Control | What it is | Docs |
| --- | --- | --- |
| SLIDING WINDOW | Cockpit window control handle | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/overviews/lateral-console/#7-cockpit-window-control-handle) |
| SIDESTICK | Sidestick; its red pushbutton disconnects the autopilot | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/overviews/lateral-console/#4-sidestick) |
| TILLER | Steering handwheel; its centre button (PEDAL DISC) takes steering off the rudder pedals | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/overviews/lateral-console/#5-steering-handwheels-tiller) |
| OIT | Onboard information terminal (INOP; the flyPad stands in) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/overviews/lateral-console/#3-oit-display) |

---

## MFD

### Data and Status

| Page / field | What it is | Docs |
| --- | --- | --- |
| DATA/STATUS | Start-up page: aircraft and engine type, nav database and its dates | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#data-status) |

### INIT

| Page / field | What it is | Docs |
| --- | --- | --- |
| INIT | INIT page, opened from the ACTIVE menu | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#init-flight-plan-initialization) |
| CPNY F-PLN REQUEST | Pulls the SimBrief flight plan into the FMS | [docs](https://docs.flybywiresim.com/aircraft/a380x/feature-guides/simbrief/#request-data-from-simbrief-and-initialize-flight-plan) |
| FLT NBR | Flight number | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#flight-number) |
| FROM / TO / ALTN | Departure, destination and alternate airports | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#from-to-and-alternate-airports) |
| CI | Cost index | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#cost-index) |
| CRZ FL | Cruise flight level | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#cruise-level-temp) |
| CRZ TEMP | Cruise temperature, filled automatically (not fully implemented) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#cruise-level-temp) |

### Flight Plan

| Page / field | What it is | Docs |
| --- | --- | --- |
| F-PLN | Flight plan page | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#verify-the-flight-plan) |
| DEPARTURE | F-PLN/DEPARTURE page: RUNWAY, SID and TRANS | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#inputting-a-sid) |
| TMPY F-PLN | Sends a selection to the temporary flight plan, shown yellow until inserted | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#inputting-a-sid) |
| AIRWAYS | Airway entry from a waypoint's menu: VIA and TO | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#en-route-flight-plan) |
| INSERT NEXT WPT | Direct leg to a next waypoint, from a waypoint's menu | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#en-route-flight-plan) |
| ARRIVAL | F-PLN/ARRIVAL page: RUNWAY, APPR, VIA, STAR and TRANS | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#planning-the-arrival) |
| INSERT TMPY | Inserts the temporary flight plan into the active one | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#verify-the-flight-plan) |
| DIR TO | Direct to a waypoint: FROM P.POS DIR TO, then INSERT DIR TO | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/05_takeoff-climb-cruise/#5-cruise) |

### Navaids

| Page / field | What it is | Docs |
| --- | --- | --- |
| NAVAIDS | Navaid tuning page, reached from INIT; VOR and ILS auto-tune | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#navaids) |
| VOR1 IDENT | VOR 1 identifier | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#vor-tuning) |
| LS IDENT | ILS identifier; frequency and course fill in | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#departure-ils) |

### Fuel and Load

| Page / field | What it is | Docs |
| --- | --- | --- |
| FUEL&LOAD | Fuel and load page, reached from INIT; values in tonnes | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#fuel-payload) |
| ZFW / ZFWCG | Zero fuel weight and its CG | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#fuel-payload) |
| BLOCK | Block fuel | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#fuel-payload) |
| TAXI FUEL | Taxi fuel, the TAXI field | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#fuel-payload) |
| PAX NBR | Number of passengers | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#fuel-payload) |
| RTE RSV | Route reserve fuel, greyed out for now | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#fuel-payload) |
| ALTN | Alternate fuel | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#fuel-payload) |
| FINAL | Final reserve fuel (FINRES) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#fuel-payload) |
| MIN FUEL AT DEST | Minimum fuel at destination | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#fuel-payload) |
| TOW | Takeoff weight, read off for the performance calculator | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#performance-calculator) |

### Performance

| Page / field | What it is | Docs |
| --- | --- | --- |
| PERF | Performance page, one tab per flight phase | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#performance) |
| T.O PERF | Takeoff performance tab, reached from INIT | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#take-off-performance) |
| V1 / VR / V2 | Takeoff speeds | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#take-off-performance) |
| FLEX | Takeoff thrust (TOGA / FLEX) and FLEX temperature; DERATED is not supported | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#take-off-performance) |
| FLAPS | Takeoff flaps | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#take-off-performance) |
| THS FOR | Takeoff trim setting | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#take-off-performance) |
| PACKS | Packs during takeoff | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#take-off-performance) |
| ANTI ICE | Anti-ice during takeoff (OFF / ENG ONLY / …) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#take-off-performance) |
| THR RED / ACCEL / EO ACCEL | Thrust reduction, acceleration and engine-out acceleration altitudes, set automatically | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#take-off-performance) |
| TRANS ALT | Transition altitude, the TRANS field | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/03_preparing-fms/#take-off-performance) |
| PERF CLB | Climb tab | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/05_takeoff-climb-cruise/#at-10000-feet) |
| PERF CRZ | Cruise tab | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/05_takeoff-climb-cruise/#5-cruise) |
| PERF DES | Descent tab | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/06_descent/#flight-management-system-fms-checks) |
| PERF APPR | Approach tab: QNH, TEMP, MAG WIND, TRANS LVL, minima | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/06_descent/#entering-dest-data-on-the-mfd) |
| BARO / RADIO | Approach minima: BARO for DA or MDA, RADIO for DH | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/06_descent/#entering-dest-data-on-the-mfd) |
| TRANS LVL | Transition level | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/06_descent/#trans-level-by-atc) |
| ACTIVATE APPR | Activates the approach phase, at the bottom of the PERF page | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/07_landing/#after-atc-clearance) |
| PERF GA | Go-around tab | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/06_descent/#flight-management-system-fms-checks) |

### Surveillance

| Page / field | What it is | Docs |
| --- | --- | --- |
| SURV | Surveillance page: transponder, TCAS, TAWS and weather radar | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/02_cockpit-preparation/#mfd-surveillance-default-settings) |
| SQWK | Squawk code field | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/02_cockpit-preparation/#mfd-surveillance-default-settings) |
| XPDR | Transponder mode (AUTO) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/02_cockpit-preparation/#mfd-surveillance-default-settings) |
| TCAS | TCAS mode (TA/RA) and display (NORM) | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/02_cockpit-preparation/#mfd-surveillance-default-settings) |
| TAWS | Terrain warning modes, all ON | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-beginner-guide/02_cockpit-preparation/#mfd-surveillance-default-settings) |

---

## ECAM

### EWD

| Indication | What it is | Docs |
| --- | --- | --- |
| EWD | Engine and warning display: engines, memos and the checklists | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/main-panel/ewd/) |
| MEMO | The memo area of the EWD | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/main-panel/ewd/) |
| T.O MEMO | Takeoff memo, complete when no blue line is left | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/main-panel/ewd/) |
| LDG MEMO | Landing memo, complete when no blue line is left | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/main-panel/ewd/) |

### System Pages

| Indication | What it is | Docs |
| --- | --- | --- |
| SD | System display, below the EWD | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/main-panel/sd/) |
| FOB | Fuel on board, in the SD's permanent data | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/main-panel/sd/) |
| SD APU page | APU page | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/main-panel/sd/) |
| SD BLEED page | Bleed air page | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/main-panel/sd/) |
| SD DOOR page | Doors, windows, slides and oxygen page | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/main-panel/sd/) |
| SD ENG page | Engine page | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/main-panel/sd/) |
| SD F/CTL page | Flight controls page | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/main-panel/sd/) |
| SD FUEL page | Fuel page | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/main-panel/sd/) |
| SD STS page | Status page | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/main-panel/sd/) |
| SD WHEEL page | Wheels, brakes and gear page | [docs](https://docs.flybywiresim.com/pilots-corner/a380x/a380x-briefing/flight-deck/main-panel/sd/) |

---

## flyPad EFB

### Dispatch

| Control | What it is | Docs |
| --- | --- | --- |
| OFP | The SimBrief operational flight plan, shown on the dispatch page | [docs](https://docs.flybywiresim.com/aircraft/common/flypados3/dispatch/#ofp-page) |

### Ground

| Control | What it is | Docs |
| --- | --- | --- |
| FUEL | Fuel loading page | [docs](https://docs.flybywiresim.com/aircraft/common/flypados3/ground/#fuel-page) |
| PAYLOAD | Passenger and cargo loading page; shows ZFW, ZFWCG and GW CG | [docs](https://docs.flybywiresim.com/aircraft/common/flypados3/ground/#payload-page) |
| GROUND SERVICES | Doors, jet bridge, GPU, ground air and ground equipment | [docs](https://docs.flybywiresim.com/aircraft/common/flypados3/ground/#ground-service) |
| PUSHBACK | flyPad pushback controls | [docs](https://docs.flybywiresim.com/aircraft/common/flypados3/ground/#pushback) |

### Dashboard and Charts

| Control | What it is | Docs |
| --- | --- | --- |
| WEATHER | Dashboard weather widget: METAR for departure and arrival | [docs](https://docs.flybywiresim.com/aircraft/common/flypados3/dashboard/#weather-widget) |
| CHARTS | Navigraph and local chart viewer | [docs](https://docs.flybywiresim.com/aircraft/common/flypados3/charts/) |
| PERFORMANCE | Top of descent calculator | [docs](https://docs.flybywiresim.com/aircraft/common/flypados3/performance/#top-of-descent-calculator) |
