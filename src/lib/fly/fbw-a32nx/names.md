# Names

Every flight-deck label the procedures use, mapped to its full name. This is the
companion's only name source: it fills the small grey line under each checklist
control, and the tooltip on a bolded setting.

Deliberately standalone. Nothing resolves from here into
[abbreviations.md](abbreviations.md) at build time — that page is a verbatim
copy of FlyByWire's airline-wide glossary, refreshed by re-downloading, so a
change upstream must never be able to silently drop or rewrite a name here.
Duplication between the two files is the point, and duplication inside this file
is fine too: one row per label as the procedures actually write it, so
`ENG MASTER 1`, `ENG MASTER 2` and `ENG MASTER 1 & 2` all get their own row.

Full names follow the abbreviations.md pattern — the letters that make up the
label stay capitalised, so you can see where the label came from: `AUX` becomes
`AUXiliary`, `A/THR` becomes `AutoTHRust`, `EXT PWR` becomes `EXTernal PoWeR`.
Expand the abbreviated words and leave the plain ones alone, in lower case:
`ENG 1 & 2 FIRE TEST` becomes `ENGine 1 & 2 fire test`.

`–` means the label already reads plainly and gains nothing from a name —
`SEAT BELTS`, `SPEED BRAKE`, `FLAPS`. Where the cockpit reading differs from the
airline-wide one, this file holds the cockpit reading: `RET` is `RETracted` on a
speed brake lever, not abbreviations.md's `RETurn`.

Keys match case-insensitively. `pnpm fly` prints any `controls.md` label with no
row here, and any two rows that disagree.

## Controls

### Electrical

| Name | Full name |
| --- | --- |
| BAT 1 & 2 | BATtery 1 & 2 |
| EXT PWR | EXTernal PoWeR |
| GEN 1 & 2 | GENerator 1 & 2 |
| APU GEN | Auxiliary Power Unit GENerator |
| BUS TIE | BUSbar tie |
| AC ESS FEED | Alternating Current ESSential feed |
| GALY & CAB | GALleY & CABin |
| COMMERCIAL | commercial load |

### Auxiliary Power Unit (APU)

| Name | Full name |
| --- | --- |
| APU | Auxiliary Power Unit |
| APU MASTER SW | Auxiliary Power Unit master SWitch |
| APU START | Auxiliary Power Unit start |
| APU BLEED | Auxiliary Power Unit bleed |

### Fire Protection

| Name | Full name |
| --- | --- |
| APU FIRE TEST | Auxiliary Power Unit fire test |
| ENG 1 & 2 FIRE TEST | ENGine 1 & 2 fire test |

### Hydraulics

| Name | Full name |
| --- | --- |
| ENG 1 & 2 PUMP | ENGine 1 & 2 pump |
| BLUE ELEC PUMP | blue ELECtric pump |
| YELLOW ELEC PUMP | yellow ELECtric pump |
| PTU | Power Transfer Unit |

### Oxygen

| Name | Full name |
| --- | --- |
| CREW SUPPLY | crew oxygen supply |

### ADIRS

| Name | Full name |
| --- | --- |
| ADIR 1 & 2 & 3 | Air Data/Inertial Reference 1 & 2 & 3 |
| IR 1 & 2 & 3 | Inertial Reference 1 & 2 & 3 |

### Air Conditioning and Pressurisation

| Name | Full name |
| --- | --- |
| PACK 1 & 2 | air conditioning pack 1 & 2 |
| ENG 1 & 2 BLEED | ENGine 1 & 2 bleed |
| PACK FLOW | – |
| HOT AIR | trim air valve |
| COCKPIT / FWD CABIN / AFT CABIN | cockpit / ForWarD cabin / aft cabin |
| LDG ELEV | LanDinG ELEVation |
| CABIN PRESS MODE SEL | cabin PRESSure mode SELector |

### Fuel

| Name | Full name |
| --- | --- |
| FUEL MODE SEL | centre tank transfer mode SELector |
| L TK PUMPS 1 & 2 | Left TanK pumps 1 & 2 |
| CTR TK PUMP 1 & 2 | CenTeR TanK pump 1 & 2 |
| R TK PUMPS 1 & 2 | Right TanK pumps 1 & 2 |

### Anti-Ice

| Name | Full name |
| --- | --- |
| ENG ANTI ICE | ENGine anti-ice |
| WING ANTI ICE | – |

### Signs

| Name | Full name |
| --- | --- |
| SEAT BELTS | – |
| NO SMOKING | – |
| EMER EXIT LT | EMERgency exit LighTing |

### Exterior Lighting

| Name | Full name |
| --- | --- |
| STROBE | – |
| BEACON | – |
| WING | wing inspection light |
| NAV & LOGO | NAVigation & logo |
| RWY TURN OFF | RunWaY turn off |
| LAND L & R | LANDing Left & Right |
| NOSE | nose taxi and takeoff light |

### Interior Lighting

| Name | Full name |
| --- | --- |
| OVHD INTEG LT | OVerHeaD INTEGral LighTing |
| DOME | cockpit dome light |
| ANN LT | ANNunciator LighT |

### Calls

| Name | Full name |
| --- | --- |
| CALLS ALL | call all cabin crew |

### Wipers

| Name | Full name |
| --- | --- |
| WIPER | windshield wiper |

### GPWS

| Name | Full name |
| --- | --- |
| GPWS | Ground Proximity Warning System |
| TERR | TERRain awareness |
| LDG FLAP 3 | LanDinG flap 3 |

### Flight Control Unit (FCU)

| Name | Full name |
| --- | --- |
| FCU | Flight Control Unit |
| ALT | ALTitude |
| SPD / MACH | SPeeD / Mach |
| HDG / TRK | HeaDinG / TRacK |
| V/S | Vertical Speed |
| APPR | APPRoach |
| LOC | LOCalizer |
| EXPED | EXPEDite |
| AP 1 / AP 2 | AutoPilot 1 / AutoPilot 2 |
| A/THR | AutoTHRust |

### EFIS Control Panel

| Name | Full name |
| --- | --- |
| EFIS | Electronic Flight Information System |
| BARO REF | BAROmetric REFerence |
| BARO selector | BAROmetric reference selector |
| FD | Flight Director |
| LS | Landing System |
| CSTR | ConSTRaint |
| ND mode | Navigation Display mode |
| ND range | Navigation Display range |

### Warning Panel

| Name | Full name |
| --- | --- |
| CHRONO | CHRONOmeter |
| MASTER CAUTION | – |

### Displays

| Name | Full name |
| --- | --- |
| PFD brightness | Primary Flight Display brightness |
| ND brightness | Navigation Display brightness |
| INTEG LT | INTEGral LighTing |
| FMA | Flight Mode Annunciator |

### ISIS

| Name | Full name |
| --- | --- |
| ISIS | Integrated Standby Instrument System |
| ISIS BARO | Integrated Standby Instrument System BAROmetric setting |

### Autobrake and Gear

| Name | Full name |
| --- | --- |
| AUTO/BRK | AUTOmatic BRaKe |
| LANDING GEAR | – |
| BRK FAN | BRaKe fan |

### Parking Brake

| Name | Full name |
| --- | --- |
| PARK BRK | PARKing BRaKe |

### Flaps and Speed Brake

| Name | Full name |
| --- | --- |
| FLAPS | – |
| SPEED BRAKE | – |

### Engine

| Name | Full name |
| --- | --- |
| ENG MASTER 1 & 2 | ENGine master switches 1 & 2 |
| ENG MASTER 1 | ENGine master switch 1 |
| ENG MASTER 2 | ENGine master switch 2 |
| ENG MODE | ENGine mode |

### Thrust and Trim

| Name | Full name |
| --- | --- |
| THRUST | – |
| PITCH TRIM | – |
| RUD TRIM | RUDder trim |

### ECAM Control Panel

| Name | Full name |
| --- | --- |
| ECAM | Electronic Centralized Aircraft Monitoring |
| ECAM UPPER / LOWER brightness | Electronic Centralized Aircraft Monitoring upper / lower display brightness |
| F/CTL and other system pages | Flight ConTroLs and other system pages |
| T.O CONFIG | Take-Off CONFIGuration |
| CLR | CLeaR |

### Radar

| Name | Full name |
| --- | --- |
| WX RADAR MODE | Weather radar mode |
| SYS | weather radar SYStem |
| PWS | Predictive WindShear |

### ATC and TCAS

| Name | Full name |
| --- | --- |
| ATC | Air Traffic Control |
| ATC mode | Air Traffic Control transponder mode |
| ATC code | Air Traffic Control transponder code |
| ALT RPTG | ALTitude RePorTinG |
| TCAS mode | Traffic alert and Collision Avoidance System mode |

### Radio Management

| Name | Full name |
| --- | --- |
| RMP 1 | Radio Management Panel 1 |
| RMP frequency | Radio Management Panel frequency |
| RMP transfer | Radio Management Panel transfer |

### Gravity Gear Extension

| Name | Full name |
| --- | --- |
| GRVTY GEAR EXTN | GRaViTY gear EXTeNsion |

### INIT

| Name | Full name |
| --- | --- |
| INIT REQUEST | INITialisation request — the SimBrief flight plan import |
| FROM/TO | departure and destination pair |
| FLT NBR | FLighT NumBeR |
| COST INDEX | cost index — the time against fuel trade-off |
| CRZ FL | CRuiZe Flight Level |
| ALIGN IRS | ALIGN the Inertial Reference System |
| BLOCK | block fuel |
| ZFW / ZFWCG | Zero Fuel Weight / Zero Fuel Weight Center of Gravity |

### Flight Plan

| Name | Full name |
| --- | --- |
| F-PLN | Flight PLan |
| DEPARTURE | runway, Standard Instrument Departure and transition selection |
| ARRIVAL | approach, Standard Terminal Arrival Route and via selection |
| LAT REV | LATeral REVision |
| VERT REV | VERTical REVision |
| AIRWAYS | airway and waypoint entry |
| WIND | climb, cruise and descent wind entry |
| FIX INFO | FIX INFOrmation — distance rings and radials from a fix |
| HOLD | HOLDing pattern |
| DIR TO | DIRect TO |

### Performance

| Name | Full name |
| --- | --- |
| TAKEOFF | takeoff performance entries |
| TAKEOFF (FLAPS, FLEX TO TEMP, V1, VR, V2) | takeoff performance entries |
| T.O SHIFT | Take-Off shift |
| THR RED/ACC | THRust REDuction / ACCeleration altitudes |
| ENG OUT ACC | ENGine-out ACCeleration altitude |
| FLAPS/THS | takeoff flaps / Trimmable Horizontal Stabilizer |
| CLIMB | – |
| CRUISE | – |
| DESCENT | – |
| APPROACH | approach performance and phase activation |
| GO-AROUND | – |

### Radio Navigation

| Name | Full name |
| --- | --- |
| RAD NAV (LS / FREQ) | RADio NAVigation — Landing System FREQuency |
| RAD NAV | RADio NAVigation |

### Fuel Prediction

| Name | Full name |
| --- | --- |
| FUEL PRED | fuel PREDiction |

### Progress

| Name | Full name |
| --- | --- |
| PROG | PROGress |

### Data

| Name | Full name |
| --- | --- |
| A/C STATUS | AirCraft status — carries the nav data cycle |
| POSITION MONITOR | navigation position sources |

### Secondary Flight Plan

| Name | Full name |
| --- | --- |
| SEC F-PLN | SECondary Flight PLan |

### ATSU and AOC

| Name | Full name |
| --- | --- |
| AOC MENU | Airline Operational Control menu |
| ATIS | Automatic Terminal Information Service |

### E/WD

| Name | Full name |
| --- | --- |
| FOB | Fuel On Board |
| MEMO | the memo column on the Engine / Warning Display |

### ECAM System Pages

| Name | Full name |
| --- | --- |
| ECAM DOOR page | Electronic Centralized Aircraft Monitoring door page |
| ECAM ELEC page | Electronic Centralized Aircraft Monitoring ELECtrical page |
| ECAM FUEL page | Electronic Centralized Aircraft Monitoring fuel page |
| ECAM HYD page | Electronic Centralized Aircraft Monitoring HYDraulic page |
| ECAM ENG page | Electronic Centralized Aircraft Monitoring ENGine page |
| ECAM BLEED page | Electronic Centralized Aircraft Monitoring bleed page |
| ECAM PRESS page | Electronic Centralized Aircraft Monitoring PRESSure page |
| ECAM WHEEL page | Electronic Centralized Aircraft Monitoring wheel page |
| ECAM F/CTL page | Electronic Centralized Aircraft Monitoring Flight ConTroLs page |
| ECAM STS page | Electronic Centralized Aircraft Monitoring StaTuS page |
| ECAM CRUISE page | Electronic Centralized Aircraft Monitoring cruise page |

### flyPad EFB

| Name | Full name |
| --- | --- |
| EFB | Electronic Flight Bag |
| OFP | Operational Flight Plan |
| FUEL | fuel loading page |
| PAYLOAD | passenger and cargo loading page |
| GROUND SERVICES | doors, Ground Power Unit, pushback and ground equipment |
| PUSHBACK | flyPad pushback controls |
| PERFORMANCE | takeoff and landing performance calculator |
| CHARTS | Navigraph and local chart viewer |
| CHECKLISTS | the flyPad checklist page |

## Other Labels

Labels the procedures write that are not `controls.md` rows.

| Name | Full name |
| --- | --- |
| ATC clearance | Air Traffic Control clearance |
| IFR clearance | Instrument Flight Rules clearance |
| Revised FMS takeoff data | revised Flight Management System takeoff data |
| SimBrief OFP | SimBrief Operational Flight Plan |
| STAR chart | Standard Terminal Arrival Route chart |

## Positions and Settings

| Name | Full name |
| --- | --- |
| ABV | ABoVe — TCAS traffic shown above own altitude |
| ALL | all traffic shown |
| ARM | ARMed |
| AUTO | AUTOmatic |
| AVAIL | AVAILable |
| BRT | BRighT |
| CL | CLimb detent |
| CRANK | cranking — motoring the engine without ignition |
| DIM | DIMmed |
| FLX | FLeXible takeoff thrust |
| FLX/MCT | FLeXible takeoff thrust / Maximum Continuous Thrust |
| FLX-MCT | FLeXible takeoff thrust / Maximum Continuous Thrust |
| IGN/START | IGNition and start |
| LO | LOw autobrake |
| MAN | MANual |
| MAX | MAXimum autobrake |
| MCT | Maximum Continuous Thrust |
| MED | MEDium autobrake |
| NORM | NORMal |
| RET | RETracted |
| REV | REVerse thrust |
| REV IDLE | REVerse thrust at idle |
| REV MAX | MAXimum REVerse thrust |
| STBY | STandBY |
| STD | STanDard pressure setting — 1013 hPa / 29.92 inHg |
| SYS 1 | weather radar SYStem 1 |
| T.O. | Take-Off |
| TA | Traffic Advisory only — no resolution advisories |
| TA/RA | Traffic Advisory and Resolution Advisory |
| TOGA | Take-Off/Go Around thrust |

## Flight Deck Systems

| Name | Full name |
| --- | --- |
| ADIRS | Air Data/Inertial Reference System |
| ADIRU | Air Data/Inertial Reference Unit |
| AGL | Above Ground Level |
| AIRAC | Aeronautical Information Regulation And Control cycle — the nav data version |
| AOC | Airline Operational Control — the datalink menu |
| AP1 | AutoPilot 1 |
| AP2 | AutoPilot 2 |
| ARC | ARC — the forward-sector ND mode |
| ATSU | Air Traffic Service Unit |
| BARO | BAROmetric — minima read from the altimeter |
| CABIN READY | the cabin crew's confirmation that the cabin is secure |
| CG | Center of Gravity |
| DECEL | DECELeration point — where the approach phase activates |
| DH | Decision Height |
| DA | Decision Altitude |
| E/WD | Engine / Warning Display |
| EGT | Exhaust Gas Temperature |
| F/CTL | Flight ConTroLs |
| FAF | Final Approach Fix |
| FF | Fuel Flow |
| FMS | Flight Management System |
| FWS | Flight Warning System |
| G/S | Glide Slope |
| GPU | Ground Power Unit |
| GW | Gross Weight |
| IAF | Initial Approach Fix |
| IAP | Instrument Approach Procedure |
| ILS | Instrument Landing System — LOCalizer and Glide Slope |
| IRS | Inertial Reference System |
| LSK | Line Select Key |
| MCDU | Multipurpose Control & Display Unit |
| MDA | Minimum Descent Altitude |
| N1 | engine fan speed, as a percentage |
| N2 | engine core speed, as a percentage |
| ND | Navigation Display |
| NO DH | NO Decision Height |
| OAT | Outside Air Temperature |
| PAPI | Precision Approach Path Indicator |
| PFD | Primary Flight Display |
| PLAN | PLAN — the north-up, flight-plan ND mode |
| QFE | Field Elevation atmospheric pressure |
| QNH | sea level atmospheric pressure |
| RA | Radio Altitude |
| RADIO | Radio Altitude — minima read from the radio altimeter |
| ROSE LS | ROSE Landing System — the ND mode showing localizer deviation |
| RWY | RunWaY track mode |
| SID | Standard Instrument Departure |
| SOP | Standard Operating Procedures |
| SPLRS ARM | ground SPoiLeRS ARMed |
| SRS | Speed Reference System — the takeoff and go-around pitch mode |
| STAR | Standard Terminal Arrival Route |
| TCAS | Traffic alert and Collision Avoidance System |
| TOD | Top Of Descent |
| VOR | Very high-frequency OmniRange station |
| WX | Weather |
| XPDR | transPonDeR |

## MCDU Pages and Performance

| Name | Full name |
| --- | --- |
| BRG/DIST | BeaRinG / DISTance |
| CLB | CLimB |
| DCT | DireCT |
| DES | managed DEScent |
| DEST | DESTination |
| ENG OUT | ENGine out |
| F speed | flap retraction speed |
| FLEX TO TEMP | FLEXible Take-Off TEMPerature |
| green dot speed | best lift-to-drag speed, clean configuration |
| INIT | INITialisation |
| INIT DATA REQ | INITialisation DATA REQuest |
| INIT/PRES | INITialisation / PRESent position |
| LS/FREQ | Landing System FREQuency |
| LVR CLB | LeVeRs to CLimB detent |
| OP CLB | OPen CLimB |
| OP DES | OPen DEScent |
| PERF | PERFormance |
| S speed | slat retraction speed |
| THR CLB | THRust CLimB |
| THS | Trimmable Horizontal Stabilizer |
| TRANS ALT | TRANSition ALTitude |
| TRANS LVL | TRANSition LeVeL |
| V1 | decision speed — go or stop |
| V2 | takeoff safety speed |
| VAPP | approach speed |
| VFE | maximum flap extended speed |
| VR | rotation speed |
| ZFW | Zero Fuel Weight |
| ZFWCG | Zero Fuel Weight Center of Gravity |

---

[Controls Reference](controls.md) ·
[Airbus Terms and Abbreviations](abbreviations.md)
