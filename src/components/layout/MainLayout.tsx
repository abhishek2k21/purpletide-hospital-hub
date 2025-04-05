
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "../theme/theme-provider";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout() {
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen is mobile on mount and on resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="md:pl-64 transition-all duration-300">
          <Header />
          <main className="p-4 md:p-8">
            <Outlet />
          </main>
        </div>
        <Toaster />
        <SonnerToaster />
      </div>
    </ThemeProvider>
  );
}
