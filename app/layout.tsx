// pages/index.tsx
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Inter } from "next/font/google";
import Providers from "./providers";
import { headers } from "next/headers";
import GlobalNavbar from "@/components/GlobalNavbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = headers().get("cookie");
  return (
    <html lang="en">
      <body className={inter.className}>

        <Providers cookie={cookie} >

<GlobalNavbar/> 
           {children}
          </Providers>
       

      </body>
    </html>
  );
}
