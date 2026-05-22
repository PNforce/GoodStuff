# GoodStuff 網站維護 README

GoodStuff 是一個發布在 GitHub Pages 的資料驅動靜態網站。網站內容主要由 `public/content` 底下的 JSON 與 Markdown 決定；一般新增、修改文章時，不需要改 React 程式。

正式網站：

https://pnforce.github.io/GoodStuff/

GitHub repo：

https://github.com/PNforce/GoodStuff/

## 主要維護入口

- 給人類維護者：本檔案 `README.md`
- 給 AI agent：`claude_code_prompt_0517.txt`
- GA4 追蹤說明：`docs/analytics.md`
- GitHub Pages 部署說明：`docs/github-pages-deploy.md`
- 舊版操作補充：`docs/human-user-operation.md`、`docs/ai-agent-operation.md`

`claude_code_prompt_0517.txt` 是給 Claude Code / Codex / 其他 AI agent 的工作規格。當你要請 AI agent 新增文章、批次整理內容、檢查 GA4 追蹤、更新 sitemap 或部署時，可以先把該檔案內容提供給 agent，讓它遵守 GoodStuff 的資料結構、寫作規則與安全檢查流程。

## 網站資料結構

```text
public/content/
  site.json
  catalog.json
  books/
    product-comparisons/
      book.json
      chapters/*.md
    shops-introduce/
      book.json
      chapters/*.md
    profuct-introduce/
      book.json
      chapters/*.md
```

重要規則：

- `catalog.json` 控制首頁分類、內容集順序與 `book.json` 路徑。
- 每個 `book.json` 控制該內容集標題、摘要、封面、章節清單、slug、排序與是否發布。
- 每篇文章內容放在 `chapters/*.md`。
- 新增章節時，要同時新增 Markdown 檔案並更新該內容集的 `book.json`。
- 只有新增、移除、改名、改分類內容集時，才需要改 `catalog.json`。
- `src/data/siteData.ts` 是舊 fallback/reference，不是主要公開內容來源。

## 目前三個主要內容集

| 內容集 | 路由 | 文章數 | 用途 |
| --- | --- | ---: | --- |
| `product-comparisons` | `/articles/product-comparisons` | 20 | 兩款商品比較、情境選擇、優缺點與購買參考 |
| `shops-introduce` | `/articles/shops-introduce` | 18 | 店鋪或多商品整理、推薦族群與商品介紹 |
| `profuct-introduce` | `/articles/profuct-introduce` | 82 | 單件商品介紹、目標客戶、推薦理由與評價觀察 |

注意：`profuct-introduce` 是目前網站既有公開 slug，雖然拼字不是 `product`，但不要任意改名，否則會破壞既有 URL、sitemap 與搜尋索引。

## 內文撰寫規範

### 1. Product Comparisons：產品比較文章

位置：

```text
public/content/books/product-comparisons/chapters/
```

目的：比較兩款商品，回答「誰適合哪一款」、「差異在哪裡」、「什麼情境該選 A 或 B」。

建議結構：

```markdown
# A vs B：主題與情境怎麼選

## 插圖圖片
## 購買參考
## 適合誰看這篇
## 兩款商品快速比較
## 產品重點
### [商品 A](https://s.shopee.tw/...) 重點
### [商品 B](https://s.shopee.tw/...) 重點
## 真實評測與網友意見整理
## 怎麼選
## 購買參考
## 資料來源與查核
```

寫作要求：

- 必須是兩款商品的比較，不要寫成單品介紹。
- `## 購買參考` 要放在上方，且底部可再放一次。
- `## 兩款商品快速比較` 必須使用 GitHub Flavored Markdown 表格。
- `## 產品重點` 底下的商品標題要連到對應 Shopee 短連結。
- `## 怎麼選` 要用情境判斷，例如坪數、預算、噪音、維護、保固、用途，而不是只寫規格。
- 每篇目前有 2 張自製 SVG 插圖，放在 `public/images/product-comparisons/`。
- 產品比較 SVG 維持 1400 寬畫布與拉開的左右方案間距，不要退回窄版。
- 不要編造評價留言；若無法查核留言，寫「評價觀察重點」與可核對訊號。

### 2. Shops Introduce：店鋪介紹 / 多商品整理文章

位置：

```text
public/content/books/shops-introduce/chapters/
```

目的：整理一個店鋪、主題商品群或內容型文章，幫讀者理解店鋪特色、商品組合、適合客群與推薦方向。

常見結構：

```markdown
# 店鋪或主題名稱 產品比較指南 / 深度推薦評析

## 商品圖片
## 前言
## 商品介紹 或 ## 內容介紹
### 1. [商品或內容項目](https://s.shopee.tw/...)
## 比較概況
## 推薦建議
### 針對不同顧客群體的專業推薦
## 如何購買 或 ## 閱讀小撇步
## 免責聲明
```

寫作要求：

- 文章主體是店鋪或多商品整理，不要改寫成單一商品頁。
- 可介紹多個商品，但每個商品要有清楚差異與適合族群。
- 若原始資料有可靠 Shopee 短連結，商品標題應加連結。
- 沒有可靠 URL 時不要自行補假連結。
- 不要出現 `OpenClaw`、`openclaw` 或內部生成痕跡。
- 內文要回答「這家店 / 這組商品適合誰」、「為什麼適合」、「該注意什麼」。
- 若有圖片，使用公開商品圖 URL 或站內公開圖片；不要提交私有圖片或帶權限的 URL。

### 3. Profuct Introduce：單件商品介紹文章

位置：

```text
public/content/books/profuct-introduce/chapters/
```

目的：針對單一商品做產品理解、目標客戶推薦、推薦理由、限制與評價觀察。

建議結構：

```markdown
# 商品名稱：情境與定位推薦分析

## 適合誰看這篇
## 商品圖片
## 商品介紹
## 推薦給哪些人 / 目標族群與理由
## 可能不適合的情境
## 評價留言應觀察什麼
## 產品定位摘要
## 相關連結
## 查核筆記
```

寫作要求：

- 必須聚焦單件商品，不要寫成店鋪總覽。
- `## 商品介紹` 至少 400 字，建議 500 到 700 字。
- 不要每篇套同一個模板；段落、措辭、推薦理由要依商品類型變化。
- 不是教讀者「如何採購」，而是理解產品後推薦適合的目標客戶並說明理由。
- `## 適合誰看這篇` 要包含商品定位、店鋪、價格、銷量等可公開查核資訊。
- `## 商品介紹` 要根據商品頁標題、公開價格、銷售量、圖片、商品類型與可查核資訊撰寫。
- 留言或評價不可編造逐字內容；若平台驗證導致無法讀取，改寫成該類商品應觀察的留言訊號。
- 必須包含商品圖片。
- 必須包含 Shopee affiliate 短連結；若保留原始商品頁，也要標示清楚。

## 新增文章流程

1. 選擇內容集：`product-comparisons`、`shops-introduce` 或 `profuct-introduce`。
2. 在該內容集的 `chapters/` 新增 Markdown。
3. 檔名使用三位數排序，例如 `083-profuct-083.md`。
4. 在同一內容集的 `book.json` 新增 chapter：

```json
{
  "slug": "profuct-083",
  "title": "文章標題",
  "summary": "文章摘要",
  "md": "/content/books/profuct-introduce/chapters/083-profuct-083.md",
  "order": 830,
  "published": true
}
```

5. 更新 `book.json` 的 `updatedAt`。
6. 如有新增內容集，再更新 `catalog.json`。
7. 執行 build 檢查。
8. commit 並 push 到 `main`，GitHub Actions 會部署 GitHub Pages。

## 本機檢查與部署

安裝依賴只需要在第一次或 `package.json` 改變時執行：

```powershell
npm.cmd install
```

本機 build：

```powershell
$env:VITE_BASE_PATH='/GoodStuff/'
$env:VITE_SITE_URL='https://PNforce.github.io/GoodStuff/'
npm.cmd run build
```

推送部署：

```powershell
git status
git add public/content README.md claude_code_prompt_0517.txt docs
git commit -m "Update GoodStuff content docs"
git push origin main
```

推送後到 GitHub Actions 確認 `Deploy GoodStuff Static Site` 成功：

https://github.com/PNforce/GoodStuff/actions

## GA4 功能追蹤

目前 GA4 Measurement ID：

```text
G-49G5GBLQRP
```

追蹤實作位置：

- Google tag：`index.html`
- 追蹤邏輯：`src/lib/analytics.ts`
- page meta 與 pageview：`src/lib/seo.ts`
- Shopee 點擊事件：`components/ArticlePage.tsx`

目前事件：

| 事件 | 觸發時機 | 用途 |
| --- | --- | --- |
| `page_view` | SPA 路由載入並更新頁面 metadata | 追蹤首頁、分類頁、文章頁瀏覽 |
| `affiliate_click` | 使用者點擊文章內 `s.shopee.*` 連結 | 追蹤 Shopee affiliate 點擊 |

`affiliate_click` 目前會送出：

- `affiliate_network`
- `link_domain`
- `link_url`
- `link_text`
- `page_path`
- `book_slug`
- `book_title`
- `chapter_slug`
- `chapter_title`

GA4 後台建議：

- 把 `affiliate_click` 標記成 Key event。
- 建立事件範圍 custom dimensions：`book_slug`、`chapter_slug`、`chapter_title`、`link_text`、`link_url`。
- 成效分析使用：

```text
全站 Shopee CTR = affiliate_click / page_view
單頁 CTR = 該頁 affiliate_click / 該頁 page_view
分類 CTR = 該分類 affiliate_click / 該分類 page_view
```

如果要改善 CTR，優先檢查：

- 每篇商品頁第一屏是否有明顯 CTA。
- 商品圖片是否可點擊。
- 中段是否有第二個 CTA。
- 底部連結是否太晚出現。
- GA4 是否能分辨 CTA 位置，例如 `top_button`、`image`、`middle_button`、`bottom_link`。

## 資安與公開內容檢查

推送前請檢查：

```powershell
rg -n -i "(api[_-]?key|secret|token|password|passwd|private key|BEGIN [A-Z ]*PRIVATE KEY|credential|access[_-]?key|client_secret|authorization:|bearer )" -g "!node_modules/**" -g "!dist/**" -g "!.git/**"
git diff --check
```

不要提交：

- `.env`
- API key
- token
- password
- 私鑰
- 帳密 URL
- 內部後台截圖
- 未確認授權的私有資料

## 維護原則

- 公開頁面只放可公開資料。
- 價格、銷量、庫存、規格會變動，文章要標示以商品頁最新資訊為準。
- 不要編造商品留言、評價、銷量或優惠。
- 不要破壞既有 slug，除非已同步處理 redirect、sitemap 與內部連結。
- 內容更新後必須 build，讓 `sitemap.xml` 與靜態 fallback 一起更新。
