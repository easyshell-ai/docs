// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://docs.easyshell.ai",
  integrations: [
    starlight({
      title: "EasyShell",
      defaultLocale: "root",
      locales: {
        root: {
          label: "English",
          lang: "en",
        },
        "zh-cn": {
          label: "简体中文",
          lang: "zh-CN",
        },
      },
      logo: {
        light: "./src/assets/logo-light.svg",
        dark: "./src/assets/logo-dark.svg",
        replacesTitle: true,
      },
      social: [
        { icon: "github", label: "GitHub", href: "https://github.com/easyshell-ai/easyshell" },
      ],
      editLink: {
        baseUrl: "https://github.com/easyshell-ai/easyshell-docs/edit/main/",
      },
      lastUpdated: true,
      expressiveCode: {
        themes: ["github-light", "github-dark"],
      },
      sidebar: [
        {
          label: "Getting Started",
          translations: { "zh-CN": "快速开始" },
          items: [
            "getting-started/introduction",
            "getting-started/quick-start",
            "getting-started/concepts",
          ],
        },
        {
          label: "Installation",
          translations: { "zh-CN": "安装部署" },
          items: [
            "installation/docker",
            "installation/manual",
            "installation/production",
            "installation/agent",
          ],
        },
        {
          label: "Guides",
          translations: { "zh-CN": "使用指南" },
          items: [
            "guides/host-management",
            "guides/script-execution",
            "guides/ai-assistant",
            "guides/cluster",
            "guides/web-terminal",
          ],
        },
        {
          label: "API Reference",
          translations: { "zh-CN": "API 参考" },
          items: [
            "api-reference/server-api",
            "api-reference/agent-protocol",
          ],
        },
        {
          label: "Configuration",
          translations: { "zh-CN": "配置" },
          items: [
            "configuration/server-config",
            "configuration/ai-config",
            "configuration/bot-channels",
            "configuration/security",
          ],
        },
        {
          label: "Contributing",
          translations: { "zh-CN": "参与贡献" },
          items: [
            "contributing/development",
            "contributing/guidelines",
          ],
        },
        "changelog",
        "faq",
      ],
      customCss: ["./src/styles/custom.css"],
    }),
  ],
  vite: {
    server: {
      allowedHosts: ["docs.easyshell.ai"],
    },
  },
});
