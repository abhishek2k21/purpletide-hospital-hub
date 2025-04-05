
import { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  BadgeIndianRupee,
  CalendarDays,
  ChevronDown,
  CreditCard,
  Download,
  Eye,
  Filter,
  MoreHorizontal,
  Plus,
  Printer,
  Receipt,
  Search,
  Trash2,
  UserRound,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Dummy Indian patient data
const patients = [
  { id: "PAT-123456", name: "Ananya Patel" },
  { id: "PAT-234567", name: "Ravi Gupta" },
  { id: "PAT-345678", name: "Neha Sharma" },
  { id: "PAT-456123", name: "Arjun Nair" },
  { id: "PAT-456789", name: "Vikram Singh" },
  { id: "PAT-567890", name: "Deepika Reddy" },
  { id: "PAT-678901", name: "Sanjay Mehta" },
  { id: "PAT-789012", name: "Raj Kumar" },
  { id: "PAT-890123", name: "Priya Malhotra" },
  { id: "PAT-901234", name: "Rakesh Verma" },
];

// Initial invoice data
const initialInvoices = [
  {
    id: "INV-2024-0001",
    patientId: "PAT-123456",
    patientName: "Ananya Patel",
    date: new Date(2024, 3, 1),
    dueDate: new Date(2024, 3, 15),
    amount: 12500,
    status: "Paid",
    paymentMethod: "Credit Card",
    items: [
      { description: "General Consultation", amount: 1500 },
      { description: "Blood Test - Complete Hemogram", amount: 800 },
      { description: "X-Ray Chest", amount: 1200 },
      { description: "Medication", amount: 9000 },
    ],
    discount: 0,
    tax: 0,
  },
  {
    id: "INV-2024-0002",
    patientId: "PAT-234567",
    patientName: "Ravi Gupta",
    date: new Date(2024, 3, 2),
    dueDate: new Date(2024, 3, 16),
    amount: 65000,
    status: "Pending",
    paymentMethod: "Insurance",
    items: [
      { description: "Specialist Consultation", amount: 3000 },
      { description: "MRI Scan", amount: 12000 },
      { description: "Hospital Stay (3 days)", amount: 45000 },
      { description: "Medication", amount: 5000 },
    ],
    discount: 0,
    tax: 0,
  },
  {
    id: "INV-2024-0003",
    patientId: "PAT-345678",
    patientName: "Neha Sharma",
    date: new Date(2024, 3, 3),
    dueDate: new Date(2024, 3, 17),
    amount: 8500,
    status: "Overdue",
    paymentMethod: "Cash",
    items: [
      { description: "Dental Consultation", amount: 1000 },
      { description: "Root Canal Treatment", amount: 6000 },
      { description: "Medication", amount: 1500 },
    ],
    discount: 0,
    tax: 0,
  },
  {
    id: "INV-2024-0004",
    patientId: "PAT-456123",
    patientName: "Arjun Nair",
    date: new Date(2024, 3, 4),
    dueDate: new Date(2024, 3, 18),
    amount: 18000,
    status: "Paid",
    paymentMethod: "UPI",
    items: [
      { description: "Orthopedic Consultation", amount: 2000 },
      { description: "Physiotherapy Sessions (5)", amount: 5000 },
      { description: "Knee Brace", amount: 8000 },
      { description: "Medication", amount: 3000 },
    ],
    discount: 0,
    tax: 0,
  },
  {
    id: "INV-2024-0005",
    patientId: "PAT-456789",
    patientName: "Vikram Singh",
    date: new Date(2024, 3, 5),
    dueDate: new Date(2024, 3, 19),
    amount: 150000,
    status: "Pending",
    paymentMethod: "Insurance",
    items: [
      { description: "Cardiac Consultation", amount: 3500 },
      { description: "Angiography", amount: 25000 },
      { description: "Angioplasty Procedure", amount: 110000 },
      { description: "Hospital Stay (2 days)", amount: 30000 },
      { description: "Medication", amount: 11500 },
    ],
    discount: 30000,
    tax: 0,
  },
  {
    id: "INV-2024-0006",
    patientId: "PAT-567890",
    patientName: "Deepika Reddy",
    date: new Date(2024, 3, 6),
    dueDate: new Date(2024, 3, 20),
    amount: 7500,
    status: "Paid",
    paymentMethod: "Credit Card",
    items: [
      { description: "Gynecology Consultation", amount: 2500 },
      { description: "Ultrasound", amount: 3000 },
      { description: "Lab Tests", amount: 2000 },
    ],
    discount: 0,
    tax: 0,
  },
  {
    id: "INV-2024-0007",
    patientId: "PAT-678901",
    patientName: "Sanjay Mehta",
    date: new Date(2024, 3, 7),
    dueDate: new Date(2024, 3, 21),
    amount: 4500,
    status: "Overdue",
    paymentMethod: "Pending",
    items: [
      { description: "ENT Consultation", amount: 1500 },
      { description: "Endoscopy", amount: 2500 },
      { description: "Medication", amount: 500 },
    ],
    discount: 0,
    tax: 0,
  },
];

// Payment methods
const paymentMethods = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "UPI",
  "Insurance",
  "Bank Transfer",
  "Pending",
];

// Invoice schema
const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number().min(0, "Amount cannot be negative"),
});

const invoiceSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
  discount: z.coerce.number().min(0, "Discount cannot be negative").optional(),
  tax: z.coerce.number().min(0, "Tax cannot be negative").optional(),
  paymentMethod: z.string().min(1, "Payment method is required"),
  status: z.string().min(1, "Status is required"),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

export default function Billing() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openNewInvoice, setOpenNewInvoice] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [viewInvoice, setViewInvoice] = useState(false);
  
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      patientId: "",
      date: new Date(),
      dueDate: new Date(),
      items: [{ description: "", amount: 0 }],
      discount: 0,
      tax: 0,
      paymentMethod: "",
      status: "Pending",
    },
  });
  
  // Filter invoices based on search and status
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.patientId.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "All" || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Calculate stats
  const totalPaid = invoices
    .filter((inv) => inv.status === "Paid")
    .reduce((sum, inv) => sum + inv.amount, 0);
    
  const totalPending = invoices
    .filter((inv) => inv.status === "Pending")
    .reduce((sum, inv) => sum + inv.amount, 0);
    
  const totalOverdue = invoices
    .filter((inv) => inv.status === "Overdue")
    .reduce((sum, inv) => sum + inv.amount, 0);
  
  // Add empty item field
  const addItem = () => {
    const items = form.getValues("items") || [];
    form.setValue("items", [...items, { description: "", amount: 0 }]);
  };
  
  // Remove item field
  const removeItem = (index: number) => {
    const items = form.getValues("items");
    if (items.length <= 1) return;
    form.setValue(
      "items",
      items.filter((_, i) => i !== index)
    );
  };
  
  // Calculate totals from form values
  const calculateTotal = () => {
    const items = form.getValues("items") || [];
    const discount = form.getValues("discount") || 0;
    const tax = form.getValues("tax") || 0;
    
    const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const total = subtotal - discount + tax;
    
    return {
      subtotal,
      discount,
      tax,
      total,
    };
  };
  
  // Handle delete invoice
  const handleDeleteInvoice = (id: string) => {
    setInvoices(invoices.filter((inv) => inv.id !== id));
    toast.success("Invoice deleted successfully");
  };
  
  // Handle view invoice
  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setViewInvoice(true);
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "Overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  // Create new invoice
  const onSubmit = (data: InvoiceFormValues) => {
    const { subtotal, total } = calculateTotal();
    
    const patient = patients.find((p) => p.id === data.patientId);
    
    if (!patient) {
      toast.error("Patient not found");
      return;
    }
    
    // Ensure all items have required properties
    const validatedItems = data.items.map(item => ({
      description: item.description,
      amount: item.amount
    }));
    
    const newInvoice = {
      id: `INV-2024-${String(invoices.length + 1).padStart(4, "0")}`,
      patientId: data.patientId,
      patientName: patient.name,
      date: data.date,
      dueDate: data.dueDate,
      amount: total,
      status: data.status,
      paymentMethod: data.paymentMethod,
      items: validatedItems,
      discount: data.discount || 0,
      tax: data.tax || 0,
    };
    
    setInvoices([newInvoice, ...invoices]);
    toast.success("Invoice created successfully");
    setOpenNewInvoice(false);
    form.reset();
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="mb-2">Billing</h1>
            <p className="text-muted-foreground">
              Manage patient invoices and payments
            </p>
          </div>
          
          <Button onClick={() => setOpenNewInvoice(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Collected
              </CardTitle>
              <BadgeIndianRupee className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ₹{totalPaid.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                From {invoices.filter(inv => inv.status === "Paid").length} paid invoices
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Payments
              </CardTitle>
              <BadgeIndianRupee className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                ₹{totalPending.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                From {invoices.filter(inv => inv.status === "Pending").length} pending invoices
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Overdue Payments
              </CardTitle>
              <BadgeIndianRupee className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ₹{totalOverdue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                From {invoices.filter(inv => inv.status === "Overdue").length} overdue invoices
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>
              Manage and track patient invoices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-8"
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="w-full md:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
            
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-10 border rounded-md">
                <Receipt className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No invoices found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-3 font-medium">Invoice</th>
                      <th className="text-left p-3 font-medium">Patient</th>
                      <th className="text-left p-3 font-medium hidden md:table-cell">Date</th>
                      <th className="text-left p-3 font-medium hidden md:table-cell">Amount</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-right p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredInvoices.map((invoice) => (
                      <motion.tr 
                        key={invoice.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <td className="p-3">
                          <div className="font-medium">{invoice.id}</div>
                          <div className="text-xs text-muted-foreground md:hidden">
                            {format(invoice.date, "MMM dd, yyyy")} • ₹{invoice.amount.toLocaleString()}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {invoice.patientName.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{invoice.patientName}</div>
                              <div className="text-xs text-muted-foreground">
                                {invoice.patientId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 hidden md:table-cell">
                          {format(invoice.date, "MMM dd, yyyy")}
                        </td>
                        <td className="p-3 hidden md:table-cell">
                          ₹{invoice.amount.toLocaleString()}
                        </td>
                        <td className="p-3">
                          <Badge className={getStatusColor(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewInvoice(invoice)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Printer className="h-4 w-4 mr-2" />
                                Print
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600 focus:text-red-600"
                                onClick={() => handleDeleteInvoice(invoice.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Invoice Dialog */}
      <Dialog open={openNewInvoice} onOpenChange={setOpenNewInvoice}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
            <DialogDescription>
              Enter invoice details for the patient
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.name} ({patient.id})
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
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {paymentMethods.map((method) => (
                            <SelectItem key={method} value={method}>
                              {method}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Invoice Date</FormLabel>
                      <Input
                        type="date"
                        value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          field.onChange(date);
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date</FormLabel>
                      <Input
                        type="date"
                        value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          field.onChange(date);
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <FormLabel>Invoice Items</FormLabel>
                {form.getValues().items?.map((_, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      placeholder="Item description"
                      {...form.register(`items.${index}.description` as const)}
                      className="flex-1"
                    />
                    <div className="relative">
                      <BadgeIndianRupee className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="pl-8"
                        {...form.register(`items.${index}.amount` as const, {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={form.getValues().items?.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {form.formState.errors.items && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.items.message}
                  </p>
                )}
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount (₹)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax (₹)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="border rounded-md p-4 bg-muted/50">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>
                      ₹{calculateTotal().subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount:</span>
                    <span>
                      - ₹{calculateTotal().discount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax:</span>
                    <span>
                      ₹{calculateTotal().tax.toLocaleString()}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>
                      ₹{calculateTotal().total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenNewInvoice(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Invoice</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* View Invoice Dialog */}
      {selectedInvoice && (
        <Dialog open={viewInvoice} onOpenChange={setViewInvoice}>
          <DialogContent className="max-h-[90vh] overflow-y-auto max-w-4xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>Invoice {selectedInvoice.id}</DialogTitle>
                <Badge className={getStatusColor(selectedInvoice.status)}>
                  {selectedInvoice.status}
                </Badge>
              </div>
              <DialogDescription>
                Generated on {format(selectedInvoice.date, "MMMM dd, yyyy")}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Hospital</h3>
                  <div className="mt-1">
                    <p className="font-medium">City Hospital & Research Center</p>
                    <p>123 Healthcare Avenue</p>
                    <p>Mumbai, Maharashtra 400001</p>
                    <p>India</p>
                    <p>GST: 27AABCU9603R1ZX</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Patient</h3>
                  <div className="mt-1">
                    <div className="flex items-center gap-2">
                      <UserRound className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{selectedInvoice.patientName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedInvoice.patientId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <span>Due: {format(selectedInvoice.dueDate, "MMMM dd, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-muted-foreground" />
                      <span>Payment Method: {selectedInvoice.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Items</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="bg-muted/50">
                        <th scope="col" className="px-4 py-3 text-left text-sm font-medium">Description</th>
                        <th scope="col" className="px-4 py-3 text-right text-sm font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {selectedInvoice.items.map((item: any, index: number) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm">{item.description}</td>
                          <td className="px-4 py-3 text-sm text-right">₹{item.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="border rounded-md p-4 bg-muted/50">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>
                      ₹{selectedInvoice.items
                        .reduce((sum: number, item: any) => sum + item.amount, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                  {selectedInvoice.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Discount:</span>
                      <span>- ₹{selectedInvoice.discount.toLocaleString()}</span>
                    </div>
                  )}
                  {selectedInvoice.tax > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax:</span>
                      <span>₹{selectedInvoice.tax.toLocaleString()}</span>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>₹{selectedInvoice.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                {selectedInvoice.status === "Pending" && (
                  <Button 
                    onClick={() => {
                      const updatedInvoices = invoices.map((inv) => {
                        if (inv.id === selectedInvoice.id) {
                          return { ...inv, status: "Paid" };
                        }
                        return inv;
                      });
                      setInvoices(updatedInvoices);
                      setSelectedInvoice({ ...selectedInvoice, status: "Paid" });
                      toast.success("Payment marked as received");
                    }}
                  >
                    Mark as Paid
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
