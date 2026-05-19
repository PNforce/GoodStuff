# 日本股票市場概覽

日本股票市場長期由製造業、金融業、半導體供應鏈、消費品牌與商社共同支撐。對內容型網站來說，這類主題很適合用資料驅動方式維護：目錄放在 `book.json`，正文放在 Markdown，首頁清單放在 `catalog.json`。

## 資料驅動的內容邏輯

這個章節不是由 React 程式碼硬寫，也不是預先輸出的 HTML。頁面在瀏覽器中讀取：

- `/content/catalog.json`
- `/content/books/127-jp-stock/book.json`
- `/content/books/127-jp-stock/chapters/001-market-overview.md`

因此只要替換這份 Markdown 並重新整理瀏覽器，正文就會更新。

## 投資觀察角度

日本企業通常具有穩定的供應鏈、成熟的品牌資產與長期研發文化。分析時可以從三個層面切入：

1. 公司是否具備全球市場能力。
2. 產業是否正在經歷技術轉型。
3. 股價是否反映未來成長與風險。

這些段落只是範例。實際上傳內容時，請用新的 Markdown 覆蓋本檔案，或在 `book.json` 新增章節指向新的 md。
