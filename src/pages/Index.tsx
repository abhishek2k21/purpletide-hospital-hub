
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { GenderFilter, Gender } from "@/components/GenderFilter";

const Index = () => {
  const [genderFilter, setGenderFilter] = useState<Gender>('all');
  
  // Sample data for demonstration
  const patients = [
    { id: 1, name: "John Doe", gender: "Male", age: 35 },
    { id: 2, name: "Jane Smith", gender: "Female", age: 28 },
    { id: 3, name: "Alex Johnson", gender: "Other", age: 42 },
  ];
  
  // Filter patients by selected gender
  const filteredPatients = genderFilter === 'all' 
    ? patients 
    : patients.filter(patient => patient.gender === genderFilter);
  
  const resetFilter = () => {
    setGenderFilter('all');
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Hospital Management System</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Patient Directory</CardTitle>
            <CardDescription>View and filter patients by gender</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <GenderFilter 
                value={genderFilter} 
                onChange={setGenderFilter} 
                showReset={true}
                onReset={resetFilter}
              />
            </div>
            
            {filteredPatients.length > 0 ? (
              <div className="grid gap-4">
                {filteredPatients.map(patient => (
                  <div key={patient.id} className="p-4 border rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">{patient.gender}, {patient.age} years old</p>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">No patients found matching the filter.</p>
            )}
          </CardContent>
        </Card>
        
        <div className="text-center">
          <p className="text-xl font-medium mb-4">Welcome to Your Blank App</p>
          <p className="text-muted-foreground">Start building your amazing project here!</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
