
import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  CheckCircle2, 
  ChevronDown, 
  Clock, 
  Download, 
  Eye, 
  File, 
  FileText, 
  Filter, 
  ImageIcon, 
  Loader2, 
  MoreHorizontal, 
  PdfIcon, 
  Plus, 
  Search, 
  Trash2, 
  UploadCloud, 
  UserCircle, 
  X
} from "lucide-react";

// Document categories with Indian hospital context
const categories = [
  "All",
  "Medical Records",
  "Prescriptions",
  "Lab Reports",
  "Insurance",
  "Consent Forms",
  "Discharge Summaries",
  "Imaging",
  "Administrative",
];

// Example documents with Indian patient names
const initialDocuments = [
  {
    id: 1,
    name: "Blood Test Report - Vikram Singh",
    type: "pdf",
    category: "Lab Reports",
    uploadedBy: "Dr. Rahul Sharma",
    uploadedAt: new Date(2024, 3, 1),
    size: "1.4 MB",
    patient: "Vikram Singh",
    patientId: "PAT-456789",
  },
  {
    id: 2,
    name: "X-Ray Chest - Ananya Patel",
    type: "image",
    category: "Imaging",
    uploadedBy: "Dr. Meera Verma",
    uploadedAt: new Date(2024, 3, 2),
    size: "5.2 MB",
    patient: "Ananya Patel",
    patientId: "PAT-123456",
  },
  {
    id: 3,
    name: "Discharge Summary - Raj Kumar",
    type: "pdf",
    category: "Discharge Summaries",
    uploadedBy: "Dr. Anil Kumar",
    uploadedAt: new Date(2024, 3, 3),
    size: "0.9 MB",
    patient: "Raj Kumar",
    patientId: "PAT-789012",
  },
  {
    id: 4,
    name: "Insurance Approval - Neha Sharma",
    type: "pdf",
    category: "Insurance",
    uploadedBy: "Admin Staff",
    uploadedAt: new Date(2024, 3, 4),
    size: "0.5 MB",
    patient: "Neha Sharma",
    patientId: "PAT-345678",
  },
  {
    id: 5,
    name: "Surgical Consent Form - Rakesh Verma",
    type: "pdf",
    category: "Consent Forms",
    uploadedBy: "Dr. Priya Patel",
    uploadedAt: new Date(2024, 3, 5),
    size: "0.3 MB",
    patient: "Rakesh Verma",
    patientId: "PAT-901234",
  },
  {
    id: 6,
    name: "MRI Report - Deepika Reddy",
    type: "image",
    category: "Imaging",
    uploadedBy: "Dr. Vikram Singh",
    uploadedAt: new Date(2024, 3, 6),
    size: "8.7 MB",
    patient: "Deepika Reddy",
    patientId: "PAT-567890",
  },
  {
    id: 7,
    name: "Medication History - Ravi Gupta",
    type: "pdf",
    category: "Medical Records",
    uploadedBy: "Dr. Sunita Gupta",
    uploadedAt: new Date(2024, 3, 7),
    size: "1.1 MB",
    patient: "Ravi Gupta",
    patientId: "PAT-234567",
  },
  {
    id: 8,
    name: "Blood Pressure Chart - Sanjay Mehta",
    type: "pdf",
    category: "Medical Records",
    uploadedBy: "Dr. Rahul Sharma",
    uploadedAt: new Date(2024, 2, 28),
    size: "0.8 MB",
    patient: "Sanjay Mehta",
    patientId: "PAT-678901",
  },
  {
    id: 9,
    name: "ECG Report - Priya Malhotra",
    type: "pdf",
    category: "Lab Reports",
    uploadedBy: "Dr. Anil Kumar",
    uploadedAt: new Date(2024, 2, 25),
    size: "1.2 MB",
    patient: "Priya Malhotra",
    patientId: "PAT-890123",
  },
  {
    id: 10,
    name: "Dental X-Ray - Arjun Nair",
    type: "image",
    category: "Imaging",
    uploadedBy: "Dr. Meera Verma",
    uploadedAt: new Date(2024, 2, 20),
    size: "3.4 MB",
    patient: "Arjun Nair",
    patientId: "PAT-456123",
  },
];

// Schema for document upload form
const documentSchema = z.object({
  name: z.string().min(1, "Document name is required"),
  category: z.string().min(1, "Category is required"),
  patient: z.string().min(1, "Patient is required"),
  patientId: z.string().min(1, "Patient ID is required"),
  file: z.any().refine((file) => file instanceof File, {
    message: "File is required",
  }),
});

type DocumentFormValues = z.infer<typeof documentSchema>;

export default function Documents() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<any>(null);
  
  // Form for document upload
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: "",
      category: "",
      patient: "",
      patientId: "",
    },
  });
  
  // Patients list (would come from database)
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

  // Filter documents based on search term and category
  const filteredDocuments = documents
    .filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.patientId.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesCategory = 
        selectedCategory === "All" || doc.category === selectedCategory;
        
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? a.uploadedAt.getTime() - b.uploadedAt.getTime()
          : b.uploadedAt.getTime() - a.uploadedAt.getTime();
      } else if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        // Sort by size requires parsing the size string
        const aSize = parseFloat(a.size.split(" ")[0]);
        const bSize = parseFloat(b.size.split(" ")[0]);
        return sortOrder === "asc" ? aSize - bSize : bSize - aSize;
      }
    });
    
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <PdfIcon className="h-8 w-8 text-red-500" />;
      case "image":
        return <ImageIcon className="h-8 w-8 text-blue-500" />;
      default:
        return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };
  
  const toggleSort = (field: "date" | "name" | "size") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };
  
  const handleDeleteDocument = () => {
    if (documentToDelete !== null) {
      const updatedDocuments = documents.filter((doc) => doc.id !== documentToDelete);
      setDocuments(updatedDocuments);
      toast.success("Document deleted successfully");
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };
  
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("file", file);
      // Auto-fill the name field with the file name
      const fileName = file.name.replace(/\.[^/.]+$/, "");  // Remove extension
      form.setValue("name", fileName);
    }
  };
  
  const onPreviewDocument = (document: any) => {
    setPreviewDocument(document);
    setPreviewDialogOpen(true);
  };
  
  const onSubmit = (data: DocumentFormValues) => {
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const file = data.file as File;
      const fileSize = file.size / (1024 * 1024);
      const fileSizeFormatted = fileSize < 1 
        ? `${(fileSize * 1024).toFixed(0)} KB` 
        : `${fileSize.toFixed(1)} MB`;
        
      const fileType = file.type.includes("pdf") 
        ? "pdf" 
        : file.type.includes("image") 
        ? "image" 
        : "file";
        
      const patient = patients.find(p => p.id === data.patientId);
        
      const newDocument = {
        id: documents.length + 1,
        name: data.name,
        type: fileType,
        category: data.category,
        uploadedBy: "Dr. Rahul Sharma", // Current logged in user
        uploadedAt: new Date(),
        size: fileSizeFormatted,
        patient: patient?.name || "",
        patientId: data.patientId,
      };
      
      setDocuments([newDocument, ...documents]);
      toast.success("Document uploaded successfully");
      setIsUploading(false);
      setOpenUploadDialog(false);
      form.reset();
    }, 1500);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="mb-2">Documents</h1>
            <p className="text-muted-foreground">
              Manage and store patient and hospital documents
            </p>
          </div>
          
          <Button onClick={() => setOpenUploadDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Document Repository</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-8"
                  placeholder="Search documents, patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-[160px]">
                    <Filter className="h-4 w-4 mr-2" />
                    Sort By
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => toggleSort("date")}>
                    Date {sortBy === "date" && (sortOrder === "asc" ? "(Oldest)" : "(Newest)")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleSort("name")}>
                    Name {sortBy === "name" && (sortOrder === "asc" ? "(A-Z)" : "(Z-A)")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleSort("size")}>
                    Size {sortBy === "size" && (sortOrder === "asc" ? "(Smallest)" : "(Largest)")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-10">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No documents found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or upload a new document
                </p>
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium">
                        Document
                      </th>
                      <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-sm font-medium">
                        Patient
                      </th>
                      <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-sm font-medium">
                        Category
                      </th>
                      <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-sm font-medium">
                        Date
                      </th>
                      <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-sm font-medium">
                        Size
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-sm font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredDocuments.map((doc) => (
                      <motion.tr 
                        key={doc.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-muted/50"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            {getDocumentIcon(doc.type)}
                            <div className="ml-3">
                              <div className="font-medium">{doc.name}</div>
                              <div className="text-xs text-muted-foreground md:hidden">
                                {doc.patient} • {doc.category}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-4 py-4 text-sm">
                          <div className="flex items-center">
                            <UserCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{doc.patient}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {doc.patientId}
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-4 py-4 text-sm">
                          <Badge variant="outline">{doc.category}</Badge>
                        </td>
                        <td className="hidden md:table-cell px-4 py-4 text-sm">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            {format(doc.uploadedAt, "MMM d, yyyy")}
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-4 py-4 text-sm">
                          {doc.size}
                        </td>
                        <td className="px-4 py-4 text-sm text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => onPreviewDocument(doc)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600 focus:text-red-600"
                                onClick={() => {
                                  setDocumentToDelete(doc.id);
                                  setDeleteDialogOpen(true);
                                }}
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
      
      {/* Upload Document Dialog */}
      <Dialog open={openUploadDialog} onOpenChange={setOpenUploadDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Add a new document to the repository
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid w-full place-items-center gap-6 rounded-lg border border-dashed p-6">
                <div className="flex flex-col items-center gap-2 text-center">
                  <UploadCloud className="h-10 w-10 text-muted-foreground" />
                  <div className="grid gap-1">
                    <h3 className="text-base font-semibold">Upload file</h3>
                    <p className="text-sm text-muted-foreground">
                      Drag and drop or click to upload
                    </p>
                  </div>
                </div>
                <Input
                  id="file"
                  type="file"
                  className="cursor-pointer"
                  onChange={onFileChange}
                />
                {form.formState.errors.file && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.file.message as string}
                  </p>
                )}
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      A descriptive name for the document
                    </FormDescription>
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
                          {categories.slice(1).map((category) => (
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
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenUploadDialog(false)}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-4 w-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteDocument}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Document Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                {previewDocument && getDocumentIcon(previewDocument.type)}
                <span>{previewDocument?.name}</span>
              </DialogTitle>
              <Button variant="outline" size="icon" onClick={() => setPreviewDialogOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="p-6 border rounded-lg bg-muted/50 min-h-[400px] flex flex-col items-center justify-center">
            {previewDocument?.type === "image" ? (
              <div className="text-center">
                <ImageIcon className="h-20 w-20 mx-auto mb-4 text-blue-500" />
                <p className="text-muted-foreground mb-2">Image Preview</p>
                <p className="text-xs text-muted-foreground mb-4">{previewDocument?.name}</p>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Image
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <PdfIcon className="h-20 w-20 mx-auto mb-4 text-red-500" />
                <p className="text-muted-foreground mb-2">PDF Document</p>
                <p className="text-xs text-muted-foreground mb-4">{previewDocument?.name}</p>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            )}
          </div>
          <div className="px-4 py-3 bg-muted/50 rounded-lg text-sm">
            <div className="flex flex-wrap gap-y-2">
              <div className="w-1/2">
                <span className="text-muted-foreground">Patient: </span>
                <span className="font-medium">{previewDocument?.patient}</span>
              </div>
              <div className="w-1/2">
                <span className="text-muted-foreground">Patient ID: </span>
                <span className="font-medium">{previewDocument?.patientId}</span>
              </div>
              <div className="w-1/2">
                <span className="text-muted-foreground">Category: </span>
                <span className="font-medium">{previewDocument?.category}</span>
              </div>
              <div className="w-1/2">
                <span className="text-muted-foreground">Uploaded By: </span>
                <span className="font-medium">{previewDocument?.uploadedBy}</span>
              </div>
              <div className="w-1/2">
                <span className="text-muted-foreground">Date: </span>
                <span className="font-medium">
                  {previewDocument?.uploadedAt && format(previewDocument.uploadedAt, "PPP")}
                </span>
              </div>
              <div className="w-1/2">
                <span className="text-muted-foreground">Size: </span>
                <span className="font-medium">{previewDocument?.size}</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
