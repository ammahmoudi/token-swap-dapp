// components/GlobalNavbar.jsx
import React from "react";
import { Navbar, NavbarBrand, Link, Button, NavbarContent, NavbarItem } from "@nextui-org/react";
import { ConnectBtn } from "./ConnectButton";

const GlobalNavbar = () => {
  return (
    <Navbar isBordered >
  <NavbarBrand>
        <p className="font-bold text-inherit">ACME</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <ConnectBtn/>
        </NavbarItem>
      </NavbarContent>

    </Navbar>
  );
};

export default GlobalNavbar;
