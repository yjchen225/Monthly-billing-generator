# Monthly-billing-generator

前端 Web App（React + Vite + Tailwind + SheetJS）  
上傳「銷貨單付款明細」與「退換貨單」兩份 Excel，產生摘要頁 + 每客戶明細頁，並以 A4 列印輸出 PDF。

## 開發
```bash
npm install
npm run dev
```

## 建置
```bash
npm run build
npm run preview
```

## 欄位對應
若你的 Excel header 名稱不同，請調整：
- `src/lib/aggregate.js` 的 `REQUIRED_*_HEADERS`
- `FIELDS` mapping
