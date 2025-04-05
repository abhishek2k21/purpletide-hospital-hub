import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  AlarmClock,
  AlertCircle,
  ArrowUp,
  Calendar,
  Check,
  Download,
  File,
  FileArchive,
  FileImage,
  FileText,
  Filter,
  FolderOpen,
  Heart,
  MoreHorizontal,
  Plus,
  Search,
  Share2,
  Tag,
  Trash2,
  Upload,
  User,
  UserPlus,
  X,
} from "lucide-react";

// Dummy document data
const initialDocuments = [
  {
    id: 1,
    name: "Patient Medical History",
    type: "Medical Record",
    category: "Health",
    uploadedBy: "Dr. Smith",
    dateUploaded: "2024-01-15",
    size: "2.5 MB",
    sharedWith: ["Dr. Johnson", "Nurse Davis"],
  },
  {
    id: 2,
    name: "Lab Results - Blood Test",
    type: "Lab Report",
    category: "Health",
    uploadedBy: "Lab Technician",
    dateUploaded: "2024-02-01",
    size: "1.2 MB",
    sharedWith: ["Dr. Smith"],
  },
  {
    id: 3,
    name: "MRI Scan Report",
    type: "Imaging",
    category: "Health",
    uploadedBy: "Radiologist",
    dateUploaded: "2024-02-10",
    size: "3.8 MB",
    sharedWith: ["Dr. Smith", "Dr. Johnson"],
  },
  {
    id: 4,
    name: "Insurance Claim Form",
    type: "Financial",
    category: "Insurance",
    uploadedBy: "Patient",
    dateUploaded: "2024-02-15",
    size: "0.9 MB",
    sharedWith: ["Insurance Company"],
  },
  {
    id: 5,
    name: "Consent Form for Surgery",
    type: "Legal",
    category: "Legal",
    uploadedBy: "Dr. Smith",
    dateUploaded: "2024-02-20",
    size: "0.5 MB",
    sharedWith: ["Patient", "Nurse Davis"],
  },
  {
    id: 6,
    name: "Physical Therapy Plan",
    type: "Therapy Plan",
    category: "Health",
    uploadedBy: "Physical Therapist",
    dateUploaded: "2024-02-25",
    size: "1.8 MB",
    sharedWith: ["Dr. Smith", "Patient"],
  },
  {
    id: 7,
    name: "Billing Statement - January",
    type: "Financial",
    category: "Billing",
    uploadedBy: "Billing Department",
    dateUploaded: "2024-03-01",
    size: "0.7 MB",
    sharedWith: ["Patient"],
  },
  {
    id: 8,
    name: "Prescription - Antibiotics",
    type: "Prescription",
    category: "Health",
    uploadedBy: "Dr. Johnson",
    dateUploaded: "2024-03-05",
    size: "0.3 MB",
    sharedWith: ["Patient", "Pharmacy"],
  },
  {
    id: 9,
    name: "Referral Letter - Cardiology",
    type: "Referral",
    category: "Health",
    uploadedBy: "Dr. Smith",
    dateUploaded: "2024-03-10",
    size: "0.6 MB",
    sharedWith: ["Cardiologist", "Patient"],
  },
  {
    id: 10,
    name: "Discharge Summary",
    type: "Medical Record",
    category: "Health",
    uploadedBy: "Dr. Smith",
    dateUploaded: "2024-03-15",
    size: "2.0 MB",
    sharedWith: ["Patient", "Primary Care Physician"],
  },
];

// Document categories
const documentCategories = [
  "All",
  "Health",
  "Insurance",
  "Legal",
  "Billing",
];

export default function Documents() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openNewDocument, setOpenNewDocument] = useState(false);

  // Filter documents based on search and category
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || doc.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="mb-2">Documents</h1>
            <p className="text-muted-foreground">
              Manage and organize patient documents
            </p>
          </div>

          <Button onClick={() => setOpenNewDocument(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Search documents..."
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
              {documentCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="text-center py-10 border rounded-md">
            <FileArchive className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No documents found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-3 font-medium">Document</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">
                    Type
                  </th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">
                    Category
                  </th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">
                    Uploaded By
                  </th>
                  <th className="text-left p-3 font-medium">Date Uploaded</th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredDocuments.map((doc) => (
                  <motion.tr
                    key={doc.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {doc.type === "Medical Record" ? (
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        ) : doc.type === "Lab Report" ? (
                          <FileImage className="h-4 w-4 text-muted-foreground" />
                        ) : doc.type === "Imaging" ? (
                          <FileArchive className="h-4 w-4 text-muted-foreground" />
                        ) : doc.type === "Financial" ? (
                          <File className="h-4 w-4 text-muted-foreground" />
                        ) : doc.type === "Legal" ? (
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        ) : doc.type === "Therapy Plan" ? (
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        ) : doc.type === "Prescription" ? (
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <File className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div>
                          <div className="font-medium">{doc.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {doc.size}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 hidden md:table-cell">{doc.type}</td>
                    <td className="p-3 hidden md:table-cell">{doc.category}</td>
                    <td className="p-3 hidden md:table-cell">{doc.uploadedBy}</td>
                    <td className="p-3">{doc.dateUploaded}</td>
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
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600 focus:text-red-600">
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
      </div>

      {/* Upload Document Dialog */}
      <Dialog open={openNewDocument} onOpenChange={setOpenNewDocument}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload New Document</DialogTitle>
            <DialogDescription>
              Select a file to upload and categorize
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value="Document-001.pdf" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="upload">Upload File</Label>
              <Input type="file" id="upload" className="mt-1.5" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpenNewDocument(false)}>
              Cancel
            </Button>
            <Button>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
