import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

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
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
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
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ height: "100dvh", overflow: "hidden" }}>
        <div className="mx-auto max-w-[480px] h-[100dvh] grid grid-rows-[1fr_auto] bg-background">
          <main className="overflow-y-auto no-scrollbar p-4">
            {children}
          </main>
          <nav className="border-t px-4 py-2 grid grid-cols-3 gap-2 text-sm">
            <button className="py-2 rounded-md bg-primary text-primary-foreground">Dashboard</button>
            <button className="py-2 rounded-md border">Add</button>
            <button className="py-2 rounded-md border">Profile</button>
          </nav>
        </div>
        <Toaster richColors closeButton position="top-center" />
      </body>
    </html>
  );
}
