
import { useState } from "react";
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Legend, 
  Line, 
  LineChart, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  Sector, 
  Tooltip as RechartsTooltip, 
  XAxis, 
  YAxis,
  Area,
  AreaChart
} from "recharts";
import { 
  BarChart3, 
  Calendar as CalendarIcon,
  ChevronDown,
  Download,
  FileText,
  Filter,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Search,
  Share2,
  Printer
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Revenue data
const revenueData = [
  { month: 'Jan', amount: 120000 },
  { month: 'Feb', amount: 90000 },
  { month: 'Mar', amount: 100000 },
  { month: 'Apr', amount: 130000 },
  { month: 'May', amount: 80000 },
  { month: 'Jun', amount: 110000 },
  { month: 'Jul', amount: 150000 },
  { month: 'Aug', amount: 160000 },
  { month: 'Sep', amount: 170000 },
  { month: 'Oct', amount: 140000 },
  { month: 'Nov', amount: 120000 },
  { month: 'Dec', amount: 190000 }
];

// Appointment data
const appointmentData = [
  { month: 'Jan', count: 150 },
  { month: 'Feb', count: 120 },
  { month: 'Mar', count: 140 },
  { month: 'Apr', count: 180 },
  { month: 'May', count: 120 },
  { month: 'Jun', count: 110 },
  { month: 'Jul', count: 130 },
  { month: 'Aug', count: 170 },
  { month: 'Sep', count: 190 },
  { month: 'Oct', count: 160 },
  { month: 'Nov', count: 150 },
  { month: 'Dec', count: 130 }
];

// Bed usage data
const bedUsageData = [
  { month: 'Jan', occupancy: 75 },
  { month: 'Feb', occupancy: 82 },
  { month: 'Mar', occupancy: 78 },
  { month: 'Apr', occupancy: 85 },
  { month: 'May', occupancy: 90 },
  { month: 'Jun', occupancy: 87 },
  { month: 'Jul', occupancy: 83 },
  { month: 'Aug', occupancy: 89 },
  { month: 'Sep', occupancy: 92 },
  { month: 'Oct', occupancy: 88 },
  { month: 'Nov', occupancy: 85 },
  { month: 'Dec', occupancy: 79 }
];

// Department performance data
const departmentData = [
  { name: 'Cardiology', patients: 450, revenue: 850000 },
  { name: 'Orthopedics', patients: 380, revenue: 780000 },
  { name: 'Neurology', patients: 320, revenue: 650000 },
  { name: 'Pediatrics', patients: 290, revenue: 420000 },
  { name: 'Oncology', patients: 250, revenue: 580000 },
  { name: 'Dermatology', patients: 220, revenue: 390000 },
  { name: 'Psychiatry', patients: 180, revenue: 350000 },
  { name: 'Radiology', patients: 150, revenue: 320000 },
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState("revenue");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date()
  });
  const [dateRange, setDateRange] = useState<"1m" | "3m" | "6m" | "1y" | "all">("all");
  
  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (range) {
      setDate(range);
    }
  };
  
  const handleQuickDateRange = (range: "1m" | "3m" | "6m" | "1y" | "all") => {
    setDateRange(range);
    
    const now = new Date();
    let fromDate;
    
    switch (range) {
      case "1m":
        fromDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case "3m":
        fromDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case "6m":
        fromDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        break;
      case "1y":
        fromDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      case "all":
      default:
        fromDate = new Date(2023, 0, 1);
        break;
    }
    
    setDate({
      from: fromDate,
      to: now
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="mb-2">Reports & Analytics</h1>
        <p className="text-muted-foreground">
          Gain insights into your hospital's performance
        </p>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="grid grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="revenue" onClick={() => setActiveTab("revenue")}>Revenue</TabsTrigger>
          <TabsTrigger value="appointments" onClick={() => setActiveTab("appointments")}>Appointments</TabsTrigger>
          <TabsTrigger value="bed-usage" onClick={() => setActiveTab("bed-usage")}>Bed Usage</TabsTrigger>
          <TabsTrigger value="department-performance" onClick={() => setActiveTab("department-performance")}>Department Performance</TabsTrigger>
        </TabsList>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                size="sm"
                className={cn(
                  "justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={handleDateRangeSelect}
                numberOfMonths={2}
              />
              <div className="flex justify-between items-center p-4">
                <Button 
                  variant="link" 
                  size="sm"
                  onClick={() => handleQuickDateRange("all")}
                >
                  Reset
                </Button>
                <div className="flex items-center gap-2">
                  <Button 
                    variant={dateRange === "1m" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleQuickDateRange("1m")}
                  >
                    1M
                  </Button>
                  <Button 
                    variant={dateRange === "3m" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleQuickDateRange("3m")}
                  >
                    3M
                  </Button>
                  <Button 
                    variant={dateRange === "6m" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleQuickDateRange("6m")}
                  >
                    6M
                  </Button>
                  <Button 
                    variant={dateRange === "1y" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleQuickDateRange("1y")}
                  >
                    1Y
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>
                Total revenue generated over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>
                Revenue distribution by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Trends</CardTitle>
              <CardDescription>
                Number of appointments scheduled over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={appointmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Appointment Distribution</CardTitle>
              <CardDescription>
                Distribution of appointments by department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={appointmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bed-usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bed Occupancy Rate</CardTitle>
              <CardDescription>
                Percentage of beds occupied over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={bedUsageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Area type="monotone" dataKey="occupancy" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Bed Usage Analysis</CardTitle>
              <CardDescription>
                Analysis of bed usage patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bedUsageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="occupancy" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="department-performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Revenue</CardTitle>
              <CardDescription>
                Revenue generated by each department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Patient Volume by Department</CardTitle>
              <CardDescription>
                Number of patients served by each department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="patients" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
