<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useData } from "vitepress";

const { lang } = useData();
const isZh = computed(() => lang.value.startsWith("zh"));

const NAME = computed(() => (isZh.value ? "罗嘉海" : "luojiahai"));
const VERSION = "v3.14159";
const TAGLINE = computed(() => (isZh.value ? "INTJ" : "INTJ personality"));

type Conversation = Array<{
  question: string;
  answer: string;
}>;

const CONVERSATION: Record<string, Conversation> = {
  en: [
    {
      question: "Who are you?",
      answer:
        "Hi there, I'm luojiahai. I was born and raised in Guangzhou, China. I'm currently based in Melbourne, Australia.",
    },
    {
      question: 'What is "luojiahai"?',
      answer: "It's the Pinyin (Mandarin romanization) of my Chinese name. I use it as my internet handle.",
    },
    {
      question: "What do you do?",
      answer: "I'm a computer programmer. I do programming in computer.",
    },
    {
      question: "What are you working on?",
      answer: "I'm working on an interesting project, check it out at http://localhost:5173.",
    },
    {
      question: "What do you do outside of programming?",
      answer: "I like eating, cooking, and grocery shopping. I play Microsoft Flight Simulator, flying Airbus.",
    },
  ],
  zh: [
    {
      question: "你是谁？",
      answer: "你好，我是罗嘉海。我在广州出生长大，目前住在澳大利亚墨尔本。",
    },
    {
      question: "你是做什么的？",
      answer: "我是一名计算机程序员，我在计算机里编程。",
    },
    {
      question: "你在做什么项目？",
      answer: "我在做一个有趣的项目，可以去 http://localhost:5173 看一下。",
    },
    {
      question: "除了编程以外你有什么爱好？",
      answer: "我喜欢吃饭、做饭和逛超市。我玩微软飞行模拟器，飞空客。",
    },
  ],
};

const conversation = computed(() => CONVERSATION[isZh.value ? "zh" : "en"]);

const BROWSER_PATTERNS = [
  { pattern: /Firefox\/([\d.]+)/, name: "Firefox" },
  { pattern: /Edg\/([\d.]+)/, name: "Edge" },
  { pattern: /Chrome\/([\d.]+)/, name: "Chrome", exclude: /Edg\// },
  {
    pattern: /Version\/([\d.]+)/,
    name: "Safari",
    check: /Safari\/(?!.*Chrome)/,
  },
  { pattern: /(?:Opera|OPR)\/([\d.]+)/, name: "Opera" },
] as const;

const OS_PATTERNS = [
  { pattern: /Win/, name: "Windows" },
  { pattern: /iPhone|iPad|iOS/, name: "iOS" },
  { pattern: /Mac/, name: "macOS" },
  { pattern: /Android/, name: "Android" },
  { pattern: /Linux/, name: "Linux" },
] as const;

const language = ref("");
const device = ref("");
const operatingSystem = ref("");
const browser = ref("");

const detectBrowser = (ua: string): string => {
  for (const item of BROWSER_PATTERNS) {
    const { pattern, name } = item;
    const exclude = "exclude" in item ? item.exclude : undefined;
    const check = "check" in item ? item.check : undefined;

    if (exclude?.test(ua)) continue;
    if (check && !check.test(ua)) continue;
    const match = ua.match(pattern);
    if (match) return `${name} ${match[1] || ""}`.trim();
  }
  return "Unknown Browser";
};

const detectOS = (ua: string): string => {
  for (const { pattern, name } of OS_PATTERNS) {
    if (pattern.test(ua)) return name;
  }
  return "Unknown OS";
};

const detectDevice = (ua: string): string => {
  if (ua.includes("Mobile")) return "Mobile";
  if (ua.includes("Tablet") || ua.includes("iPad")) return "Tablet";
  return "Desktop";
};

const initSystemInfo = (): void => {
  const ua = navigator.userAgent;
  language.value = navigator.language || "Unknown";
  device.value = detectDevice(ua);
  operatingSystem.value = detectOS(ua);
  browser.value = detectBrowser(ua);
};

const terminalContent = ref<HTMLElement | null>(null);
const charMeasure = ref<HTMLElement | null>(null);
const charWidth = ref(0);
const numChars = ref(80);
let resizeObserver: ResizeObserver | null = null;

const updateNumChars = () => {
  if (!terminalContent.value || !charMeasure.value) return;
  const measured = charMeasure.value.getBoundingClientRect().width;
  if (measured > 0) {
    charWidth.value = measured;
    numChars.value = Math.floor(terminalContent.value.clientWidth / measured) - 3; // subtract 3 to prevent overflow
  }
};

onMounted(() => {
  initSystemInfo();
  resizeObserver = new ResizeObserver(updateNumChars);
  if (terminalContent.value) {
    resizeObserver.observe(terminalContent.value);
  }
  document.fonts.ready.then(updateNumChars);
});

onUnmounted(() => {
  resizeObserver?.disconnect();
});
</script>

<template>
  <div class="terminal-frame">
    <div class="terminal-header"></div>
    <div ref="terminalContent" class="terminal-content">
      <span ref="charMeasure" class="char-measure">─</span>
      <div class="heading">
        <div class="heading-bar"></div>
        <div class="heading-info">
          <div class="heading-name">
            <span>{{ NAME }}</span
            >&nbsp;<span class="heading-version">{{ VERSION }}</span>
          </div>
          <div class="heading-tagline-container">
            <div class="heading-tagline">{{ TAGLINE }}</div>
          </div>
        </div>
        <div class="heading-spacer"></div>
      </div>
      <div class="conversation">
        <div v-for="turn in conversation" :key="turn.question" class="turn">
          <div class="user-line">{{ turn.question }}</div>
          <div class="assistant-line">{{ turn.answer }}</div>
        </div>
      </div>
      <div class="input-border">{{ "─".repeat(numChars) }}</div>
      <div class="terminal-input">
        <textarea
          id="terminal-input-area"
          class="input-area"
          rows="1"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          inputmode="text"
          @keydown.enter.prevent
          @keydown.tab.prevent
        ></textarea>
      </div>
      <div class="input-border">{{ "─".repeat(numChars) }}</div>
    </div>
    <div class="terminal-footer">
      <span>{{ isZh ? "语言" : "Language" }}: {{ language }}</span>
      <span class="separator">|</span>
      <span>{{ isZh ? "设备" : "Device" }}: {{ device }}</span>
      <span class="separator">|</span>
      <span>{{ isZh ? "操作系统" : "Operating System" }}: {{ operatingSystem }}</span>
      <span class="separator">|</span>
      <span>{{ isZh ? "浏览器" : "Browser" }}: {{ browser }}</span>
    </div>
  </div>
</template>

<style scoped>
.terminal-frame {
  margin: 0 -24px;
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  color: var(--vp-c-text-1);
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;
  scrollbar-width: none;
  border-radius: 0;
  border: none;
}

.terminal-frame::-webkit-scrollbar {
  display: none;
}

.terminal-header {
  display: flex;
  align-items: center;
  padding: 0 14px;
  height: 32px;
  background-color: var(--vp-c-bg-elv);
  color: var(--vp-c-text-2);
}

.terminal-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px;
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  white-space: nowrap;
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.terminal-content::-webkit-scrollbar {
  display: none;
}

.heading {
  display: flex;
  align-items: flex-start;
  flex: 1;
}

.heading-version {
  color: var(--vp-c-text-2);
}

.heading-bar {
  align-self: stretch;
  width: 8px;
  margin-right: 16px;
  border-left: 5px solid var(--vp-c-brand-1);
}

.heading-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  white-space: pre-wrap;
}

.heading-name {
  color: var(--vp-c-text-1);
}

.heading-tagline {
  color: var(--vp-c-text-2);
}

.conversation {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 16px 0;
  width: 100%;
  white-space: normal;
}

.turn {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-line {
  display: flex;
  align-items: baseline;
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg-soft);
}

.assistant-line {
  display: flex;
  align-items: baseline;
  color: var(--vp-c-text-2);
}

.char-measure {
  position: absolute;
  visibility: hidden;
  pointer-events: none;
}

.input-border {
  color: var(--vp-c-default-1);
}

.terminal-input {
  display: flex;
  width: 100%;
}

.input-area {
  font-size: inherit;
  width: inherit;
  margin: 0;
  color: inherit;
  background-color: inherit;
  font-family: inherit;
  border: none;
  outline: none;
  resize: none;
  white-space: nowrap;
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.terminal-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 16px;
  font-size: 12px;
  background-color: var(--vp-c-bg-elv);
  color: var(--vp-c-text-3);
  white-space: nowrap;
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.terminal-footer::-webkit-scrollbar {
  display: none;
}

.separator {
  color: var(--vp-c-divider);
  user-select: none;
}

.terminal-input::before,
.user-line::before {
  content: "❯";
  display: inline-flex;
  width: 8px;
  margin-right: 16px;
}

.assistant-line::before {
  content: "⏺\FE0E";
  display: inline-flex;
  width: 8px;
  margin-right: 16px;
}

@media (min-width: 640px) {
  .terminal-frame {
    margin: 40px 0;
    border-radius: 8px;
    border: 1px solid var(--vp-c-border);
  }
}
</style>
