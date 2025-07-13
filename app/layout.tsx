import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

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
    <html lang="zh-TW">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}