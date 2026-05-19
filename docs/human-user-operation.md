# 人類使用者操作文件

`GoodStuff` 現在是資料驅動靜態網站。一般更新內容時，只需要改 `public/content` 底下的 JSON 與 Markdown，不需要改 React 程式碼。

最終發布 repo：

```text
M:\#github_others\GoodStuff
```

## 內容放哪裡

主要資料結構：

```text
public/content/
  site.json
  catalog.json
  books/
    affiliate-product-comparisons/
      book.json
      chapters/*.md
    openclaw-generated-content/
      book.json
      chapters/*.md
```

- `site.json`：首頁標題、搜尋提示、全站文字。
- `catalog.json`：分類、書本清單、排序、每本書的 `book.json` 路徑。
- `books/{bookSlug}/book.json`：單一本書的標題、摘要、章節清單、聯盟連結。
- `books/{bookSlug}/chapters/*.md`：實際文章內容。

## OpenClaw 內容

OpenClaw 來源資料仍保留在：

```text
projects/CRM/generated_content
```

已發布到網站上的版本放在：

```text
public/content/books/openclaw-generated-content/
```

這批內容在首頁會獨立顯示為 `OpenClaw 選品內容` 分類。若未來 `projects/CRM/generated_content` 新增 Markdown，需要再複製或轉換到 `public/content/books/openclaw-generated-content/chapters/`，並更新 `book.json` 的 `chapters` 清單。

## 新增一本書

1. 建立資料夾：

```text
public/content/books/my-new-book/
public/content/books/my-new-book/chapters/
```

2. 建立 `book.json` 與章節 Markdown：

```text
public/content/books/my-new-book/book.json
public/content/books/my-new-book/chapters/001-intro.md
```

3. 在 `public/content/catalog.json` 的 `books` 加入：

```json
{
  "slug": "my-new-book",
  "title": "My New Book",
  "category": "shopping",
  "summary": "這本書的簡短介紹。",
  "cover": "",
  "bookJson": "/content/books/my-new-book/book.json",
  "published": true,
  "order": 40,
  "updatedAt": "2026-05-18"
}
```

## 新增一篇文章

1. 新增 Markdown：

```text
public/content/books/my-new-book/chapters/002-next.md
```

2. 在該書的 `book.json` 加入章節：

```json
{
  "slug": "next",
  "title": "下一篇文章",
  "summary": "文章摘要。",
  "md": "/content/books/my-new-book/chapters/002-next.md",
  "order": 20,
  "published": true
}
```

網址會是：

```text
/articles/my-new-book/next
```

## 隱藏內容

把書本或章節的 `published` 改成 `false`，前台就不會顯示。資料仍會留在 repo 裡，之後可以再改回 `true`。

## 本機檢查

第一次使用：

```powershell
npm install
```

開發預覽：

```powershell
npm run dev
```

這個 workspace 路徑含有 `#`，Vite 可能會出現路徑警告。如果 dev mode 顯示異常，請改用 build 後預覽：

```powershell
npm run build
npm run preview
```

## GitHub Pages 發布

此 repo 預設以 GitHub Pages project page 發布，路徑是 `/GoodStuff/`。手動 build 時請用：

```powershell
$env:VITE_BASE_PATH='/GoodStuff/'
npm run build
```

`npm run build` 會同時產出 `dist/404.html`，讓 GitHub Pages 可以支援直接打開文章網址。

GitHub Actions workflow 在：

```text
.github/workflows/pages.yml
```

push 到 `main` 後會自動 build 並部署 `dist`。

更完整的 GitHub Pages 設定、推送與發布後檢查流程，請看：

```text
docs/github-pages-deploy.md
```

## 更新前檢查

- JSON 不可有註解或尾逗號。
- `slug` 請使用小寫英文、數字與連字號。
- `catalog.json` 裡每本書的 `bookJson` 都要存在。
- `book.json` 裡每篇章節的 `md` 都要存在。
- Markdown 圖片請使用網站路徑，例如 `/content/books/my-book/assets/image.jpg`。
- 只改內容時，優先改 `public/content`；不要改 `src/data/siteData.ts`，那只是舊資料參考。
