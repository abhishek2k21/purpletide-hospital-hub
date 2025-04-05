
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Calendar,
  ClipboardList,
  FileText,
  Home,
  LayoutDashboard,
  Menu,
  Package,
  PieChart,
  Settings,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import { ModeToggle } from "../theme/ModeToggle";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  isActive: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon: Icon, label, to, isActive, onClick }: NavItemProps) => {
  return (
    <Link to={to} onClick={onClick} className="w-full">
      <div
        className={cn(
          "flex items-center gap-4 px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
          isActive && "bg-accent text-accent-foreground font-medium"
        )}
      >
        <Icon size={20} />
        <span>{label}</span>
      </div>
    </Link>
  );
};

export default function Sidebar() {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", to: "/" },
    { icon: Users, label: "Patients", to: "/patients" },
    { icon: Calendar, label: "Appointments", to: "/appointments" },
    { icon: ShoppingCart, label: "Pharmacy", to: "/pharmacy" },
    { icon: Package, label: "Inventory", to: "/inventory" },
    { icon: ClipboardList, label: "Billing", to: "/billing" },
    { icon: BarChart3, label: "Reports", to: "/reports" },
    { icon: FileText, label: "Documents", to: "/documents" },
    { icon: Settings, label: "Settings", to: "/settings" },
  ];

  const closeMobileSidebar = () => setIsMobileOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed inset-0 z-50 w-full bg-background md:hidden"
          >
            <div className="flex h-full flex-col overflow-y-auto bg-background p-6">
              <div className="flex items-center justify-between">
                <Link to="/" onClick={closeMobileSidebar}>
                  <h1 className="text-xl font-bold text-violet-600 dark:text-violet-400">
                    HMS
                  </h1>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeMobileSidebar}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="mt-8 flex flex-col gap-2">
                {navItems.map((item) => (
                  <NavItem
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    to={item.to}
                    isActive={location.pathname === item.to}
                    onClick={closeMobileSidebar}
                  />
                ))}
              </div>
              <div className="mt-auto pt-4 flex justify-end">
                <ModeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
        <div className="flex flex-col flex-grow border-r border-border bg-card px-4 py-6">
          <Link to="/">
            <div className="flex items-center px-4 mb-8">
              <Home className="h-6 w-6 mr-2 text-violet-600 dark:text-violet-400" />
              <h1 className="text-xl font-bold text-violet-600 dark:text-violet-400">
                HMS
              </h1>
            </div>
          </Link>
          <div className="flex flex-col gap-1 flex-1">
            {navItems.map((item) => (
              <NavItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                to={item.to}
                isActive={location.pathname === item.to}
              />
            ))}
          </div>
          <div className="mt-auto pt-4 flex justify-end">
            <ModeToggle />
          </div>
        </div>
      </div>
    </>
  );
}
