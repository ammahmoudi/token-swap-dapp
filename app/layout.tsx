// pages/index.tsx
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Inter } from "next/font/google";
import Providers from "./providers";
import { headers } from "next/headers";
import Profile from "@/components/profile";
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

        <Providers cookie={cookie}>
        {/* <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <ConnectBtn />
      </div> */}
<GlobalNavbar/> 
           {children}
 
      <Profile />

          </Providers>
       

      </body>
    </html>
  );
}
