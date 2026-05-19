# GitHub Pages 發布操作文件

這個 repo 已設定用 GitHub Actions 發布到 GitHub Pages。一般情況下，只要把內容推到 `main`，workflow 會自動 build 並部署 `dist`。

發布 repo：

```text
M:\#github_others\GoodStuff
```

遠端 repo：

```text
https://github.com/PNforce/GoodStuff.git
```

正式網址預期為：

```text
https://pnforce.github.io/GoodStuff/
```

## 第一次在 GitHub 上設定

1. 打開 GitHub repo：`PNforce/GoodStuff`
2. 進入 `Settings` -> `Pages`
3. 在 `Build and deployment` 的 `Source` 選擇 `GitHub Actions`
4. 確認 repo 的 `Actions` 有允許 workflow 執行
5. push 到 `main` 後，進入 `Actions` 查看 `Deploy GoodStuff Static Site`

workflow 檔案位置：

```text
.github/workflows/pages.yml
```

workflow 會使用：

```text
VITE_BASE_PATH=/GoodStuff/
VITE_SITE_URL=https://PNforce.github.io/GoodStuff/
```

## 本機發布前檢查

```powershell
cd M:\#github_others\GoodStuff
npm install
$env:VITE_BASE_PATH='/GoodStuff/'
$env:VITE_SITE_URL='https://PNforce.github.io/GoodStuff/'
npm.cmd run build
```

build 會產出：

```text
dist/index.html
dist/404.html
dist/robots.txt
dist/sitemap.xml
```

`404.html` 是 React Router 文章直連 fallback，請保留。

## 推送發布

```powershell
git status
git add .
git commit -m "Deploy GoodStuff data-driven static site"
git push origin main
```

如果只要更新文章內容，通常只需要 commit：

```text
public/content/**
public/images/**
```

## 發布後檢查

請在 Actions 成功後打開：

```text
https://pnforce.github.io/GoodStuff/
https://pnforce.github.io/GoodStuff/articles/affiliate-product-comparisons
https://pnforce.github.io/GoodStuff/articles/affiliate-product-comparisons/bp04-vs-hushjet
https://pnforce.github.io/GoodStuff/robots.txt
https://pnforce.github.io/GoodStuff/sitemap.xml
```

確認項目：

- 首頁可載入。
- 20 篇產品比較文章可開啟。
- 每篇文章的 SVG 圖片正常顯示。
- 重新整理文章直連 URL 不會 404。
- `robots.txt` 沒有封鎖 `/articles/`、`/content/`、`/images/`。
- `sitemap.xml` 包含首頁、書籍頁、20 篇產品比較文章。

## 注意

- 若 repo 維持 private，GitHub Pages 的可見性會受 GitHub 帳號/組織方案與 Pages 設定影響。
- 若 Pages 頁面沒有出現網址，先確認 `Settings` -> `Pages` 已選 `GitHub Actions`。
- 若 Actions build 失敗，先看 `Actions` 裡的 log；本機 Windows 路徑含 `#` 可能會出現 Vite 警告，但 GitHub Actions 在 Linux runner 上不會有這個路徑問題。
