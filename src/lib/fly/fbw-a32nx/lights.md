# Lights by Phase

The same handful of light switches gets touched in almost every phase, so they
live here as one matrix instead of being repeated across nine procedure pages.
The procedure pages still say *when* to act; this page is the single source of
truth for *what state*.

`–` means no action in that phase (the previous state carries over).

## Exterior

| Light | Prep | Start and Taxi | Takeoff | Initial Climb | Above 10,000 ft | Descent 10,000 ft | Final (G/S green) | After Landing | Shutdown |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [NAV & LOGO](controls.md#exterior-lighting) | **ON** | – | ON | – | – | – | – | – | **OFF** |
| [STROBE](controls.md#exterior-lighting) | **AUTO** | – | **ON** | – | – | – | – | **AUTO** | – |
| [BEACON](controls.md#exterior-lighting) | **OFF** | **ON** | – | – | – | – | – | – | **OFF** |
| [WING](controls.md#exterior-lighting) | – | – | **OFF** | – | – | – | – | – | – |
| [RWY TURN OFF](controls.md#exterior-lighting) | – | **ON** | ON | **OFF** | – | – | **ON** | ON | **OFF** |
| [NOSE](controls.md#exterior-lighting) | – | **TAXI** | **T.O.** | **OFF** | – | – | **T.O.** | **TAXI** | **OFF** |
| [LAND L & R](controls.md#exterior-lighting) | – | – | **ON** | – | **OFF** | as required | – | **OFF** | – |

- **NAV & LOGO** goes on as soon as the aircraft has power, from external power,
  the APU or an engine, and off again once that power is removed at shutdown.
  The logo lights only illuminate with the gear struts compressed or the slats
  out. The A32NX models the `2` and `OFF` positions; `1` is not available.
- **BEACON** goes ON at push and start clearance, before pushback or engine
  start, and OFF once the engines have spooled down at the gate. It is the
  ground crew's signal that the engines are about to run.
- **STROBE** sits at AUTO on the ground — AUTO turns them on by itself when the
  main gear strut extends — and goes ON no later than the takeoff roll. Select
  ON whenever you cross a runway, taxiing out or in.
- **RWY TURN OFF and NOSE go off by themselves** when the gear retracts, but
  move the switches anyway: if the cut-out failed, the lamps are now inside the
  gear bay heating up.
- **LAND L & R** have three positions. OFF shuts the lights down but leaves them
  extended; RETRACT stows them. They add drag while extended, so retract them
  in the cruise.
- **NAV & LOGO and RWY TURN OFF appear twice.** Both are set before the takeoff
  block and set again in it. If nothing changed them in between, the second
  entry is a verify rather than an action.
- **WING is only ever set OFF** at takeoff and never turned on in normal
  operation — it lights the leading edge and engine intake to check for ice.

## Interior and Signs

| Control | Prep | Above 10,000 ft | Descent 10,000 ft | Shutdown |
| --- | --- | --- | --- | --- |
| [SEAT BELTS](controls.md#signs) | **ON** | **OFF** when stable | **ON** | **OFF** |
| [NO SMOKING](controls.md#signs) | **AUTO** | – | – | **OFF** |
| [EMER EXIT LT](controls.md#signs) | **ARM** | – | – | **OFF** |
| [DOME](controls.md#interior-lighting) | as required | – | – | **OFF** |
| [OVHD INTEG LT](controls.md#interior-lighting) | adjust | – | – | reset |
| [INTEG LT](controls.md#displays) | adjust | – | – | reset |

- **NO SMOKING sits at AUTO**, which ties it to landing gear position. Leaving
  either sign off AUTO prevents the emergency batteries from charging.
- **SEAT BELTS** goes off above 10,000 ft only once the aircraft is stable — no
  turn, no weather — and back on in the descent at 10,000 ft at the latest. That
  is also the cue for the cabin crew to secure the cabin.
