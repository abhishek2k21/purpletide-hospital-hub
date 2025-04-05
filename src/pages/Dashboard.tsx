
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BedIcon,
  CalendarIcon,
  DollarSignIcon,
  TrendingUpIcon,
  UserIcon,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

// Demo data
const patientData = [
  { name: "Jan", count: 130 },
  { name: "Feb", count: 145 },
  { name: "Mar", count: 160 },
  { name: "Apr", count: 175 },
  { name: "May", count: 162 },
  { name: "Jun", count: 190 },
  { name: "Jul", count: 210 },
];

const revenueData = [
  { name: "Jan", revenue: 28000 },
  { name: "Feb", revenue: 32000 },
  { name: "Mar", revenue: 30000 },
  { name: "Apr", revenue: 36000 },
  { name: "May", revenue: 34000 },
  { name: "Jun", revenue: 38000 },
  { name: "Jul", revenue: 42000 },
];

const appointmentData = [
  { name: "Mon", count: 24 },
  { name: "Tue", count: 18 },
  { name: "Wed", count: 22 },
  { name: "Thu", count: 15 },
  { name: "Fri", count: 20 },
  { name: "Sat", count: 12 },
  { name: "Sun", count: 8 },
];

const bedOccupancyData = [
  { name: "ICU", value: 18 },
  { name: "General", value: 45 },
  { name: "Pediatric", value: 12 },
  { name: "Maternity", value: 9 },
  { name: "Surgery", value: 15 },
];

const COLORS = ["#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe"];

const activityLog = [
  {
    id: 1,
    action: "Patient admitted",
    patient: "John Doe",
    department: "Cardiology",
    time: "10 minutes ago",
    doctor: "Dr. Smith",
  },
  {
    id: 2,
    action: "Medicine dispensed",
    patient: "Sarah Johnson",
    medicine: "Amoxicillin",
    time: "25 minutes ago",
  },
  {
    id: 3,
    action: "Appointment scheduled",
    patient: "Michael Brown",
    department: "Orthopedics",
    time: "1 hour ago",
    doctor: "Dr. Garcia",
  },
  {
    id: 4,
    action: "Lab results updated",
    patient: "Emily Wilson",
    test: "Blood work",
    time: "2 hours ago",
  },
  {
    id: 5,
    action: "Patient discharged",
    patient: "Robert Miller",
    department: "General Surgery",
    time: "3 hours ago",
  },
];

// Card animations
const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.1, duration: 0.5 },
  }),
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of hospital performance and activity
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="initial"
          animate="animate"
        >
          <Card className="border-l-4 border-l-violet-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Active Patients
              </CardTitle>
              <UserIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">214</div>
              <p className="text-xs text-muted-foreground mt-1">
                <TrendingUpIcon className="inline h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 font-medium">12%</span>{" "}
                vs previous month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          custom={1}
          variants={cardVariants}
          initial="initial"
          animate="animate"
        >
          <Card className="border-l-4 border-l-violet-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Today's Appointments
              </CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-violet-500 font-medium">8 remaining</span>{" "}
                for today
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          custom={2}
          variants={cardVariants}
          initial="initial"
          animate="animate"
        >
          <Card className="border-l-4 border-l-violet-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Bed Occupancy
              </CardTitle>
              <BedIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">75%</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="font-medium">24 beds</span> available
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          custom={3}
          variants={cardVariants}
          initial="initial"
          animate="animate"
        >
          <Card className="border-l-4 border-l-violet-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Revenue
              </CardTitle>
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$42,500</div>
              <p className="text-xs text-muted-foreground mt-1">
                <TrendingUpIcon className="inline h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 font-medium">8.2%</span>{" "}
                vs previous month
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <Tabs defaultValue="today" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="beds">Bed Occupancy</TabsTrigger>
          <TabsTrigger value="medicine">Medicine Alerts</TabsTrigger>
        </TabsList>
        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={appointmentData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Admissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={patientData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#8b5cf6"
                      fill="#c4b5fd"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="beds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Bed Occupancy by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bedOccupancyData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({
                        cx,
                        cy,
                        midAngle,
                        innerRadius,
                        outerRadius,
                        percent,
                        index,
                      }) => {
                        const RADIAN = Math.PI / 180;
                        const radius =
                          innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x =
                          cx + radius * Math.cos(-midAngle * RADIAN);
                        const y =
                          cy + radius * Math.sin(-midAngle * RADIAN);

                        return (
                          <text
                            x={x}
                            y={y}
                            fill="#fff"
                            textAnchor={x > cx ? "start" : "end"}
                            dominantBaseline="central"
                          >
                            {`${bedOccupancyData[index].name} ${(
                              percent * 100
                            ).toFixed(0)}%`}
                          </text>
                        );
                      }}
                    >
                      {bedOccupancyData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="medicine" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medicine Stock Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-md bg-red-50 dark:border-red-900 dark:bg-red-950">
                  <div>
                    <h3 className="font-medium">Amoxicillin</h3>
                    <p className="text-sm text-muted-foreground">
                      Stock: <span className="text-red-500 font-medium">5</span>{" "}
                      / 50
                    </p>
                  </div>
                  <div className="py-1 px-2 text-xs rounded-md bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300">
                    Low Stock
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-red-200 rounded-md bg-red-50 dark:border-red-900 dark:bg-red-950">
                  <div>
                    <h3 className="font-medium">Ibuprofen IV</h3>
                    <p className="text-sm text-muted-foreground">
                      Stock: <span className="text-red-500 font-medium">8</span>{" "}
                      / 60
                    </p>
                  </div>
                  <div className="py-1 px-2 text-xs rounded-md bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300">
                    Low Stock
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-amber-200 rounded-md bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
                  <div>
                    <h3 className="font-medium">Insulin Regular</h3>
                    <p className="text-sm text-muted-foreground">
                      Stock:{" "}
                      <span className="text-amber-500 font-medium">12</span> / 40
                    </p>
                  </div>
                  <div className="py-1 px-2 text-xs rounded-md bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300">
                    Reorder Soon
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {activityLog.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className="w-2 h-2 mt-2 rounded-full bg-violet-500 shrink-0"></div>
                <div className="space-y-1">
                  <div className="font-medium">{activity.action}</div>
                  <div className="text-sm text-muted-foreground">
                    <span className="text-foreground">
                      {activity.patient}
                    </span>{" "}
                    {activity.department
                      ? `in ${activity.department}`
                      : activity.medicine
                      ? `received ${activity.medicine}`
                      : activity.test
                      ? `- ${activity.test}`
                      : ""}
                    {activity.doctor && ` with ${activity.doctor}`}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {activity.time}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
