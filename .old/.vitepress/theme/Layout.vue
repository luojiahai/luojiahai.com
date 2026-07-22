<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import { computed, nextTick, onMounted, watch } from "vue";
import { useRoute } from "vitepress";
import { useData } from "vitepress";

const { Layout } = DefaultTheme;
const route = useRoute();

const { lang } = useData();
const isZh = computed(() => lang.value.startsWith("zh"));

const ZH_THINKING_VERBS = ["思考中", "捣鼓中", "编排中", "叽里咕噜中", "撒欢中", "磨叽中", "搞事情中", "那啥那啥中"];
const EN_THINKING_VERBS = [
  "Thinking",
  "Combobulating",
  "Choreographing",
  "Flibbertigibbeting",
  "Frolicking",
  "Schlepping",
  "Shenaniganing",
  "Whatchamacalliting",
];
const THINKING_VERBS = computed(() => (isZh.value ? ZH_THINKING_VERBS : EN_THINKING_VERBS));

function startTypewriter(el: Element) {
  let wordIdx = 0;
  let charIdx = 0;
  let stopped = false;

  function tick() {
    if (stopped) return;
    const word = THINKING_VERBS.value[wordIdx] + "...";
    if (charIdx < word.length) {
      el.textContent = word.slice(0, charIdx + 1) + "_❚";
      charIdx++;
      setTimeout(tick, 50);
    } else {
      el.textContent = word;
      setTimeout(() => {
        if (stopped) return;
        wordIdx = (wordIdx + 1) % THINKING_VERBS.value.length;
        const nextWord = THINKING_VERBS.value[wordIdx] + "...";
        const maxLen = Math.max(word.length, nextWord.length);
        let replaceIdx = 1;
        function replace() {
          if (stopped) return;
          if (replaceIdx < maxLen) {
            el.textContent = nextWord.slice(0, replaceIdx) + "_❚" + word.slice(replaceIdx + 1);
            replaceIdx++;
            setTimeout(replace, 50);
          } else {
            charIdx = nextWord.length;
            tick();
          }
        }
        replace();
      }, 2000);
    }
  }

  tick();
  return () => {
    stopped = true;
  };
}

onMounted(() => {
  let cleanup: (() => void) | null = null;
  let tickId = 0;

  watch(
    () => route.path,
    () => {
      if (cleanup) cleanup();
      const currentTickId = ++tickId;
      nextTick(async () => {
        if (currentTickId !== tickId) return;
        const el = document.querySelector(".VPHome .VPHero .thinking");
        if (!el) return;
        cleanup = startTypewriter(el);
      });
    },
    { immediate: true },
  );
});
</script>

<template>
  <Layout />
</template>
