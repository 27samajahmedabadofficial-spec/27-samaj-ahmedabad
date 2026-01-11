import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Upload, Loader, Edit2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { familyService } from "@/services/familyService";

interface FamilyMember {
  id?: string | number;
  relation: string;
  fullName: string;
  mobileNo: string;
  dateOfBirth: string;
  maritalStatus: string;
  jobBusinessDetails: string;
  education: string;
  relation_with_head?: string;
  full_name?: string;
  mobile_no?: string;
  date_of_birth?: string;
  marital_status?: string;
  job_business_details?: string;
}

interface FamilyData {
  id?: number;
  full_name?: string;
  fullName?: string;
  mobile_no?: string;
  mobileNo?: string;
  village_name?: string;
  villageName?: string;
  current_address?: string;
  currentAddress?: string;
  date_of_birth?: string;
  dateOfBirth?: string;
  marital_status?: string;
  maritalStatus?: string;
  job_business_details?: string;
  jobBusinessDetails?: string;
  education?: string;
  photo_url?: string;
  payment_status?: string;
  receipt_url?: string;
}

const Family = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  // State for existing family
  const [existingFamily, setExistingFamily] = useState<FamilyData | null>(null);
  const [existingMembers, setExistingMembers] = useState<FamilyMember[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoadingFamily, setIsLoadingFamily] = useState(true);

  // State for form
  const [familyHead, setFamilyHead] = useState({
    fullName: "",
    mobileNo: "",
    villageName: "",
    currentAddress: "",
    dateOfBirth: "",
    maritalStatus: "",
    jobBusinessDetails: "",
    education: "",
    photo: null as File | null,
  });

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { 
      id: crypto.randomUUID(), 
      relation: "",
      fullName: "", 
      mobileNo: "",
      dateOfBirth: "", 
      maritalStatus: "",
      jobBusinessDetails: "",
      education: ""
    }
  ]);

  const [paymentStatus, setPaymentStatus] = useState({
    alreadyPaid: false,
    receipt: null as File | null,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Load existing family on mount
  useEffect(() => {
    const loadFamily = async () => {
      try {
        setIsLoadingFamily(true);
        const response = await familyService.getFamilyDetails();
        if (response.family) {
          setExistingFamily(response.family);
          setExistingMembers(response.members || []);
          // Pre-populate form with existing data for edit mode
          setFamilyHead({
            fullName: response.family.full_name || "",
            mobileNo: response.family.mobile_no || "",
            villageName: response.family.village_name || "",
            currentAddress: response.family.current_address || "",
            dateOfBirth: response.family.date_of_birth || "",
            maritalStatus: response.family.marital_status || "",
            jobBusinessDetails: response.family.job_business_details || "",
            education: response.family.education || "",
            photo: null,
          });
          setPaymentStatus({
            alreadyPaid: response.family.payment_status === "completed",
            receipt: null,
          });
        }
      } catch (error) {
        console.error("Error loading family:", error);
      } finally {
        setIsLoadingFamily(false);
      }
    };

    loadFamily();
  }, []);

  // Sync from profile on first load
  useEffect(() => {
    if (profile && !existingFamily) {
      setFamilyHead((f) => ({
        ...f,
        fullName: (profile as any).full_name || "",
        mobileNo: (profile as any).mobile_no || "",
      }));
    }
  }, [profile, existingFamily]);

  const addFamilyMember = () => {
    setFamilyMembers([
      ...familyMembers,
      { 
        id: crypto.randomUUID(), 
        relation: "",
        fullName: "", 
        mobileNo: "",
        dateOfBirth: "", 
        maritalStatus: "",
        jobBusinessDetails: "",
        education: ""
      }
    ]);
  };

  const removeFamilyMember = (id: string | number) => {
    if (familyMembers.length > 1) {
      setFamilyMembers(familyMembers.filter(member => member.id !== id));
    }
  };

  const updateFamilyMember = (id: string | number, field: string, value: string) => {
    setFamilyMembers(familyMembers.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const handleSaveFamily = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!familyHead.fullName || !familyHead.mobileNo) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const familyData = {
        fullName: familyHead.fullName,
        mobileNo: familyHead.mobileNo,
        villageName: familyHead.villageName,
        currentAddress: familyHead.currentAddress,
        dateOfBirth: familyHead.dateOfBirth,
        maritalStatus: familyHead.maritalStatus,
        jobBusinessDetails: familyHead.jobBusinessDetails,
        education: familyHead.education,
        paymentStatus: paymentStatus.alreadyPaid ? "completed" : "pending",
      };

      const response = await familyService.updateFamily(
        familyData,
        familyHead.photo,
        paymentStatus.receipt
      );

      if (response.success) {
        toast.success("Family details updated successfully!");
        setIsEditMode(false);
        // Reload family data
        const updatedFamily = await familyService.getFamilyDetails();
        if (updatedFamily.family) {
          setExistingFamily(updatedFamily.family);
          setExistingMembers(updatedFamily.members || []);
        }
      }
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error.error || error.message || "Failed to update family");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async () => {
    const newMember = familyMembers.find(m => !m.id || (typeof m.id === 'string' && m.id.includes('-')));
    
    if (!newMember || !newMember.fullName || !newMember.relation) {
      toast.error("Please fill in relation and full name for the new member");
      return;
    }

    setIsLoading(true);

    try {
      const memberData = {
        relation: newMember.relation,
        fullName: newMember.fullName,
        mobileNo: newMember.mobileNo,
        dateOfBirth: newMember.dateOfBirth,
        maritalStatus: newMember.maritalStatus,
        jobBusinessDetails: newMember.jobBusinessDetails,
        education: newMember.education,
      };

      const response = await familyService.addFamilyMember(memberData);
      if (response.success) {
        toast.success("Member added successfully!");
        // Remove the temp member from form and reload family
        setFamilyMembers(familyMembers.filter(m => m.id !== newMember.id));
        const updatedFamily = await familyService.getFamilyDetails();
        if (updatedFamily.members) {
          setExistingMembers(updatedFamily.members);
        }
      }
    } catch (error: any) {
      console.error("Add member error:", error);
      toast.error(error.error || error.message || "Failed to add member");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMember = async (memberId: string | number) => {
    if (!window.confirm("Are you sure you want to delete this member?")) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await familyService.deleteFamilyMember(memberId as string);
      if (response.success) {
        toast.success("Member deleted successfully!");
        setExistingMembers(existingMembers.filter(m => m.id !== memberId));
      }
    } catch (error: any) {
      console.error("Delete member error:", error);
      toast.error(error.error || error.message || "Failed to delete member");
    } finally {
      setIsLoading(false);
    }
  };

  const getNormalizedMember = (member: FamilyMember) => ({
    id: member.id,
    relation: member.relation || member.relation_with_head || "",
    fullName: member.fullName || member.full_name || "",
    mobileNo: member.mobileNo || member.mobile_no || "",
    dateOfBirth: member.dateOfBirth || member.date_of_birth || "",
    maritalStatus: member.maritalStatus || member.marital_status || "",
    jobBusinessDetails: member.jobBusinessDetails || member.job_business_details || "",
    education: member.education || "",
  });

  // If loading, show spinner
  if (isLoadingFamily) {
    return (
      <div className="min-h-screen bg-background pb-24 flex items-center justify-center">
        <Header />
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading family details...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  // If family exists and not in edit mode - show view mode
  if (existingFamily && !isEditMode) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <Header />
        
        <main className="animate-fade-in">
          <div className="px-4 pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>

          <div className="px-4 py-6 space-y-6">
            <h1 className="text-2xl font-semibold text-center text-foreground mb-8">
              Family Details
            </h1>

            {/* Family Head Card */}
            <Card className="animate-slide-up">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-lg font-semibold text-primary">Family Head</h2>
                  <Button
                    onClick={() => setIsEditMode(true)}
                    className="gap-2"
                    size="sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="text-lg font-medium">{existingFamily.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mobile No</p>
                    <p className="text-lg font-medium">{existingFamily.mobile_no}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Village</p>
                    <p className="text-lg font-medium">{existingFamily.village_name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p className="text-lg font-medium">{existingFamily.date_of_birth || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Marital Status</p>
                    <p className="text-lg font-medium capitalize">{existingFamily.marital_status || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Education</p>
                    <p className="text-lg font-medium">{existingFamily.education || "-"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="text-lg font-medium">{existingFamily.current_address || "-"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Job/Business Details</p>
                    <p className="text-lg font-medium">{existingFamily.job_business_details || "-"}</p>
                  </div>
                  {existingFamily.photo_url && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground mb-2">Photo</p>
                      <img 
                        src={existingFamily.photo_url} 
                        alt="Family head" 
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                {/* Payment Status */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Status</p>
                      <p className={`text-lg font-medium capitalize ${
                        existingFamily.payment_status === "completed" ? "text-green-600" : "text-orange-600"
                      }`}>
                        {existingFamily.payment_status}
                      </p>
                    </div>
                    {existingFamily.receipt_url && (
                      <a 
                        href={existingFamily.receipt_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        View Receipt
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Family Members */}
            <div className="space-y-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-primary">Family Members ({existingMembers.length})</h2>
                <Button
                  onClick={() => setIsEditMode(true)}
                  size="sm"
                  variant="outline"
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Member
                </Button>
              </div>

              {existingMembers.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    No family members added yet
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {existingMembers.map((member) => {
                    const normalized = getNormalizedMember(member);
                    return (
                      <Card key={member.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-sm font-semibold text-primary capitalize">
                              {normalized.relation}
                            </span>
                            <Button
                              onClick={() => handleDeleteMember(member.id)}
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                              disabled={isLoading}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div>
                              <p className="text-muted-foreground">Full Name</p>
                              <p className="font-medium">{normalized.fullName}</p>
                            </div>
                            {normalized.mobileNo && (
                              <div>
                                <p className="text-muted-foreground">Mobile</p>
                                <p className="font-medium">{normalized.mobileNo}</p>
                              </div>
                            )}
                            {normalized.dateOfBirth && (
                              <div>
                                <p className="text-muted-foreground">DOB</p>
                                <p className="font-medium">{normalized.dateOfBirth}</p>
                              </div>
                            )}
                            {normalized.maritalStatus && (
                              <div>
                                <p className="text-muted-foreground">Marital Status</p>
                                <p className="font-medium capitalize">{normalized.maritalStatus}</p>
                              </div>
                            )}
                            {normalized.education && (
                              <div>
                                <p className="text-muted-foreground">Education</p>
                                <p className="font-medium">{normalized.education}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>

        <BottomNav />
      </div>
    );
  }

  // Register/Edit form mode
  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      
      <main className="animate-fade-in">
        <div className="px-4 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (existingFamily && isEditMode) {
                setIsEditMode(false);
              } else {
                navigate(-1);
              }
            }}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            {existingFamily && isEditMode ? "Cancel" : "Back"}
          </Button>
        </div>

        <form onSubmit={handleSaveFamily} className="px-4 py-6 space-y-6">
          <h1 className="text-2xl font-semibold text-center text-foreground mb-8">
            {existingFamily ? "Edit Family Details" : "Member Registration Form"}
          </h1>

          {/* Section 1 - Family Head Details */}
          <section className="bg-card rounded-xl p-5 shadow-card animate-slide-up">
            <h2 className="text-lg font-semibold text-primary border-l-4 border-primary pl-3 mb-4">
              Family Head Details
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  placeholder="Enter full name" 
                  value={familyHead.fullName}
                  onChange={(e) => setFamilyHead(s => ({ ...s, fullName: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobileNo">Mobile No</Label>
                <Input 
                  id="mobileNo" 
                  type="tel" 
                  placeholder="Enter mobile number" 
                  value={familyHead.mobileNo}
                  onChange={(e) => setFamilyHead(s => ({ ...s, mobileNo: e.target.value.replace(/\D/g, '').slice(0,10) }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="villageName">Village Name</Label>
                <Select value={familyHead.villageName} onValueChange={(v) => setFamilyHead(s => ({ ...s, villageName: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="-- Select Village --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Devpura">Devpura</SelectItem>
                    <SelectItem value="Ganeshpura">Ganeshpura</SelectItem>
                    <SelectItem value="Hirpura">Hirpura</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentAddress">Current Address</Label>
                <Textarea 
                  id="currentAddress" 
                  placeholder="Enter current address" 
                  value={familyHead.currentAddress}
                  onChange={(e) => setFamilyHead(s => ({ ...s, currentAddress: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input 
                  id="dateOfBirth" 
                  type="date"
                  placeholder="dd/mm/yyyy" 
                  value={familyHead.dateOfBirth}
                  onChange={(e) => setFamilyHead(s => ({ ...s, dateOfBirth: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maritalStatus">Marital Status</Label>
                <Select value={familyHead.maritalStatus} onValueChange={(v) => setFamilyHead(s => ({ ...s, maritalStatus: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="-- Select --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobBusinessDetails">Job / Business Details</Label>
                <Textarea 
                  id="jobBusinessDetails" 
                  placeholder="Enter job or business details" 
                  value={familyHead.jobBusinessDetails}
                  onChange={(e) => setFamilyHead(s => ({ ...s, jobBusinessDetails: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Input 
                  id="education" 
                  placeholder="Enter education details" 
                  value={familyHead.education}
                  onChange={(e) => setFamilyHead(s => ({ ...s, education: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo">Photo {existingFamily && "(Leave blank to keep existing)"}</Label>
                <div className="flex items-center gap-3">
                  <Input 
                    id="photo" 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setFamilyHead(s => ({ ...s, photo: e.target.files?.[0] || null }))}
                    className="flex-1"
                  />
                  {familyHead.photo && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Upload className="w-4 h-4" />
                      <span>{familyHead.photo.name}</span>
                    </div>
                  )}
                </div>
                {familyHead.photo && (
                  <img 
                    src={URL.createObjectURL(familyHead.photo)} 
                    alt="Preview" 
                    className="w-24 h-24 object-cover rounded-lg mt-2"
                  />
                )}
                {existingFamily?.photo_url && !familyHead.photo && (
                  <img 
                    src={existingFamily.photo_url} 
                    alt="Current" 
                    className="w-24 h-24 object-cover rounded-lg mt-2"
                  />
                )}
              </div>
            </div>
          </section>

          {/* Section 2 - Family Members */}
          <section className="bg-card rounded-xl p-5 shadow-card animate-slide-up" style={{ animationDelay: "100ms" }}>
            <h2 className="text-lg font-semibold text-primary border-l-4 border-primary pl-3 mb-4">
              {existingFamily ? "Existing Members" : "Family Members"}
            </h2>

            {/* Show existing members */}
            {existingMembers.length > 0 && (
              <div className="mb-6 pb-6 border-b">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Current Members ({existingMembers.length})</h3>
                <div className="space-y-3">
                  {existingMembers.map((member) => {
                    const normalized = getNormalizedMember(member);
                    return (
                      <div 
                        key={member.id}
                        className="border border-border rounded-lg p-3 bg-muted/30 flex justify-between items-start"
                      >
                        <div className="text-sm flex-1">
                          <p className="font-medium">{normalized.fullName}</p>
                          <p className="text-muted-foreground text-xs">{normalized.relation}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMember(member.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                          disabled={isLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Form for adding new members */}
            <div className="space-y-6">
              {familyMembers.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    {existingFamily ? "Add New Member" : "Family Members"}
                  </h3>
                </div>
              )}

              {familyMembers.map((member, index) => (
                <div 
                  key={member.id} 
                  className="border border-border rounded-lg p-4 bg-muted/30"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-muted-foreground">
                      {existingFamily ? "New Member" : `Member ${index + 1}`}
                    </span>
                    {familyMembers.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFamilyMember(member.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Relation with Family Head</Label>
                      <Select 
                        value={member.relation}
                        onValueChange={(value) => updateFamilyMember(member.id, "relation", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="-- Select Relation --" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="spouse">Spouse</SelectItem>
                          <SelectItem value="son">Son</SelectItem>
                          <SelectItem value="daughter">Daughter</SelectItem>
                          <SelectItem value="father">Father</SelectItem>
                          <SelectItem value="mother">Mother</SelectItem>
                          <SelectItem value="brother">Brother</SelectItem>
                          <SelectItem value="sister">Sister</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input 
                        placeholder="Enter full name" 
                        value={member.fullName}
                        onChange={(e) => updateFamilyMember(member.id, "fullName", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Mobile No</Label>
                      <Input 
                        type="tel"
                        placeholder="Enter mobile number" 
                        value={member.mobileNo}
                        onChange={(e) => updateFamilyMember(member.id, "mobileNo", e.target.value.replace(/\D/g, '').slice(0,10))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input 
                        type="date"
                        placeholder="dd/mm/yyyy" 
                        value={member.dateOfBirth}
                        onChange={(e) => updateFamilyMember(member.id, "dateOfBirth", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Marital Status</Label>
                      <Select 
                        value={member.maritalStatus}
                        onValueChange={(value) => updateFamilyMember(member.id, "maritalStatus", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="-- Select --" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Job / Business Details</Label>
                      <Textarea 
                        placeholder="Enter job or business details" 
                        value={member.jobBusinessDetails}
                        onChange={(e) => updateFamilyMember(member.id, "jobBusinessDetails", e.target.value)}
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Education</Label>
                      <Input 
                        placeholder="Enter education details" 
                        value={member.education}
                        onChange={(e) => updateFamilyMember(member.id, "education", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {familyMembers.length > 0 && (
                <Button
                  type="button"
                  onClick={handleAddMember}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
                  disabled={isLoading}
                >
                  {isLoading && <Loader className="w-4 h-4 animate-spin" />}
                  {isLoading ? "Adding..." : "Add Member"}
                </Button>
              )}

              {familyMembers.length === 0 && (
                <Button
                  type="button"
                  onClick={addFamilyMember}
                  className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Family Member
                </Button>
              )}
            </div>
          </section>

          {/* Section 3 - Payment (only on new registration) */}
          {!existingFamily && (
            <section className="bg-card rounded-xl p-5 shadow-card animate-slide-up" style={{ animationDelay: "200ms" }}>
              <h2 className="text-lg font-semibold text-primary border-l-4 border-primary pl-3 mb-4">
                Member Registration Fees - <b>₹501</b>
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Checkbox 
                    id="alreadyPaid"
                    checked={paymentStatus.alreadyPaid}
                    onCheckedChange={(checked) => setPaymentStatus(s => ({ ...s, alreadyPaid: checked as boolean }))}
                  />
                  <Label htmlFor="alreadyPaid" className="cursor-pointer flex-1 font-medium">
                    I have already paid the registration fee
                  </Label>
                </div>

                {paymentStatus.alreadyPaid ? (
                  <div className="space-y-2">
                    <Label htmlFor="receipt">Upload Payment Receipt</Label>
                    <div className="flex items-center gap-3">
                      <Input 
                        id="receipt" 
                        type="file" 
                        accept="image/*,.pdf"
                        onChange={(e) => setPaymentStatus(s => ({ ...s, receipt: e.target.files?.[0] || null }))}
                        className="flex-1"
                      />
                      {paymentStatus.receipt && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <Upload className="w-4 h-4" />
                          <span>{paymentStatus.receipt.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-900 mb-3">Payment Required</p>
                    <p className="text-sm text-blue-800 mb-4">
                      A registration fee of ₹500 is required to complete the family registration. Please proceed with payment.
                    </p>
                    <Button 
                      type="button"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Proceed to Payment
                    </Button>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Submit Button */}
          <div className="text-center pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="px-8 py-2 gradient-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed gap-2"
            >
              {isLoading && <Loader className="w-4 h-4 animate-spin" />}
              {isLoading ? "Saving..." : existingFamily ? "Update Family" : "Submit"}
            </Button>
          </div>
        </form>
      </main>

      <BottomNav />
    </div>
  );
};

export default Family;
