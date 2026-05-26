# EasyShell Docs 部署教程

本文档介绍如何构建和部署 EasyShell 文档站点（基于 [Astro Starlight](https://starlight.astro.build/)）。

---

## 环境要求

| 工具 | 版本要求 |
|------|---------|
| Node.js | 18.0 或更高 |
| pnpm | 10.x（推荐） |

验证安装：

```bash
node --version
pnpm --version
```

---

## 本地开发

### 1. 克隆仓库

```bash
git clone https://github.com/easyshell-ai/easyshell-docs.git
cd easyshell-docs
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 启动开发服务器

```bash
pnpm dev
```

访问 `http://localhost:4321` 查看文档站点，修改文件后页面会自动热更新。

---

## 构建静态文件

```bash
pnpm build
```

构建产物输出到 `dist/` 目录，包含完整的静态 HTML/CSS/JS 文件，可直接部署到任意静态托管服务。

本地预览构建结果：

```bash
pnpm preview
```

---

## 部署方式

### 方式一：Nginx 静态托管

1. 构建静态文件：

   ```bash
   pnpm build
   ```

2. 将 `dist/` 目录内容上传到服务器，例如 `/var/www/easyshell-docs/`。

3. 配置 Nginx：

   ```nginx
   server {
       listen 80;
       server_name docs.easyshell.ai;
       root /var/www/easyshell-docs;
       index index.html;

       location / {
           try_files $uri $uri/ $uri.html /404.html;
       }
   }
   ```

4. 若需 HTTPS，使用 Certbot 申请证书：

   ```bash
   certbot --nginx -d docs.easyshell.ai
   ```

---

### 方式二：Docker 容器部署

使用以下 `Dockerfile` 打包为 Nginx 容器：

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

构建并运行：

```bash
docker build -t easyshell-docs .
docker run -d -p 80:80 --name easyshell-docs easyshell-docs
```

---

### 方式三：Vercel / Netlify 一键部署

**Vercel：**

```bash
npm install -g vercel
vercel --prod
```

**Netlify：**

在 Netlify Dashboard 中导入仓库，设置以下构建参数：

| 参数 | 值 |
|------|-----|
| Build command | `pnpm build` |
| Publish directory | `dist` |
| Node version | `20` |

---

### 方式四：GitHub Pages

在仓库中添加 `.github/workflows/deploy.yml`：

```yaml
name: Deploy Docs

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: actions/deploy-pages@v4
        with:
          artifact_name: github-pages
```

在仓库 **Settings → Pages** 中将 Source 设置为 **GitHub Actions**。

---

## 配置说明

站点配置文件为 `astro.config.mjs`，主要参数：

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `site` | 站点的完整 URL，用于生成 Sitemap | `https://docs.easyshell.ai` |
| `locales` | 多语言配置，当前支持英文（默认）和简体中文 | — |
| `sidebar` | 侧边栏导航结构 | — |

修改 `site` 字段以匹配实际部署域名：

```js
// astro.config.mjs
export default defineConfig({
  site: "https://your-domain.com",
  // ...
});
```

---

## 目录结构

```
easyshell-docs/
├── src/
│   ├── content/
│   │   └── docs/          # 文档内容（.mdx 文件）
│   │       ├── zh-cn/     # 简体中文文档
│   │       └── ...        # 英文文档（默认）
│   ├── assets/            # 静态资源（Logo 等）
│   └── styles/            # 自定义 CSS
├── public/                # 公共静态文件
├── astro.config.mjs       # Astro 配置
└── package.json
```

新增文档页面只需在 `src/content/docs/` 对应目录下创建 `.mdx` 文件，并在 `astro.config.mjs` 的 `sidebar` 中注册即可。
