/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 圖片優化
  images: {
    domains: ['notion.so', 's3.us-west-2.amazonaws.com', 'prod-files-secure.s3.us-west-2.amazonaws.com'],
    // 啟用圖片優化
    formats: ['image/avif', 'image/webp'],
  },

  // 生產環境優化
  swcMinify: true,

  // 輸出優化
  output: 'standalone',

  // 實驗性功能
  experimental: {
    // 啟用伺服器元件
    serverComponents: true,
  },
};

module.exports = nextConfig;
