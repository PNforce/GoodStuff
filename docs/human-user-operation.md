# GoodStuff 人類使用者操作文件

這個網站的公開內容放在 `public/content`。一般內容更新不需要修改 React 程式，只要更新 JSON 或 Markdown，推送到 `main` 後 GitHub Actions 會重新部署 GitHub Pages。

## 主要資料夾

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
```

## 常見修改

- 首頁標題、說明文字：修改 `public/content/site.json`
- 首頁卡片、分類、排序：修改 `public/content/catalog.json`
- 某一本內容集的標題與文章清單：修改該資料夾的 `book.json`
- 單篇文章內文：修改 `chapters/*.md`

## 目前公開路由

```text
https://pnforce.github.io/GoodStuff/
https://pnforce.github.io/GoodStuff/articles/product-comparisons
https://pnforce.github.io/GoodStuff/articles/shops-introduce
```

單篇文章路由格式：

```text
/articles/{bookSlug}/{chapterSlug}
```

## 上線前檢查

```powershell
npm.cmd run build
npm.cmd audit --audit-level=moderate
```

確認 build 成功後再 commit、push。推送到 `main` 後，到 GitHub repo 的 `Actions` 頁確認 `Deploy GoodStuff Static Site` 成功。

## 注意事項

- 不要提交 `.env`、API key、token、password、私鑰或帳密 URL。
- 不要提交 `node_modules/` 或 `dist/`。
- Markdown 表格可以直接使用 GitHub Flavored Markdown 表格語法。
- 商品購買連結請使用一般 Markdown 連結格式：`[文字](https://example.com)`。

## Product Comparisons 維護規則

- 公開分類路徑是 `/articles/product-comparisons`。
- 不要再使用舊路徑 `affiliate-product-comparisons`。
- 20 篇產品比較文章都要有上方 `## 購買參考`，而且要放在 `## 適合誰看這篇` 前面。
- `## 產品重點` 底下的商品標題要連到對應購買連結。
- `## 兩款商品快速比較` 要用 Markdown 表格，不要改成純文字。
- 產品比較 SVG 放在 `public/images/product-comparisons/`，目前共 40 張。
- SVG 要保留加寬後的左右方案間距，目前畫布寬度是 `1400`。

## Shops Introduce 維護規則

- 公開分類路徑是 `/articles/shops-introduce`。
- 不要再使用舊路徑 `openclaw-generated-content`。
- 店鋪文章 slug 使用 `shops-001` 這類格式。
- 如果商品介紹原文有購買 URL，商品標題要加上連結。
- 沒有可靠購買 URL 時不要自行補連結。
- 公開文字不要出現 `OpenClaw` 或 `openclaw`。

## 分類縮圖

目前必要分類縮圖有兩個：

- `public/images/books/product-comparisons.svg`
- `public/images/books/shops-introduce.svg`
