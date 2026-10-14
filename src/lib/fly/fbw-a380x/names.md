# Names

Every flight-deck label the procedures use, mapped to its full name. This is the
companion's only name source: it fills the small grey line under each checklist
control, and the tooltip on a bolded setting.

Deliberately standalone. Nothing resolves from here into the shared Airbus Terms
and Abbreviations page at build time — that page is a verbatim copy of
FlyByWire's airline-wide glossary, refreshed by re-downloading, so a change
upstream must never be able to silently drop or rewrite a name here. Duplication
between the two files is the point, and duplication inside this file is fine
too: one row per label as the procedures actually write it, so `ENG MASTER 1`,
`ENG MASTER 2` and `ENG MASTER 1 & 2 & 3 & 4` all get their own row.

Full names follow the glossary's pattern — the letters that make up the label
stay capitalised, so you can see where the label came from: `AUX` becomes
`AUXiliary`, `A/THR` becomes `AutoTHRust`, `CKPT` becomes `CocKPiT`. Expand the
abbreviated words and leave the plain ones alone, in lower case:
`ENG 1 & 2 & 3 & 4 FIRE` becomes `ENGine 1 & 2 & 3 & 4 fire pushbuttons`.

`–` means the label already reads plainly and gains nothing from a name —
`SEAT BELTS`, `SPEED BRAKE`, `FLAPS`. Where the cockpit reading differs from the
airline-wide one, this file holds the cockpit reading: `RET` is `RETracted` on a
speed brake lever, not the glossary's `RETurn`.

Keys match case-insensitively and every key holds one name, so a word that is
both a label and a setting gets the reading that fits both: `NAV` is the light
switch, the IR mode and the FMA mode. `pnpm fly` prints any `controls.md` label
with no row here, and any two rows that disagree.

## Controls

### Overhead Scan

| Name | Full name |
| --- | --- |
| ALL WHITE LIGHTS | – |
| MAINTENANCE PANEL | – |

### Electrical

| Name | Full name |
| --- | --- |
| ALL BAT | all BATteries |
| BAT 1 | BATtery 1 |
| ESS BAT | ESSential BATtery |
| BAT 2 | BATtery 2 |
| APU BAT | Auxiliary Power Unit BATtery |
| EXT 1 & 2 & 3 & 4 | EXTernal power 1 & 2 & 3 & 4 |
| EXT 1 | EXTernal power 1 |
| EXT 2 | EXTernal power 2 |
| EXT 3 | EXTernal power 3 |
| EXT 4 | EXTernal power 4 |

### Recorders, Evacuation and ELT

| Name | Full name |
| --- | --- |
| RCDR GND CTL | ReCorDeR GrouND ConTroL |
| CAPT & PURS | CAPTain & PURSer evacuation command |
| ELT | Emergency Locator Transmitter |
| CVR TEST | Cockpit Voice Recorder test |

### ADIRS

| Name | Full name |
| --- | --- |
| ADIRS | Air Data/Inertial Reference System |
| IR MODE 1 & 2 & 3 | Inertial Reference mode selectors 1 & 2 & 3 |
| PROBE & WINDOW HEAT | – |

### Fire Protection

| Name | Full name |
| --- | --- |
| APU FIRE | Auxiliary Power Unit fire pushbutton |
| APU AGENT | Auxiliary Power Unit extinguisher agent |
| ENG 1 & 2 & 3 & 4 FIRE | ENGine 1 & 2 & 3 & 4 fire pushbuttons |
| ENG AGENT 1 & 2 | ENGine extinguisher agent 1 & 2 |
| FIRE TEST | – |

### Auxiliary Power Unit (APU)

| Name | Full name |
| --- | --- |
| APU | Auxiliary Power Unit |
| APU MASTER SW | Auxiliary Power Unit master SWitch |
| APU START | Auxiliary Power Unit start |

### Air Conditioning and Bleed

| Name | Full name |
| --- | --- |
| AIR FLOW | – |
| PACK 1 & 2 | air conditioning pack 1 & 2 |
| CKPT | CocKPiT temperature |
| CABIN | cabin temperature |
| APU BLEED | Auxiliary Power Unit bleed |
| XBLEED | crossBLEED |

### Cargo Air Conditioning

| Name | Full name |
| --- | --- |
| CARGO AIR COND | cargo air CONDitioning |

### Engine Start

| Name | Full name |
| --- | --- |
| ENG START | ENGine start selector |

### Fuel

| Name | Full name |
| --- | --- |
| FEED TK 1 & 2 & 3 & 4 MAIN | FEED TanK 1 & 2 & 3 & 4 main pumps |
| FEED TK 1 & 2 & 3 & 4 STBY | FEED TanK 1 & 2 & 3 & 4 STandBY pumps |
| TRIM TK FEED | TRIM TanK feed |

### Anti-Ice

| Name | Full name |
| --- | --- |
| ENG ANTI ICE | ENGine anti-ice |
| WING ANTI ICE | – |

### Oxygen

| Name | Full name |
| --- | --- |
| CREW SUPPLY | crew oxygen supply |

### Signs

| Name | Full name |
| --- | --- |
| SEAT BELTS | – |
| NO MOBILE | no mobile phones |
| EMER EXIT LT | EMERgency EXIT LighTing |

### Exterior Lighting

| Name | Full name |
| --- | --- |
| STROBE | – |
| BEACON | – |
| WING | wing and engine scan lights |
| NAV | NAVigation |
| LOGO | – |
| RWY TURN OFF | RunWaY turn off |
| RWY TURN OFF & CAMERA | RunWaY turn off & camera lights |
| LAND | LANDing lights |
| NOSE | nose taxi and takeoff lights |

### Interior Lighting

| Name | Full name |
| --- | --- |
| STBY COMPASS | STandBY compass light |
| STORM | storm lighting |
| ANN LT | ANNunciator LighT |

### Wipers

| Name | Full name |
| --- | --- |
| WIPER | windshield wiper |

### AFS Control Panel

| Name | Full name |
| --- | --- |
| AFS CP | Automatic Flight System Control Panel |
| SPD/MACH | SPeeD/Mach |
| SPD | SPeeD |
| HDG/TRK | HeaDinG/TRacK |
| HDG | HeaDinG |
| ALT | ALTitude |
| V/S / FPA | Vertical Speed / Flight Path Angle |
| V/S | Vertical Speed |
| LOC | LOCalizer |
| APPR | APPRoach |
| AP1 / AP2 | AutoPilot 1 / AutoPilot 2 |
| A/THR | AutoTHRust |
| FD | Flight Director |
| TRUE/MAG | TRUE/MAGnetic north reference |

### EFIS Control Panel

| Name | Full name |
| --- | --- |
| EFIS | Electronic Flight Instrument System |
| EFIS CP | Electronic Flight Instrument System Control Panel |
| BARO REF | BAROmetric REFerence |
| BARO selector | BAROmetric reference selector |
| LS | Landing System |
| CSTR | ConSTRaint |
| TERR | TERRain |
| TRAF | TRAFfic |
| WX | Weather |
| ND mode | Navigation Display mode |
| ND range | Navigation Display range |
| TAXI (ETACS) | taxi camera — External and Taxiing Aid Camera System |

### Glareshield Side Panels

| Name | Full name |
| --- | --- |
| CHRONO | CHRONOmeter |
| MASTER WARN | master WARNing |
| MASTER CAUT | master CAUTion |

### Glareshield Lighting

| Name | Full name |
| --- | --- |
| GLARESHIELD LT | glareshield LighTing |

### Displays

| Name | Full name |
| --- | --- |
| PFD | Primary Flight Display |
| FMA | Flight Mode Annunciator |
| ND | Navigation Display |
| MFD | MultiFunction Display |
| OANS | Onboard Airport Navigation System |
| BTV | Brake To Vacate |

### Switching

| Name | Full name |
| --- | --- |
| SWITCHING | – |

### ISIS

| Name | Full name |
| --- | --- |
| ISIS | Integrated Standby Instrument System |
| ISIS BARO | Integrated Standby Instrument System BAROmetric setting |

### Landing Gear and Brakes

| Name | Full name |
| --- | --- |
| LANDING GEAR | – |
| L/G | Landing Gear |
| AUTO BRK | AUTOmatic BRaKe |
| RTO | Rejected Take-Off |
| A-SKID | Anti-SKID |
| BODY ACCU | BODY gear brake ACCUmulator |
| L/G GRVTY | Landing Gear GRaViTY extension |

### Clock

| Name | Full name |
| --- | --- |
| CLOCK | – |

### Table and Keyboard

| Name | Full name |
| --- | --- |
| SLIDING TABLE | – |

### Parking Brake

| Name | Full name |
| --- | --- |
| PARK BRK | PARKing BRaKe |
| ACCUS REINFLATE | ACCUmulatorS reinflate |

### Flaps and Speed Brake

| Name | Full name |
| --- | --- |
| FLAPS | – |
| SPEED BRAKE | – |

### Engine

| Name | Full name |
| --- | --- |
| ENG MASTER 1 & 2 & 3 & 4 | ENGine master levers 1 & 2 & 3 & 4 |
| ENG MASTER 1 & 2 | ENGine master levers 1 & 2 |
| ENG MASTER 1 | ENGine master lever 1 |
| ENG MASTER 2 | ENGine master lever 2 |
| ENG MASTER 3 | ENGine master lever 3 |
| ENG MASTER 4 | ENGine master lever 4 |

### Thrust

| Name | Full name |
| --- | --- |
| THRUST | – |
| REVERSER | – |
| A/THR instinctive disconnect | AutoTHRust instinctive disconnect pushbutton |

### Trim

| Name | Full name |
| --- | --- |
| PITCH TRIM | – |
| RUDDER TRIM | – |
| RUDDER TRIM RESET | – |

### ECAM Control Panel

| Name | Full name |
| --- | --- |
| ECAM | Electronic Centralized Aircraft Monitoring |
| ECP | ECAM Control Panel |
| T.O CONFIG | Take-Off CONFIGuration |
| C/L | CheckList |
| ✓ | check-mark key |
| UP | – |
| DOWN | – |
| STS | StaTuS |
| SD page keys (ENG, APU, BLEED, DOOR, FUEL, WHEEL, F/CTL) | System Display page keys |

### Surveillance Panel

| Name | Full name |
| --- | --- |
| TA ONLY | Traffic Advisory only — no resolution advisories |
| WXR | Weather Radar |

### Radio Management

| Name | Full name |
| --- | --- |
| RMP | Radio Management Panel |
| RMP 1 & 2 | Radio Management Panel 1 & 2 |
| RMP 3 | Radio Management Panel 3 |
| RMP frequency | Radio Management Panel frequency |
| VHF | Very High Frequency |
| VHF 1 & 2 & 3 | Very High Frequency radios 1 & 2 & 3 |
| VHF transmission keys | Very High Frequency transmission keys |
| INT | INTerphone |
| STBY RAD NAV | STandBY RADio NAVigation |
| SQWK | SQuaWK |

### Cockpit Lighting

| Name | Full name |
| --- | --- |
| INTEG LT | INTEGral LighTing |
| MAIN PNL FLOOD LT | main PaNeL FLOOD LighT |
| PEDESTAL FLOOD LT | pedestal FLOOD LighT |
| AMBIENT LT | ambient LighT |

### Cockpit Door

| Name | Full name |
| --- | --- |
| CKPT DOOR | CocKPiT door |

### Lateral Console

| Name | Full name |
| --- | --- |
| SLIDING WINDOW | – |
| SIDESTICK | – |
| TILLER | nose wheel steering handwheel |
| OIT | Onboard Information Terminal |

### Data and Status

| Name | Full name |
| --- | --- |
| DATA/STATUS | – |

### INIT

| Name | Full name |
| --- | --- |
| INIT | INITialisation |
| CPNY F-PLN REQUEST | ComPaNY Flight PLaN request — the SimBrief import |
| FLT NBR | FLighT NumBeR |
| FROM / TO / ALTN | departure / destination / ALTerNate airports |
| FROM | departure airport |
| TO | destination airport |
| CI | Cost Index — the time against fuel trade-off |
| CRZ FL | CRuiZe Flight Level |
| CRZ TEMP | CRuiZe TEMPerature |

### Flight Plan

| Name | Full name |
| --- | --- |
| F-PLN | Flight PLaN |
| DEPARTURE | runway, Standard Instrument Departure and transition selection |
| TMPY F-PLN | TeMPorarY Flight PLaN |
| AIRWAYS | airway and waypoint entry |
| INSERT NEXT WPT | insert next WayPoinT |
| ARRIVAL | runway, approach, via, Standard Terminal Arrival Route and transition selection |
| INSERT TMPY | insert TeMPorarY flight plan |
| DIR TO | DIRect TO |

### Navaids

| Name | Full name |
| --- | --- |
| NAVAIDS | NAVigation AIDS |
| VOR1 IDENT | Very high-frequency OmniRange 1 IDENTifier |
| LS IDENT | Landing System IDENTifier |

### Fuel and Load

| Name | Full name |
| --- | --- |
| FUEL&LOAD | fuel and load |
| ZFW / ZFWCG | Zero Fuel Weight / Zero Fuel Weight Center of Gravity |
| BLOCK | block fuel |
| TAXI FUEL | – |
| PAX NBR | PAssenger NumBeR |
| RTE RSV | RouTE ReSerVe fuel |
| ALTN | ALTerNate |
| FINAL | final reserve fuel |
| MIN FUEL AT DEST | MINimum fuel at DESTination |
| TOW | Take-Off Weight |

### Performance

| Name | Full name |
| --- | --- |
| PERF | PERFormance |
| T.O PERF | Take-Off PERFormance |
| V1 / VR / V2 | decision, rotation and takeoff safety speeds |
| FLEX | FLEXible takeoff thrust |
| THS FOR | Trimmable Horizontal Stabilizer FORward — the takeoff trim |
| PACKS | air conditioning packs |
| ANTI ICE | – |
| THR RED / ACCEL / EO ACCEL | THRust REDuction / ACCELeration / Engine-Out ACCELeration altitudes |
| TRANS ALT | TRANSition ALTitude |
| PERF CLB | PERFormance CLimB |
| PERF CRZ | PERFormance CRuiZe |
| PERF DES | PERFormance DEScent |
| PERF APPR | PERFormance APPRoach |
| BARO / RADIO | BAROmetric / RADIO altitude minima |
| TRANS LVL | TRANSition LeVeL |
| ACTIVATE APPR | activate APPRoach phase |
| PERF GA | PERFormance Go-Around |

### Surveillance

| Name | Full name |
| --- | --- |
| SURV | SURVeillance |
| XPDR | transPonDeR |
| TCAS | Traffic alert and Collision Avoidance System |
| TAWS | Terrain Awareness and Warning System |

### EWD

| Name | Full name |
| --- | --- |
| EWD | Engine/Warning Display |
| MEMO | the memo area of the Engine/Warning Display |
| T.O MEMO | Take-Off MEMO |
| LDG MEMO | LanDinG MEMO |

### System Pages

| Name | Full name |
| --- | --- |
| SD | System Display |
| FOB | Fuel On Board |
| SD APU page | System Display Auxiliary Power Unit page |
| SD BLEED page | System Display bleed page |
| SD DOOR page | System Display door page |
| SD ENG page | System Display ENGine page |
| SD F/CTL page | System Display Flight ConTroLs page |
| SD FUEL page | System Display fuel page |
| SD STS page | System Display StaTuS page |
| SD WHEEL page | System Display wheel page |

### flyPad EFB

| Name | Full name |
| --- | --- |
| EFB | Electronic Flight Bag |
| OFP | Operational Flight Plan |
| FUEL | fuel loading page |
| PAYLOAD | passenger and cargo loading page |
| GROUND SERVICES | doors, jet bridge, Ground Power Unit and ground equipment |
| PUSHBACK | flyPad pushback controls |
| WEATHER | dashboard weather widget |
| CHARTS | Navigraph and local chart viewer |
| PERFORMANCE | top of descent calculator |

## Other Labels

Labels the procedures write that are not `controls.md` rows.

| Name | Full name |
| --- | --- |
| ATC clearance | Air Traffic Control clearance |
| IFR clearance | Instrument Flight Rules clearance |
| SimBrief OFP | SimBrief Operational Flight Plan |
| STAR chart | Standard Terminal Arrival Route chart |
| CABIN READY | the cabin crew's confirmation that the cabin is secure |
| PEDAL DISC | rudder PEDAL DISConnect — the tiller's centre button |
| N/W STEERING DISC | Nose Wheel STEERING DISConnected — the towing memo |
| FROM P.POS DIR TO | FROM Present POSition DIRect TO |
| INSERT DIR TO | insert DIRect TO |
| ACTIVE | the MFD's active flight plan menu |
| ATC | Air Traffic Control |
| PAPI | Precision Approach Path Indicator |
| Optimal and max altitude | optimal and MAXimum altitude |
| Other EFIS options | other Electronic Flight Instrument System options |
| Planning tool | – |
| SimBrief | – |
| Remaining exterior lights | – |
| Takeoff briefing | – |
| SimBrief takeoff calculator | – |
| Ground crew | – |
| Engines 1 and 2 | – |
| Engines 3 and 4 | – |
| Rudder pedals | – |
| Ground equipment | – |
| Brakes | – |
| Initial climb speed and speed limit | – |
| Flight instruments | – |
| Left and right | – |
| Cabin crew | – |
| Approach path | – |
| Takeoff runway | – |
| Final approach | – |
| Runway centre line | – |
| Takeoff callout | – |
| Takeoff thrust | – |
| Positive climb | – |
| Flight progress | – |
| Landing elevation | – |
| Landing briefing | – |
| Descent | – |
| Rate of descent | – |
| Intercept angle | – |
| Intercept altitude | – |
| Managed speed | – |
| Touchdown zone | – |
| Callout | – |
| Decision | – |
| Next exit | – |
| Runway entry marker | – |
| Other exterior lights | – |

## Positions and Settings

| Name | Full name |
| --- | --- |
| ARC | ARC — the forward-sector ND mode |
| ARM | ARMed |
| ARMED | – |
| ATT | ATTitude — heading entered by hand, no navigation |
| AUTO | AUTOmatic |
| AVAIL | AVAILable |
| BRT | BRighT |
| CAPT | CAPTain |
| CL | CLimb detent |
| CRANK | cranking — motoring the engine without ignition |
| DERATED | DERATED takeoff thrust, not supported yet |
| DIM | DIMmed |
| DISARM | DISARMed |
| DISCH | DISCHarged |
| ENG ONLY | ENGine anti-ice ONLY |
| FLX | FLeXible takeoff thrust |
| FLX/MCT | FLeXible takeoff thrust / Maximum Continuous Thrust |
| FULL | – |
| HI | HIgh |
| ICE IND | ICE INDicator light |
| IDLE | – |
| IDLE REV | IDLE REVerse thrust |
| IGN START | IGNition START |
| ISOL | ISOLated |
| LO | LOw |
| MAG | MAGnetic north reference |
| MAN | MANual |
| MAX REV | MAXimum REVerse thrust |
| MCT | Maximum Continuous Thrust |
| NORM | NORMal |
| PLAN | PLAN — the north-up, flight-plan ND mode |
| PURS SEL | PURSer SELection — cabin temperature set from the cabin crew panel |
| QNH | sea level atmospheric pressure |
| RET | RETracted |
| ROSE-LS | ROSE Landing System — the ND mode showing localizer deviation |
| ROSE-NAV | ROSE NAVigation — the 360° ND mode |
| RTO ARM | Rejected Take-Off autobrake ARMed |
| SLOW | – |
| FAST | – |
| SQUIB | – |
| STBY | STandBY |
| STD | STanDard pressure setting — 1013 hPa / 29.92 inHg |
| STOWED | – |
| T.O | Take-Off |
| T.O. | Take-Off |
| TA/RA | Traffic Advisory and Resolution Advisory |
| TAXI | taxi lights only |
| TOGA | Take-Off/Go Around thrust |
| TRUE | TRUE north reference |
| ZOOM | ZOOM — the airport map range |
| INOP | INOPerative |

## Flight Deck Systems

| Name | Full name |
| --- | --- |
| AIRAC | Aeronautical Information Regulation And Control cycle — the nav data version |
| ALT CRZ | ALTitude CRuiZe — the cruise vertical mode |
| AP1 | AutoPilot 1 |
| AP2 | AutoPilot 2 |
| BLG | Body Landing Gear |
| CDLS | Cockpit Door Locking System |
| CG | Center of Gravity |
| CLB | CLimB |
| DECEL | DECELeration point — where the approach phase activates |
| DES | managed DEScent |
| ECL | Electronic CheckList |
| EGT | Exhaust Gas Temperature |
| ETACS | External and Taxiing Aid Camera System |
| F/CTL | Flight ConTroLs |
| FCU | Flight Control Unit |
| FCU BKUP | Flight Control Unit BacKUP — the MFD page that stands in for the AFS CP |
| FF | Fuel Flow |
| FINRES | FINal REServe fuel |
| FMC | Flight Management Computer |
| FMS | Flight Management System |
| G/S | Glide Slope |
| GW CG | Gross Weight Center of Gravity |
| ILS | Instrument Landing System — LOCalizer and Glide Slope |
| KCCU | Keyboard and Cursor Control Unit |
| LVR CLB | LeVeRs to CLimB detent |
| MLG | Main Landing Gear |
| N1 | engine fan speed, as a percentage |
| N2 | engine intermediate-pressure spool speed, as a percentage |
| N3 | engine high-pressure spool speed, as a percentage |
| NLG | Nose Landing Gear |
| OIS | Onboard Information System |
| OP CLB | OPen CLimB |
| OP DES | OPen DEScent |
| PF | Pilot Flying |
| PM | Pilot Monitoring |
| SFD | Standby Flight Display |
| SND | Standby Navigation Display |
| SRS | Speed Reference System — the takeoff and go-around pitch mode |
| THR | THRust, as a percentage |
| THS | Trimmable Horizontal Stabilizer |
| TOD | Top Of Descent |
| VD | Vertical Display |
| VV | Velocity Vector |
| WLG | Wing Landing Gear |

## Speeds

| Name | Full name |
| --- | --- |
| F speed | flap retraction speed |
| green dot speed | best lift-to-drag speed, clean configuration |
| S speed | slat retraction speed |
| V1 | decision speed — go or stop |
| V2 | takeoff safety speed |
| VAPP | approach speed |
| VFE | maximum flap extended speed |
| VR | rotation speed |

---

[Controls Reference](controls.md)
