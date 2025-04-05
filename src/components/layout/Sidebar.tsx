
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  PieChart,
  Settings,
  ShoppingCart,
  User,
  Users,
  X,
} from "lucide-react";
import { ModeToggle } from "../theme/ModeToggle";

interface NavGroupProps {
  label: string;
  children: React.ReactNode;
  isCollapsed: boolean;
  icon: React.ElementType;
  isOpen?: boolean;
  onToggle?: () => void;
}

const NavGroup = ({ label, children, icon: Icon, isCollapsed, isOpen = false, onToggle }: NavGroupProps) => {
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onToggle}
      className="w-full"
    >
      <CollapsibleTrigger className="w-full">
        <div
          className={cn(
            "flex items-center justify-between w-full px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
            isOpen && "bg-accent text-accent-foreground font-medium"
          )}
        >
          <div className="flex items-center gap-4">
            <Icon size={20} />
            {!isCollapsed && (
              <span>{label}</span>
            )}
          </div>
          {!isCollapsed && (
            <div className="flex items-center">
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className={cn("transition-all", !isCollapsed ? "pl-9" : "pl-2")}>
        <div className="flex flex-col gap-1 pt-1">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
  badge?: number;
  isNested?: boolean;
}

const NavItem = ({ 
  icon: Icon, 
  label, 
  to, 
  isActive, 
  isCollapsed, 
  onClick,
  badge,
  isNested = false
}: NavItemProps) => {
  const content = (
    <div
      className={cn(
        "flex items-center gap-4 px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
        isActive && "bg-accent text-accent-foreground font-medium",
        isNested && !isCollapsed && "pl-2",
      )}
    >
      <Icon size={20} />
      {!isCollapsed && (
        <span className="flex-grow">{label}</span>
      )}
      {!isCollapsed && badge && badge > 0 && (
        <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
  );

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to={to} onClick={onClick} className="w-full">
              {content}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{label}</p>
            {badge && badge > 0 && (
              <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Link to={to} onClick={onClick} className="w-full">
      {content}
    </Link>
  );
};

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    patients: false,
    appointments: false,
    pharmacy: false,
    inventory: false,
    billing: false,
    reports: false,
    documents: false,
    settings: false,
  });

  useEffect(() => {
    // Open the group corresponding to the active route
    const currentPath = location.pathname.split('/')[1];
    if (currentPath && openGroups.hasOwnProperty(currentPath)) {
      setOpenGroups(prev => ({ ...prev, [currentPath]: true }));
    }
  }, []);

  const toggleGroup = (group: string) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const closeMobileSidebar = () => setIsMobileOpen(false);

  const handleLogout = () => {
    // Handle logout logic here
    navigate("/login");
  };

  const isActiveRoute = (path: string) => {
    if (path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const isExactActiveRoute = (path: string) => location.pathname === path;

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", to: "/" },
  ];

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

              <div className="mt-8 flex flex-col gap-1">
                <NavItem
                  key="dashboard"
                  icon={LayoutDashboard}
                  label="Dashboard"
                  to="/"
                  isActive={isExactActiveRoute("/")}
                  isCollapsed={false}
                  onClick={closeMobileSidebar}
                />

                <NavGroup
                  label="Patients"
                  icon={Users}
                  isCollapsed={false}
                  isOpen={openGroups.patients}
                  onToggle={() => toggleGroup("patients")}
                >
                  <NavItem 
                    icon={Users} 
                    label="All Patients" 
                    to="/patients" 
                    isActive={isExactActiveRoute("/patients")} 
                    isCollapsed={false}
                    onClick={closeMobileSidebar}
                    isNested
                  />
                  <NavItem 
                    icon={User} 
                    label="Add Patient" 
                    to="/patients/add" 
                    isActive={isExactActiveRoute("/patients/add")} 
                    isCollapsed={false}
                    onClick={closeMobileSidebar}
                    isNested
                  />
                </NavGroup>

                <NavGroup
                  label="Appointments"
                  icon={Calendar}
                  isCollapsed={false}
                  isOpen={openGroups.appointments}
                  onToggle={() => toggleGroup("appointments")}
                >
                  <NavItem 
                    icon={ClipboardList} 
                    label="All Appointments" 
                    to="/appointments" 
                    isActive={isExactActiveRoute("/appointments")} 
                    isCollapsed={false}
                    onClick={closeMobileSidebar}
                    isNested
                  />
                  <NavItem 
                    icon={Calendar} 
                    label="Calendar" 
                    to="/appointments/calendar" 
                    isActive={isExactActiveRoute("/appointments/calendar")} 
                    isCollapsed={false}
                    onClick={closeMobileSidebar}
                    isNested
                  />
                </NavGroup>

                <NavGroup
                  label="Pharmacy"
                  icon={ShoppingCart}
                  isCollapsed={false}
                  isOpen={openGroups.pharmacy}
                  onToggle={() => toggleGroup("pharmacy")}
                >
                  <NavItem 
                    icon={ShoppingCart} 
                    label="Dispensary" 
                    to="/pharmacy" 
                    isActive={isExactActiveRoute("/pharmacy")} 
                    isCollapsed={false}
                    onClick={closeMobileSidebar}
                    isNested
                  />
                  <NavItem 
                    icon={Package} 
                    label="Stock" 
                    to="/pharmacy/stock" 
                    isActive={isExactActiveRoute("/pharmacy/stock")} 
                    isCollapsed={false}
                    onClick={closeMobileSidebar}
                    isNested
                  />
                </NavGroup>

                <NavGroup
                  label="Inventory"
                  icon={Package}
                  isCollapsed={false}
                  isOpen={openGroups.inventory}
                  onToggle={() => toggleGroup("inventory")}
                >
                  <NavItem 
                    icon={Package} 
                    label="All Items" 
                    to="/inventory" 
                    isActive={isExactActiveRoute("/inventory")} 
                    isCollapsed={false}
                    onClick={closeMobileSidebar}
                    isNested
                  />
                  <NavItem 
                    icon={ClipboardList} 
                    label="Suppliers" 
                    to="/inventory/suppliers" 
                    isActive={isExactActiveRoute("/inventory/suppliers")} 
                    isCollapsed={false}
                    onClick={closeMobileSidebar}
                    isNested
                  />
                </NavGroup>

                <NavGroup
                  label="Billing"
                  icon={ClipboardList}
                  isCollapsed={false}
                  isOpen={openGroups.billing}
                  onToggle={() => toggleGroup("billing")}
                >
                  <NavItem 
                    icon={ClipboardList} 
                    label="Overview" 
                    to="/billing" 
                    isActive={isExactActiveRoute("/billing")} 
                    isCollapsed={false}
                    onClick={closeMobileSidebar}
                    isNested
                  />
                  <NavItem 
                    icon={FileText} 
                    label="Invoices" 
                    to="/billing/invoices" 
                    isActive={isExactActiveRoute("/billing/invoices")} 
                    isCollapsed={false}
                    onClick={closeMobileSidebar}
                    isNested
                  />
                </NavGroup>

                <NavGroup
                  label="Reports"
                  icon={BarChart3}
                  isCollapsed={false}
                  isOpen={openGroups.reports}
                  onToggle={() => toggleGroup("reports")}
                >
                  <NavItem 
                    icon={BarChart3} 
                    label="Daily Reports" 
                    to="/reports/daily" 
                    isActive={isExactActiveRoute("/reports/daily")} 
                    isCollapsed={false}
                    onClick={closeMobileSidebar}
                    isNested
                  />
                  <NavItem 
                    icon={PieChart} 
                    label="Monthly Reports" 
                    to="/reports/monthly" 
                    isActive={isExactActiveRoute("/reports/monthly")} 
                    isCollapsed={false}
                    onClick={closeMobileSidebar}
                    isNested
                  />
                </NavGroup>

                <NavGroup
                  label="Documents"
                  icon={FileText}
                  isCollapsed={false}
                  isOpen={openGroups.documents}
                  onToggle={() => toggleGroup("documents")}
                >
                  <NavItem 
                    icon={FileText} 
                    label="All Documents" 
                    to="/documents" 
                    isActive={isExactActiveRoute("/documents")} 
                    isCollapsed={false}
                    onClick={closeMobileSidebar}
                    isNested
                  />
                  <NavItem 
                    icon={FileText} 
                    label="Upload" 
                    to="/documents/upload" 
                    isActive={isExactActiveRoute("/documents/upload")} 
                    isCollapsed={false}
                    onClick={closeMobileSidebar}
                    isNested
                  />
                </NavGroup>

                <NavItem 
                  icon={Settings} 
                  label="Settings" 
                  to="/settings" 
                  isActive={isActiveRoute("/settings")} 
                  isCollapsed={false} 
                  onClick={closeMobileSidebar}
                />
              </div>

              <div className="mt-auto pt-4 flex flex-col gap-2">
                <NavItem 
                  icon={User} 
                  label="Profile" 
                  to="/profile" 
                  isActive={isExactActiveRoute("/profile")} 
                  isCollapsed={false}
                  onClick={closeMobileSidebar}
                />
                <div className="mb-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start px-4 py-3" 
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-4 h-5 w-5" />
                    Logout
                  </Button>
                </div>
                <div className="flex justify-end">
                  <ModeToggle />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 z-30">
        <div 
          className={cn(
            "flex flex-col flex-grow border-r border-border bg-card px-4 py-6 transition-all duration-300",
            isCollapsed ? "w-[70px]" : "w-64"
          )}
        >
          <Link to="/">
            <div className="flex items-center px-4 mb-8">
              <Home className="h-6 w-6 mr-2 text-violet-600 dark:text-violet-400" />
              {!isCollapsed && (
                <h1 className="text-xl font-bold text-violet-600 dark:text-violet-400">
                  HMS
                </h1>
              )}
            </div>
          </Link>
          
          <div className="flex flex-col gap-1 flex-1">
            <NavItem
              key="dashboard"
              icon={LayoutDashboard}
              label="Dashboard"
              to="/"
              isActive={isExactActiveRoute("/")}
              isCollapsed={isCollapsed}
            />

            <NavGroup
              label="Patients"
              icon={Users}
              isCollapsed={isCollapsed}
              isOpen={openGroups.patients}
              onToggle={() => toggleGroup("patients")}
            >
              <NavItem 
                icon={Users} 
                label="All Patients" 
                to="/patients" 
                isActive={isExactActiveRoute("/patients")} 
                isCollapsed={isCollapsed}
                isNested
              />
              <NavItem 
                icon={User} 
                label="Add Patient" 
                to="/patients/add" 
                isActive={isExactActiveRoute("/patients/add")} 
                isCollapsed={isCollapsed}
                isNested
              />
            </NavGroup>

            <NavGroup
              label="Appointments"
              icon={Calendar}
              isCollapsed={isCollapsed}
              isOpen={openGroups.appointments}
              onToggle={() => toggleGroup("appointments")}
            >
              <NavItem 
                icon={ClipboardList} 
                label="All Appointments" 
                to="/appointments" 
                isActive={isExactActiveRoute("/appointments")} 
                isCollapsed={isCollapsed}
                isNested
              />
              <NavItem 
                icon={Calendar} 
                label="Calendar" 
                to="/appointments/calendar" 
                isActive={isExactActiveRoute("/appointments/calendar")} 
                isCollapsed={isCollapsed}
                isNested
              />
            </NavGroup>

            <NavGroup
              label="Pharmacy"
              icon={ShoppingCart}
              isCollapsed={isCollapsed}
              isOpen={openGroups.pharmacy}
              onToggle={() => toggleGroup("pharmacy")}
            >
              <NavItem 
                icon={ShoppingCart} 
                label="Dispensary" 
                to="/pharmacy" 
                isActive={isExactActiveRoute("/pharmacy")} 
                isCollapsed={isCollapsed}
                isNested
              />
              <NavItem 
                icon={Package} 
                label="Stock" 
                to="/pharmacy/stock" 
                isActive={isExactActiveRoute("/pharmacy/stock")} 
                isCollapsed={isCollapsed}
                isNested
              />
            </NavGroup>

            <NavGroup
              label="Inventory"
              icon={Package}
              isCollapsed={isCollapsed}
              isOpen={openGroups.inventory}
              onToggle={() => toggleGroup("inventory")}
            >
              <NavItem 
                icon={Package} 
                label="All Items" 
                to="/inventory" 
                isActive={isExactActiveRoute("/inventory")} 
                isCollapsed={isCollapsed}
                isNested
              />
              <NavItem 
                icon={ClipboardList} 
                label="Suppliers" 
                to="/inventory/suppliers" 
                isActive={isExactActiveRoute("/inventory/suppliers")} 
                isCollapsed={isCollapsed}
                isNested
              />
            </NavGroup>

            <NavGroup
              label="Billing"
              icon={ClipboardList}
              isCollapsed={isCollapsed}
              isOpen={openGroups.billing}
              onToggle={() => toggleGroup("billing")}
            >
              <NavItem 
                icon={ClipboardList} 
                label="Overview" 
                to="/billing" 
                isActive={isExactActiveRoute("/billing")} 
                isCollapsed={isCollapsed}
                isNested
              />
              <NavItem 
                icon={FileText} 
                label="Invoices" 
                to="/billing/invoices" 
                isActive={isExactActiveRoute("/billing/invoices")} 
                isCollapsed={isCollapsed}
                isNested
              />
            </NavGroup>

            <NavGroup
              label="Reports"
              icon={BarChart3}
              isCollapsed={isCollapsed}
              isOpen={openGroups.reports}
              onToggle={() => toggleGroup("reports")}
            >
              <NavItem 
                icon={BarChart3} 
                label="Daily Reports" 
                to="/reports/daily" 
                isActive={isExactActiveRoute("/reports/daily")} 
                isCollapsed={isCollapsed}
                isNested
              />
              <NavItem 
                icon={PieChart} 
                label="Monthly Reports" 
                to="/reports/monthly" 
                isActive={isExactActiveRoute("/reports/monthly")} 
                isCollapsed={isCollapsed}
                isNested
              />
            </NavGroup>

            <NavGroup
              label="Documents"
              icon={FileText}
              isCollapsed={isCollapsed}
              isOpen={openGroups.documents}
              onToggle={() => toggleGroup("documents")}
            >
              <NavItem 
                icon={FileText} 
                label="All Documents" 
                to="/documents" 
                isActive={isExactActiveRoute("/documents")} 
                isCollapsed={isCollapsed}
                isNested
              />
              <NavItem 
                icon={FileText} 
                label="Upload" 
                to="/documents/upload" 
                isActive={isExactActiveRoute("/documents/upload")} 
                isCollapsed={isCollapsed}
                isNested
              />
            </NavGroup>

            <NavItem 
              icon={Settings} 
              label="Settings" 
              to="/settings" 
              isActive={isActiveRoute("/settings")} 
              isCollapsed={isCollapsed} 
            />
          </div>

          <div className="mt-auto pt-4 flex flex-col gap-2">
            <NavItem 
              icon={User} 
              label="Profile" 
              to="/profile" 
              isActive={isExactActiveRoute("/profile")} 
              isCollapsed={isCollapsed}
            />
            <div className="mb-2">
              {isCollapsed ? (
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-center px-2 py-3" 
                        onClick={handleLogout}
                      >
                        <LogOut className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Logout</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start px-4 py-3" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-4 h-5 w-5" />
                  Logout
                </Button>
              )}
            </div>
            <div className="flex items-center justify-between px-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="md:flex hidden"
              >
                <ChevronRight className={cn(
                  "h-5 w-5 transition-transform",
                  isCollapsed ? "" : "rotate-180"
                )} />
              </Button>
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
