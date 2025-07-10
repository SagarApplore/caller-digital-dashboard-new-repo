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
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Progress } from "@/components/ui/progress";
import { Stepper } from "@/components/molecules/stepper";
import { NetworkService } from "@/services/network-service";
import endpoints from "@/lib/endpoints";
import apiRequest from "@/utils/api";

export function CreateCampaignPage() {
  const router = useRouter();
  const [selectedSource, setSelectedSource] = useState<"csv" | "crm" | null>(
    null
  );
  const [dragActive, setDragActive] = useState(false);
  const [step, setStep] = useState(1);
  const [campaignName, setCampaignName] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  // selectedAssistant now stores the whole assistant object, not just the id
  const [selectedAssistant, setSelectedAssistant] = useState<any>(null);
  const [selectedPhone, setSelectedPhone] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timezone, setTimezone] = useState("");
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
    const response = await apiRequest(endpoints.assistants.list, "GET");

    if (response.data?.success === true) {
      setAssistants(response.data.data);
    } else {
      console.error("Failed to fetch assistants:", response.statusText);
    }
  };

  // Helper to get assistant id for Select value
  const getSelectedAssistantId = () =>
    selectedAssistant && selectedAssistant._id ? selectedAssistant._id : "";

  const createCampaign = async () => {
    setCampaignCreating(true);
    try {
      // Check if we have a CSV file to upload
      if (selectedSource === "csv" && uploadedFile) {
        // Create FormData to send file + campaign data together
        const formData = new FormData();

        // Add the CSV file
        formData.append("csvFile", uploadedFile);

        formData.append("campaignName", campaignName);
        formData.append("assistant", selectedAssistant._id);

        const response = await apiRequest(
          endpoints.outboundCampaign.create,
          "POST",
          formData
        );

        console.log("Campaign created with CSV:", response.data);

        // Redirect to campaigns page on success
        router.push("/outbound-campaign-manager");
        return response.data;
      } else {
        // For CRM or other sources without file upload
        const response = await apiRequest(
          endpoints.outboundCampaign.create,
          "POST",
          {
            campaignName,
            assistant: selectedAssistant._id,
            selectedSource,
          }
        );

        console.log("Campaign created:", response.data);

        // Redirect to campaigns page on success
        router.push("/outbound-campaign-manager");
        return response.data;
      }
    } catch (error) {
      console.error("Campaign creation failed:", error);
      // You can add toast notification here
      alert("Failed to create campaign. Please try again.");
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

          {/* Step 3 - Commented out */}
          {/* {Stepper("Review & Launch", 3, step, 3)} */}
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
                  Upload CSV File
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
                <Badge className="bg-gray-100 text-gray-600">Available</Badge>
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
                        Required columns: Phone, Name (Optional: Email, Company,
                        Custom Fields)
                      </p>
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

          {/* Template Download Section */}
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Info className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800 font-medium">
                    Need a template? Download our sample CSV format
                  </span>
                </div>
                <Button
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-800"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel
            </Button>

            <Button
              className={`px-8 py-2 ${
                selectedSource === null ||
                (selectedSource === "csv" &&
                  (!uploadedFile || uploadStatus === "uploading"))
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
              onClick={() => setStep(step + 1)}
              disabled={
                selectedSource === null ||
                (selectedSource === "csv" &&
                  (!uploadedFile || uploadStatus === "uploading"))
              }
            >
              Continue to Assistant Selection
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-lg shadow-gray-200 max-h-[calc(100vh-170px)] overflow-y-auto space-y-4">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Campaign Configuration
            </h1>
            <p className="text-gray-600">
              Configure your AI assistant, calling settings, and campaign rules
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Campaign Details */}
              <Card className="border-none bg-gray-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Tag className="w-5 h-5 text-purple-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Campaign Details
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="campaign-name"
                        className="text-sm font-medium text-gray-700"
                      >
                        Campaign Name
                      </Label>
                      <Input
                        id="campaign-name"
                        placeholder="e.g., Q1 Product Launch Outreach"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="campaign-description"
                        className="text-sm font-medium text-gray-700"
                      >
                        Campaign Description
                      </Label>
                      <Textarea
                        id="campaign-description"
                        placeholder="Brief description of campaign goals..."
                        value={campaignDescription}
                        onChange={(e) => setCampaignDescription(e.target.value)}
                        className="mt-1 min-h-[100px]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Assistant */}
              <Card className="border-none bg-gray-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Bot className="w-5 h-5 text-purple-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      AI Assistant
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Select Assistant
                      </Label>
                      <Select
                        value={getSelectedAssistantId()}
                        onValueChange={(value) => {
                          const found = assistants.find(
                            (assistant) => assistant._id === value
                          );
                          setSelectedAssistant(found || null);
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Choose an assistant..." />
                        </SelectTrigger>
                        <SelectContent>
                          {assistants.map((assistant) => (
                            <SelectItem
                              key={assistant._id}
                              value={assistant._id}
                            >
                              {assistant.agentName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Assistant Profile */}
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-purple-200 text-purple-700">
                            {selectedAssistant && selectedAssistant.agentName
                              ? selectedAssistant.agentName[0]
                              : "S"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {selectedAssistant && selectedAssistant.agentName
                              ? selectedAssistant.agentName
                              : "Sarah - Sales Assistant"}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {selectedAssistant && selectedAssistant.description
                              ? selectedAssistant.description
                              : "Professional, persuasive, goal-oriented"}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center space-x-2">
                              <Globe className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                {selectedAssistant &&
                                selectedAssistant.languages
                                  ? selectedAssistant.languages.join(", ")
                                  : "English, Spanish"}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium text-gray-700">
                                {selectedAssistant && selectedAssistant.rating
                                  ? `${selectedAssistant.rating} Rating`
                                  : "4.8 Rating"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Outbound Number */}
              {/* <Card className="border-none bg-gray-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Phone className="w-5 h-5 text-purple-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Outbound Number
                    </h2>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Select Phone Number
                    </Label>
                    <Select
                      value={selectedPhone}
                      onValueChange={setSelectedPhone}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us-east">
                          +1 (555) 123-4567 - US East
                        </SelectItem>
                        <SelectItem value="us-west">
                          +1 (555) 987-6543 - US West
                        </SelectItem>
                        <SelectItem value="us-central">
                          +1 (555) 456-7890 - US Central
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex items-center space-x-2 mt-3">
                      <Badge className="text-green-700 border-green-300 bg-green-50">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        DND Compliant
                      </Badge>
                      <Badge className="text-blue-700 border-blue-300 bg-blue-50">
                        <Globe className="w-3 h-3 mr-1" />
                        US Region
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card> */}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Calling Schedule */}
              {/* <Card className="border-none bg-gray-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Calling Schedule
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Start Time
                        </Label>
                        <Select value={startTime} onValueChange={setStartTime}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="8:00 AM">8:00 AM</SelectItem>
                            <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                            <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          End Time
                        </Label>
                        <Select value={endTime} onValueChange={setEndTime}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                            <SelectItem value="5:00 PM">5:00 PM</SelectItem>
                            <SelectItem value="6:00 PM">6:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Timezone
                      </Label>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eastern">
                            Eastern Time (ET)
                          </SelectItem>
                          <SelectItem value="central">
                            Central Time (CT)
                          </SelectItem>
                          <SelectItem value="mountain">
                            Mountain Time (MT)
                          </SelectItem>
                          <SelectItem value="pacific">
                            Pacific Time (PT)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-3 block">
                        Calling Days
                      </Label>
                      <div className="flex flex-wrap gap-4">
                        {[
                          { key: "mon", label: "Mon" },
                          { key: "tue", label: "Tue" },
                          { key: "wed", label: "Wed" },
                          { key: "thu", label: "Thu" },
                          { key: "fri", label: "Fri" },
                          { key: "sat", label: "Sat" },
                          { key: "sun", label: "Sun" },
                        ].map(({ key, label }) => (
                          <div
                            key={key}
                            className="flex items-center space-x-1"
                          >
                            <Checkbox
                              id={key}
                              checked={
                                callingDays[key as keyof typeof callingDays]
                              }
                              className={`h-4 w-4 border-gray-300 border-2 ${
                                callingDays[key as keyof typeof callingDays]
                                  ? "bg-purple-600 border-purple-600"
                                  : "bg-white border-gray-300"
                              }`}
                              onCheckedChange={(checked) =>
                                handleDayChange(key, checked as boolean)
                              }
                            />
                            <Label htmlFor={key} className="text-sm">
                              {label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card> */}

              {/* Retry Settings */}
              {/* <Card className="border-none bg-gray-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <RotateCcw className="w-5 h-5 text-purple-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Retry Settings
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Max Retries
                        </Label>
                        <Select>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Retry Interval
                        </Label>
                        <Select>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-hour">1 hour</SelectItem>
                            <SelectItem value="6-hours">6 hours</SelectItem>
                            <SelectItem value="12-hours">12 hours</SelectItem>
                            <SelectItem value="24-hours">24 hours</SelectItem>
                            <SelectItem value="48-hours">48 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="smart-retry"
                        checked={enableSmartRetry}
                        className={`h-4 w-4 border-2 ${
                          enableSmartRetry
                            ? "bg-purple-600 border-purple-600"
                            : "bg-white border-gray-300"
                        }`}
                        onCheckedChange={(checked) =>
                          setEnableSmartRetry(checked as boolean)
                        }
                      />
                      <Label htmlFor="smart-retry" className="text-sm">
                        Enable smart retry (skip busy signals)
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card> */}

              {/* Human Handoff */}
              <Card className="border-none bg-gray-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Users className="w-5 h-5 text-purple-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Human Handoff
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="enable-handoff"
                        checked={enableHumanHandoff}
                        className={`h-4 w-4 border-gray-300 border-2 ${
                          enableHumanHandoff
                            ? "bg-purple-600 border-purple-600"
                            : "bg-white border-gray-300"
                        }`}
                        onCheckedChange={(checked) =>
                          setEnableHumanHandoff(checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="enable-handoff"
                        className="text-sm font-medium"
                      >
                        Enable human handoff
                      </Label>
                    </div>

                    {enableHumanHandoff && (
                      <div className="ml-6 space-y-3">
                        <Label className="text-sm font-medium text-gray-700">
                          Handoff Triggers
                        </Label>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="customer-request"
                            checked={customerRequestsAgent}
                            className={`h-4 w-4 border-gray-300 border-2 ${
                              customerRequestsAgent
                                ? "bg-purple-600 border-purple-600"
                                : "bg-white border-gray-300"
                            }`}
                            onCheckedChange={(checked) =>
                              setCustomerRequestsAgent(checked as boolean)
                            }
                          />
                          <Label
                            htmlFor="customer-request"
                            className="text-sm text-gray-600"
                          >
                            Customer requests human agent
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="low-confidence"
                            checked={lowConfidenceHandoff}
                            className={`h-4 w-4 border-gray-300 border-2 ${
                              lowConfidenceHandoff
                                ? "bg-purple-600 border-purple-600"
                                : "bg-white border-gray-300"
                            }`}
                            onCheckedChange={(checked) =>
                              setLowConfidenceHandoff(checked as boolean)
                            }
                          />
                          <Label
                            htmlFor="low-confidence"
                            className="text-sm text-gray-600"
                          >
                            AI confidence below 70%
                          </Label>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-800"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <Button
              className={`px-8 py-2 ${
                !selectedAssistant || !campaignName.trim() || campaignCreating
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
              onClick={createCampaign}
              disabled={
                !selectedAssistant || !campaignName.trim() || campaignCreating
              }
            >
              {campaignCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Campaign...
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4 mr-2" />
                  Launch Campaign
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Step 3 - Commented out */}
      {/* {step === 3 && (
        <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-lg shadow-gray-200 max-h-[calc(100vh-170px)] overflow-y-auto">
          {/* Header */}
      {/* <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Review & Launch Campaign
            </h1>
            <p className="text-gray-600">
              Review all settings before launching your outbound voice campaign
            </p>
          </div>

          <div>
            {/* Summary Cards */}
      {/* <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Campaign Overview */}
      {/* <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">
                      Campaign Overview
                    </h3>
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-purple-700 font-medium">Name:</span>
                      <span className="text-gray-900 font-medium">
                        {campaignName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700 font-medium">
                        Total Leads:
                      </span>
                      <span className="text-gray-900 font-medium">2,456</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700 font-medium">
                        Source:
                      </span>
                      <span className="text-gray-900 font-medium">
                        {selectedSource === "csv" ? "CSV Upload" : "CRM Upload"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Assistant */}
      {/* <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">
                      AI Assistant
                    </h3>
                    <Bot className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-blue-700 font-medium">
                        Assistant:
                      </span>
                      <span className="text-gray-900 font-medium">
                        {selectedAssistant && selectedAssistant.agentName
                          ? selectedAssistant.agentName
                          : ""}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700 font-medium">Phone:</span>
                      <span className="text-gray-900 font-medium">
                        +1 (555) 123-4567
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700 font-medium">
                        Handoff:
                      </span>
                      <span className="text-gray-900 font-medium">
                        Disabled
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Schedule */}
      {/* <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Schedule</h3>
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-green-700 font-medium">Time:</span>
                      <span className="text-gray-900 font-medium">
                        9AM - 5PM ET
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700 font-medium">Days:</span>
                      <span className="text-gray-900 font-medium">
                        Mon - Fri
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700 font-medium">
                        Retries:
                      </span>
                      <span className="text-gray-900 font-medium">
                        3 attempts
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column */}
      {/* <div className="space-y-6">
                {/* Lead Information */}
      {/* <Card className="border-none bg-gray-50">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-6">
                      <Users className="w-5 h-5 text-gray-600" />
                      <h2 className="text-lg font-semibold text-gray-900">
                        Lead Information
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                          2,456
                        </div>
                        <div className="text-sm text-gray-600">Total Leads</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-1">
                          2,398
                        </div>
                        <div className="text-sm text-gray-600">
                          Valid Numbers
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Data Quality
                        </span>
                        <span className="text-sm font-bold text-green-600">
                          97.6%
                        </span>
                      </div>
                      <Progress value={97.6} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Compliance Status */}
      {/* <Card className="border-none bg-gray-50">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-6">
                      <Shield className="w-5 h-5 text-gray-600" />
                      <h2 className="text-lg font-semibold text-gray-900">
                        Compliance Status
                      </h2>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-3">
                          <Check className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-gray-900">
                            DND Registry Check
                          </span>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-300">
                          Passed
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-3">
                          <Check className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-gray-900">
                            TCPA Compliance
                          </span>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-300">
                          Enabled
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-3">
                          <Check className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-gray-900">
                            Time Zone Validation
                          </span>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-300">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
      {/* <div className="space-y-6">
                {/* Estimated Performance */}
      {/* <Card className="border-none bg-gray-50">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-6">
                      <TrendingUp className="w-5 h-5 text-gray-600" />
                      <h2 className="text-lg font-semibold text-gray-900">
                        Estimated Performance
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-1">
                          35%
                        </div>
                        <div className="text-sm text-gray-600">
                          Connect Rate
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-1">
                          860
                        </div>
                        <div className="text-sm text-gray-600">
                          Est. Connects
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Campaign Duration</span>
                        <span className="font-medium text-gray-900">
                          5-7 days
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Daily Call Volume</span>
                        <span className="font-medium text-gray-900">
                          ~350 calls
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Cost Breakdown */}
      {/* <Card className="border-none bg-gray-50">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-6">
                      <DollarSign className="w-5 h-5 text-gray-600" />
                      <h2 className="text-lg font-semibold text-gray-900">
                        Cost Breakdown
                      </h2>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Voice minutes</span>
                        <span className="font-medium text-gray-900">
                          $127.80
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">AI processing</span>
                        <span className="font-medium text-gray-900">
                          $24.56
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Platform fees</span>
                        <span className="font-medium text-gray-900">
                          $15.00
                        </span>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900">
                            Total Estimate
                          </span>
                          <span className="text-2xl font-bold text-green-600">
                            $167.36
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Bottom Navigation */}
      {/* <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-800"
                onClick={() => setStep(step - 1)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Configuration
              </Button>

              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  className="border-gray-300 bg-transparent"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save as Draft
                </Button>

                <Button
                  className={`px-8 py-2 ${
                    campaignCreating
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700 text-white"
                  }`}
                  onClick={createCampaign}
                  disabled={campaignCreating}
                >
                  {campaignCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Campaign...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4 mr-2" />
                      Launch Campaign
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default CreateCampaignPage;
