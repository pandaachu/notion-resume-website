import '../styles/globals.css';
import 'aos/dist/aos.css';
import {
  Inter,
  Noto_Sans_TC,
  JetBrains_Mono,
  Playfair_Display,
  Fira_Code,
  Baskervville,
  Roboto,
  Nanum_Myeongjo,
  Cormorant_Garamond,
  Marcellus,
} from 'next/font/google';

// 🎯 英文字體 - Inter (現代、易讀)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// 🎯 中文字體 - Noto Sans TC (Google 中文字體)
const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-noto-sans-tc',
  display: 'swap',
});

// 🎯 等寬字體 - JetBrains Mono (程式碼用)
const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

// 🎯 等寬字體 - Fira Code (程式碼用，支援連字符)
const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-fira-code',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto',
});

// 🎯 標題字體 - 優雅的襯線字體
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

// 🎯 標題字體 - 優雅的襯線字體
const baskervville = Baskervville({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-baskervville',
  display: 'swap',
});

// 🎯 標題字體 - 優雅的襯線字體
const nanumMyeongjo = Nanum_Myeongjo({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-nanum-myeongjo',
  display: 'swap',
});
// 🎯 標題字體 - 優雅的襯線字體
const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-cormorant-garamond',
  display: 'swap',
});
const marcellus = Marcellus({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-marcellus',
  display: 'swap',
});

export const metadata = {
  title: "Pandaa's Portfolio",
  description: '使用 Next.js 和 Notion 建立的個人履歷網站',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh-TW"
      className={` ${inter.variable} ${notoSansTC.variable} ${jetBrainsMono.variable} ${firaCode.variable} ${playfairDisplay.variable} ${baskervville.variable} ${roboto.variable} ${nanumMyeongjo.variable} ${cormorantGaramond.variable} ${marcellus.variable}`}
    >
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/plx7dty.css" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="bg-[#2F2F2F] antialiased">{children}</body>
    </html>
  );
}
