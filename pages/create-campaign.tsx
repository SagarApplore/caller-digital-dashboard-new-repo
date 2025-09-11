"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/organisms/card";
import {
  FileText,
  Database,
  Info,
  Upload,
  Download,
  ArrowLeft,
  ArrowRight,
  Check,
  Badge,
  Tag,
  Star,
  Phone,
  CheckCircle,
  Globe,
  Clock,
  Bot,
  RotateCcw,
  Users,
  DollarSign,
  Rocket,
  Save,
  Shield,
  Target,
  TrendingUp,
  X,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Label } from "@/components/atoms/label";
import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge as BadgeComponent } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Progress } from "@/components/ui/progress";
import { Stepper } from "@/components/molecules/stepper";
import { NetworkService } from "@/services/network-service";
import endpoints from "@/lib/endpoints";
import apiRequest from "@/utils/api";
import { toast } from "sonner";

export function CreateCampaignPage() {
  const router = useRouter();
  const [selectedSource, setSelectedSource] = useState<"csv" | "crm" | null>(
    null
  );
  const [dragActive, setDragActive] = useState(false);
  const [step, setStep] = useState(1);
  const [campaignName, setCampaignName] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  const [selectedAssistant, setSelectedAssistant] = useState<any>(null);
  const [selectedPhone, setSelectedPhone] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [timeAdjusted, setTimeAdjusted] = useState(false);
  const [callingDays, setCallingDays] = useState({
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
    sun: false,
  });
  const [assistants, setAssistants] = useState<any[]>([]);
  const [assistantsLoading, setAssistantsLoading] = useState(false);
  const [maxRetries, setMaxRetries] = useState(1);
  const [retryInterval, setRetryInterval] = useState(1);
  const [enableSmartRetry, setEnableSmartRetry] = useState(false);
  const [enableHumanHandoff, setEnableHumanHandoff] = useState(false);
  const [customerRequestsAgent, setCustomerRequestsAgent] = useState(false);
  const [lowConfidenceHandoff, setLowConfidenceHandoff] = useState(false);

  // File upload states
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string>("");
  const [campaignCreating, setCampaignCreating] = useState(false);
  
  // CSV column selection states
  const [csvColumns, setCsvColumns] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<{[key: string]: boolean}>({});
  const [requiredColumns] = useState<string[]>(['phone_number', 'name']);

  // Manual lead entry (fallback when user doesn't have a CSV)
  const [manualName, setManualName] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [manualError, setManualError] = useState<string>("");

  const generateCsvFromManualLead = () => {
    setManualError("");
    // Basic validation
    const trimmedName = manualName.trim();
    const trimmedPhone = manualPhone.trim();
    if (!trimmedName || !trimmedPhone) {
      setManualError("Please enter both phone number and name.");
      return;
    }
    
    // Enhanced phone number validation with country code
    // Check for international format (starts with + followed by country code)
    const phoneRegex = /^\+[1-9]\d{0,3}[\s.-]?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      setManualError("Please enter a valid phone number with country code (e.g., +1234567890).");
      return;
    }
    
    // Extract digits for length validation
    const digits = trimmedPhone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) {
      setManualError("Phone number must have 10 to 15 digits including country code.");
      return;
    }
    
    // Validate country code (must start with +)
    if (!trimmedPhone.startsWith('+')) {
      setManualError("Phone number must include country code starting with + (e.g., +1 for US).");
      return;
    }
     const phoneWithoutPlus = trimmedPhone.startsWith("+")
    ? trimmedPhone.substring(1)
    : trimmedPhone;

    console.log("phoneWithoutPlus",phoneWithoutPlus)
    // Build minimal CSV with required headers exactly as validated elsewhere
    // Note: wrap values with quotes to be safe
    const csvContent = `phone_number,name\n"${phoneWithoutPlus}","${trimmedName}"`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const file = new File([blob], "manual_leads.csv", { type: "text/csv" });
    // Reuse existing upload flow (validation + UI state)
    handleFileUpload(file);
  };

  // Additional fields required by backend API
  const [status, setStatus] = useState("running");
  const [connect, setConnect] = useState(false);
  const [callPlaced, setCallPlaced] = useState(0);
  const [successPrompt, setSuccessPrompt] = useState("");
  const [failurePrompt, setFailurePrompt] = useState("");
  const [scheduleTimestamp, setScheduleTimestamp] = useState("");
  const [delay_between_calls, setDelayBetweenCalls] = useState("60");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Reset states
    setUploadError("");
    setUploadProgress(0);

    // Validate file type
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setUploadError("Please select a valid CSV file.");
      return;
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      setUploadError("File size must be less than 50MB.");
      return;
    }

    // Validate CSV headers
    try {
      const text = await file.text();
      const lines = text.split('\n');
      if (lines.length === 0) {
        setUploadError("CSV file is empty.");
        return;
      }

      // Normalize headers: trim whitespace, remove quotes, and convert to lowercase
      const headers = lines[0]
        .split(',')
        .map(header => header.trim().replace(/['"]*/g, ''));
      
      console.log("Found headers:", headers);
      
      const missingColumns = requiredColumns.filter(col => !headers.includes(col));

      if (missingColumns.length > 0) {
        setUploadError(`CSV is missing required columns: ${missingColumns.join(', ')}. Please ensure your CSV has exactly these columns: phone_number, name`);
        return;
      }
      
      // Store the CSV columns for selection
      setCsvColumns(headers);
      
      // Initialize selected columns - required columns are selected by default
      const initialSelectedColumns: {[key: string]: boolean} = {};
      headers.forEach(column => {
        initialSelectedColumns[column] = requiredColumns.includes(column);
      });
      setSelectedColumns(initialSelectedColumns);

      console.log("CSV validation passed. Headers found:", headers);
    } catch (validationError) {
      setUploadError("Error reading CSV file. Please check the file format.");
      console.error("CSV validation error:", validationError);
      return;
    }

    // Set file and simulate upload progress (API call will be done later)
    setUploadedFile(file);
    setUploadStatus("uploading");

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      setUploadStatus("success");
      console.log("File upload simulated successfully");

      // Clear the file input
      const fileInput = document.getElementById(
        "csv-upload"
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (simulationError) {
      setUploadStatus("error");
      setUploadError("Upload failed. Please try again.");
      console.error("Upload error:", simulationError);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadStatus("idle");
    setUploadProgress(0);
    setUploadError("");

    // Clear the file input
    const fileInput = document.getElementById("csv-upload") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const downloadSampleCSV = () => {
    const csvContent = "phone_number,name,email,company\n+1234567890,John Doe,john@example.com,ABC Corp\n+1987654321,Jane Smith,jane@example.com,XYZ Inc";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_campaign_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  function handleDayChange(key: string, checked: boolean) {
    setCallingDays((prev) => ({
      ...prev,
      [key]: checked,
    }));
  }

  useEffect(() => {
    fetchAssistants();
  }, []);

  const fetchAssistants = async () => {
    setAssistantsLoading(true);
    try {
      // Get current user info to determine client ID
      const userResponse = await apiRequest('/auth/me', "GET");
      let clientId = null;
      
      if (userResponse.data?.success) {
        const user = userResponse.data.data;
        if (user.role === "CLIENT_ADMIN") {
          clientId = user._id;
        } else if (user.role === "TEAM_MEMBER") {
          clientId = user.createdBy;
        }
        // For SUPER_ADMIN, we don't filter by client as they can see all agents
      }

      // Build the API URL with client ID if needed (only for CLIENT_ADMIN and TEAM_MEMBER)
      let apiUrl = '/agents/with-phone-numbers';
      if (clientId) {
        apiUrl += `?clientId=${clientId}`;
      }

      // Fetch agents with phone numbers assigned
      const response = await apiRequest(apiUrl, "GET");

      if (response.data?.success === true) {
        setAssistants(response.data.data);
      } else {
        console.error("Failed to fetch assistants with phone numbers:", response.statusText);
        // Fallback to regular agents list if the new endpoint doesn't exist
        const fallbackResponse = await apiRequest(endpoints.assistants.list, "GET");
        if (fallbackResponse.data?.success === true) {
          setAssistants(fallbackResponse.data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching assistants:", error);
      // Fallback to regular agents list
      try {
        const fallbackResponse = await apiRequest(endpoints.assistants.list, "GET");
        if (fallbackResponse.data?.success === true) {
          setAssistants(fallbackResponse.data.data);
        }
      } catch (fallbackError) {
        console.error("Fallback fetch also failed:", fallbackError);
      }
    } finally {
      setAssistantsLoading(false);
    }
  };

  const getSelectedAssistantId = () =>
    selectedAssistant && selectedAssistant._id ? selectedAssistant._id : undefined;

  const createCampaign = async () => {
    setCampaignCreating(true);
    try {
      // Validate CSV upload for CSV source
      if (selectedSource === "csv") {
        if (!uploadedFile) {
          toast.error("Please upload a CSV file for CSV source campaigns.");
          setCampaignCreating(false);
          return;
        }
        
        if (uploadStatus === "error") {
          toast.error("Please fix the CSV file errors before creating the campaign.");
          setCampaignCreating(false);
          return;
        }
      }

      // Prepare campaign data with all required fields
      const campaignData = {
        campaignName,
        status,
        assistant: selectedAssistant._id,
        connect,
        callPlaced,
        successPrompt,
        failurePrompt,
        scheduleTimestamp,
        delay_between_calls,
        timezone
      };

      // Check if we have a CSV file to upload
      if (selectedSource === "csv" && uploadedFile) {
        // Create FormData to send file + campaign data together
        const formData = new FormData();

        // Add the CSV file
        formData.append("csvFile", uploadedFile);

        // Add all campaign data fields
        Object.entries(campaignData).forEach(([key, value]) => {
          formData.append(key, value.toString());
        });
        
        // Add selected columns
        const selectedColumnsList = Object.entries(selectedColumns)
          .filter(([_, isSelected]) => isSelected)
          .map(([column]) => column);
        formData.append("selectedColumns", JSON.stringify(selectedColumnsList));

        const response = await apiRequest(
          endpoints.outboundCampaign.create,
          "POST",
          formData
        );

        console.log("Campaign created with CSV:", response.data);

        // Redirect to campaigns page on success
        toast.success("Campaign created successfully!");
        router.push("/outbound-campaign-manager");
        return response.data;
      } else {
        // For CRM or other sources without file upload
        const response = await apiRequest(
          endpoints.outboundCampaign.create,
          "POST",
          campaignData
        );

        console.log("Campaign created:", response.data);

        // Redirect to campaigns page on success
        toast.success("Campaign created successfully!");
        router.push("/outbound-campaign-manager");
        return response.data;
      }
    } catch (error: any) {
      console.error("Campaign creation failed:", error);
      
      // Handle specific error messages
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to create campaign. Please try again.");
      }
      throw error;
    } finally {
      setCampaignCreating(false);
    }
  };

  return (
    <div>
      {/* Stepper */}
      <div className="flex items-center justify-center bg-white p-4 mb-6">
        <div className="flex items-center space-x-8">
          {/* Step 1 - Active */}
          {Stepper("Lead Source", 1, step, 2)}

          {/* Step 2 - Inactive */}
          {Stepper("Configuration", 2, step, 2)}
        </div>
      </div>

      {step === 1 && (
        <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-lg shadow-gray-200 max-h-[calc(100vh-170px)] overflow-y-auto">
          {/* Main Content */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Choose Your Lead Source
            </h1>
            <p className="text-gray-600">
              Select how you want to import your leads for this campaign
            </p>
          </div>

          {/* Source Selection Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Upload CSV File */}
            <Card
              className={`cursor-pointer transition-all duration-200 ${
                selectedSource === "csv"
                  ? "border-purple-300 bg-purple-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedSource("csv")}
            >
              <CardContent className="p-8 text-center">
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center ${
                    selectedSource === "csv" ? "bg-purple-100" : "bg-gray-100"
                  }`}
                >
                  <FileText
                    className={`w-8 h-8 ${
                      selectedSource === "csv"
                        ? "text-purple-600"
                        : "text-gray-600"
                    }`}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select to Upload CSV File or add a number
                </h3>
                <p className="text-gray-600 mb-4">
                  Import leads from a CSV file with phone numbers, names, and
                  custom fields
                </p>
                {selectedSource === "csv" && (
                  <div className="flex items-center justify-center space-x-2 text-purple-600">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">Selected</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Import from CRM */}
            <Card
              className={`cursor-pointer transition-all duration-200 ${
                selectedSource === "crm"
                  ? "border-purple-300 bg-purple-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedSource("crm")}
            >
              <CardContent className="p-8 text-center">
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center ${
                    selectedSource === "crm" ? "bg-purple-100" : "bg-gray-100"
                  }`}
                >
                  <Database
                    className={`w-8 h-8 ${
                      selectedSource === "crm"
                        ? "text-purple-600"
                        : "text-gray-600"
                    }`}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Import from CRM
                </h3>
                <p className="text-gray-600 mb-4">
                  Connect to your CRM system and import leads directly
                </p>
                <BadgeComponent className="bg-gray-100 text-gray-600">Available</BadgeComponent>
              </CardContent>
            </Card>
          </div>

          {/* CSV Upload Section */}
          {selectedSource === "csv" && (
            <Card className="mb-6">
              <CardContent className="p-8">
                {!uploadedFile ? (
                  <div
                    className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                      dragActive
                        ? "border-purple-400 bg-purple-50"
                        : "border-gray-300 bg-gray-50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Upload Your CSV File
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Drag and drop your CSV file here, or click to browse
                    </p>

                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="csv-upload"
                    />
                    <label htmlFor="csv-upload">
                      <Button
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 cursor-pointer"
                        onClick={() => {
                          document.getElementById("csv-upload")?.click();
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Choose File
                      </Button>
                    </label>

                    <div className="mt-6 text-sm text-gray-500">
                      <p className="mb-1">Supported format: CSV (max 50MB)</p>
                      <p>
                        Required columns: <strong>phone_number</strong>, <strong>name</strong> (Optional: email, company, custom fields)
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        ⚠️ Column names must be exactly: "phone_number" and "name" 
                      </p>
                      <div className="mt-6 text-sm text-gray-500">OR</div>
                      <div className="mt-3 flex flex-col sm:flex-row gap-3 sm:items-end">
                        <div className="flex-1">
                          <Label htmlFor="manual-phone" className="text-sm font-medium">Phone Number with Country Code (no CSV)</Label>
                          <Input id="manual-phone" placeholder="e.g. +1 (555) 123-4567" value={manualPhone} onChange={(e)=>setManualPhone(e.target.value)} className="mt-1" />
                        </div>
                        <div className="flex-1">
                          <Label htmlFor="manual-name" className="text-sm font-medium">Name</Label>
                          <Input id="manual-name" placeholder="e.g. John Doe" value={manualName} onChange={(e)=>setManualName(e.target.value)} className="mt-1" />
                        </div>
                        <div>
                          <Button onClick={generateCsvFromManualLead} className="bg-emerald-600 hover:bg-emerald-700 text-white whitespace-nowrap">
                            Generate CSV & Use
                          </Button>
                        </div>
                      </div>
                      {manualError && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{manualError}</div>
                      )}
                      <div className="mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={downloadSampleCSV}
                          className="text-blue-600 border-blue-300 hover:bg-blue-50"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download Sample CSV
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-solid rounded-lg p-6 transition-colors border-green-300 bg-green-50">
                    {/* Upload Progress */}
                    {uploadStatus === "uploading" && (
                      <div className="text-center mb-4">
                        <div className="flex items-center justify-center mb-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mr-2"></div>
                          <span className="text-purple-600 font-medium">
                            Uploading...
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {uploadProgress}% complete
                        </p>
                      </div>
                    )}

                    {/* Upload Success */}
                    {uploadStatus === "success" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {uploadedFile.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                • Uploaded successfully
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveFile}
                            className="text-gray-500 hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {/* CSV Column Selection */}
                        {csvColumns.length > 0 && (
                          <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <h4 className="font-medium text-gray-900 mb-2">Select Columns to Import</h4>
                            <p className="text-sm text-gray-600 mb-3">
                              Required columns are selected by default. Choose additional required columns to include in your campaign.
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {csvColumns.map((column) => (
                                <div key={column} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={`column-${column}`}
                                    checked={selectedColumns[column] || false}
                                    onChange={(e) => {
                                      // Don't allow unchecking required columns
                                      if (requiredColumns.includes(column) && !e.target.checked) {
                                        return;
                                      }
                                      setSelectedColumns({
                                        ...selectedColumns,
                                        [column]: e.target.checked,
                                      });
                                    }}
                                    disabled={requiredColumns.includes(column)}
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                  />
                                  <label
                                    htmlFor={`column-${column}`}
                                    className={`text-sm ${requiredColumns.includes(column) ? 'font-medium text-purple-700' : 'text-gray-700'}`}
                                  >
                                    {column}
                                    {requiredColumns.includes(column) && (
                                      <span className="ml-1 text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                                        Required
                                      </span>
                                    )}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Upload Error */}
                    {uploadStatus === "error" && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {uploadedFile.name}
                            </h4>
                            <p className="text-sm text-red-600">
                              {uploadError}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveFile}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    {/* Change File Button */}
                    {uploadStatus === "success" && (
                      <div className="mt-4 text-center">
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="csv-upload-change"
                        />
                        <label htmlFor="csv-upload-change">
                          <Button
                            variant="outline"
                            className="border-purple-300 text-purple-700 hover:bg-purple-50"
                            onClick={() => {
                              document
                                .getElementById("csv-upload-change")
                                ?.click();
                            }}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Change File
                          </Button>
                        </label>
                      </div>
                    )}
                  </div>
                )}

                {/* Error Message */}
                {uploadError && !uploadedFile && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600">
                        {uploadError}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6">
            <Button
              variant="outline"
              onClick={() => router.push("/outbound-campaign-manager")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>

            <Button
              onClick={() => setStep(2)}
              disabled={!selectedSource || (selectedSource === "csv" && !uploadedFile)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg shadow-gray-200 max-h-[calc(100vh-170px)] overflow-y-auto">
          {/* Main Content */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Campaign Configuration
            </h1>
            <p className="text-gray-600">
              Configure your campaign settings and parameters
            </p>
          </div>

          {/* Campaign Details */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Campaign Details
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="campaign-name" className="text-sm font-medium text-gray-700">
                    Campaign Name
                  </Label>
                  <Input
                    id="campaign-name"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="Enter campaign name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="campaign-description" className="text-sm font-medium text-gray-700">
                    Campaign Description
                  </Label>
                  <Textarea
                    id="campaign-description"
                    value={campaignDescription}
                    onChange={(e) => setCampaignDescription(e.target.value)}
                    placeholder="Enter campaign description"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="assistant" className="text-sm font-medium text-gray-700">
                    Select Assistant
                  </Label>
                  <p className="text-xs text-gray-500 mb-2">
                    Only your assistants with assigned phone numbers are shown for outbound campaigns
                  </p>
                  <Select value={getSelectedAssistantId()} onValueChange={(value) => {
                    const assistant = assistants.find(a => a._id === value);
                    setSelectedAssistant(assistant);
                  }}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={assistantsLoading ? "Loading..." : "Select an assistant with phone number"} />
                    </SelectTrigger>
                    <SelectContent>
                      {assistantsLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading assistants...
                        </SelectItem>
                      ) : assistants.length > 0 ? (
                        assistants.map((assistant) => (
                          <SelectItem key={assistant._id} value={assistant._id}>
                            {assistant.agentName}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-assistants" disabled>
                          No assistants with phone numbers available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {assistants.length === 0 && (
                    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-yellow-800 font-medium">
                            No assistants with phone numbers found
                          </p>
                          <p className="text-xs text-yellow-700 mt-1">
                            Please assign phone numbers to agents first. 
                            <Button
                              variant="link"
                              size="sm"
                              className="text-yellow-800 p-0 h-auto font-medium underline"
                              onClick={() => router.push("/phone-numbers")}
                            >
                              Go to Phone Numbers
                            </Button>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Prompts */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Campaign Prompts
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="success-prompt" className="text-sm font-medium text-gray-700">
                    Success Prompt
                  </Label>
                  <Textarea
                    id="success-prompt"
                    value={successPrompt}
                    onChange={(e) => setSuccessPrompt(e.target.value)}
                    placeholder="Enter success prompt"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="failure-prompt" className="text-sm font-medium text-gray-700">
                    Failure Prompt
                  </Label>
                  <Textarea
                    id="failure-prompt"
                    value={failurePrompt}
                    onChange={(e) => setFailurePrompt(e.target.value)}
                    placeholder="Enter failure prompt"
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call Settings */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Phone className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Call Settings
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="delay-between-calls" className="text-sm font-medium text-gray-700">
                    Delay Between Calls (seconds)
                  </Label>
                  <Input
                    id="delay-between-calls"
                    type="string"
                    value={delay_between_calls}
                    onChange={(e) => setDelayBetweenCalls(e.target.value)}
                    
                    className="mt-1 bg-gray-50 cursor"
                  />
                  {/* <p className="text-xs text-gray-500 mt-1">
                    Fixed at 60 seconds - cannot be modified
                  </p> */}
                </div>

                <div>
                  <Label htmlFor="campaign-status" className="text-sm font-medium text-gray-700">
                    Campaign Status
                  </Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="running">Running</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="stopped">Stopped</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Settings */}
          
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Schedule Settings
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="schedule-timestamp" className="text-sm font-medium text-gray-700">
                    Schedule Campaign Start
                  </Label>
                  <Input
                    id="schedule-timestamp"
                    type="datetime-local"
                    value={scheduleTimestamp}
                    onChange={(e) => {
                      const selectedValue = e.target.value; // Format: "2024-01-15T18:39"
                      
                      // If no value is selected, reset everything
                      if (!selectedValue) {
                        setScheduleTimestamp("");
                        setTimeAdjusted(false);
                        return;
                      }
                      
                      const now = new Date();
                      
                      // Parse the selected date and time without timezone conversion
                      const [datePart, timePart] = selectedValue.split('T');
                      const selectedDate = new Date(datePart + 'T00:00:00');
                      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                      
                      // More robust date comparison
                      const isToday = selectedDate.toDateString() === today.toDateString();
                      
                      console.log('Selected date:', selectedDate.toDateString());
                      console.log('Today:', today.toDateString());
                      console.log('Is today?', isToday);
                      
                      // If user selects today's date, add 30 minutes to the selected time
                      if (isToday) {
                        console.log('Adding 30 minutes to time:', timePart);
                        // Parse time and add 30 minutes
                        const [hours, minutes] = timePart.split(':').map(Number);
                        const adjustedMinutes = minutes + 30;
                        const adjustedHours = hours + Math.floor(adjustedMinutes / 60);
                        const finalMinutes = adjustedMinutes % 60;
                        
                        // Format back to datetime-local format
                        const adjustedTime = `${datePart}T${adjustedHours.toString().padStart(2, '0')}:${finalMinutes.toString().padStart(2, '0')}`;
                        console.log('Adjusted time:', adjustedTime);
                        setScheduleTimestamp(adjustedTime);
                        setTimeAdjusted(true);
                      } else {
                        console.log('Not today, using original time:', selectedValue);
                        setScheduleTimestamp(selectedValue);
                        setTimeAdjusted(false);
                      }
                    }}
                    min={(() => {
                      const now = new Date();
                      const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);
                      return thirtyMinutesFromNow.toISOString().slice(0, 16);
                    })()}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Optional: Leave empty to start immediately. Cannot schedule in the past. If today's date is selected, 30 minutes will be added to your chosen time.
                  </p>
                  {timeAdjusted && (
                    <div className="mt-2 p-2 bg-blue-100 border border-blue-200 rounded-md text-blue-800 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      Time adjusted to 30 minutes after your selected time.
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="timezone" className="text-sm font-medium text-gray-700">
                    Timezone
                  </Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      {/* <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem> */}
                      <SelectItem value="Asia/Kolkata">Mumbai (IST)</SelectItem>
                      {/* <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      <SelectItem value="Europe/Paris">Paris (CET)</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>

            <Button
              onClick={createCampaign}
              disabled={!campaignName || !selectedAssistant || campaignCreating || assistants.length === 0}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 flex items-center space-x-2"
            >
              {campaignCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4" />
                  <span>Create Campaign</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateCampaignPage;
