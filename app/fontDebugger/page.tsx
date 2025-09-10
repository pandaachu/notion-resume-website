'use client';
import React from 'react';

const FontDebugger = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="mb-6 text-2xl font-bold">字體診斷工具</h1>

      {/* 🔍 檢查 CSS 變數是否正確載入 */}
      <div className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">1. CSS 變數檢查</h2>
        <div className="space-y-2 text-sm">
          <div style={{ fontFamily: 'var(--font-fira-code), monospace' }}>
            直接使用 CSS 變數: const result = x =&gt; x &gt;= 10;
          </div>
          <div className="font-fira">使用 font-fira 類別: const result = x =&gt; x &gt;= 10;</div>
          <div className="font-mono">使用 font-mono 類別: const result = x =&gt; x &gt;= 10;</div>
        </div>
      </div>

      {/* 🔍 檢查 Tailwind 類別是否生成 */}
      <div className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">2. Tailwind 類別測試</h2>
        <div className="space-y-2">
          <p className="font-sans">font-sans: 這是預設字體</p>
          <p className="font-serif">font-serif: 這是襯線字體</p>
          <p className="font-mono">font-mono: 這是等寬字體</p>
          <p className="font-fira">font-fira: 這應該是 Fira Code</p>
          <p className="font-jetbrains">font-jetbrains: 這應該是 JetBrains Mono</p>
          <p className="font-baskervville">font-baskervville: 這應該是 baskervville</p>
          <p className="font-roboto">font-roboto: 這應該是 roboto</p>
          <p className="font-muli">這是 Muli Regular 字體</p>
          <p className="font-nanum-myeongjo">這是 Nanum Myeongjo 字體</p>
          <p className="font-cormorant-garamond">這是 Cormorant Garamond 字體</p>
          <p className="font-marcellus">這是 Marcellus 字體</p>
        </div>
      </div>

      {/* 🔍 強制使用 !important 測試 */}
      <div className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">3. 強制字體測試</h2>
        <div className="space-y-2">
          <div
            className="force-fira-code"
            style={{
              fontFamily: 'var(--font-fira-code), "Fira Code", Consolas, Monaco, monospace !important',
              fontFeatureSettings: '"liga" 1, "calt" 1',
            }}
          >
            強制 Fira Code: const fn = () =&gt; x &gt;= 10 && x &lt;= 100;
          </div>
        </div>
      </div>

      {/* 🔍 檢查字體是否載入 */}
      <div className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">4. 字體載入檢查</h2>
        <div className="space-y-2 text-sm">
          <p>開啟瀏覽器開發者工具 → Network → 篩選 Font</p>
          <p>刷新頁面，查看是否有 Fira Code 相關的字體檔案載入</p>
          <p>或者在 Console 中執行：</p>
          <code className="mt-2 block rounded bg-gray-100 p-2">document.fonts.check('12px "Fira Code"')</code>
        </div>
      </div>

      {/* 🔍 瀏覽器計算樣式檢查 */}
      <div className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">5. 計算樣式檢查</h2>
        <div className="space-y-2">
          <div id="fira-test-element" className="font-fira rounded bg-gray-100 p-2">
            測試元素: const test = () =&gt; true;
          </div>
          <p className="text-sm text-gray-600">右鍵點擊上方元素 → 檢查 → Computed → font-family 查看實際使用的字體</p>
        </div>
      </div>

      {/* 🔍 CSS 檢查工具 */}
      <div className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">6. CSS 類別檢查</h2>
        <button
          onClick={() => {
            // 檢查 font-fira 類別是否存在
            const testEl = document.createElement('div');
            testEl.className = 'font-fira';
            document.body.appendChild(testEl);

            const computedStyle = window.getComputedStyle(testEl);
            const fontFamily = computedStyle.fontFamily;

            alert(`font-fira 類別的實際 font-family: ${fontFamily}`);

            document.body.removeChild(testEl);
          }}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          檢查 font-fira 類別
        </button>
      </div>

      {/* 🔧 臨時修復方案 */}
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <h2 className="mb-3 text-lg font-semibold text-yellow-800">7. 臨時修復方案</h2>
        <div className="space-y-2 text-sm">
          <p className="text-yellow-700">如果 font-fira 不工作，可以使用以下替代方案：</p>

          <div className="rounded bg-white p-3">
            <h4 className="mb-2 font-medium">方案 1: 直接使用內聯樣式</h4>
            <code className="text-xs">
              style=&#123;&#123; fontFamily: 'var(--font-fira-code), monospace' &#125;&#125;
            </code>
          </div>

          <div className="rounded bg-white p-3">
            <h4 className="mb-2 font-medium">方案 2: 建立自訂 CSS 類別</h4>
            <code className="block text-xs">
              .custom-fira &#123;
              <br />
              &nbsp;&nbsp;font-family: var(--font-fira-code), monospace !important;
              <br />
              &#125;
            </code>
          </div>

          <div className="rounded bg-white p-3">
            <h4 className="mb-2 font-medium">方案 3: 重新建構 Tailwind</h4>
            <code className="text-xs">npm run build</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FontDebugger;
