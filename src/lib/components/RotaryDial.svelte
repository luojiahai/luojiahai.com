<script lang="ts">
  import Icon from "./Icon.svelte";
  import type { IconName } from "$lib/icons";

  interface RotaryDialOption {
    value: string;
    /** Text label displayed outside the knob... */
    label?: string;
    /** ...or an icon label. */
    icon?: IconName;
  }

  let {
    options,
    value,
    onchange,
    title,
    labelLayout = "arc",
  }: {
    /** Ordered options. Distributed on an upper arc centered at 12 o'clock. */
    options: RotaryDialOption[];
    value: string;
    /** Called when the user clicks to advance to the next option. */
    onchange: (value: string) => void;
    title?: string;
    labelLayout?: "arc" | "inline";
  } = $props();

  /**
   * Angle (in degrees, 0 = 12-o'clock, CW positive) for the i-th option out
   * of `count` options. Two options sit at ±45°, three at -45°/0°/+45°.
   */
  function optionAngle(i: number, count: number): number {
    if (count === 2) return i === 0 ? -45 : 45;
    if (count === 3) return (i - 1) * 45;
    const spread = 60;
    const mid = (count - 1) / 2;
    return (i - mid) * spread;
  }

  const knobSize = 36;
  const labelRadius = 28;

  let currentIndex = $derived(options.findIndex((o) => o.value === value));
  let rotation = $derived(
    currentIndex >= 0 ? optionAngle(currentIndex, options.length) : 0,
  );

  function labelPosition(i: number): { x: number; y: number } {
    if (labelLayout === "inline") {
      const xExtent = labelRadius * Math.SQRT1_2;
      const ratio = options.length === 1 ? 0.5 : i / (options.length - 1);
      return {
        x: -xExtent + 2 * xExtent * ratio,
        y: -labelRadius * Math.SQRT1_2,
      };
    }
    const angle = optionAngle(i, options.length);
    const rad = (angle - 90) * (Math.PI / 180);
    return { x: Math.cos(rad) * labelRadius, y: Math.sin(rad) * labelRadius };
  }

  function cycle() {
    const nextIndex = (currentIndex + 1) % options.length;
    onchange(options[nextIndex].value);
  }
</script>

<div
  class="relative flex items-center justify-center"
  style:width="{knobSize}px"
  style:height="{knobSize}px"
>
  {#each options as opt, i (opt.value)}
    {@const pos = labelPosition(i)}
    <div
      class={[
        "absolute pointer-events-none select-none transition-opacity duration-200",
        "font-mono text-[8px] uppercase tracking-widest leading-none",
        i === currentIndex
          ? "text-printer-accent dark:text-printer-accent-dark opacity-100"
          : "text-printer-ink-light dark:text-printer-ink-dark/40 opacity-60",
      ]}
      style:left="calc(50% + {pos.x}px)"
      style:top="calc(50% + {pos.y}px)"
      style:transform="translate(-50%, -50%)"
    >
      {#if opt.icon}
        <Icon name={opt.icon} class="w-2 h-2" />
      {:else}
        {opt.label}
      {/if}
    </div>
  {/each}

  <button
    onclick={cycle}
    {title}
    aria-label={title}
    class="rotary-dial-knob absolute inset-[5px] rounded-full cursor-pointer"
  >
    <div
      class="absolute inset-0 flex justify-center transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
      style:transform="rotate({rotation}deg)"
    >
      <div
        class="w-[1.5px] h-[40%] bg-printer-accent dark:bg-printer-accent-dark rounded-full"
      ></div>
    </div>
  </button>
</div>
