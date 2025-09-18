# 🚀 個人履歷網站 - Notion CMS

使用 Next.js、TypeScript、TailwindCSS 和 Notion 作為 CMS 的現代化個人履歷網站。

## ✨ 特色

- 🎨 **現代化設計** - 響應式設計，完美支援桌面和行動裝置
- ⚡ **高效能** - Next.js App Router + SSG，載入速度極快
- 🔧 **易於維護** - 模組化組件設計，程式碼簡潔清晰
- 📝 **內容管理** - 使用 Notion 作為 CMS，非技術人員也能輕鬆更新
- 🔒 **型別安全** - 完整的 TypeScript 支援
- 🎯 **SEO 友善** - 內建 SEO 最佳化

## 🛠️ 技術棧

- **框架：** Next.js 14 (App Router)
- **語言：** TypeScript
- **樣式：** TailwindCSS
- **UI 組件：** Headless UI + Heroicons
- **CMS：** Notion Database
- **部署：** Vercel (推薦)

## 📁 專案結構

```
notion-resume-website/
├── 📁 app/                        # Next.js App Router
│   ├── layout.tsx                 # 根佈局
│   ├── page.tsx                   # 首頁
│   ├── globals.css                # 全域樣式
│   └── api/                       # API 路由
│       └── resume/
│           └── route.ts           # 履歷資料 API
│
├── 📁 components/                 # React 組件
│   ├── Header.tsx                 # 頁首組件（個人資訊）
│   ├── ExperienceSection.tsx      # 工作經驗區塊
│   ├── EducationSection.tsx       # 教育背景區塊
│   ├── ProjectsSection.tsx        # 專案作品區塊
│   └── SkillsSection.tsx         # 技能區塊
│
├── 📁 lib/                       # 工具函式和服務
│   └── notion.ts                 # Notion API 整合服務
│
├── 📁 types/                     # TypeScript 型別定義
│   └── notion.ts                 # Notion 資料型別
│
├── 📁 styles/                    # 樣式檔案
│   └── globals.css               # 全域樣式
│
├── 📁 public/                    # 靜態資源
│   └── favicon.ico               # 網站圖示
│
├── 📄 .env.local                 # 環境變數（機敏資料）
├── 📄 .env.example               # 環境變數範例
├── 📄 next.config.js             # Next.js 設定
├── 📄 tailwind.config.js         # TailwindCSS 設定
├── 📄 tsconfig.json              # TypeScript 設定
└── 📄 package.json               # 專案依賴和腳本
```

## 🚀 快速開始

### 1. 安裝專案

```bash
# 創建 Next.js 專案
npx create-next-app@latest notion-resume-website --typescript --tailwind --eslint

# 進入專案目錄
cd notion-resume-website

# 安裝額外依賴
npm install @notionhq/client @headlessui/react @heroicons/react
```

### 2. 設置 Notion Integration

1. 前往 [Notion Developers](https://developers.notion.com/)
2. 點擊 **"My integrations"**
3. 點擊 **"+ New integration"**
4. 填寫 Integration 名稱（例如：Resume Website）
5. 選擇工作區間
6. 點擊 **"Submit"** 創建
7. 複製 **"Internal Integration Token"**

### 3. 創建 Notion 資料庫

在 Notion 中創建新資料庫，包含以下屬性：

| 屬性名稱 | 類型 | 說明 |
|----------|------|------|
| **Name** | Title | 標題/名稱 |
| **Type** | Select | 資料類型 |
| **Title** | Rich Text | 職稱 |
| **Company** | Rich Text | 公司名稱 |
| **Position** | Rich Text | 職位 |
| **StartDate** | Date | 開始日期 |
| **EndDate** | Date | 結束日期 |
| **Current** | Checkbox | 是否為目前職位 |
| **Description** | Rich Text | 描述 |
| **Technologies** | Multi-select | 技術標籤 |
| **Category** | Select | 技能分類 |
| **Level** | Select | 技能等級 |
| **Email** | Email | 電子郵件 |
| **Phone** | Phone | 電話 |
| **Location** | Rich Text | 地點 |
| **Summary** | Rich Text | 個人簡介 |
| **GitHubURL** | URL | GitHub 連結 |
| **LiveURL** | URL | 即時預覽連結 |
| **LinkedIn** | URL | LinkedIn 連結 |
| **Website** | URL | 個人網站 |
| **Avatar** | Files | 頭像 |
| **Image** | Files | 專案圖片 |
| **School** | Rich Text | 學校名稱 |
| **Degree** | Rich Text | 學位 |
| **Field** | Rich Text | 主修領域 |
| **GPA** | Rich Text | 學業成績 |

#### 必要的 Select 選項設定：

**Type 欄位選項：**
- `Personal Info`
- `Experience`
- `Education`
- `Project`
- `Skill`

**Level 欄位選項（技能等級）：**
- `Beginner`
- `Intermediate`
- `Advanced`
- `Expert`

**Category 欄位選項（技能分類）：**
- `前端技術`
- `後端技術`
- `程式語言`
- `工具軟體`

### 4. 設置資料庫權限

1. 在 Notion 資料庫頁面，點擊右上角的 **"..."** 選單
2. 選擇 **"Add connections"**
3. 搜尋並選擇你剛創建的 Integration
4. 複製資料庫 URL 中的 Database ID

**獲取 Database ID：**
```
URL 格式：https://notion.so/xxxxxxxxxxxxxxxx?v=xxxxxxxxx
Database ID：問號前的 xxxxxxxxxxxxxxxx 部分
```

### 5. 設置環境變數

創建 `.env.local` 檔案：

```bash
NOTION_TOKEN=secret_xxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxx
```

### 6. 啟動開發伺服器

```bash
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000) 查看結果。

## 📝 Notion 測試資料添加指南
開啟 [http://localhost:3000/debug](http://localhost:3000/debug) 查看結果。

### 個人資訊資料
```
Name: 張小明
Type: Personal Info
Title: 全端工程師
Email: zhang.xiaoming@gmail.com
Phone: +886 912345678
Location: 台北市, 台灣
Summary: 熱愛程式開發的全端工程師，擅長 React、Node.js 和雲端部署。致力於建立高品質、易維護的軟體解決方案。
LinkedIn: https://linkedin.com/in/zhang-xiaoming
GitHub: https://github.com/zhang-xiaoming
Website: https://zhang-xiaoming.dev
```

### 工作經驗資料
```
Name: 前端工程師
Type: Experience
Company: ABC 科技公司
Position: 前端工程師
StartDate: 2023-01-01
EndDate: 留空（如果是目前職位）
Current: ☑️ 勾選（如果是目前職位）
Description: 負責開發響應式網頁應用程式，使用 React 和 TypeScript 建立用戶界面
Technologies: React, TypeScript, Next.js
```

### 教育背景資料
```
Name: 資訊工程學士
Type: Education
School: 國立台灣大學
Degree: 學士
Field: 資訊工程學系
StartDate: 2019-09-01
EndDate: 2023-06-30
GPA: 3.8/4.0
```

### 專案作品資料
```
Name: 電商網站
Type: Project
Description: 使用 Next.js 開發的現代化電商平台，包含購物車和付款功能
Technologies: Next.js, TailwindCSS, Stripe
GitHubURL: https://github.com/yourusername/ecommerce
LiveURL: https://your-ecommerce.vercel.app
```

### 技能資料
```
Name: React
Type: Skill
Category: 前端技術
Level: Advanced

Name: TypeScript  
Type: Skill
Category: 程式語言
Level: Intermediate

Name: Node.js
Type: Skill
Category: 後端技術
Level: Intermediate
```

## 🧪 測試流程

### 步驟 1：基本連接測試
```bash
# 啟動開發伺服器
npm run dev

# 檢查 Console 訊息
# ✅ 應該看到：履歷資料獲取完成
# ⚠️ 警告訊息是正常的（空欄位）
```

### 步驟 2：創建調試頁面（可選）
創建 `app/debug/page.tsx` 進行詳細調試

### 步驟 3：測試頁面順序
1. **調試頁面：** `http://localhost:3000/debug` - 檢查連接狀態
2. **主頁面：** `http://localhost:3000` - 檢查完整功能

### 步驟 4：驗證內容顯示
- ✅ 個人資訊區塊有內容
- ✅ 工作經驗區塊有內容
- ✅ 教育背景區塊有內容
- ✅ 專案作品區塊有內容
- ✅ 技能區塊有內容

## 🔧 常見問題

### ❌ 連接失敗
**錯誤：** `401 Unauthorized`
**解決：** 檢查 `NOTION_TOKEN` 是否正確

**錯誤：** `404 Not Found`
**解決：** 檢查 `NOTION_DATABASE_ID` 是否正確

### ❌ 資料不顯示
**問題：** 頁面載入但內容空白
**解決：** 
1. 檢查 Notion 資料庫中是否有資料
2. 確認 `Type` 欄位設定正確
3. 驗證 Integration 權限

### ❌ 屬性錯誤
**錯誤：** `Property is undefined`
**解決：** 檢查資料庫屬性名稱和類型是否與程式碼一致

### ❌ 圖片無法顯示
**解決：** 確認 `next.config.js` 中包含 Notion 圖片域名：

```javascript
module.exports = {
  images: {
    domains: [
      'notion.so', 
      's3.us-west-2.amazonaws.com',
      'prod-files-secure.s3.us-west-2.amazonaws.com'
    ],
  },
}
```

## 🚀 部署

### Vercel 部署（推薦）

1. 推送程式碼到 GitHub
2. 在 [Vercel](https://vercel.com) 中導入專案
3. 設置環境變數：
   - `NOTION_TOKEN`
   - `NOTION_DATABASE_ID`
4. 部署完成！

### 其他平台
- **Netlify：** 支援，需要設置環境變數
- **Railway：** 支援，需要設置環境變數
- **自託管：** 使用 `npm run build && npm start`

## 📚 進階功能

### 自動重新驗證
專案使用 ISR (Incremental Static Regeneration)，每小時自動更新內容：

```typescript
export const revalidate = 3600 // 秒
```

### 自訂樣式
修改 `tailwind.config.js` 或組件中的 TailwindCSS 類別來客製化外觀。

### 添加新欄位
1. 在 Notion 資料庫中添加新屬性
2. 更新 `types/notion.ts` 中的型別定義
3. 修改 `lib/notion.ts` 中的資料解析邏輯
4. 更新相關組件顯示新欄位

---