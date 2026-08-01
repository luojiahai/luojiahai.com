# Lights by Phase

Every light state, in one matrix. The procedure pages say *when*; this says
*what*.

`–` means no action: the previous state carries over.

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

- **NAV & LOGO** on with power, off when power goes at shutdown. The A32NX
  models `2` and `OFF` only; `1` is not available.
- **BEACON** on before pushback or start, off once the engines spool down. It
  tells the ground crew the engines are about to run.
- **STROBE** AUTO on the ground, which fires them when the gear strut extends.
  ON by the takeoff roll, and whenever you cross a runway.
- **RWY TURN OFF and NOSE** cut out by themselves when the gear retracts. Move
  the switches anyway: if the cut-out failed, the lamps are cooking in the bay.
- **LAND L & R** OFF leaves them extended and dragging, RETRACT stows them.
  Retract in the cruise.
- **WING** is only ever set OFF. It lights the leading edge to check for ice.
- **NAV & LOGO and RWY TURN OFF appear twice**, before and inside the takeoff
  block. The second entry is a verify unless something changed in between.

## Interior and Signs

| Control | Prep | Above 10,000 ft | Descent 10,000 ft | Shutdown |
| --- | --- | --- | --- | --- |
| [SEAT BELTS](controls.md#signs) | **ON** | **OFF** when stable | **ON** | **OFF** |
| [NO SMOKING](controls.md#signs) | **AUTO** | – | – | **OFF** |
| [EMER EXIT LT](controls.md#signs) | **ARM** | – | – | **OFF** |
| [DOME](controls.md#interior-lighting) | as required | – | – | **OFF** |
| [OVHD INTEG LT](controls.md#interior-lighting) | adjust | – | – | reset |
| [INTEG LT](controls.md#displays) | adjust | – | – | reset |

- **NO SMOKING** stays at AUTO, tied to gear position. Either sign off AUTO
  stops the emergency batteries charging.
- **SEAT BELTS** off above 10,000 ft only once stable, no turn and no weather.
  Back on by 10,000 ft in the descent, which also cues the cabin crew.
