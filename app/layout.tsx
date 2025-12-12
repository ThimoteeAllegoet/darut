import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { AlertProvider } from "./contexts/AlertContext";
import MainLayout from "./components/MainLayout";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "DARUT - Outils de suivi",
  description: "Application de centralisation d'outils pour le suivi quotidien",
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body
        className={`${roboto.variable} antialiased`}
        style={{ fontFamily: 'Marianne, var(--font-roboto), sans-serif' }}
      >
        <AuthProvider>
          <AlertProvider>
            <MainLayout>{children}</MainLayout>
          </AlertProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
