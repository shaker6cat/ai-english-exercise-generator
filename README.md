# AI English Exercise Generator

一个基于AI的英语练习生成器，使用Google Gemini API生成个性化的英语学习内容。

## 功能特点

- 🤖 AI驱动的英语练习生成
- 📝 多种练习类型（词汇、语法、阅读理解等）
- 🎯 个性化难度调整
- 💫 现代化的React界面
- ⚡ 快速响应的Vite构建

## 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite
- **AI服务**: Google Gemini API
- **样式**: 现代化CSS设计

## 快速开始

### 环境要求

- Node.js (推荐 v18+)
- npm 或 yarn
- Google Gemini API密钥

### 安装步骤

1. 克隆项目
```bash
git clone https://github.com/your-username/ai-english-exercise-generator.git
cd ai-english-exercise-generator
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
复制 `.env.example` 文件为 `.env.local`，并添加你的Gemini API密钥：
```
GEMINI_API_KEY=your_api_key_here
```

4. 启动开发服务器
```bash
npm run dev
```

5. 构建生产版本
```bash
npm run build
```

## 项目结构

```
ai-english-exercise-generator/
├── components/          # React组件
│   ├── ExerciseDisplay.tsx
│   ├── Header.tsx
│   ├── InputForm.tsx
│   ├── Loader.tsx
│   └── Welcome.tsx
├── services/           # API服务
│   └── geminiService.ts
├── types.ts           # TypeScript类型定义
├── constants.ts       # 常量配置
├── App.tsx           # 主应用组件
├── index.tsx         # 应用入口
└── vite.config.ts    # Vite配置
```

## API配置

本项目使用Google Gemini API生成英语练习内容。你需要：

1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 创建API密钥
3. 在 `.env.local` 文件中配置密钥

## 开发说明

- 使用TypeScript进行类型安全的开发
- 组件化架构，易于维护和扩展
- 现代化的React Hooks模式
- 响应式设计，支持移动端

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 许可证

MIT License

## 部署

项目已配置Vite构建工具，可以轻松部署到各种静态网站托管服务：

- Vercel
- Netlify
- GitHub Pages
- 其他静态托管服务

运行 `npm run build` 生成生产构建文件，然后部署 `dist` 目录即可。