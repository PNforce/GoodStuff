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
