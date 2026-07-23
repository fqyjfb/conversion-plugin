# 单位换算插件 (Conversion Plugin)

一款功能强大的单位换算工具，支持长度、温度、重量、体积等多种单位的实时转换。

## 功能特点

- **多功能换算**：支持长度、温度、重量、体积四大类单位转换
- **实时结果**：输入数值时即时显示转换结果
- **简洁界面**：现代、直观的设计，支持浅色/深色主题
- **单位交换**：一键交换源单位和目标单位
- **多单位支持**：每种类别提供丰富的单位选项

## 支持的单位

### 长度
- 米 (m)、千米 (km)、厘米 (cm)、毫米 (mm)
- 英尺 (ft)、英寸 (in)、码 (yd)、英里 (mi)

### 温度
- 摄氏度 (°C)、华氏度 (°F)、开尔文 (K)

### 重量
- 千克 (kg)、克 (g)、毫克 (mg)、吨 (t)
- 磅 (lb)、盎司 (oz)

### 体积
- 升 (L)、毫升 (mL)、立方米 (m³)、立方厘米 (cm³)
- 加仑 (gal)、夸脱 (qt)、品脱 (pt)

## 技术栈

- React 19.x
- TypeScript 6.x
- Vite 5.x
- Tailwind CSS 3.x (CDN)
- Lucide React 0.454.x

## 开发

```bash
# 安装依赖
npm install

# 构建插件
npm run build

# 构建产物将生成在 dist/index.js
```

## 项目结构

```
plugin-conversion/
├── src/
│   ├── index.tsx        # 入口文件
│   └── ToolPanel.tsx    # 主界面组件
├── dist/
│   └── index.js         # 构建产物
├── .github/
│   └── workflows/
│       └── release.yml  # GitHub Actions 自动构建
├── .gitignore
├── README.md
├── build.mjs            # Vite 构建配置
├── manifest.json        # 插件元数据
├── package.json
└── tsconfig.json
```

## 发布

1. 更新 `manifest.json` 和 `package.json` 中的版本号
2. 构建：`npm run build`
3. 提交代码和构建产物：`git add -A && git commit -m "release: v1.0.0"`
4. 推送：`git push origin main`
5. 创建标签：`git tag v1.0.0 && git push origin v1.0.0`

## 许可证

MIT License