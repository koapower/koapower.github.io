# BackToTop 使用說明

BackToTop 是一個完全獨立的返回頂部按鈕組件，可以在任何頁面重複使用。

## 基本使用

### 1. ES6 模組方式 (推薦)

```html
<!-- 在 HTML 中引入 -->
<script type="module">
  import { initBackToTop } from './scripts/BackToTop.js';
  
  // 基本初始化
  document.addEventListener('DOMContentLoaded', function() {
    const backToTop = initBackToTop();
  });
</script>
```

### 2. 傳統 script 標籤方式

```html
<!-- 引入腳本 -->
<script src="scripts/BackToTop.js"></script>

<!-- 初始化 -->
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const backToTop = new BackToTop();
  });
</script>
```

## 自定義配置

```javascript
const backToTop = initBackToTop({
  showThreshold: 300,        // 顯示按鈕的滾動距離 (px)
  buttonText: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 24px; height: 24px;">
    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
  </svg>`,                   // 按鈕 SVG 圖示或文字
  position: {               // 按鈕位置
    bottom: '30px',
    right: '30px'
  },
  scrollDuration: 600,      // 滾動動畫時長 (ms)
  customClass: 'my-btn',    // 自定義 CSS 類別
  autoInjectCSS: true       // 是否自動注入預設樣式
});
```

## 可用選項

| 選項 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `showThreshold` | number | 300 | 顯示按鈕的滾動閾值 (px) |
| `buttonText` | string | '↑' | 按鈕文字或 HTML 內容 |
| `position.bottom` | string | '30px' | 距離底部距離 |
| `position.right` | string | '30px' | 距離右側距離 |
| `scrollDuration` | number | 600 | 平滑滾動持續時間 (ms) |
| `classPrefix` | string | 'back-to-top' | CSS 類別前綴 |
| `autoInjectCSS` | boolean | true | 是否自動插入 CSS |
| `customClass` | string | '' | 額外的 CSS 類別 |

## 公共方法

```javascript
const backToTop = initBackToTop();

// 手動顯示按鈕
backToTop.show();

// 手動隱藏按鈕
backToTop.hide();

// 更新配置
backToTop.updateOptions({
  buttonText: '🔝',
  showThreshold: 500
});

// 銷毀組件
backToTop.destroy();
```

## 自定義樣式

如果設定 `autoInjectCSS: false`，可以完全自定義樣式：

```css
.back-to-top-button {
  /* 你的自定義樣式 */
  width: 60px;
  height: 60px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border-radius: 15px;
  /* ... */
}

.back-to-top-button.visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
```

## 響應式設計

組件內建響應式支援，在手機版會自動調整大小和位置。

## 特色功能

- ✅ **完全獨立** - 不依賴任何第三方庫
- ✅ **高度可配置** - 支援多種自定義選項
- ✅ **平滑動畫** - 使用 easeOutQuart 緩動效果
- ✅ **性能優化** - 使用節流避免過度觸發
- ✅ **無障礙支援** - 支援鍵盤操作和 ARIA 標籤
- ✅ **響應式設計** - 自適應不同螢幕尺寸
- ✅ **ES6 模組** - 支援現代 JavaScript 導入方式
- ✅ **向後相容** - 也支援傳統 script 標籤使用

## 在其他頁面中使用

只需要複製 `BackToTop.js` 文件到新頁面的 scripts 目錄，然後按照上述方式初始化即可。