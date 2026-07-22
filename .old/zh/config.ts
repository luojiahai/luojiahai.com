import { defineConfig, type DefaultTheme } from "vitepress";

export const config = defineConfig({
  lang: "zh-Hans",
  themeConfig: {
    nav: nav(),
    editLink: {
      pattern: "https://github.com/luojiahai/luojiahai.github.io/edit/main/:path",
      text: "在 GitHub 上编辑此页面",
    },
    footer: {
      copyright: `© ${new Date().getFullYear()} LUOJIAHAI`,
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    outline: {
      label: "页面导航",
    },
    lastUpdated: {
      text: "最后更新于",
    },
    notFound: {
      title: "页面未找到",
      quote: "但如果你不改变方向，并且继续寻找，你可能最终会到达你所前往的地方。",
      linkLabel: "前往首页",
      linkText: "带我回首页",
    },
    langMenuLabel: "多语言",
    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "菜单",
    darkModeSwitchLabel: "主题",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",
    skipToContentLabel: "跳转到内容",
  },
});

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: "首页", link: "/zh/" },
    // { text: "博客", activeMatch: "/zh/blog/", link: "/zh/blog/" },
    { text: "使用", link: "/zh/use" },
    { text: "简历", link: "/zh/resume" },
  ];
}

export function searchOptions(): DefaultTheme.LocalSearchOptions {
  return {
    translations: {
      button: {
        buttonText: "搜索",
        buttonAriaLabel: "搜索",
      },
      modal: {
        displayDetails: "显示详细列表",
        resetButtonTitle: "重置搜索",
        backButtonTitle: "关闭搜索",
        noResultsText: "没有结果",
        footer: {
          selectText: "选择",
          selectKeyAriaLabel: "输入",
          navigateText: "导航",
          navigateUpKeyAriaLabel: "上箭头",
          navigateDownKeyAriaLabel: "下箭头",
          closeText: "关闭",
          closeKeyAriaLabel: "Esc",
        },
      },
    },
  };
}
