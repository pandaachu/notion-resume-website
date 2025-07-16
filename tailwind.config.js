/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // 🎯 預設字體 (中英文混合)
        'sans': ['var(--font-inter)', 'var(--font-noto-sans-tc)', 'system-ui', 'sans-serif'],
        
        // 🎯 中文專用字體
        'zh': ['var(--font-noto-sans-tc)', 'PingFang SC', 'Microsoft JhengHei', 'sans-serif'],
        
        // 🎯 英文專用字體
        'en': ['var(--font-inter)', 'system-ui', 'sans-serif'],
        
        // 🎯 標題字體
        'heading': ['var(--font-playfair)', 'var(--font-noto-sans-tc)', 'serif'],
        
        // 🎯 等寬字體 (程式碼)
        'mono': ['var(--font-jetbrains-mono)', 'Consolas', 'Monaco', 'monospace'],
        'fira': ['var(--font-fira-code)', 'Consolas', 'Monaco', 'monospace'],
      },
    },
  },
  plugins: [],
}
