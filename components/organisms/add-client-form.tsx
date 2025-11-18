"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/organisms/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Crown, User, Upload } from "lucide-react";
import apiRequest from "@/utils/api";

interface AddClientFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormDataType {
  companyName: string;
  websiteUrl: string;
  industry: string;
  companySize: string;
  companyLogo: File | null;
  billing: string;
  contactFullName: string;
  contactEmail: string;
  countryCode: string;
  contactPhone: string;
  contactJobTitle: string;
  timeZone: string;
  preferredLanguage: string;
  password: string;
  notes: string;
  active: boolean;
  DIY: boolean;
  costPerMin: number;
  totalCredits: number;
}

export const AddClientForm: React.FC<AddClientFormProps> = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [pricingModels, setPricingModels] = useState<any[]>([]);
  const [pricingLoading, setPricingLoading] = useState(true);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);


  useEffect(() => {
    setPricingLoading(true);
    apiRequest("/pricing-models", "GET")
      .then((data) => {
        setPricingModels(data.data.data || []);
        setPricingLoading(false);
      })
      .catch(() => setPricingLoading(false));
  }, []);

  const [formData, setFormData] = useState<FormDataType>({
    companyName: "",
    websiteUrl: "",
    industry: "",
    companySize: "",
    companyLogo: null,
    billing: "",
    contactFullName: "",
    contactEmail: "",
    countryCode: "+1",
    contactPhone: "",
    contactJobTitle: "",
    timeZone: "",
    preferredLanguage: "English",
    password: "",
    notes: "",
    active: true,
    DIY: false,
    costPerMin: 0,
    totalCredits: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof FormDataType, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    
    // Real-time validation for website URL
    if (field === "websiteUrl" && typeof value === "string") {
      if (value.trim()) {
        try {
          const url = new URL(value);
          if (!url.protocol || !url.hostname) {
            setErrors(prev => ({ ...prev, websiteUrl: "Please enter a valid website URL (e.g., https://example.com)" }));
          } else {
            // Check if hostname has a valid TLD (at least 2 characters after the last dot)
            const hostnameParts = url.hostname.split('.');
            if (hostnameParts.length < 2 || hostnameParts[hostnameParts.length - 1].length < 2) {
              setErrors(prev => ({ ...prev, websiteUrl: "Please enter a valid website URL with proper domain (e.g., https://example.com)" }));
            } else {
              setErrors(prev => ({ ...prev, websiteUrl: "" }));
            }
          }
        } catch (error) {
          setErrors(prev => ({ ...prev, websiteUrl: "Please enter a valid website URL (e.g., https://example.com)" }));
        }
      } else {
        setErrors(prev => ({ ...prev, websiteUrl: "" }));
      }
    }
  };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setFormData(prev => ({ ...prev, companyLogo: file }));
  //   }
  // };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setFormData(prev => ({ ...prev, companyLogo: file }));

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
  }
};


  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    // Website URL validation (only if provided)
    if (formData.websiteUrl.trim()) {
      try {
        // Basic URL validation - must have protocol and valid format
        const url = new URL(formData.websiteUrl);
        if (!url.protocol || !url.hostname) {
          newErrors.websiteUrl = "Please enter a valid website URL (e.g., https://example.com)";
        } else {
          // Check if hostname has a valid TLD (at least 2 characters after the last dot)
          const hostnameParts = url.hostname.split('.');
          if (hostnameParts.length < 2 || hostnameParts[hostnameParts.length - 1].length < 2) {
            newErrors.websiteUrl = "Please enter a valid website URL with proper domain (e.g., https://example.com)";
          }
        }
      } catch (error) {
        newErrors.websiteUrl = "Please enter a valid website URL (e.g., https://example.com)";
      }
    }

    if (!formData.industry) {
      newErrors.industry = "Industry is required";
    }

    if (!formData.contactFullName.trim()) {
      newErrors.contactFullName = "Contact full name is required";
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = "Contact email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email address";
    }

    // Phone number validation
    if (formData.contactPhone.trim()) {
      // Remove all non-digit characters for validation
      const phoneDigits = formData.contactPhone.replace(/\D/g, '');
      if (phoneDigits.length !== 10) {
        newErrors.contactPhone = "Phone number must be 10 digits long";
      } 
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }
    if (formData.password.length<6) {
      newErrors.password = "Password should be at least 6 characters long";
    }

    if (formData.costPerMin < 0) {
      newErrors.costPerMin = "Cost per minute must be a positive number";
    }

    if (formData.totalCredits < 0) {
      newErrors.totalCredits = "Total credits must be a positive number";
    }

    if (!formData.timeZone ) {
      newErrors.timeZone = "Please enter timeZone";
    }

       if (!formData.companySize ) {
      newErrors.companySize = "Please enter companySize";
    }
    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'companyLogo' && formData[key as keyof FormDataType]) {
          submitData.append(key, formData[key as keyof FormDataType] as File);
        } else if (key === 'contactPhone') {
          // Combine country code and phone number
          const fullPhoneNumber = formData.countryCode + formData.contactPhone;
          submitData.append(key, fullPhoneNumber);
        } else if (key !== 'companyLogo' && key !== 'countryCode') {
          submitData.append(key, String(formData[key as keyof FormDataType]));
        }
      });

      await apiRequest("/our-clients/create", "POST", submitData);
      
      // Reset form
      setFormData({
        companyName: "",
        websiteUrl: "",
        industry: "",
        companySize: "",
        companyLogo: null,
        billing: "",
        contactFullName: "",
        contactEmail: "",
        countryCode: "+1",
        contactPhone: "",
        contactJobTitle: "",
        timeZone: "",
        preferredLanguage: "English",
        password: "",
        notes: "",
        active: true,
        DIY: false,
        costPerMin: 0,
        totalCredits: 0
      });
      
      setErrors({});
      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating client:", error);
      setErrors({ submit: error?.response?.data?.message || "Failed to create client" });
    } finally {
      setLoading(false);
    }
  };

  return (
   <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-600" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                placeholder="Enter company name"
                className={errors.companyName ? "border-red-500" : ""}
              />
              {errors.companyName && (
                <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input
                id="websiteUrl"
                value={formData.websiteUrl}
                onChange={(e) => handleInputChange("websiteUrl", e.target.value)}
                placeholder="https://example.com"
                className={errors.websiteUrl ? "border-red-500" : ""}
              />
              {errors.websiteUrl && (
                <p className="text-red-500 text-sm mt-1">{errors.websiteUrl}</p>
              )}
            </div>

            <div>
              <Label htmlFor="industry">Industry *</Label>
              <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                <SelectTrigger className={errors.industry ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Real Estate">Real Estate</SelectItem>
                  <SelectItem value="Consulting">Consulting</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-red-500 text-sm mt-1">{errors.industry}</p>
              )}
            </div>

            <div>
              <Label htmlFor="companySize">Company Size *</Label>
              <Select value={formData.companySize} onValueChange={(value) => handleInputChange("companySize", value)}>
                <SelectTrigger className={errors.companySize ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10</SelectItem>
                  <SelectItem value="11-50">11-50</SelectItem>
                  <SelectItem value="51-200">51-200</SelectItem>
                  <SelectItem value="201-1000">201-1000</SelectItem>
                  <SelectItem value="1000+">1000+</SelectItem>
                </SelectContent>
              </Select>
                {errors.companySize && (
                <p className="text-red-500 text-sm mt-1">{errors.companySize}</p>
              )}
            </div>

            <div>
             <Label htmlFor="companyLogo">Company Logo</Label>
<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
  <p className="text-sm text-gray-600 mb-1">Drop logo here or click to upload</p>
  <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>

  <input
    type="file"
    id="companyLogo"
    accept="image/*"
    onChange={handleFileChange}
    className="hidden"
  />

  <Button
    type="button"
    variant="outline"
    size="sm"
    className="mt-2"
    onClick={() => document.getElementById('companyLogo')?.click()}
  >
    Choose File
  </Button>

  {/* Logo Preview */}
  {logoPreview && (
    <div className="mt-4">
      <p className="text-sm font-medium mb-2">Preview:</p>
      <img
        src={logoPreview}
        alt="Logo Preview"
        className="mx-auto h-20 object-contain"
      />
    </div>
  )}
</div>

            </div>
          </CardContent>
        </Card>

        {/* Plan & Billing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-purple-600" />
              Credit Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="costPerMin">Cost per Minute *</Label>
                <Input
                  id="costPerMin"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.costPerMin}
                  onChange={(e) => handleInputChange("costPerMin", parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className={errors.costPerMin ? "border-red-500" : ""}
                />
                {errors.costPerMin && (
                  <p className="text-red-500 text-sm mt-1">{errors.costPerMin}</p>
                )}
              </div>

              <div>
                <Label htmlFor="totalCredits">Total Credits *</Label>
                <Input
                  id="totalCredits"
                  type="number"
                  min="0"
                  value={formData.totalCredits}
                  onChange={(e) => handleInputChange("totalCredits", parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className={errors.totalCredits ? "border-red-500" : ""}
                />
                {errors.totalCredits && (
                  <p className="text-red-500 text-sm mt-1">{errors.totalCredits}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Commented out Subscription Plan section - not needed for new requirement */}
        {/*
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-purple-600" />
              Plan & Billing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Subscription Plan *</Label>
              <div className="space-y-2 mt-2">
                {pricingLoading ? (
                  <div>Loading plans...</div>
                ) : pricingModels.length === 0 ? (
                  <div className="text-gray-500">No plans available.</div>
                ) : (
                  pricingModels.map((plan) => (
                    <label key={plan._id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="billing"
                        value={plan._id}
                        checked={formData.billing === plan._id}
                        onChange={(e) => handleInputChange("billing", e.target.value)}
                        className="text-purple-600"
                      />
                      <span className="font-medium">{plan.name}</span>
                      <span className="text-gray-600">{plan.description}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        */}
      </div>

      {/* Primary Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" />
            Primary Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactFullName">Full Name *</Label>
              <Input
                id="contactFullName"
                value={formData.contactFullName}
                onChange={(e) => handleInputChange("contactFullName", e.target.value)}
                placeholder="Enter full name"
                className={errors.contactFullName ? "border-red-500" : ""}
              />
              {errors.contactFullName && (
                <p className="text-red-500 text-sm mt-1">{errors.contactFullName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="contactEmail">Email Address *</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                placeholder="contact@company.com"
                className={errors.contactEmail ? "border-red-500" : ""}
              />
              {errors.contactEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Enter password"
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <Label htmlFor="contactPhone">Phone Number</Label>
              <div className="flex gap-2">
                <Select 
                  value={formData.countryCode} 
                  onValueChange={(value) => handleInputChange("countryCode", value)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+1">+1 (US)</SelectItem>
                    {/* <SelectItem value="+44">+44 (UK)</SelectItem> */}
                    <SelectItem value="+91">+91 (IN)</SelectItem>
                    <SelectItem value="+61">+63 (PH)</SelectItem>
                    {/* <SelectItem value="+86">+86 (CN)</SelectItem> */}
                    {/* <SelectItem value="+81">+81 (JP)</SelectItem> */}
                    {/* <SelectItem value="+49">+49 (DE)</SelectItem> */}
                    {/* <SelectItem value="+33">+33 (FR)</SelectItem> */}
                    {/* <SelectItem value="+39">+39 (IT)</SelectItem> */}
                    {/* <SelectItem value="+34">+34 (ES)</SelectItem> */}
                    {/* <SelectItem value="+7">+7 (RU)</SelectItem> */}
                    {/* <SelectItem value="+55">+55 (BR)</SelectItem> */}
                    <SelectItem value="+52">+52 (MX)</SelectItem>
                    {/* <SelectItem value="+27">+27 (ZA)</SelectItem> */}
                    {/* <SelectItem value="+971">+971 (AE)</SelectItem> */}
                    {/* <SelectItem value="+966">+966 (SA)</SelectItem> */}
                    <SelectItem value="+65">+977 (NEP)</SelectItem>
                    <SelectItem value="+852">+880 (BAN)</SelectItem>
                    <SelectItem value="+82">+234 (NIG)</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                  placeholder="(555) 000-0000"
                  className={errors.contactPhone ? "border-red-500" : ""}
                />
              </div>
              {errors.contactPhone && (
                <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>
              )}
            </div>

            <div>
              <Label htmlFor="contactJobTitle">Job Title</Label>
              <Input
                id="contactJobTitle"
                value={formData.contactJobTitle}
                onChange={(e) => handleInputChange("contactJobTitle", e.target.value)}
                placeholder="CEO, CTO, etc."
              />
            </div>

            <div>
              <Label htmlFor="timeZone">Time Zone *</Label>
              <Select value={formData.timeZone} onValueChange={(value) => handleInputChange("timeZone", value)}>
                <SelectTrigger className={errors.timeZone ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select Time Zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time (EST)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CST)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MST)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PST)</SelectItem>
                  <SelectItem value="Europe/London">London (GMT)</SelectItem>
                  <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                  <SelectItem value="Asia/Shanghai">Shanghai (CST)</SelectItem>
                  <SelectItem value="Australia/Sydney">Sydney (AEST)</SelectItem>
                </SelectContent>
                  {errors.timeZone && (
                <p className="text-red-500 text-sm mt-1">{errors.timeZone}</p>
              )}
              </Select>
              
            </div>

            <div>
              <Label htmlFor="preferredLanguage">Preferred Language</Label>
              <Select value={formData.preferredLanguage} onValueChange={(value) => handleInputChange("preferredLanguage", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="German">German</SelectItem>
                  <SelectItem value="Chinese">Chinese</SelectItem>
                  <SelectItem value="Japanese">Japanese</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Additional notes about the client..."
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="DIY"
              checked={formData.DIY}
              onChange={(e) => handleInputChange("DIY", e.target.checked)}
              className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
            />
            <Label htmlFor="DIY" className="text-sm font-medium text-gray-700">
              DIY (Do It Yourself) - Client can access voice, chat, and LLM integration features
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600 text-sm">{errors.submit}</p>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Client"}
        </Button>
      </div>
    </form>
  );
}; 