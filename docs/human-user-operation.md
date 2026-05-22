# GoodStuff 人類使用者操作文件

主要維護入口已整合到根目錄 `README.md`。

如果你要請 AI agent 協助維護，請提供根目錄 `claude_code_prompt_0517.txt`。該檔案包含 GoodStuff 的資料結構、三類文章寫作規範、GA4 追蹤與安全檢查要求。

## 快速入口

- 網站：https://pnforce.github.io/GoodStuff/
- Repo：https://github.com/PNforce/GoodStuff/
- 人類維護主 README：`README.md`
- AI agent prompt：`claude_code_prompt_0517.txt`
- GA4 說明：`docs/analytics.md`
- GitHub Pages 部署：`docs/github-pages-deploy.md`

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
https://pnforce.github.io/GoodStuff/articles/profuct-introduce
```

單篇文章路由格式：

```text
/articles/{bookSlug}/{chapterSlug}
```

## 上線前檢查

```powershell
$env:VITE_BASE_PATH='/GoodStuff/'
$env:VITE_SITE_URL='https://PNforce.github.io/GoodStuff/'
npm.cmd run build
git diff --check
```

推送到 `main` 後，到 GitHub repo 的 `Actions` 頁確認 `Deploy GoodStuff Static Site` 成功。

## 注意事項

- 不要提交 `.env`、API key、token、password、私鑰或帳密 URL。
- 不要提交 `node_modules/`。
- Markdown 表格可以直接使用 GitHub Flavored Markdown 表格語法。
- 商品購買連結請使用一般 Markdown 連結格式：`[文字](https://s.shopee.tw/...)`。
- 詳細寫作規範請看 `README.md` 與 `claude_code_prompt_0517.txt`。
