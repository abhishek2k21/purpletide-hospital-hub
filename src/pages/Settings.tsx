
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/theme/ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth";
import { AlertCircle, Bell, Globe, Languages, Lock, Save, Shield, User } from "lucide-react";

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  position: z.string().min(1, { message: "Please select your position." }),
  department: z.string().min(1, { message: "Please select your department." }),
  bio: z.string().optional(),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords do not match.",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function Settings() {
  const { user, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [systemNotifications, setSystemNotifications] = useState(true);
  const [language, setLanguage] = useState("english");

  // Dummy Indian user data
  const defaultValues: Partial<ProfileFormValues> = {
    name: "Rajesh Kumar",
    email: user?.email || "rajesh.kumar@email.com",
    phone: "9876543210",
    position: "Doctor",
    department: "Cardiology",
    bio: "Experienced cardiologist with 10+ years of practice in interventional procedures. MBBS from AIIMS Delhi, MD Cardiology from PGI Chandigarh.",
  };

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const positions = [
    { id: "doctor", name: "Doctor" },
    { id: "nurse", name: "Nurse" },
    { id: "admin", name: "Administrator" },
    { id: "receptionist", name: "Receptionist" },
    { id: "lab_tech", name: "Lab Technician" },
    { id: "pharmacist", name: "Pharmacist" },
  ];

  const departments = [
    { id: "cardiology", name: "Cardiology" },
    { id: "neurology", name: "Neurology" },
    { id: "orthopedics", name: "Orthopedics" },
    { id: "pediatrics", name: "Pediatrics" },
    { id: "internal_medicine", name: "Internal Medicine" },
    { id: "dermatology", name: "Dermatology" },
    { id: "gynecology", name: "Gynecology" },
    { id: "ophthalmology", name: "Ophthalmology" },
    { id: "ent", name: "ENT" },
    { id: "psychiatry", name: "Psychiatry" },
    { id: "radiology", name: "Radiology" },
    { id: "pathology", name: "Pathology" },
    { id: "anesthesiology", name: "Anesthesiology" },
  ];

  async function onProfileSubmit(data: ProfileFormValues) {
    setLoading(true);
    try {
      // This would connect to Supabase in production
      // await updateUserProfile(data);
      setTimeout(() => {
        toast.success("Profile updated successfully");
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error("Failed to update profile");
      setLoading(false);
    }
  }

  async function onPasswordSubmit(data: PasswordFormValues) {
    setLoading(true);
    try {
      // This would connect to Supabase in production
      setTimeout(() => {
        toast.success("Password changed successfully");
        passwordForm.reset();
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error("Failed to change password");
      setLoading(false);
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage system and user preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 md:w-[600px]">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-lg">RK</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="font-medium">Profile Picture</h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                    <Button variant="outline" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a position" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {positions.map((position) => (
                                <SelectItem
                                  key={position.id}
                                  value={position.name}
                                >
                                  {position.name}
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
                    control={profileForm.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments.map((department) => (
                              <SelectItem
                                key={department.id}
                                value={department.name}
                              >
                                {department.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Brief professional summary
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email_notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch 
                    id="email_notifications" 
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms_notifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via SMS
                    </p>
                  </div>
                  <Switch 
                    id="sms_notifications" 
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="system_notifications">System Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive in-app notifications
                    </p>
                  </div>
                  <Switch 
                    id="system_notifications" 
                    checked={systemNotifications}
                    onCheckedChange={setSystemNotifications}
                  />
                </div>
              </div>
              
              <div className="pt-4 space-y-4">
                <h3 className="font-medium">Notification Types</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Appointment Alerts</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid gap-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="appointment_new" defaultChecked />
                          <Label htmlFor="appointment_new">New appointments</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="appointment_reminder" defaultChecked />
                          <Label htmlFor="appointment_reminder">Appointment reminders</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="appointment_cancelled" defaultChecked />
                          <Label htmlFor="appointment_cancelled">Cancelled appointments</Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">System Updates</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid gap-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="system_maintenance" defaultChecked />
                          <Label htmlFor="system_maintenance">Scheduled maintenance</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="system_feature" defaultChecked />
                          <Label htmlFor="system_feature">New features</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="system_alert" defaultChecked />
                          <Label htmlFor="system_alert">Security alerts</Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => toast.success("Notification preferences saved")}>
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Changing Password..." : "Change Password"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Use your phone number for verification
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Authenticator App</Label>
                  <p className="text-sm text-muted-foreground">
                    Use an authenticator app for verification
                  </p>
                </div>
                <Button variant="outline">Setup</Button>
              </div>
              
              <div className="pt-4 flex items-start space-x-4 rounded-md border p-4">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Security Recommendation
                  </p>
                  <p className="text-sm text-muted-foreground">
                    We strongly recommend enabling two-factor authentication for enhanced account security.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sessions</CardTitle>
              <CardDescription>
                Manage your active sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">Chrome on Windows</p>
                      <Badge>Current</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Mumbai, India • IP: 103.156.xx.xx • Last active: Just now
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Safari on iPhone</p>
                    <p className="text-xs text-muted-foreground">
                      Mumbai, India • IP: 103.156.xx.xx • Last active: 2 days ago
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    End
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Chrome on MacBook</p>
                    <p className="text-xs text-muted-foreground">
                      Chennai, India • IP: 49.207.xx.xx • Last active: 5 days ago
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    End
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => toast.success("All other sessions have been ended")}
              >
                End All Other Sessions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>
                Customize the appearance of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark mode
                  </p>
                </div>
                <ModeToggle />
              </div>
              
              <div className="pt-4">
                <Label>Theme Color</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose your preferred accent color
                </p>
                <div className="flex flex-wrap gap-3">
                  {["violet", "blue", "green", "orange", "red", "pink"].map((color) => (
                    <div
                      key={color}
                      className={`h-8 w-8 rounded-full cursor-pointer border ${
                        color === "violet" ? "border-2 border-primary" : "border-border"
                      }`}
                      style={{ 
                        backgroundColor: 
                          color === "violet" ? "rgb(139, 92, 246)" :
                          color === "blue" ? "rgb(59, 130, 246)" :
                          color === "green" ? "rgb(34, 197, 94)" :
                          color === "orange" ? "rgb(249, 115, 22)" :
                          color === "red" ? "rgb(239, 68, 68)" :
                          "rgb(236, 72, 153)" // pink
                      }}
                      onClick={() => toast.success(`Theme color changed to ${color}`)}
                    ></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Language</CardTitle>
              <CardDescription>
                Set your preferred language
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Languages className="h-5 w-5" />
                  <div>
                    <Label>Interface Language</Label>
                    <p className="text-sm text-muted-foreground">
                      Select the language for the user interface
                    </p>
                  </div>
                </div>
                
                <Select
                  value={language}
                  onValueChange={setLanguage}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">हिन्दी (Hindi)</SelectItem>
                    <SelectItem value="marathi">मराठी (Marathi)</SelectItem>
                    <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                    <SelectItem value="telugu">తెలుగు (Telugu)</SelectItem>
                    <SelectItem value="bengali">বাংলা (Bengali)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4 flex items-start space-x-4 rounded-md border p-4">
                <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Language Preferences
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Some content might not be available in all languages. In such cases, English will be used as a fallback.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => toast.success(`Language changed to ${language === "english" ? "English" : language === "hindi" ? "Hindi" : language === "marathi" ? "Marathi" : language === "tamil" ? "Tamil" : language === "telugu" ? "Telugu" : "Bengali"}`)}
              >
                Save Language Preference
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
