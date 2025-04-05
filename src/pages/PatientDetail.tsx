
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Clipboard,
  Calendar,
  FileText,
  ArrowLeft,
  Edit,
  Activity as ActivityIcon
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Dummy patient data
const patientData = {
  id: 1,
  name: "Sarah Johnson",
  email: "sarah.johnson@example.com",
  dob: "1985-04-12",
  gender: "Female",
  phone: "555-123-4567",
  bloodType: "A+",
  address: "123 Main St, Springfield",
  status: "Active",
  doctor: "Dr. Emily Carter",
  department: "Cardiology",
  medicalHistory: "Hypertension, Type 2 Diabetes, Seasonal allergies",
  emergencyContact: "John Johnson (Husband) - 555-987-6543",
  lastVisit: "2023-11-15",
  nextAppointment: "2023-12-10",
  height: "165 cm",
  weight: "65 kg",
  bmi: "23.9",
  bp: "120/80 mmHg",
  pulse: "72 bpm",
  temperature: "98.6°F",
  oxygen: "98%",
  glucose: "110 mg/dL",
  lipidProfile: {
    totalCholesterol: "180 mg/dL",
    ldl: "100 mg/dL",
    hdl: "55 mg/dL",
    triglycerides: "130 mg/dL"
  },
  allergies: ["Penicillin", "Nuts", "Shellfish"],
  medications: [
    {
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      prescribedDate: "2023-08-15",
      instructions: "Take with food"
    },
    {
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      prescribedDate: "2023-08-15",
      instructions: "Take with meals"
    }
  ],
  appointments: [
    {
      id: 1,
      date: "2023-11-15",
      time: "10:00 AM",
      doctor: "Dr. Emily Carter",
      department: "Cardiology",
      status: "Completed",
      notes: "Blood pressure stable. Continue current medications."
    },
    {
      id: 2,
      date: "2023-09-20",
      time: "2:30 PM",
      doctor: "Dr. Emily Carter",
      department: "Cardiology",
      status: "Completed",
      notes: "Patient reported occasional dizziness. Adjusted medication dosage."
    },
    {
      id: 3,
      date: "2023-12-10",
      time: "11:15 AM",
      doctor: "Dr. Emily Carter",
      department: "Cardiology",
      status: "Scheduled",
      notes: "Routine follow-up and medication review."
    }
  ],
  reports: [
    {
      id: 1,
      name: "Blood Test Results",
      date: "2023-11-15",
      doctor: "Dr. Emily Carter",
      type: "Laboratory",
      file: "blood_test_20231115.pdf"
    },
    {
      id: 2,
      name: "ECG Report",
      date: "2023-11-15",
      doctor: "Dr. Emily Carter",
      type: "Diagnostic",
      file: "ecg_20231115.pdf"
    },
    {
      id: 3,
      name: "Chest X-Ray",
      date: "2023-09-20",
      doctor: "Dr. Michael Wong",
      type: "Radiology",
      file: "chest_xray_20230920.pdf"
    }
  ]
};

export default function PatientDetail() {
  const { id } = useParams();
  
  // For a real application, we would fetch the patient data based on the id
  // Here we're using the dummy data
  const patient = patientData;

  return (
    <div className="space-y-6">
      {/* Back button and header */}
      <div>
        <Link to="/patients">
          <Button variant="ghost" className="mb-4 px-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Patients
          </Button>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-violet-200 dark:border-violet-800">
              <AvatarFallback className="text-xl bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-100">
                {patient.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1>{patient.name}</h1>
                <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
              </div>
              <p className="text-muted-foreground">
                Patient ID: #{patient.id} • {patient.gender}, {getAge(patient.dob)} years
              </p>
            </div>
          </div>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Patient
          </Button>
        </div>
      </div>

      {/* Patient Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-1">
                <dt className="font-medium text-muted-foreground">Date of Birth</dt>
                <dd>{patient.dob} ({getAge(patient.dob)} years)</dd>
              </div>
              
              <div className="grid grid-cols-2 gap-1">
                <dt className="font-medium text-muted-foreground">Blood Type</dt>
                <dd>{patient.bloodType}</dd>
              </div>

              <div className="grid grid-cols-2 gap-1">
                <dt className="font-medium text-muted-foreground">Phone</dt>
                <dd>{patient.phone}</dd>
              </div>

              <div className="grid grid-cols-2 gap-1">
                <dt className="font-medium text-muted-foreground">Email</dt>
                <dd className="break-all">{patient.email}</dd>
              </div>

              <div className="grid grid-cols-2 gap-1">
                <dt className="font-medium text-muted-foreground">Address</dt>
                <dd>{patient.address}</dd>
              </div>

              <div className="grid grid-cols-2 gap-1">
                <dt className="font-medium text-muted-foreground">Emergency Contact</dt>
                <dd>{patient.emergencyContact}</dd>
              </div>

              <div className="grid grid-cols-2 gap-1">
                <dt className="font-medium text-muted-foreground">Primary Doctor</dt>
                <dd>{patient.doctor}</dd>
              </div>

              <div className="grid grid-cols-2 gap-1">
                <dt className="font-medium text-muted-foreground">Department</dt>
                <dd>{patient.department}</dd>
              </div>

              <div className="grid grid-cols-2 gap-1">
                <dt className="font-medium text-muted-foreground">Last Visit</dt>
                <dd>{patient.lastVisit}</dd>
              </div>

              <div className="grid grid-cols-2 gap-1">
                <dt className="font-medium text-muted-foreground">Next Appointment</dt>
                <dd>{patient.nextAppointment}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Medical Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="vitals">
              <TabsList className="mb-4">
                <TabsTrigger value="vitals">
                  <ActivityIcon className="h-4 w-4 mr-2" />
                  Vitals
                </TabsTrigger>
                <TabsTrigger value="history">
                  <Clipboard className="h-4 w-4 mr-2" />
                  History
                </TabsTrigger>
                <TabsTrigger value="appointments">
                  <Calendar className="h-4 w-4 mr-2" />
                  Appointments
                </TabsTrigger>
                <TabsTrigger value="documents">
                  <FileText className="h-4 w-4 mr-2" />
                  Documents
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="vitals">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Basic Measurements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-4 text-sm">
                        <div className="grid grid-cols-3 gap-1">
                          <dt className="font-medium text-muted-foreground">Height</dt>
                          <dd className="col-span-2">{patient.height}</dd>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-1">
                          <dt className="font-medium text-muted-foreground">Weight</dt>
                          <dd className="col-span-2">{patient.weight}</dd>
                        </div>

                        <div className="grid grid-cols-3 gap-1">
                          <dt className="font-medium text-muted-foreground">BMI</dt>
                          <dd className="col-span-2">{patient.bmi}</dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Current Vitals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-4 text-sm">
                        <div>
                          <div className="flex justify-between mb-1">
                            <dt className="font-medium text-muted-foreground">Blood Pressure</dt>
                            <dd>{patient.bp}</dd>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <dt className="font-medium text-muted-foreground">Pulse Rate</dt>
                            <dd>{patient.pulse}</dd>
                          </div>
                          <Progress value={65} className="h-2" />
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <dt className="font-medium text-muted-foreground">Temperature</dt>
                            <dd>{patient.temperature}</dd>
                          </div>
                          <Progress value={50} className="h-2" />
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <dt className="font-medium text-muted-foreground">Oxygen Saturation</dt>
                            <dd>{patient.oxygen}</dd>
                          </div>
                          <Progress value={98} className="h-2" />
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <dt className="font-medium text-muted-foreground">Blood Glucose</dt>
                            <dd>{patient.glucose}</dd>
                          </div>
                          <Progress value={60} className="h-2" />
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mt-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Lipid Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      {Object.entries(patient.lipidProfile).map(([key, value]) => (
                        <div key={key} className="p-4 rounded-lg border bg-card">
                          <p className="text-xs text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="text-lg font-semibold mt-1">{value}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Medical History</h3>
                    <p>{patient.medicalHistory}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Allergies</h3>
                    <div className="flex flex-wrap gap-2">
                      {patient.allergies.map((allergy, index) => (
                        <Badge key={index} variant="secondary">{allergy}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Current Medications</h3>
                    <div className="space-y-4">
                      {patient.medications.map((medication, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                              <div>
                                <h4 className="font-medium">{medication.name} - {medication.dosage}</h4>
                                <p className="text-sm text-muted-foreground">{medication.frequency}</p>
                              </div>
                              <div className="text-sm text-right">
                                <p>Prescribed: {medication.prescribedDate}</p>
                                <p className="text-muted-foreground">{medication.instructions}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="appointments">
                <div className="space-y-4">
                  {patient.appointments.map((appointment) => (
                    <Card key={appointment.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-3 h-12 rounded-full",
                              appointment.status === "Completed" ? "bg-green-500" :
                              appointment.status === "Scheduled" ? "bg-blue-500" :
                              "bg-orange-500"
                            )} />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{appointment.date}</h4>
                                <Badge variant="outline">{appointment.status}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {appointment.time} • {appointment.doctor} • {appointment.department}
                              </p>
                            </div>
                          </div>
                          <div>
                            <Button variant="outline" size="sm">View Details</Button>
                          </div>
                        </div>
                        {appointment.notes && (
                          <div className="mt-4 text-sm border-t pt-4">
                            <p className="font-medium">Notes:</p>
                            <p className="text-muted-foreground">{appointment.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  <div className="flex justify-end">
                    <Button>
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Appointment
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">All</Button>
                      <Button variant="outline" size="sm">Laboratory</Button>
                      <Button variant="outline" size="sm">Diagnostic</Button>
                      <Button variant="outline" size="sm">Radiology</Button>
                    </div>
                    <Button size="sm">
                      Upload Document
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {patient.reports.map((report) => (
                      <Card key={report.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row md:items-center">
                          <div className="bg-violet-100 dark:bg-violet-900/40 p-6 flex items-center justify-center md:w-16">
                            <FileText className="h-8 w-8 text-violet-600 dark:text-violet-300" />
                          </div>
                          <CardContent className="p-4 flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                              <div>
                                <h4 className="font-medium">{report.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {report.date} • {report.doctor} • {report.type}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">View</Button>
                                <Button variant="outline" size="sm">Download</Button>
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper functions
function getStatusColor(status: string) {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Inactive":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    case "Critical":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
  }
}

function getAge(dateOfBirth: string) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();
  
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}
