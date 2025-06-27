import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/providers/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import MainLayout from "@/components/layout/main-layout"
import { WebSocketProvider } from "@/components/providers/websocket-provider"
import { SidebarProvider } from "@/components/ui/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TrackFlow - Project & Task Management",
  description: "Real-time project and task tracking dashboard",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <WebSocketProvider>
            <SidebarProvider>
              <MainLayout>{children}</MainLayout>
              <Toaster />
            </SidebarProvider>
          </WebSocketProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
