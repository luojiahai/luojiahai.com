<script lang="ts">
  import { onMount } from "svelte";

  /**
   * A small decorative tin-toy robot that walks back and forth along the top
   * edge of the printer shell. It's built from the printer's own parts: a
   * plastic shell, a dark visor with lamp-green LED eyes, a slip of thermal
   * paper in its chest slot, and a wind-up key in its back.
   *
   * The turn-around is the tricky part: mirroring a flat SVG about the Y axis
   * goes paper-thin halfway through, which reads as a flipping card. Instead
   * it stops, cuts to a front-facing frame, blinks at you, and cuts back to
   * the side frame facing the other way. Like a real wind-up toy it also runs
   * down once per crossing: it slows to a stand, the key spins back as it's
   * rewound, and it sets off again.
   */
  type Phase =
    | "walk"
    | "runDown"
    | "stopped"
    | "rewind"
    | "windUp"
    | "halt"
    | "facing";

  type PhaseSpec = {
    /** Gait speed, 0..1, at `t` seconds into the phase. */
    speed: (t: number) => number;
    /** Every phase but walk ends on a timer; walk ends on position. */
    timer?: { duration: number; next: Phase };
    /** Key spin in rad/s, overriding the speed-driven spin. */
    keySpin?: number;
    /** Seconds into the phase at which the eyes blink. */
    blinkAt?: number;
  };

  let lane: HTMLDivElement;
  let walker: HTMLDivElement;
  let body: SVGGElement;
  let side: SVGGElement;
  let front: SVGGElement;
  let key: SVGGElement;
  let legA: SVGRectElement;
  let legB: SVGRectElement;
  let sideEyes: SVGGElement;
  let frontEyes: SVGGElement;

  onMount(() => {
    const CROSSING = 24; // s of walking to cross the top once
    const STEP = 0.5; // s per step
    const ROCK = 4; // deg the body rocks about the feet at full speed
    const LIFT = 1.4; // user units a leg lifts at full speed
    const KEY_SPIN = 10; // rad/s at full speed
    const BLINK = 0.16; // s
    const FEET = "28.5 34"; // rock pivot, in svg user units
    const MIRROR = "translate(57 0) scale(-1 1)";

    const ease = (x: number) =>
      0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, x)));

    const phases: Record<Phase, PhaseSpec> = {
      walk: { speed: () => 1 },
      runDown: {
        speed: (t) => 1 - ease(t / 1.2),
        timer: { duration: 1.2, next: "stopped" },
      },
      stopped: { speed: () => 0, timer: { duration: 2, next: "rewind" } },
      rewind: {
        speed: () => 0,
        timer: { duration: 0.9, next: "windUp" },
        keySpin: -30,
      },
      windUp: {
        speed: (t) => ease(t / 0.4),
        timer: { duration: 0.4, next: "walk" },
      },
      halt: {
        speed: (t) => 1 - ease(t / 0.3),
        timer: { duration: 0.35, next: "facing" },
      },
      facing: {
        speed: () => 0,
        timer: { duration: 1.1, next: "windUp" },
        blinkAt: 0.45,
      },
    };

    const rollRunDown = () => 0.3 + Math.random() * 0.4;
    const rollBlink = () => 2.5 + Math.random() * 3;

    let phase: Phase = "walk";
    let elapsed = 0; // s into the current phase
    let dir: 1 | -1 = 1;
    let pos = 0; // 0..1 along the lane
    let runDownAt = rollRunDown(); // crossing progress; Infinity once spent
    let gait = 0; // s of walking, advanced at the current speed
    let keyAngle = 0; // rad
    let blinkIn = rollBlink();
    let blinkT: number | null = null; // s into the current blink

    const enter = (next: Phase) => {
      if (phase === "facing") {
        dir = dir === 1 ? -1 : 1;
        runDownAt = rollRunDown();
      }
      phase = next;
      elapsed = 0;
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const showFront = (facing: boolean) => {
      side.setAttribute("display", facing ? "none" : "inline");
      front.setAttribute("display", facing ? "inline" : "none");
    };
    const place = (x: number) => {
      walker.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
    };

    // Rest pose: centered, facing the viewer.
    const placeStatic = () => {
      place(span / 2);
      showFront(true);
    };

    // Travel range — kept fresh with a ResizeObserver so it survives the
    // initial layout settling and responsive width changes.
    let span = 0;
    const measure = () => {
      span = Math.max(0, lane.clientWidth - walker.offsetWidth);
      if (reduce.matches) placeStatic();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(lane);
    ro.observe(walker);

    const step = (dt: number) => {
      elapsed += dt;
      const timer = phases[phase].timer;
      if (timer && elapsed >= timer.duration) enter(timer.next);

      const spec = phases[phase];
      const speed = spec.speed(elapsed);
      gait += dt * speed;
      keyAngle += dt * (spec.keySpin ?? KEY_SPIN * speed);
      const stride = 1 - Math.cos((2 * Math.PI * gait) / STEP);
      pos = Math.min(1, Math.max(0, pos + (dir * speed * dt * stride) / CROSSING));

      blinkIn -= dt;
      if (blinkIn <= 0) {
        blinkT = 0;
        blinkIn = rollBlink();
      }
      const cue = spec.blinkAt;
      if (cue !== undefined && elapsed >= cue && elapsed - dt < cue) blinkT = 0;
      let eye = 1;
      if (blinkT !== null) {
        blinkT += dt;
        if (blinkT < BLINK) eye = 1 - 0.9 * Math.sin((Math.PI * blinkT) / BLINK);
        else blinkT = null;
      }

      const swing = Math.sin((Math.PI * gait) / STEP);
      const rock = ROCK * swing * speed;
      const liftA = Math.max(0, swing) * LIFT * speed;
      const liftB = Math.max(0, -swing) * LIFT * speed;
      const blink = `translate(0 10.2) scale(1 ${eye.toFixed(3)}) translate(0 -10.2)`;
      place(pos * span);
      showFront(phase === "facing");
      side.setAttribute("transform", dir === 1 ? "" : MIRROR);
      body.setAttribute("transform", `rotate(${rock.toFixed(3)} ${FEET})`);
      legA.setAttribute("transform", `translate(0 ${(-liftA).toFixed(3)})`);
      legB.setAttribute("transform", `translate(0 ${(-liftB).toFixed(3)})`);
      key.setAttribute(
        "transform",
        `translate(0 22) scale(1 ${Math.cos(keyAngle).toFixed(3)}) translate(0 -22)`,
      );
      sideEyes.setAttribute("transform", blink);
      frontEyes.setAttribute("transform", blink);

      if (phase === "walk") {
        const progress = dir === 1 ? pos : 1 - pos;
        if (progress >= 1) {
          enter("halt");
        } else if (progress >= runDownAt) {
          runDownAt = Infinity;
          enter("runDown");
        }
      }
    };

    if (reduce.matches) {
      placeStatic();
      return () => ro.disconnect();
    }

    let raf = 0;
    let last = 0;
    const frame = (now: number) => {
      // Clamped so a long stall resumes the walk instead of jumping it.
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      step(dt);
      raf = requestAnimationFrame(frame);
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  });
</script>

<div class="robot-lane" bind:this={lane} aria-hidden="true">
  <div class="robot-walker" bind:this={walker}>
    <svg
      class="robot-svg"
      viewBox="0 0 60 36"
      preserveAspectRatio="xMidYMax meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g bind:this={body}>
        <!-- Side view, facing right. JS mirrors it to face left. -->
        <g bind:this={side}>
          <g class="robot-key" bind:this={key}>
            <path class="robot-key-shaft" d="M12.5 22 L18 22" />
            <ellipse class="robot-key-wing" cx="11" cy="18.6" rx="1.6" ry="3" />
            <ellipse class="robot-key-wing" cx="11" cy="25.4" rx="1.6" ry="3" />
          </g>
          <rect
            class="robot-leg"
            bind:this={legA}
            x="22"
            y="29"
            width="5"
            height="5"
            rx="1"
          />
          <rect
            class="robot-leg"
            bind:this={legB}
            x="31"
            y="29"
            width="5"
            height="5"
            rx="1"
          />
          <rect class="robot-shell" x="18" y="16" width="21" height="14" rx="3" />
          <rect class="robot-slot" x="24" y="19.6" width="11" height="1.4" rx="0.7" />
          <rect class="robot-paper" x="25.5" y="20.6" width="8" height="5.6" />
          <path class="robot-print" d="M27 22.8 h5 M27 24.6 h3.4" />
          <path class="robot-antenna" d="M25 4.5 V1.8" />
          <circle class="robot-antenna-tip" cx="25" cy="1.4" r="1.4" />
          <rect class="robot-shell" x="21" y="4.5" width="17" height="11.5" rx="3.5" />
          <rect class="robot-screen" x="26" y="7.5" width="10.5" height="5.5" rx="2.5" />
          <g bind:this={sideEyes}>
            <circle class="robot-led" cx="30" cy="10.2" r="1" />
            <circle class="robot-led" cx="34" cy="10.2" r="1" />
          </g>
        </g>

        <!-- Front view, shown only while turning around -->
        <g bind:this={front} display="none">
          <rect class="robot-leg" x="22.5" y="29" width="4.5" height="5" rx="1" />
          <rect class="robot-leg" x="30" y="29" width="4.5" height="5" rx="1" />
          <rect class="robot-shell" x="18" y="16" width="21" height="14" rx="3" />
          <rect class="robot-slot" x="23" y="19.6" width="11" height="1.4" rx="0.7" />
          <rect class="robot-paper" x="24.5" y="20.6" width="8" height="5.6" />
          <path class="robot-print" d="M26 22.8 h5 M26 24.6 h3.4" />
          <path class="robot-antenna" d="M28.5 4.5 V1.8" />
          <circle class="robot-antenna-tip" cx="28.5" cy="1.4" r="1.4" />
          <circle class="robot-ear" cx="19.6" cy="10.2" r="1.2" />
          <circle class="robot-ear" cx="37.4" cy="10.2" r="1.2" />
          <rect class="robot-shell" x="20" y="4.5" width="17" height="11.5" rx="3.5" />
          <rect class="robot-screen" x="22.5" y="7.5" width="12" height="5.5" rx="2.5" />
          <g bind:this={frontEyes}>
            <circle class="robot-led" cx="26" cy="10.2" r="1" />
            <circle class="robot-led" cx="31" cy="10.2" r="1" />
          </g>
        </g>
      </g>
    </svg>
  </div>
</div>
