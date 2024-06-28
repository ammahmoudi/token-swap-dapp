'use client'
// components/GlobalNavbar.jsx
import React from "react";
import { Navbar, NavbarBrand, Link, Button, NavbarContent, NavbarItem } from "@nextui-org/react";
import { ConnectBtn } from "./ConnectBtn";
import { usePathname } from "next/navigation";

const GlobalNavbar = () => {

  const currentPath = usePathname()
  const navItems = [
    { title: 'Home', path: '/' },
    { title: 'Swap', path: '/swap' },
    // Add more items here
  ];

  return (
    <Navbar classNames={{
      item: [
        "flex",
        "relative",
        "h-full",
        "items-center",
        "data-[active=true]:after:content-['']",
        "data-[active=true]:after:absolute",
        "data-[active=true]:after:bottom-0",
        "data-[active=true]:after:left-0",
        "data-[active=true]:after:right-0",
        "data-[active=true]:after:h-[2px]",
        "data-[active=true]:after:rounded-[2px]",
        "data-[active=true]:after:bg-primary",
      ],
    }} >
  <NavbarBrand>
        <p className="font-bold text-inherit">Mamood Swap Dapp</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
      {navItems.map((item) => (
        <NavbarItem
          key={item.path}
          data-active={currentPath === item.path}
        >
          <Link  href={item.path}>{item.title}</Link>
        </NavbarItem>
      ))}



      </NavbarContent>

      <NavbarContent justify="end">
          <ConnectBtn/>
    
      </NavbarContent>

    </Navbar>
  );
};

export default GlobalNavbar;
