
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Calendar, Mail, Phone, Shield, User, Building, Medal, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function UserProfile() {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    department: user?.department || "",
    designation: user?.designation || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">Please log in to view your profile</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await updateUserProfile(formData);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">My Profile</h1>
        <p className="text-muted-foreground">View and manage your profile information</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="settings">Preferences</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="md:col-span-1"
            >
              <Card>
                <CardHeader className="text-center">
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarImage src={user.photo || "https://avatar.vercel.sh/" + user.email} />
                    <AvatarFallback>{user.name?.substring(0, 2) || user.email?.substring(0, 2) || "U"}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="mt-4">{user.name}</CardTitle>
                  <CardDescription>
                    <Badge variant="secondary" className="capitalize">
                      {user.role}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user.department && (
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{user.department}</span>
                    </div>
                  )}
                  {user.designation && (
                    <div className="flex items-center">
                      <Medal className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{user.designation}</span>
                    </div>
                  )}
                  {user.specialization && (
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{user.specialization}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="md:col-span-2"
            >
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </div>
                    <Button 
                      variant={isEditing ? "outline" : "default"}
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange}
                            placeholder="Enter your name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Input 
                            id="department" 
                            name="department" 
                            value={formData.department} 
                            onChange={handleChange}
                            placeholder="Enter your department"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="designation">Designation</Label>
                          <Input 
                            id="designation" 
                            name="designation" 
                            value={formData.designation} 
                            onChange={handleChange}
                            placeholder="Enter your designation"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2 mt-6">
                        <Button type="submit" disabled={isLoading}>
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Basic Info</h3>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <dt className="text-sm text-muted-foreground">Full Name</dt>
                            <dd>{user.name || "Not set"}</dd>
                          </div>
                          <div className="space-y-1">
                            <dt className="text-sm text-muted-foreground">Email</dt>
                            <dd>{user.email}</dd>
                          </div>
                          <div className="space-y-1">
                            <dt className="text-sm text-muted-foreground">Phone Number</dt>
                            <dd>{user.phone || "Not set"}</dd>
                          </div>
                          <div className="space-y-1">
                            <dt className="text-sm text-muted-foreground">Role</dt>
                            <dd className="capitalize">{user.role || "Staff"}</dd>
                          </div>
                        </dl>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Professional Info</h3>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <dt className="text-sm text-muted-foreground">Department</dt>
                            <dd>{user.department || "Not set"}</dd>
                          </div>
                          <div className="space-y-1">
                            <dt className="text-sm text-muted-foreground">Designation</dt>
                            <dd>{user.designation || "Not set"}</dd>
                          </div>
                          {user.specialization && (
                            <div className="space-y-1">
                              <dt className="text-sm text-muted-foreground">Specialization</dt>
                              <dd>{user.specialization}</dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Manage your app preferences and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-center py-8">
                Preference settings will be available soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>Password</Label>
                <div className="flex items-center justify-between">
                  <div className="text-sm">••••••••••</div>
                  <Button variant="outline">Change Password</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 mt-4">
              <p className="text-sm text-muted-foreground">Last login: April 5, 2025 at 09:32 AM</p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
