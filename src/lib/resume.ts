export interface ResumeContact {
  kind: "website" | "email" | "github";
  label: string;
  value: string;
  href: string;
}

export interface ResumeProject {
  name: string;
  note?: string;
  href?: string;
  description: string;
  stack: string[];
}

export interface ResumeExperience {
  role: string;
  organization: string;
  organizationIcon?: string;
  location?: string;
  period: string;
  summary?: string;
  projects: ResumeProject[];
}

export interface ResumeSkillGroup {
  label: string;
  items: string[];
}

export interface ResumeEducation {
  school: string;
  schoolIcon?: string;
  degree: string;
  location: string;
  period: string;
}

export interface ResumeContent {
  pageTitle: string;
  pageDescription: string;
  name: string;
  summary: string;
  imageDescription: string;
  sectionLabels: {
    experience: string;
    skills: string;
    education: string;
  };
  contacts: ResumeContact[];
  experiences: ResumeExperience[];
  skillGroups: ResumeSkillGroup[];
  education: ResumeEducation[];
}

export const resumeContent: Record<"zh" | "en", ResumeContent> = {
  en: {
    pageTitle: "Resume",
    pageDescription: "My professional background and experience.",
    name: "Luo, Jiahai",
    summary:
      "Software engineer based in Melbourne, Australia. Currently a Senior Software Engineer at REA Group (realestate.com.au); previously at Amazon Web Services and Deloitte. Master of Science in Computer Science from The University of Melbourne.",
    imageDescription:
      "Software engineer in Melbourne, Australia. REA Group, previously AWS and Deloitte.",
    sectionLabels: {
      experience: "Experience",
      skills: "Skills",
      education: "Education",
    },
    contacts: [
      {
        kind: "website",
        label: "Website",
        value: "luojiahai.com",
        href: "https://luojiahai.com",
      },
      {
        kind: "email",
        label: "Email",
        value: "ljiahai@hotmail.com",
        href: "mailto:ljiahai@hotmail.com",
      },
      {
        kind: "github",
        label: "GitHub",
        value: "github.com/luojiahai",
        href: "https://github.com/luojiahai",
      },
    ],
    experiences: [
      {
        role: "Senior Software Engineer",
        organization: "REA Group (realestate.com.au)",
        organizationIcon: "/resume/rea.png",
        location: "Melbourne, Australia",
        period: "2025 - Present",
        projects: [],
      },
      {
        role: "Software Engineer",
        organization: "REA Group (realestate.com.au)",
        organizationIcon: "/resume/rea.png",
        location: "Melbourne, Australia",
        period: "2024 - 2025",
        projects: [],
      },
      {
        role: "Software Development Engineer",
        organization: "Amazon Web Services (AWS)",
        organizationIcon: "/resume/aws.png",
        location: "Sydney, Australia",
        period: "2021 - 2024",
        projects: [],
      },
      {
        role: "Software Development Consultant",
        organization: "Deloitte",
        organizationIcon: "/resume/deloitte.png",
        location: "Melbourne, Australia",
        period: "2020 - 2021",
        projects: [],
      },
      {
        role: "Teaching Assistant",
        organization: "The University of Melbourne",
        organizationIcon: "/resume/unimelb.png",
        location: "Melbourne, Australia",
        period: "2018 - 2020",
        projects: [],
      },
    ],
    skillGroups: [
      {
        label: "AI",
        items: ["Claude Code", "Codex", "LLM agent SDKs"],
      },
      {
        label: "Languages",
        items: ["Python", "TypeScript", "Java"],
      },
      {
        label: "Frameworks & Infrastructure",
        items: [
          "React",
          "Node.js",
          "GraphQL",
          "AWS",
          "PostgreSQL",
          "Kafka",
          "Docker",
        ],
      },
    ],
    education: [
      {
        school: "The University of Melbourne",
        schoolIcon: "/resume/unimelb.png",
        degree: "Master of Science (Computer Science)",
        location: "Melbourne, Australia",
        period: "2018 - 2020",
      },
      {
        school: "The University of Melbourne",
        schoolIcon: "/resume/unimelb.png",
        degree: "Bachelor of Science",
        location: "Melbourne, Australia",
        period: "2015 - 2018",
      },
      {
        school: "Peking University",
        schoolIcon: "/resume/pku.png",
        degree: "Summer School International Program",
        location: "Beijing, China",
        period: "Summer 2016",
      },
    ],
  },
  zh: {
    pageTitle: "简历",
    pageDescription: "我的职业经历和背景。",
    name: "罗嘉海",
    summary:
      "软件工程师，现居澳大利亚墨尔本。目前在 REA 集团（realestate.com.au）担任高级软件工程师；此前曾就职于亚马逊云科技（AWS）和德勤。墨尔本大学计算机科学理学硕士。",
    imageDescription:
      "澳大利亚墨尔本的软件工程师。REA 集团，曾就职于 AWS 和德勤。",
    sectionLabels: {
      experience: "工作经历",
      skills: "技能",
      education: "教育背景",
    },
    contacts: [
      {
        kind: "website",
        label: "网站",
        value: "luojiahai.com",
        href: "https://luojiahai.com",
      },
      {
        kind: "email",
        label: "邮箱",
        value: "ljiahai@hotmail.com",
        href: "mailto:ljiahai@hotmail.com",
      },
      {
        kind: "github",
        label: "GitHub",
        value: "github.com/luojiahai",
        href: "https://github.com/luojiahai",
      },
    ],
    experiences: [
      {
        role: "高级软件工程师",
        organization: "REA 集团（realestate.com.au）",
        organizationIcon: "/resume/rea.png",
        location: "澳大利亚墨尔本",
        period: "2025 - 至今",
        projects: [],
      },
      {
        role: "软件工程师",
        organization: "REA 集团（realestate.com.au）",
        organizationIcon: "/resume/rea.png",
        location: "澳大利亚墨尔本",
        period: "2024 - 2025",
        projects: [],
      },
      {
        role: "软件开发工程师",
        organization: "亚马逊云科技（AWS）",
        organizationIcon: "/resume/aws.png",
        location: "澳大利亚悉尼",
        period: "2021 - 2024",
        projects: [],
      },
      {
        role: "软件开发顾问",
        organization: "德勤",
        organizationIcon: "/resume/deloitte.png",
        location: "澳大利亚墨尔本",
        period: "2020 - 2021",
        projects: [],
      },
      {
        role: "教学助理",
        organization: "墨尔本大学",
        organizationIcon: "/resume/unimelb.png",
        location: "澳大利亚墨尔本",
        period: "2018 - 2020",
        projects: [],
      },
    ],
    skillGroups: [
      {
        label: "AI",
        items: ["Claude Code", "Codex", "LLM agent SDKs"],
      },
      {
        label: "编程语言",
        items: ["Python", "TypeScript", "Java"],
      },
      {
        label: "框架与基础设施",
        items: [
          "React",
          "Node.js",
          "GraphQL",
          "AWS",
          "PostgreSQL",
          "Kafka",
          "Docker",
        ],
      },
    ],
    education: [
      {
        school: "墨尔本大学",
        schoolIcon: "/resume/unimelb.png",
        degree: "理学硕士（计算机科学）",
        location: "澳大利亚墨尔本",
        period: "2018 - 2020",
      },
      {
        school: "墨尔本大学",
        schoolIcon: "/resume/unimelb.png",
        degree: "理学学士",
        location: "澳大利亚墨尔本",
        period: "2015 - 2018",
      },
      {
        school: "北京大学",
        schoolIcon: "/resume/pku.png",
        degree: "暑期学校国际课程",
        location: "中国北京",
        period: "2016 夏",
      },
    ],
  },
};
