<script lang="ts">
  /**
   * One FCU window on the glareshield: an engraved label over an orange LCD
   * readout, with the knob that turns it below on wide screens. The whole
   * control is a single button; `angle` sets where the knob's index points.
   */
  let {
    label,
    value,
    angle = 0,
    title,
    onclick,
  }: {
    label: string;
    value: string;
    angle?: number;
    title: string;
    onclick: () => void;
  } = $props();
</script>

<button type="button" class="fcu-window" {onclick} {title} aria-label={title}>
  <span class="fcu-label" aria-hidden="true">{label}</span>
  <span class="lcd" aria-hidden="true">{value}</span>
  <span class="knob max-lg:hidden" aria-hidden="true">
    <span class="knob-index" style:transform="rotate({angle}deg)"></span>
  </span>
</button>
