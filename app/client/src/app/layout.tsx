import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/store/provider";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import AuthProvider from "@/providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Catalogue Maker",
  description: "Create and share beautiful catalogues",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`antialiased ${geistSans.variable} ${geistMono.variable}`}
      lang="en"
    >
      <body>
        <ReduxProvider>
          <AuthProvider>
            <NuqsAdapter>
              {children}
              <Toaster richColors />
            </NuqsAdapter>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
