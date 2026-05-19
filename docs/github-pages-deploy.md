# GitHub Pages 部署文件

GoodStuff 使用 GitHub Actions 建置並部署到 GitHub Pages。

公開網站：

```text
https://pnforce.github.io/GoodStuff/
```

GitHub repo：

```text
https://github.com/PNforce/GoodStuff
```

## GitHub Pages 設定

到 repo 的 `Settings -> Pages`，確認：

```text
Build and deployment -> Source -> GitHub Actions
```

workflow 檔案：

```text
.github/workflows/pages.yml
```

## 本機建置檢查

```powershell
cd M:\#github_others\GoodStuff
npm.cmd install
$env:VITE_BASE_PATH='/GoodStuff/'
$env:VITE_SITE_URL='https://PNforce.github.io/GoodStuff/'
npm.cmd run build
```

build 會產生：

```text
dist/index.html
dist/404.html
dist/robots.txt
dist/sitemap.xml
```

## 部署

```powershell
git status
git add .
git commit -m "Update GoodStuff site content"
git push origin main
```

推送後檢查 GitHub Actions 最新 run 是否成功，再確認：

```text
https://pnforce.github.io/GoodStuff/
https://pnforce.github.io/GoodStuff/articles/product-comparisons
https://pnforce.github.io/GoodStuff/articles/product-comparisons/bp04-vs-hushjet
https://pnforce.github.io/GoodStuff/articles/shops-introduce
https://pnforce.github.io/GoodStuff/articles/shops-introduce/shops-004
https://pnforce.github.io/GoodStuff/robots.txt
https://pnforce.github.io/GoodStuff/sitemap.xml
```

## 檢查重點

- 首頁可開啟，卡片縮圖正常。
- 產品比較頁的 Markdown 表格渲染成網頁表格。
- 店鋪內容頁不顯示舊分類名稱。
- sitemap URL 都使用 `/GoodStuff/` 與最新路由。
- `robots.txt` 允許 crawler 抓取並指向 sitemap。
