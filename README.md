# Rustless

围绕 AST 建树与语义分析的本地阅读网站。

## GitHub Pages

这个仓库通过 GitHub Actions 发布到 https://wyehnf.github.io/rustless_note/ 。推送到 `main` 后，`.github/workflows/pages.yml` 会安装依赖，生成静态页面并发布 `dist/pages`。

```sh
npm ci
npm run build:pages
npm run check:content
npm run check:pages
```

`build:pages` 先静态生成全部文章和章节，再把站内链接改为带 `/rustless_note/` 的 GitHub Pages 地址。输出保留所有旧文章地址的跳转页。正文页面只需要 HTML 与 CSS；两张架构图保留各自的交互脚本。

首次发布时，在仓库的 Settings → Pages 中把 Build and deployment 的 Source 设为 GitHub Actions。之后可以在 Actions 中查看每次发布的结果。

## 目录与正文

- 一、Frontend：开篇依据 `../ast.txt` 整理，下接 1–4 组问题。
- 二、Semantic：开篇只取 `../semantic.txt` 中 Pass1 之前的说明，下接第 5 组基础概念。
  - Pass1：Semantic 下的次一级章节，对应 6–8 组问题。
  - Pass2：Semantic 下的次一级章节，对应 9–16 组问题。
- 扩展与附录：17–18 组问题。

开篇保存在 `content/parts/`，细读文章保存在 `content/articles/`。已有 61 篇细读文章（18 篇 Overview、43 篇具体讨论），覆盖 217 个原提纲细点。原有 254 个代码块保留，新增的开篇例子另外保存。标题围绕讨论的问题命名，不加“总览”后缀。

`parent: "semantic"` 指定 Pass1、Pass2 的父章节。`lib/parts.ts` 根据这个关系构造目录和阅读顺序。文章从旧组跨入新阶段时，先进入该阶段的开篇。

## 本地使用

```sh
npm run dev
```

本地地址为 http://localhost:5173/ 。开发进程需保持运行。开发时同时监听文章、导读与指南三类 Markdown；保存后生成 `lib/posts.json` 、`lib/parts.json` 与 `lib/guides.json`。

```sh
npm run content
npm run check:content
npx tsc --noEmit
npm run build
```

文章以 JSON frontmatter 保存标题等信息。单独成段的加粗句子显示为重点说明。源程序示例放在带语言名称的代码块内，短名称或表达式用行内代码。代码块按原文显示，不执行。

## 链接与架构图

- `/series`：完整目录。
- `/series/frontend`、`/series/semantic`：两章开篇。
- `/series/pass1`、`/series/pass2`：Semantic 下的两阶段开篇。
- `/posts/1.0` 等：细读文章；旧连字符链接继续跳转。
- `/atlas/frontend.html`、`/atlas/semantic.html`：原有两张完整交互图。

架构图及首页缩略图复制自 `E:/RComplier/visualizations`，原文件保持不变。网页正文使用独立的教学例子。

原始笔记、对话与整理稿保留在 tutorial 中；详细文章对应见 `../网页文章对照.md`。不要重跑 `.整理工作` 下的历史整理脚本覆盖人工编辑的正文。

## 阅读指南与显示编号

`content/guides/getting-started.md` 保存阅读指南正文，`/getting-started` 按现有目录自动列出全部导读和 Overview 链接。

Overview 使用原有内部编号和 URL，以保留旧链接；页面上统一显示为 Overview。正文分节继续从 x.1 编号。`postLabel` 统一管理显示名称。标题使用名词性短语，description 用一句简短陈述说明讨论对象及其行为。
