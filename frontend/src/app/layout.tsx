import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import NavBar from "@/components/NavBar";
import QuickActionsBar from "@/components/QuickActionsBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Budget Tracker",
  description: "Track income, expenses, and budgets on mobile",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();",
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ height: "100dvh", overflow: "hidden" }}>
        <div className="mx-auto max-w-[480px] h-[100dvh] grid grid-rows-[auto_1fr] bg-background">
          <div className="hidden md:block">
            <NavBar />
          </div>
          <main className="overflow-y-auto no-scrollbar p-4 pb-24 md:pb-4">
            {children}
          </main>
        </div>
        <Toaster richColors closeButton position="top-center" />
        <QuickActionsBar />
      </body>
    </html>
  );
}
