
import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Download, FileText, Filter, Printer, RefreshCw } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Revenue data - simulated data for an Indian hospital
const revenueData = [
  { month: "Jan", outpatient: 980000, inpatient: 1350000, pharmacy: 560000, laboratory: 430000 },
  { month: "Feb", outpatient: 920000, inpatient: 1280000, pharmacy: 520000, laboratory: 410000 },
  { month: "Mar", outpatient: 1050000, inpatient: 1420000, pharmacy: 570000, laboratory: 450000 },
  { month: "Apr", outpatient: 1100000, inpatient: 1500000, pharmacy: 600000, laboratory: 470000 },
  { month: "May", outpatient: 1180000, inpatient: 1620000, pharmacy: 640000, laboratory: 500000 },
  { month: "Jun", outpatient: 1150000, inpatient: 1580000, pharmacy: 620000, laboratory: 490000 },
];

// Patient data by department
const patientsByDepartment = [
  { name: "General Medicine", patients: 1280 },
  { name: "Cardiology", patients: 750 },
  { name: "Orthopedics", patients: 680 },
  { name: "Pediatrics", patients: 620 },
  { name: "Gynecology", patients: 590 },
  { name: "Neurology", patients: 340 },
  { name: "Dermatology", patients: 310 },
  { name: "ENT", patients: 290 },
];

// Daily patient visits
const dailyPatientData = Array.from({ length: 30 }, (_, i) => {
  const date = subDays(new Date(), 29 - i);
  // Generate realistic fluctuating data with weekend dips
  const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  // Base count with some randomness
  let count = Math.floor(Math.random() * 30) + 100;
  
  // Reduce count for weekends
  if (isWeekend) {
    count = Math.floor(count * 0.6);
  }
  
  return {
    date: format(date, "MMM dd"),
    fullDate: date,
    patients: count,
  };
});

// Bed occupancy data
const bedOccupancyData = [
  { type: "Occupied", value: 176 },
  { type: "Available", value: 54 },
];
const totalBeds = bedOccupancyData.reduce((sum, item) => sum + item.value, 0);
const occupancyRate = Math.round((bedOccupancyData[0].value / totalBeds) * 100);

// Top procedures
const topProceduresData = [
  { name: "Appendectomy", count: 48, revenue: 1440000 },
  { name: "Cataract Surgery", count: 62, revenue: 1860000 },
  { name: "Cesarean Section", count: 35, revenue: 1750000 },
  { name: "Coronary Angioplasty", count: 29, revenue: 2900000 },
  { name: "Knee Replacement", count: 21, revenue: 2520000 },
];

// Insurance claims data
const insuranceClaimsData = [
  { month: "Jan", submitted: 180, processed: 165, pending: 15 },
  { month: "Feb", submitted: 190, processed: 175, pending: 15 },
  { month: "Mar", submitted: 205, processed: 185, pending: 20 },
  { month: "Apr", submitted: 220, processed: 195, pending: 25 },
  { month: "May", submitted: 235, processed: 210, pending: 25 },
  { month: "Jun", submitted: 250, processed: 215, pending: 35 },
];

// Staff performance data
const staffPerformanceData = [
  { name: "Dr. Sharma", patients: 142, satisfaction: 92, procedures: 28 },
  { name: "Dr. Patel", patients: 128, satisfaction: 96, procedures: 32 },
  { name: "Dr. Kumar", patients: 119, satisfaction: 88, procedures: 24 },
  { name: "Dr. Verma", patients: 135, satisfaction: 90, procedures: 30 },
  { name: "Dr. Singh", patients: 110, satisfaction: 94, procedures: 22 },
];

// Pie chart colors
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

// Department average wait times (in minutes)
const waitTimeData = [
  { name: "Emergency", time: 15 },
  { name: "General Medicine", time: 42 },
  { name: "Cardiology", time: 38 },
  { name: "Orthopedics", time: 35 },
  { name: "Pediatrics", time: 28 },
  { name: "Gynecology", time: 40 },
];

export default function Reports() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const [filter, setFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Report data refreshed");
    }, 1000);
  };

  const exportPDF = () => {
    toast.success("Report exported as PDF");
  };

  const exportCSV = () => {
    toast.success("Report exported as CSV");
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="mb-2">Reports</h1>
        <p className="text-muted-foreground">
          Generate and view hospital performance reports
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center space-x-2 flex-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className="w-full md:w-[300px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "PPP")} - {format(dateRange.to, "PPP")}
                    </>
                  ) : (
                    format(dateRange.from, "PPP")
                  )
                ) : (
                  "Select date range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="medicine">General Medicine</SelectItem>
            <SelectItem value="cardiology">Cardiology</SelectItem>
            <SelectItem value="pediatrics">Pediatrics</SelectItem>
            <SelectItem value="orthopedics">Orthopedics</SelectItem>
            <SelectItem value="gynecology">Gynecology</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={refreshData} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="outline" size="icon" onClick={exportPDF}>
            <FileText className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={exportCSV}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
        
        <Button onClick={() => toast.success("Report generated successfully")}>
          Generate Report
        </Button>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue (YTD)
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹38.2M</div>
                <p className="text-xs text-muted-foreground">
                  +18% from last year
                </p>
                <div className="mt-4 h-1 w-full bg-muted">
                  <div className="h-1 w-3/4 bg-primary rounded-full" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Patient Admissions
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3,720</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
                <div className="mt-4 h-1 w-full bg-muted">
                  <div className="h-1 w-2/3 bg-primary rounded-full" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Bed Occupancy
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{occupancyRate}%</div>
                <p className="text-xs text-muted-foreground">
                  {bedOccupancyData[0].value} of {totalBeds} beds occupied
                </p>
                <div className="mt-4 h-1 w-full bg-muted">
                  <div 
                    className="h-1 bg-primary rounded-full" 
                    style={{ width: `${occupancyRate}%` }} 
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg. Wait Time
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32 min</div>
                <p className="text-xs text-muted-foreground">
                  -5% from last month
                </p>
                <div className="mt-4 h-1 w-full bg-muted">
                  <div className="h-1 w-1/2 bg-primary rounded-full" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>
                  Monthly revenue by department
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                    <Tooltip 
                      formatter={(value) => [`₹${(value as number).toLocaleString()}`, undefined]}
                    />
                    <Legend />
                    <Bar dataKey="outpatient" name="Outpatient" fill="#8884d8" />
                    <Bar dataKey="inpatient" name="Inpatient" fill="#82ca9d" />
                    <Bar dataKey="pharmacy" name="Pharmacy" fill="#ffc658" />
                    <Bar dataKey="laboratory" name="Laboratory" fill="#ff8042" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Patient Traffic</CardTitle>
                <CardDescription>
                  Daily patient visits (last 30 days)
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dailyPatientData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      padding={{ left: 0, right: 0 }}
                      tick={{ fontSize: 12 }}
                      tickCount={6}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="patients"
                      name="Patient Visits"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Bed Occupancy</CardTitle>
                <CardDescription>
                  Current bed status
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="relative h-48 w-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={bedOccupancyData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={1}
                          dataKey="value"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {bedOccupancyData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={index === 0 ? "#8884d8" : "#82ca9d"}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{occupancyRate}%</div>
                        <div className="text-xs text-muted-foreground">Occupancy</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4 mt-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#8884d8] mr-2" />
                      <span className="text-sm">Occupied: {bedOccupancyData[0].value}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#82ca9d] mr-2" />
                      <span className="text-sm">Available: {bedOccupancyData[1].value}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
                <CardDescription>
                  Patient allocation by department
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={patientsByDepartment}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="patients"
                    >
                      {patientsByDepartment.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} patients`, undefined]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Wait Times</CardTitle>
                <CardDescription>
                  Average wait time by department
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={waitTimeData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => [`${value} minutes`, "Wait Time"]} />
                    <Legend />
                    <Bar dataKey="time" fill="#8884d8" name="Minutes" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analysis</CardTitle>
              <CardDescription>
                Monthly revenue breakdown by service category
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} />
                  <Tooltip formatter={(value) => [`₹${(value as number).toLocaleString()}`, undefined]} />
                  <Legend />
                  <Bar dataKey="outpatient" name="Outpatient" stackId="a" fill="#8884d8" />
                  <Bar dataKey="inpatient" name="Inpatient" stackId="a" fill="#82ca9d" />
                  <Bar dataKey="pharmacy" name="Pharmacy" stackId="a" fill="#ffc658" />
                  <Bar dataKey="laboratory" name="Laboratory" stackId="a" fill="#ff8042" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Procedures by Revenue</CardTitle>
                <CardDescription>
                  Highest revenue generating procedures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProceduresData.map((procedure) => (
                    <div key={procedure.name} className="flex items-center">
                      <div className="space-y-1 flex-1">
                        <p className="text-sm font-medium leading-none">
                          {procedure.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {procedure.count} procedures
                        </p>
                      </div>
                      <div className="font-medium">
                        ₹{(procedure.revenue / 100000).toFixed(1)}L
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Insurance Claims</CardTitle>
                <CardDescription>
                  Monthly insurance claim status
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={insuranceClaimsData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="processed" name="Processed" fill="#82ca9d" />
                    <Bar dataKey="pending" name="Pending" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Patients Tab */}
        <TabsContent value="patients" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Patient Demographics</CardTitle>
                <CardDescription>
                  Age distribution of patients
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "0-18", value: 840 },
                        { name: "19-35", value: 1420 },
                        { name: "36-50", value: 1280 },
                        { name: "51-65", value: 960 },
                        { name: "65+", value: 625 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {patientsByDepartment.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} patients`, undefined]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
                <CardDescription>
                  Patient gender breakdown
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="relative h-48 w-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Male", value: 2560 },
                            { name: "Female", value: 2480 },
                            { name: "Other", value: 85 },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={1}
                          dataKey="value"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          <Cell fill="#8884d8" />
                          <Cell fill="#82ca9d" />
                          <Cell fill="#ffc658" />
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} patients`, undefined]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Patient Intake</CardTitle>
                <CardDescription>
                  Method of admission
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Walk-in", value: 1850 },
                        { name: "Emergency", value: 650 },
                        { name: "Referral", value: 950 },
                        { name: "Transfer", value: 480 },
                        { name: "Online", value: 1195 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {patientsByDepartment.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} patients`, undefined]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Patient Visits</CardTitle>
              <CardDescription>
                Daily patient traffic over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dailyPatientData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    padding={{ left: 0, right: 0 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="patients"
                    name="Patient Visits"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Operations Tab */}
        <TabsContent value="operations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Bed Occupancy Trend</CardTitle>
                <CardDescription>
                  Monthly bed occupancy rate
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { month: "Jan", rate: 72 },
                      { month: "Feb", rate: 68 },
                      { month: "Mar", rate: 74 },
                      { month: "Apr", rate: 78 },
                      { month: "May", rate: 82 },
                      { month: "Jun", rate: 76 },
                    ]}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis unit="%" domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, "Occupancy Rate"]} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="rate"
                      name="Occupancy Rate"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Surgery Statistics</CardTitle>
                <CardDescription>
                  Monthly surgeries by type
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { month: "Jan", elective: 85, emergency: 28 },
                      { month: "Feb", elective: 78, emergency: 32 },
                      { month: "Mar", elective: 92, emergency: 35 },
                      { month: "Apr", elective: 88, emergency: 30 },
                      { month: "May", elective: 95, emergency: 38 },
                      { month: "Jun", elective: 90, emergency: 34 },
                    ]}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="elective" name="Elective" fill="#8884d8" />
                    <Bar dataKey="emergency" name="Emergency" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Department Efficiency</CardTitle>
              <CardDescription>
                Average patient wait times by department
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={waitTimeData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 100,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip formatter={(value) => [`${value} minutes`, "Wait Time"]} />
                  <Legend />
                  <Bar dataKey="time" fill="#8884d8" name="Minutes" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Staff Tab */}
        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Performance</CardTitle>
              <CardDescription>
                Metrics for top performing medical staff
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={staffPerformanceData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="patients" name="Patients Seen" fill="#8884d8" />
                  <Bar yAxisId="left" dataKey="procedures" name="Procedures" fill="#82ca9d" />
                  <Bar yAxisId="right" dataKey="satisfaction" name="Patient Satisfaction (%)" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Staff Distribution</CardTitle>
                <CardDescription>
                  Staff by role
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Doctors", value: 85 },
                        { name: "Nurses", value: 220 },
                        { name: "Admin", value: 45 },
                        { name: "Support", value: 68 },
                        { name: "Technicians", value: 32 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {patientsByDepartment.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} staff`, undefined]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Department Coverage</CardTitle>
                <CardDescription>
                  Staff allocation by department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Cardiology", staff: 42, status: "Adequate" },
                    { name: "Emergency", staff: 65, status: "Understaffed" },
                    { name: "Pediatrics", staff: 38, status: "Adequate" },
                    { name: "Orthopedics", staff: 35, status: "Adequate" },
                    { name: "Neurology", staff: 28, status: "Understaffed" },
                    { name: "Gynecology", staff: 32, status: "Adequate" },
                  ].map((dept) => (
                    <div key={dept.name} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="font-medium">{dept.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {dept.staff} staff
                        </div>
                      </div>
                      <Badge 
                        className={
                          dept.status === "Adequate" 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                        }
                      >
                        {dept.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Training Compliance</CardTitle>
                <CardDescription>
                  Staff training completion rate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {[
                    { name: "Safety Protocols", completion: 94 },
                    { name: "Infection Control", completion: 88 },
                    { name: "Emergency Response", completion: 82 },
                    { name: "Patient Care", completion: 96 },
                    { name: "Equipment Usage", completion: 78 },
                  ].map((training) => (
                    <div key={training.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{training.name}</div>
                        <div>{training.completion}%</div>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            training.completion > 90 
                              ? "bg-green-500" 
                              : training.completion > 80 
                              ? "bg-amber-500" 
                              : "bg-red-500"
                          }`}
                          style={{ width: `${training.completion}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
