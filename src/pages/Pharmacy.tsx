
import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Box, Clock, Filter, GridIcon, ListBullet, PackageCheck, PackageSearch, Plus, Search } from "lucide-react";

// Indian medication data with generic and brand names
const initialMedications = [
  {
    id: 1,
    name: "Paracetamol",
    brandName: "Crocin",
    category: "Analgesic",
    stock: 150,
    price: 25.50,
    expiry: "2025-06-30",
    manufacturer: "GlaxoSmithKline",
    description: "For fever and mild to moderate pain relief",
    dosage: "500mg",
    lowStock: false,
  },
  {
    id: 2,
    name: "Amoxicillin",
    brandName: "Mox",
    category: "Antibiotic",
    stock: 80,
    price: 120.75,
    expiry: "2025-03-15",
    manufacturer: "Cipla",
    description: "Broad-spectrum antibiotic for bacterial infections",
    dosage: "250mg",
    lowStock: false,
  },
  {
    id: 3,
    name: "Metformin",
    brandName: "Glycomet",
    category: "Antidiabetic",
    stock: 45,
    price: 85.30,
    expiry: "2025-08-20",
    manufacturer: "USV",
    description: "For treatment of type 2 diabetes",
    dosage: "500mg",
    lowStock: true,
  },
  {
    id: 4,
    name: "Atorvastatin",
    brandName: "Atorva",
    category: "Lipid-lowering",
    stock: 60,
    price: 130.00,
    expiry: "2025-04-10",
    manufacturer: "Sun Pharma",
    description: "Lowers cholesterol and triglycerides in the blood",
    dosage: "10mg",
    lowStock: false,
  },
  {
    id: 5,
    name: "Omeprazole",
    brandName: "Omez",
    category: "Antacid",
    stock: 30,
    price: 95.50,
    expiry: "2024-12-05",
    manufacturer: "Dr. Reddy's",
    description: "For treatment of acid reflux and ulcers",
    dosage: "20mg",
    lowStock: true,
  },
  {
    id: 6,
    name: "Cetirizine",
    brandName: "Alerid",
    category: "Antihistamine",
    stock: 110,
    price: 40.25,
    expiry: "2025-05-12",
    manufacturer: "Cipla",
    description: "For allergies and hay fever",
    dosage: "10mg",
    lowStock: false,
  },
  {
    id: 7,
    name: "Diclofenac",
    brandName: "Voveran",
    category: "NSAID",
    stock: 75,
    price: 65.80,
    expiry: "2025-02-28",
    manufacturer: "Novartis",
    description: "Anti-inflammatory for pain and inflammation",
    dosage: "50mg",
    lowStock: false,
  },
  {
    id: 8,
    name: "Amlodipine",
    brandName: "Amlopin",
    category: "Antihypertensive",
    stock: 25,
    price: 110.40,
    expiry: "2025-01-15",
    manufacturer: "Micro Labs",
    description: "For high blood pressure and chest pain",
    dosage: "5mg",
    lowStock: true,
  },
  {
    id: 9,
    name: "Levothyroxine",
    brandName: "Thyronorm",
    category: "Hormone",
    stock: 55,
    price: 145.60,
    expiry: "2025-07-22",
    manufacturer: "Abbott",
    description: "For hypothyroidism",
    dosage: "50μg",
    lowStock: false,
  },
  {
    id: 10,
    name: "Azithromycin",
    brandName: "Azee",
    category: "Antibiotic",
    stock: 20,
    price: 155.75,
    expiry: "2024-09-30",
    manufacturer: "Cipla",
    description: "For bacterial infections",
    dosage: "250mg",
    lowStock: true,
  },
  {
    id: 11,
    name: "Pantoprazole",
    brandName: "Pan",
    category: "Antacid",
    stock: 65,
    price: 90.20,
    expiry: "2025-03-25",
    manufacturer: "Alkem",
    description: "For acid-related disorders of stomach and intestine",
    dosage: "40mg",
    lowStock: false,
  },
  {
    id: 12,
    name: "Losartan",
    brandName: "Losar",
    category: "Antihypertensive",
    stock: 40,
    price: 125.30,
    expiry: "2025-05-18",
    manufacturer: "Zydus",
    description: "For high blood pressure and heart failure",
    dosage: "50mg",
    lowStock: true,
  }
];

// Categories
const medicationCategories = [
  "All",
  "Analgesic",
  "Antibiotic",
  "Antidiabetic",
  "Antihypertensive",
  "Antacid",
  "Antihistamine",
  "NSAID",
  "Lipid-lowering",
  "Hormone",
];

const stockThreshold = 50; // Items below this are considered low stock

// Medicine schema
const medicineSchema = z.object({
  name: z.string().min(2, "Name is required"),
  brandName: z.string().min(1, "Brand name is required"),
  category: z.string().min(1, "Category is required"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  expiry: z.string().min(1, "Expiry date is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  description: z.string().optional(),
  dosage: z.string().min(1, "Dosage is required"),
});

type MedicineFormValues = z.infer<typeof medicineSchema>;

export default function Pharmacy() {
  const [medications, setMedications] = useState(initialMedications);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [openNewMedicine, setOpenNewMedicine] = useState(false);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  
  const form = useForm<MedicineFormValues>({
    resolver: zodResolver(medicineSchema),
    defaultValues: {
      name: "",
      brandName: "",
      category: "",
      stock: 0,
      price: 0,
      expiry: "",
      manufacturer: "",
      description: "",
      dosage: "",
    },
  });

  // Filter medications based on search, category and low stock
  const filteredMedications = medications.filter((med) => {
    const matchesSearch = 
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.brandName.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = selectedCategory === "All" || med.category === selectedCategory;
    
    const matchesStock = showLowStockOnly ? med.stock < stockThreshold : true;
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const onSubmit = (data: MedicineFormValues) => {
    const newMedicine = {
      id: medications.length + 1,
      ...data,
      lowStock: data.stock < stockThreshold,
    };
    
    setMedications([...medications, newMedicine]);
    toast.success("Medicine added successfully");
    setOpenNewMedicine(false);
    form.reset();
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="mb-2">Pharmacy</h1>
            <p className="text-muted-foreground">
              Manage medications and prescriptions
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setView("grid")}
              className={view === "grid" ? "bg-accent" : ""}
            >
              <GridIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setView("list")}
              className={view === "list" ? "bg-accent" : ""}
            >
              <ListBullet className="h-4 w-4" />
            </Button>
            <Button onClick={() => setOpenNewMedicine(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Medicine
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Search medications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {medicationCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant={showLowStockOnly ? "default" : "outline"} 
            onClick={() => setShowLowStockOnly(!showLowStockOnly)}
          >
            <PackageSearch className="h-4 w-4 mr-2" />
            Low Stock Only
          </Button>
        </div>
        
        {filteredMedications.length === 0 ? (
          <div className="p-8 text-center border rounded-lg">
            <PackageSearch className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No medications found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
            <Button onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setShowLowStockOnly(false);
            }}>
              Reset Filters
            </Button>
          </div>
        ) : (
          view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMedications.map((med) => (
                <motion.div 
                  key={med.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={med.lowStock ? "border border-red-300 dark:border-red-800" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{med.brandName}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {med.name} • {med.dosage}
                          </p>
                        </div>
                        <Badge>{med.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex justify-between items-center mb-2">
                        <Badge variant="outline" className="text-xs">
                          Exp: {new Date(med.expiry).toLocaleDateString()}
                        </Badge>
                        <span className="font-medium">₹{med.price.toFixed(2)}</span>
                      </div>
                      <div className={`flex items-center ${med.lowStock ? "text-red-500 dark:text-red-400" : ""}`}>
                        <Box className="h-4 w-4 mr-1" />
                        <span className="text-sm">Stock: {med.stock} units</span>
                        {med.lowStock && (
                          <Badge className="ml-2 text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                            Low
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Medicine</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Category</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Price</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Stock</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Expiry</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left font-medium">Manufacturer</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedications.map((med) => (
                    <motion.tr 
                      key={med.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`border-b ${med.lowStock ? "bg-red-50 dark:bg-red-950/20" : ""}`}
                    >
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{med.brandName}</div>
                          <div className="text-xs text-muted-foreground">{med.name} • {med.dosage}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge>{med.category}</Badge>
                      </td>
                      <td className="p-4">₹{med.price.toFixed(2)}</td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <span>{med.stock}</span>
                          {med.lowStock && (
                            <Badge className="ml-2 text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                              Low
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>{new Date(med.expiry).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="p-4">{med.manufacturer}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* Add Medicine Dialog */}
      <Dialog open={openNewMedicine} onOpenChange={setOpenNewMedicine}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Medicine</DialogTitle>
            <DialogDescription>
              Enter the medicine details below
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Generic Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Paracetamol" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="brandName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Crocin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {medicationCategories.slice(1).map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
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
                  name="dosage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dosage</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 500mg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>Enter number of units in stock</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="manufacturer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manufacturer</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Cipla" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="expiry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief description of the medicine" {...field} />
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
                    setOpenNewMedicine(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Medicine</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
