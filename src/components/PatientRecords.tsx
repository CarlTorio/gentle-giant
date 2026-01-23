import React, { useState, useEffect } from 'react';
import { Search, Download, Plus, Eye, Calendar, User, Phone, FileText, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Patient {
  id: string;
  member_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  emergency_contact: string | null;
  membership_type: string | null;
  membership_start_date: string | null;
  membership_expiry_date: string | null;
  last_visit: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  medicalRecords: MedicalRecord[];
}

interface MedicalRecord {
  id: number;
  date: string;
  notes: string;
}

const PatientRecords = () => {
  const [viewMode, setViewMode] = useState<'list' | 'full-record'>('list');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch patients from database
  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map database patients to our interface (add empty medicalRecords for now)
      const mappedPatients: Patient[] = (data || []).map(p => ({
        ...p,
        medicalRecords: []
      }));

      setPatients(mappedPatients);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast({
        title: "Error",
        description: "Failed to load patient records",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const calculateAge = (dob: string | null): string => {
    if (!dob) return '';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  const calculateDaysLeft = (expiration: string | null): number => {
    if (!expiration) return 0;
    const today = new Date();
    const expDate = new Date(expiration);
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getMembershipColor = (tier: string | null): string => {
    switch (tier?.toLowerCase()) {
      case 'green': return 'bg-green-100 text-green-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'platinum': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getDaysLeftColor = (days: number): string => {
    if (days > 30) return 'text-green-600';
    if (days > 7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const openFullRecord = (patient: Patient) => {
    setSelectedPatient({ ...patient });
    setViewMode('full-record');
  };

  const closeFullRecord = () => {
    setViewMode('list');
    setSelectedPatient(null);
  };

  const savePatientRecord = async () => {
    if (!selectedPatient) return;

    try {
      const { error } = await supabase
        .from('patients')
        .update({
          name: selectedPatient.name,
          email: selectedPatient.email,
          phone: selectedPatient.phone,
          date_of_birth: selectedPatient.date_of_birth,
          gender: selectedPatient.gender,
          address: selectedPatient.address,
          emergency_contact: selectedPatient.emergency_contact,
          last_visit: selectedPatient.last_visit
        })
        .eq('id', selectedPatient.id);

      if (error) throw error;

      toast({
        title: "Saved successfully",
        description: "Patient record has been updated.",
        duration: 1500,
      });

      fetchPatients();
    } catch (error) {
      console.error('Error saving patient:', error);
      toast({
        title: "Error",
        description: "Failed to save patient record",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const addNewPatient = () => {
    const newPatient: Patient = {
      id: '',
      member_id: null,
      name: '',
      email: '',
      phone: '',
      date_of_birth: null,
      gender: null,
      address: null,
      emergency_contact: null,
      membership_type: null,
      membership_start_date: null,
      membership_expiry_date: null,
      last_visit: null,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      medicalRecords: []
    };
    setSelectedPatient(newPatient);
    setViewMode('full-record');
  };

  const createNewPatient = async () => {
    if (!selectedPatient || !selectedPatient.name || !selectedPatient.email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('patients')
        .insert({
          name: selectedPatient.name,
          email: selectedPatient.email,
          phone: selectedPatient.phone,
          date_of_birth: selectedPatient.date_of_birth,
          gender: selectedPatient.gender,
          address: selectedPatient.address,
          emergency_contact: selectedPatient.emergency_contact,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Created successfully",
        description: "New patient record has been created.",
        duration: 1500,
      });

      setSelectedPatient({ ...data, medicalRecords: [] });
      fetchPatients();
    } catch (error) {
      console.error('Error creating patient:', error);
      toast({
        title: "Error",
        description: "Failed to create patient record",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const addMedicalRecord = () => {
    if (selectedPatient) {
      const newRecord: MedicalRecord = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        notes: ''
      };
      setSelectedPatient({
        ...selectedPatient,
        medicalRecords: [newRecord, ...(selectedPatient.medicalRecords || [])]
      });
    }
  };

  const updateMedicalRecord = (recordId: number, notes: string) => {
    if (selectedPatient) {
      setSelectedPatient({
        ...selectedPatient,
        medicalRecords: selectedPatient.medicalRecords.map(r =>
          r.id === recordId ? { ...r, notes } : r
        )
      });
    }
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.phone || '').includes(searchTerm) ||
    (p.membership_type || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (viewMode === 'full-record' && selectedPatient) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={closeFullRecord}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <h2 className="font-display text-2xl font-semibold text-foreground">
          {selectedPatient.id ? 'Full Record' : 'New Patient'}
        </h2>

        <div className="space-y-6">
          {/* Personal Info & Contacts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium text-foreground">Personal Info</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs text-muted-foreground mb-1 block">Name</label>
                    <Input
                      value={selectedPatient.name}
                      onChange={(e) => setSelectedPatient({ ...selectedPatient, name: e.target.value })}
                      placeholder="Enter patient name"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Date of Birth</label>
                    <Input
                      type="date"
                      value={selectedPatient.date_of_birth || ''}
                      onChange={(e) => setSelectedPatient({ ...selectedPatient, date_of_birth: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Age</label>
                    <Input
                      value={calculateAge(selectedPatient.date_of_birth)}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-muted-foreground mb-1 block">Gender</label>
                    <Select
                      value={selectedPatient.gender || ''}
                      onValueChange={(value) => setSelectedPatient({ ...selectedPatient, gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contacts */}
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium text-foreground">Contacts</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Mobile No.</label>
                    <Input
                      value={selectedPatient.phone || ''}
                      onChange={(e) => setSelectedPatient({ ...selectedPatient, phone: e.target.value })}
                      placeholder="09XXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                    <Input
                      type="email"
                      value={selectedPatient.email}
                      onChange={(e) => setSelectedPatient({ ...selectedPatient, email: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Emergency Contact</label>
                    <Input
                      value={selectedPatient.emergency_contact || ''}
                      onChange={(e) => setSelectedPatient({ ...selectedPatient, emergency_contact: e.target.value })}
                      placeholder="Emergency contact number"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Membership */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="font-medium text-foreground mb-4">Membership</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Membership</label>
                  <Badge className={getMembershipColor(selectedPatient.membership_type)}>
                    {selectedPatient.membership_type || 'None'}
                  </Badge>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Join Date</label>
                  <p className="text-sm font-medium">{formatDate(selectedPatient.membership_start_date) || '-'}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Expiration</label>
                  <p className="text-sm font-medium">{formatDate(selectedPatient.membership_expiry_date) || '-'}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Days Left</label>
                  <p className={`text-sm font-medium ${getDaysLeftColor(calculateDaysLeft(selectedPatient.membership_expiry_date))}`}>
                    {selectedPatient.membership_expiry_date ? `${calculateDaysLeft(selectedPatient.membership_expiry_date)} days` : '-'}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Status</label>
                  <Badge className={getStatusColor(selectedPatient.status)}>
                    {selectedPatient.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Records - Only show for existing patients */}
          {selectedPatient.id && (
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-medium text-foreground">Medical Records</h3>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addMedicalRecord}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    ADD
                  </Button>
                </div>

                <div className="space-y-4">
                  {selectedPatient.medicalRecords && selectedPatient.medicalRecords.length > 0 ? (
                    selectedPatient.medicalRecords.map((record) => (
                      <div key={record.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{formatDate(record.date)}</span>
                        </div>
                        <Textarea
                          value={record.notes}
                          onChange={(e) => updateMedicalRecord(record.id, e.target.value)}
                          placeholder="Enter treatment notes here..."
                          rows={3}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No medical records yet. Click ADD to create one.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end">
            <Button
              onClick={selectedPatient.id ? savePatientRecord : createNewPatient}
              className="px-8 gradient-accent text-accent-foreground"
            >
              {selectedPatient.id ? 'SAVE' : 'CREATE'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-semibold text-foreground">Patient Records Database</h2>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={addNewPatient} className="gap-2 gradient-accent text-accent-foreground">
              <Plus className="h-4 w-4" />
              ADD
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Mobile No.</th>
                    <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Last Visit</th>
                    <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Membership</th>
                    <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-muted-foreground">
                        <User className="h-12 w-12 mx-auto mb-2 opacity-30" />
                        <p>No patient records found</p>
                        <p className="text-sm">Patient records are created automatically when members are confirmed</p>
                      </td>
                    </tr>
                  ) : (
                    filteredPatients.map((patient) => (
                      <tr key={patient.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-2 font-medium">{patient.name || '-'}</td>
                        <td className="py-4 px-2 text-sm">{patient.phone || '-'}</td>
                        <td className="py-4 px-2 text-sm">{formatDate(patient.last_visit) || '-'}</td>
                        <td className="py-4 px-2">
                          {patient.membership_type ? (
                            <Badge className={getMembershipColor(patient.membership_type)}>
                              {patient.membership_type}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </td>
                        <td className="py-4 px-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openFullRecord(patient)}
                            className="gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientRecords;
