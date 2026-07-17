<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";

type ResumeEntry = {
  name: string;
  location: string;
  items: Array<{ label: string; period: string }>;
};

type ResumeSection = {
  title: string;
  entries: ResumeEntry[];
};

const RESUME: Record<string, ResumeSection[]> = {
  en: [
    {
      title: "Experience",
      entries: [
        {
          name: "REA Group (realestate.com.au)",
          location: "Melbourne, Victoria, Australia",
          items: [
            { label: "Senior Software Engineer", period: "2025 - Present" },
            { label: "Software Engineer", period: "2024 - 2025" },
          ],
        },
        {
          name: "Amazon Web Services (AWS)",
          location: "Sydney, New South Wales, Australia",
          items: [{ label: "Software Development Engineer", period: "2021 - 2024" }],
        },
        {
          name: "Deloitte",
          location: "Melbourne, Victoria, Australia",
          items: [{ label: "Software Development Consultant", period: "2020 - 2021" }],
        },
        {
          name: "The University of Melbourne",
          location: "Melbourne, Victoria, Australia",
          items: [{ label: "Teaching Assistant", period: "2018 - 2020" }],
        },
      ],
    },
    {
      title: "Education",
      entries: [
        {
          name: "The University of Melbourne",
          location: "Melbourne, Victoria, Australia",
          items: [
            { label: "Master of Science (Computer Science)", period: "2018 - 2020" },
            { label: "Bachelor of Science", period: "2015 - 2018" },
          ],
        },
        {
          name: "Peking University",
          location: "Beijing, China",
          items: [{ label: "Summer School International Program", period: "Summer 2016" }],
        },
      ],
    },
  ],
  zh: [
    {
      title: "工作经历",
      entries: [
        {
          name: "REA 集团（realestate.com.au）",
          location: "澳大利亚墨尔本",
          items: [
            { label: "高级软件工程师", period: "2025 - 至今" },
            { label: "软件工程师", period: "2024 - 2025" },
          ],
        },
        {
          name: "亚马逊云科技（AWS）",
          location: "澳大利亚悉尼",
          items: [{ label: "软件开发工程师", period: "2021 - 2024" }],
        },
        {
          name: "德勤",
          location: "澳大利亚墨尔本",
          items: [{ label: "软件开发顾问", period: "2020 - 2021" }],
        },
        {
          name: "墨尔本大学",
          location: "澳大利亚墨尔本",
          items: [{ label: "教学助理", period: "2018 - 2020" }],
        },
      ],
    },
    {
      title: "教育背景",
      entries: [
        {
          name: "墨尔本大学",
          location: "澳大利亚墨尔本",
          items: [
            { label: "理学硕士（计算机科学）", period: "2018 - 2020" },
            { label: "理学学士", period: "2015 - 2018" },
          ],
        },
        {
          name: "北京大学",
          location: "中国北京",
          items: [{ label: "暑期学校国际课程", period: "2016 夏" }],
        },
      ],
    },
  ],
};

const { lang } = useData();
const sections = computed(() => RESUME[lang.value.startsWith("zh") ? "zh" : "en"]);
</script>

<template>
  <div class="resume">
    <template v-for="section in sections" :key="section.title">
      <h2 class="section-title">{{ section.title }}</h2>
      <ul class="entry-list">
        <li v-for="entry in section.entries" :key="entry.name" class="entry-item">
          <div class="entry-header">
            <span class="entry-name">{{ entry.name }}</span>
            <span class="entry-location">{{ entry.location }}</span>
          </div>
          <ul class="item-list">
            <li v-for="item in entry.items" :key="item.label" class="item">
              <span class="item-label">{{ item.label }}</span>
              <span class="item-period">{{ item.period }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </template>
  </div>
</template>

<style scoped>
.resume {
  margin: 0 auto 32px;
  font-size: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
  margin-top: 0;
  padding-bottom: 8px;
  border-top: none;
  border-bottom: 1px solid var(--vp-c-divider);
  line-height: 16px;
}

.entry-list {
  list-style-type: none;
  padding-left: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.entry-item {
  border-left: 5px solid var(--vp-c-brand-1);
  padding-left: 16px;
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 5px;
}

.entry-name {
  font-weight: 600;
  color: var(--vp-c-text-1);
  flex: 1;
  min-width: 0;
}

.entry-location {
  font-weight: 400;
  font-style: italic;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.item-list {
  list-style-type: none;
  padding-left: 0;
  display: flex;
  flex-direction: column;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.item-label {
  font-weight: 400;
  color: var(--vp-c-text-2);
}

.item-label::before {
  font-family: var(--vp-font-family-mono);
  content: "⏺\FE0E";
  color: var(--vp-c-text-3);
  width: 8px;
  margin-right: 12px;
}

.item-period {
  font-weight: 400;
  color: var(--vp-c-text-3);
  white-space: nowrap;
}

@media (max-width: 639px) {
  .entry-header {
    flex-direction: column;
    gap: 2px;
  }

  .entry-location {
    white-space: normal;
  }
}
</style>
