# 方言外语聊天助手（dialect-taro）

方言 ↔ 外语的聊天翻译工具。[Taro](https://taro-docs.jd.com/) 4 + React 18 编写，
以微信小程序为主目标，同一份代码也能出 H5。

## 功能

- **方言查询**：会话区与实时翻译区并排，支持语音输入与会话历史侧栏
- **学习区**：方言课程（章节 / 课时）与情景对话练习
- **记录本**：知识点 / 收藏 / 资源三类标签
- **我的**：资料、设置、关注、消息中心、帮助与关于

## 开发

```sh
npm i
npm run dev:weapp    # 用微信开发者工具导入 dist/
npm run dev:h5       # 默认 http://127.0.0.1:10086
npm run build:weapp  # 生产构建
```

H5 也必须走 `npm run dev:h5`。Taro 的入口由 `src/app.config.ts` 生成，
直接跑 `vite` 会去加载根目录 `index.html` 里已经不存在的旧 Web 入口，页面白屏。

## 响应式区间

H5 端支持的视口宽度是 **320–1280px**，区间内不出现挤压和横向溢出：

- `< 360`：标题栏降到 ultra 档（字号与间距再收一档），避免头像、中间标签、记录本三块互相压线
- `< 320`：放开横向滚动兜底
- `> 1280`：`#app` 定宽 1280 并居中

分档判据在 [src/utils/deviceTier.ts](src/utils/deviceTier.ts)，边界样式在
[src/styles/index.css](src/styles/index.css)。边界用的是真实像素，因此在
[config/index.ts](config/index.ts) 的 `pxtransform.selectorBlackList` 里排除了
`html` / `body` / `#app`，否则会被 750 设计稿折半（1280 变 640）。

## 后端凭据

Supabase 的 URL 与 anon key 不进源码：[src/utils/supabase/info.ts](src/utils/supabase/info.ts)
只留空占位，需要联调时自行填入；取不到凭据的页面走空态。
`supabase/functions/server/` 里的 service role key 走 `Deno.env` 读取。

## 目录说明

- `src/`：当前 Taro 版
- `src/app/`：Figma Make 导出的 Web 原型，仅作移植对照源，不参与构建
- `utils/`、`supabase/`：原型自带的客户端凭据模块与 Edge Function

## 许可

MIT，见 [LICENSE](LICENSE)。组件源自 [shadcn/ui](https://ui.shadcn.com/)（MIT），
图片来自 [Unsplash](https://unsplash.com)，详见 [ATTRIBUTIONS.md](ATTRIBUTIONS.md)。
