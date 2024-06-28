"use client";

import Image from "next/image";
import { ConnectBtn } from "../components/ConnectBtn";
import Profile from "../components/profile";
import TokenSwapForm from "@/components/TokenSwapForm";



export default function Home() {
  return (
    <main className=" light flex min-h-screen flex-col items-center justify-between p-12">
            <Profile />

    </main>
  );
}
