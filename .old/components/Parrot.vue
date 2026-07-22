<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

const TOTAL_FRAMES = 10;
const FRAME_INTERVAL_MS = 80;
const COLORS = [
  "var(--_brand-kraft)",
  "var(--_brand-clay)",
  "var(--_brand-fig)",
  "var(--_brand-sky)",
  "var(--_brand-mineral)",
  "var(--_brand-peach)",
] as const;

const currentFrame = ref(0);
const currentColorIndex = ref(0);
const frames = ref<string[]>([]);

let animationInterval: number | undefined;

const currentColor = computed(() => COLORS[currentColorIndex.value]);

const getRandomColorIndex = (exclude: number): number =>
  (exclude + 1 + Math.floor(Math.random() * (COLORS.length - 1))) % COLORS.length;

const loadFrames = async (): Promise<void> => {
  const promises = Array.from({ length: TOTAL_FRAMES }, (_, i) =>
    fetch(`/parrot/${i}.txt`)
      .then((res) => res.text())
      .catch((err) => {
        console.error(`Failed to load frame ${i}:`, err);
        return "";
      }),
  );

  frames.value = await Promise.all(promises);
};

const tick = (): void => {
  currentFrame.value = (currentFrame.value + 1) % TOTAL_FRAMES;
  currentColorIndex.value = getRandomColorIndex(currentColorIndex.value);
};

const startAnimation = (): void => {
  if (animationInterval !== undefined) return;
  animationInterval = window.setInterval(tick, FRAME_INTERVAL_MS);
};

const stopAnimation = (): void => {
  if (animationInterval !== undefined) {
    clearInterval(animationInterval);
    animationInterval = undefined;
  }
};

onMounted(async () => {
  await loadFrames();
  startAnimation();
});

onUnmounted(() => {
  stopAnimation();
});
</script>

<template>
  <div class="parrot">
    <pre class="parrot-frame" :style="{ color: currentColor }">{{ frames[currentFrame] }}</pre>
  </div>
</template>

<style scoped>
.parrot {
  padding: 64px;
}

.parrot-frame {
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
  line-height: 12px;
  margin: 0;
  white-space: pre;
}
</style>
