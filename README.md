# react-admin

## 第一步: 使用 vite 创建项目

```shell
pnpm create vite my-vue-app --template react-ts
```

## 第二步: 安装 tailwindcss

```shell
pnpm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 第三步: 配置 index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 第四步: 配置 tailwind.config.js

```js
content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

```

## 第五步: 编辑 tsconfig.json

```json
"compilerOptions": {
  "baseUrl": ".",
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

## 第六步: 编辑 tsconfig.app.json

```json
"baseUrl": ".",
"paths": {
  "@/*": [
    "./src/*"
  ]
}
```

## 第七步: 配置路径别名

- 1.先安装 @types/node 依赖

```shell
pnpm install -D @types/node
```

- 2.编辑 vite.config.ts

```ts
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

## 第八步: 安装 shadcn-ui 组件库

```shell
npx shadcn@latest init
```

- 1. 安装组件

```shell
npx shadcn@latest add button
```
