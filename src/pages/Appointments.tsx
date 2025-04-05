
import { useState } from "react";
import { format, addDays, startOfWeek, addWeeks, subWeeks } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Filter, List, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

// Dummy doctors data with Indian names
const doctors = [
  {
    id: 1,
    name: "Dr. Rahul Sharma",
    specialty: "Cardiologist",
    avatar: "",
    available: true,
  },
  {
    id: 2,
    name: "Dr. Priya Patel",
    specialty: "Neurologist",
    avatar: "",
    available: true,
  },
  {
    id: 3,
    name: "Dr. Anil Kumar",
    specialty: "Orthopedic",
    avatar: "",
    available: false,
  },
  {
    id: 4,
    name: "Dr. Meera Verma",
    specialty: "Pediatrician",
    avatar: "",
    available: true,
  },
  {
    id: 5,
    name: "Dr. Vikram Singh",
    specialty: "Dermatologist",
    avatar: "",
    available: true,
  },
  {
    id: 6,
    name: "Dr. Sunita Gupta",
    specialty: "Gynecologist",
    avatar: "",
    available: true,
  },
];

// Dummy appointments data with Indian names and context
const initialAppointments = [
  {
    id: 1,
    patientName: "Ramesh Joshi",
    patientId: 2,
    doctorName: "Dr. Rahul Sharma",
    doctorId: 1,
    date: new Date(2024, 3, 8, 10, 30),
    status: "Confirmed",
    type: "Check-up",
    notes: "Regular cardiac check-up",
  },
  {
    id: 2,
    patientName: "Anjali Desai",
    patientId: 3,
    doctorName: "Dr. Priya Patel",
    doctorId: 2,
    date: new Date(2024, 3, 8, 14, 0),
    status: "Pending",
    type: "Consultation",
    notes: "Headache and dizziness",
  },
  {
    id: 3,
    patientName: "Suresh Kumar",
    patientId: 4,
    doctorName: "Dr. Anil Kumar",
    doctorId: 3,
    date: new Date(2024, 3, 9, 11, 15),
    status: "Confirmed",
    type: "Surgery",
    notes: "Knee replacement follow-up",
  },
  {
    id: 4,
    patientName: "Pooja Singh",
    patientId: 5,
    doctorName: "Dr. Meera Verma",
    doctorId: 4,
    date: new Date(2024, 3, 9, 9, 0),
    status: "Confirmed",
    type: "Vaccination",
    notes: "Routine vaccination for 1-year-old",
  },
  {
    id: 5,
    patientName: "Kiran Mehta",
    patientId: 6,
    doctorName: "Dr. Vikram Singh",
    doctorId: 5,
    date: new Date(2024, 3, 10, 16, 30),
    status: "Cancelled",
    type: "Check-up",
    notes: "Skin rash examination",
  },
];

// Create schema for appointment form
const appointmentSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  date: z.date({
    required_error: "Appointment date is required",
  }),
  time: z.string().min(1, "Appointment time is required"),
  type: z.string().min(1, "Appointment type is required"),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

export default function Appointments() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [searchTerm, setSearchTerm] = useState("");
  const [openNewAppointment, setOpenNewAppointment] = useState(false);
  
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: "",
      doctorId: "",
      date: new Date(),
      time: "",
      type: "",
      notes: "",
    },
  });

  // Dummy patients from the patients list with Indian names
  const patients = [
    { id: 1, name: "Ramesh Joshi" },
    { id: 2, name: "Anjali Desai" },
    { id: 3, name: "Suresh Kumar" },
    { id: 4, name: "Pooja Singh" },
    { id: 5, name: "Kiran Mehta" },
    { id: 6, name: "Deepak Gupta" },
    { id: 7, name: "Neha Reddy" },
    { id: 8, name: "Vijay Malhotra" },
  ];

  const appointmentTypes = [
    "Check-up",
    "Consultation",
    "Follow-up",
    "Surgery",
    "Vaccination",
    "Physical Therapy",
    "Test Results",
  ];

  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
  ];

  function nextWeek() {
    setWeekStart(addWeeks(weekStart, 1));
  }

  function prevWeek() {
    setWeekStart(subWeeks(weekStart, 1));
  }

  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  function getAppointmentsForDate(date: Date) {
    return appointments.filter(
      (apt) =>
        apt.date.getDate() === date.getDate() &&
        apt.date.getMonth() === date.getMonth() &&
        apt.date.getFullYear() === date.getFullYear()
    );
  }

  const filteredAppointments = appointments.filter(
    (apt) =>
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data: AppointmentFormValues) => {
    // Parse the time string and combine with date
    const [hours, minutes] = data.time.split(':').map(Number);
    const appointmentDate = new Date(data.date);
    appointmentDate.setHours(hours, minutes);
    
    const doctor = doctors.find((doc) => doc.id === Number(data.doctorId));
    const patient = patients.find((pat) => pat.id === Number(data.patientId));
    
    if (!doctor || !patient) {
      toast.error("Invalid doctor or patient selection");
      return;
    }
    
    const newAppointment = {
      id: appointments.length + 1,
      patientName: patient.name,
      patientId: patient.id,
      doctorName: doctor.name,
      doctorId: doctor.id,
      date: appointmentDate,
      status: "Pending",
      type: data.type,
      notes: data.notes || "",
    };
    
    setAppointments([...appointments, newAppointment]);
    toast.success("Appointment scheduled successfully");
    setOpenNewAppointment(false);
    form.reset();
  };
  
  function getStatusColor(status: string) {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="mb-2">Appointments</h1>
            <p className="text-muted-foreground">
              Schedule and manage patient appointments
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setView("calendar")}
              className={cn(view === "calendar" && "bg-accent")}
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setView("list")}
              className={cn(view === "list" && "bg-accent")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button onClick={() => setOpenNewAppointment(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Appointment Schedule</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    className="pl-8 w-full" 
                    placeholder="Search appointments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>All Appointments</DropdownMenuItem>
                    <DropdownMenuItem>Confirmed</DropdownMenuItem>
                    <DropdownMenuItem>Pending</DropdownMenuItem>
                    <DropdownMenuItem>Cancelled</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {view === "calendar" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Button variant="ghost" onClick={prevWeek}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous Week
                  </Button>
                  <div className="font-medium">
                    {format(weekStart, "MMMM d")} - {format(addDays(weekStart, 6), "MMMM d, yyyy")}
                  </div>
                  <Button variant="ghost" onClick={nextWeek}>
                    Next Week
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-7 gap-4 mt-4">
                  {weekDates.map((date) => (
                    <div key={date.toISOString()} className="border rounded-lg p-2">
                      <div className={cn(
                        "text-center py-1 rounded-md mb-2",
                        new Date().toDateString() === date.toDateString() 
                          ? "bg-violet-100 text-violet-800 dark:bg-violet-800 dark:text-violet-100" 
                          : "text-muted-foreground"
                      )}>
                        <div className="font-medium">{format(date, "EEE")}</div>
                        <div>{format(date, "d")}</div>
                      </div>
                      <div className="space-y-2">
                        {getAppointmentsForDate(date).map((apt) => (
                          <motion.div 
                            key={apt.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-2 rounded-md text-xs bg-card border"
                          >
                            <div className="font-medium">{format(apt.date, "h:mm a")}</div>
                            <div className="truncate">{apt.patientName}</div>
                            <div className="text-muted-foreground truncate">{apt.doctorName}</div>
                            <Badge className={cn("mt-1", getStatusColor(apt.status))}>
                              {apt.status}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left">Patient</th>
                        <th className="px-4 py-3 text-left">Doctor</th>
                        <th className="px-4 py-3 text-left">Date & Time</th>
                        <th className="px-4 py-3 text-left">Type</th>
                        <th className="px-4 py-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAppointments.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                            No appointments found
                          </td>
                        </tr>
                      ) : (
                        filteredAppointments.map((apt) => (
                          <motion.tr 
                            key={apt.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="border-b"
                          >
                            <td className="px-4 py-3">{apt.patientName}</td>
                            <td className="px-4 py-3">{apt.doctorName}</td>
                            <td className="px-4 py-3">{format(apt.date, "PPp")}</td>
                            <td className="px-4 py-3">{apt.type}</td>
                            <td className="px-4 py-3">
                              <Badge className={getStatusColor(apt.status)}>
                                {apt.status}
                              </Badge>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* New Appointment Dialog */}
      <Dialog open={openNewAppointment} onOpenChange={setOpenNewAppointment}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
            <DialogDescription>
              Fill in the details to schedule a new appointment
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id.toString()}>
                            {patient.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="doctorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doctor</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select doctor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {doctors.map((doctor) => (
                          <SelectItem 
                            key={doctor.id} 
                            value={doctor.id.toString()}
                            disabled={!doctor.available}
                          >
                            {doctor.name} ({doctor.specialty})
                            {!doctor.available && " - Unavailable"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className="pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date > new Date(2025, 0, 1)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {appointmentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input placeholder="Additional notes or details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOpenNewAppointment(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Schedule Appointment</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
