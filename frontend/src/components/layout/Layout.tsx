import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { User } from "../../types";

interface LayoutProps {
  children: React.ReactNode;
  user: User;
}

const Layout: React.FC<LayoutProps> = ({ children, user }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
