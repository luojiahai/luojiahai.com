<script lang="ts">
  import type { ProjectItem } from "$lib/content";
  import type { Dictionary } from "$lib/dictionaries";
  import EmptyState from "./EmptyState.svelte";

  /**
   * The projects page: the list on one display, and on the other a
   * navigation display (ND) in ARC mode with each project as a waypoint on
   * a green flight plan. Pointing at a project — hovering or focusing its
   * row, or pressing its waypoint — draws the magenta "direct to" line.
   *
   * The ND lives in a 100x100 box with the aircraft at (50, 88) and the
   * compass arc 60 units out, so every waypoint sits inside the arc.
   */
  let {
    projects,
    dictionary,
  }: {
    projects: ProjectItem[];
    dictionary: Dictionary;
  } = $props();

  const AIRCRAFT = { x: 50, y: 88 };
  const ARC_RADIUS = 60;
  // Bearings (degrees off the nose) the route zigzags through, repeated.
  const BEARINGS = [8, -16, 14, -12, 18, -20, 10, -8];

  let waypoints = $derived(
    projects.map((project, index) => {
      const span = Math.max(projects.length - 1, 1);
      const distance = 12 + (index * 38) / span;
      const bearing = (BEARINGS[index % BEARINGS.length] * Math.PI) / 180;
      const x = AIRCRAFT.x + distance * Math.sin(bearing);
      const y = AIRCRAFT.y - distance * Math.cos(bearing);
      return { project, x, y, labelLeft: x > 62 };
    }),
  );

  let route = $derived(
    [AIRCRAFT, ...waypoints].map(({ x, y }) => `${x},${y}`).join(" "),
  );

  let selected = $state(0);
  let target = $derived(waypoints[selected] ?? waypoints[0]);

  // Compass ticks every 10° across the ±50° arc.
  const ticks = [-40, -30, -20, -10, 0, 10, 20, 30, 40].map((degrees) => {
    const radians = (degrees * Math.PI) / 180;
    const point = (radius: number) => ({
      x: AIRCRAFT.x + radius * Math.sin(radians),
      y: AIRCRAFT.y - radius * Math.cos(radians),
    });
    return { outer: point(ARC_RADIUS), inner: point(ARC_RADIUS - 3.5) };
  });

  function arc(radius: number): string {
    const radians = (50 * Math.PI) / 180;
    const dx = radius * Math.sin(radians);
    const dy = radius * Math.cos(radians);
    return `M ${AIRCRAFT.x - dx} ${AIRCRAFT.y - dy} A ${radius} ${radius} 0 0 1 ${AIRCRAFT.x + dx} ${AIRCRAFT.y - dy}`;
  }

  function hostOf(link: string): string {
    try {
      const url = new URL(link);
      return `${url.host}${url.pathname === "/" ? "" : url.pathname}`;
    } catch {
      return link;
    }
  }
</script>

{#if projects.length === 0}
  <EmptyState />
{:else}
  <div class="flex flex-wrap items-start gap-4">
    <!-- Left display: the list -->
    <div class="flex min-w-0 flex-[1_1_22rem] flex-col gap-2">
      <p class="mb-1 text-[13px] text-ink-soft">
        {dictionary.labels.projectsHint}
      </p>
      {#each waypoints as { project }, index (project.slug)}
        <a
          href={project.link}
          target="_blank"
          rel="noopener"
          onmouseenter={() => (selected = index)}
          onfocus={() => (selected = index)}
          class={[
            "row-link grid grid-cols-[2.5rem_1fr] items-start gap-3 rounded-[3px] border-[1.5px] bg-card px-3.5 py-3 focus-visible:outline-offset-[-2px]",
            index === selected ? "border-accent" : "border-line",
          ]}
        >
          {#if project.image}
            <img
              class="h-10 w-10 rounded-[3px] border border-line"
              src={project.image}
              alt=""
              width="40"
              height="40"
              loading="lazy"
            />
          {:else}
            <span
              class="pt-0.5 font-mono text-xs text-ink-soft"
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          {/if}
          <span class="min-w-0">
            <span class="row-title block text-base font-bold">
              {project.name}
            </span>
            <span class="mt-0.5 block text-[13px] leading-normal text-ink-soft">
              {project.description}
            </span>
          </span>
        </a>
      {/each}
    </div>

    <!-- Right display: the ND -->
    <figure
      class="relative m-0 aspect-square w-full flex-[1_1_22rem] overflow-hidden rounded-[3px] border-[6px] border-bezel bg-ecam font-mono sm:max-w-[34rem]"
      aria-label={dictionary.labels.projectMap}
    >
      <div class="absolute left-3 top-2.5 text-[13px] leading-normal text-hw-ink">
        ARC
        <div class="text-ecam-green">{projects.length} WPT</div>
      </div>
      {#if target}
        <div class="absolute right-3 top-2.5 text-right leading-normal">
          <div class="text-[15px] uppercase text-white sm:text-[17px]">
            {target.project.name}
          </div>
          <a
            class="text-xs text-ecam-cyan hover:underline"
            href={target.project.link}
            target="_blank"
            rel="noopener"
          >
            {dictionary.labels.openProject} · {hostOf(target.project.link)} ›
          </a>
        </div>
      {/if}

      <svg
        class="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d={arc(ARC_RADIUS)}
          fill="none"
          stroke="#eceee8"
          stroke-width="1.5"
          vector-effect="non-scaling-stroke"
        />
        <path
          d={arc(ARC_RADIUS / 2)}
          fill="none"
          stroke="#eceee8"
          stroke-width="1"
          stroke-dasharray="3 5"
          opacity="0.55"
          vector-effect="non-scaling-stroke"
        />
        {#each ticks as { outer, inner }, index (index)}
          <line
            x1={outer.x}
            y1={outer.y}
            x2={inner.x}
            y2={inner.y}
            stroke="#eceee8"
            stroke-width="1.5"
            vector-effect="non-scaling-stroke"
          />
        {/each}
        <polyline
          points={route}
          fill="none"
          stroke="#39e46b"
          stroke-width="2"
          vector-effect="non-scaling-stroke"
        />
        {#if target}
          <line
            x1={AIRCRAFT.x}
            y1={AIRCRAFT.y}
            x2={target.x}
            y2={target.y}
            stroke="#ff4fe0"
            stroke-width="1.5"
            stroke-dasharray="5 4"
            vector-effect="non-scaling-stroke"
          />
        {/if}
        <path
          d="M 50 84 L 50 93 M 45.5 88.5 L 54.5 88.5 M 47.8 92.2 L 52.2 92.2"
          stroke="#ffe14d"
          stroke-width="3"
          stroke-linecap="round"
          vector-effect="non-scaling-stroke"
        />
      </svg>

      <span
        class="absolute left-1/2 top-[24.5%] h-0 w-0 -translate-x-1/2 border-x-[7px] border-t-[10px] border-x-transparent border-t-[#ffe14d]"
        aria-hidden="true"
      ></span>
      <span
        class="absolute left-1/2 top-[32%] -translate-x-1/2 text-sm text-hw-ink"
        aria-hidden="true">0</span
      >
      <span
        class="absolute left-[24%] top-[38%] -translate-x-1/2 text-xs text-hw-ink"
        aria-hidden="true">33</span
      >
      <span
        class="absolute left-[76%] top-[38%] -translate-x-1/2 text-xs text-hw-ink"
        aria-hidden="true">3</span
      >

      {#each waypoints as { project, x, y, labelLeft }, index (project.slug)}
        <button
          type="button"
          class={[
            "group absolute flex -translate-y-1/2 cursor-pointer items-center gap-1.5 p-0 text-[11px] tracking-[0.04em] sm:text-xs",
            labelLeft && "flex-row-reverse",
            index === selected ? "text-white" : "text-ecam-green",
          ]}
          style:left={labelLeft ? undefined : `calc(${x}% - 6px)`}
          style:right={labelLeft ? `calc(${100 - x}% - 6px)` : undefined}
          style:top="{y}%"
          aria-label={project.name}
          aria-pressed={index === selected}
          onclick={() => (selected = index)}
        >
          <span
            class="h-2.5 w-2.5 rotate-45 border-2 border-current bg-ecam"
            aria-hidden="true"
          ></span>
          <span class="uppercase group-hover:text-ecam-cyan" aria-hidden="true">
            {project.name}
          </span>
        </button>
      {/each}
    </figure>
  </div>
{/if}
