import '../styles/globals.css'
import { 
  Inter, 
  Noto_Sans_TC,
  JetBrains_Mono,
  Playfair_Display ,
  Fira_Code
} from 'next/font/google'

// 🎯 英文字體 - Inter (現代、易讀)
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

// 🎯 中文字體 - Noto Sans TC (Google 中文字體)
const notoSansTC = Noto_Sans_TC({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-noto-sans-tc',
  display: 'swap'
})

// 🎯 等寬字體 - 程式碼用
const jetBrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap'
})
// 🎯 程式碼用
const firaCode = Fira_Code({ 
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap'
})

// 🎯 標題字體 - 優雅的襯線字體
const playfairDisplay = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap'
})

export const metadata = {
  title: '個人履歷網站',
  description: '使用 Next.js 和 Notion 建立的個人履歷網站',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW" className={`
      ${inter.variable} 
      ${notoSansTC.variable} 
      ${jetBrainsMono.variable}
      ${playfairDisplay.variable}
      ${firaCode.variable}
    `}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}