"use client";

import { Card, CardContent } from "@/components/organisms/card";
import { Download, FileText, Trash2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/atoms/input";
import { useAuth } from "@/hooks/use-auth";
import apiRequest from "@/utils/api";
import endpoints from "@/lib/endpoints";
import { toast } from "react-toastify";

export interface KnowledgeBaseItem {
  _id: string;
  fileUri: string;
  name: string;
  createdAt: string;
  prompt: string;
}

export interface KnowledgeBaseProps {
  knowledgeBase: KnowledgeBaseItem[];
  setKnowledgeBase: React.Dispatch<React.SetStateAction<KnowledgeBaseItem[]>>;
}

const KnowledgeBase = ({
  knowledgeBase,
  setKnowledgeBase,
}: KnowledgeBaseProps) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] =
    useState<KnowledgeBaseItem | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Only support CSV and PDF files
  const supportedFileTypes = ["application/pdf", "text/csv", "application/csv"];

  const getFileExtension = (fileName: string) => {
    return fileName.split(".").pop()?.toLowerCase();
  };

  const isValidFileType = (file: File) => {
    // Check MIME type first
    if (supportedFileTypes.includes(file.type)) {
      return true;
    }

    // Fallback to file extension check
    const extension = getFileExtension(file.name);
    const validExtensions = ["pdf", "csv"];
    return validExtensions.includes(extension || "");
  };

  // Only validates and sets pendingFile, does not update knowledgeBase
  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] as File;
    if (file && file.type === "application/pdf") {
      setPendingFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-purple-400", "bg-purple-50");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-purple-400", "bg-purple-50");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-purple-400", "bg-purple-50");

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setPendingFile(files[0]);
    }
  };

  // Only on submit, add to knowledgeBase
  const handleSubmit = async () => {
    if (!pendingFile) return;
    if (prompt.trim() === "") {
      toast.error("Please enter prompt");
      return;
    }
    if (pendingFile.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit. Please upload a smaller PDF file.");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", pendingFile);
      formData.append("prompt", prompt);
      formData.append("name", pendingFile.name);
      formData.append("createdBy", user?.id || "");

      const response = await apiRequest(
        endpoints.knowledgeBase.create,
        "POST",
        formData
      );

      if (!response?.data) {
        throw new Error("Failed to upload document.");
      }

      const uploadedDocument: KnowledgeBaseItem = response?.data?.data;

      setKnowledgeBase((prev) => [...prev, uploadedDocument]);
      setSelectedDocument(uploadedDocument);
      handleCancelPending();
      setUploading(false);
    } catch (error) {
      console.error(`Error uploading PDF file:`, error);

      // Better error handling
      let errorMessage = "Unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null) {
        errorMessage = JSON.stringify(error);
      }

      toast.error(`Error uploading file: ${errorMessage}`);
      setUploading(false);
    }
  };

  const handleSelectDocument = (doc: KnowledgeBaseItem) => {
    setSelectedDocument(doc);
    setPendingFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancelPending = () => {
    setPendingFile(null);
    setPrompt("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownload = (fileUri: string) => {
    //  TODO
    // URI is not working, need to fix it
    const link = document.createElement("a");
    link.href = fileUri;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (doc: KnowledgeBaseItem, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Show confirmation dialog
    if (!confirm(`Are you sure you want to delete "${doc.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      // Call the delete API
      const response = await apiRequest(
        endpoints.knowledgeBase.delete.replace(':id', doc._id),
        "DELETE"
      );

      if (response?.data?.success) {
        // Remove from local state
        setKnowledgeBase((prev) => prev.filter((d) => d._id !== doc._id));
        
        // Clear selection if this was the selected document
        if (selectedDocument && selectedDocument._id === doc._id) {
          setSelectedDocument(null);
          setPendingFile(null);
        }
        
        toast.success("Knowledge base deleted successfully");
      } else {
        throw new Error(response?.data?.message || "Failed to delete knowledge base");
      }
    } catch (error) {
      console.error("Error deleting knowledge base:", error);
      toast.error("Failed to delete knowledge base. Please try again.");
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Upload Document */}
      <div className="bg-white p-4 rounded-lg space-y-4 shadow-lg shadow-gray-200">
        <div className="space-y-4 flex flex-col items-center justify-between">
          <Card
            className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer p-6 w-full"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <CardContent className="p-0 text-center relative">
              <Input
                type="file"
                id="document-upload"
                className="hidden"
                accept=".pdf,.csv"
                onChange={handleFileInput}
                ref={fileInputRef}
              />
              <label htmlFor="document-upload" className="cursor-pointer block">
                <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-lg flex items-center justify-center">
                  {uploading ? (
                    <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6 text-purple-600" />
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {uploading ? "Uploading..." : "Upload Document"}
                </h3>
                {pendingFile ? (
                  <div className="mb-2 flex items-center justify-center gap-2 relative">
                    <span className="text-gray-700 text-sm font-medium">
                      Selected files:{" "}
                      <span className="text-purple-700">
                        {pendingFile.name}
                      </span>
                    </span>
                    {!uploading && (
                      <button
                        type="button"
                        aria-label="Clear selected file"
                        className="ml-2 p-1 rounded hover:bg-gray-200 transition-colors absolute right-0 top-1/2 -translate-y-1/2"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleCancelPending();
                        }}
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    )}
                  </div>
                ) : null}
                <p className="text-gray-600 text-sm">
                  Drag & drop or click to browse
                </p>
                <p className="text-gray-600 text-sm">
                  Supported formats: PDF, CSV
                </p>
                <p className="text-gray-600 text-sm">Max limit: 5MB</p>
              </label>
            </CardContent>
          </Card>
          <Input
            value={prompt}
            placeholder={
              pendingFile ? "Enter prompt" : "Upload a file to enter prompt"
            }
            disabled={!pendingFile}
            onChange={(e) => setPrompt(e.currentTarget.value)}
          />
          <Button
            variant="outline"
            className=""
            disabled={uploading || !pendingFile}
            onClick={handleSubmit}
          >
            {uploading ? "Uploading..." : "Submit Document"}
          </Button>
          {/* Removed "Clear Selected File" button, now handled by cross in upload box */}
        </div>
      </div>

      {/* Existing Knowledge Base Documents */}
      {knowledgeBase.length > 0 && (
        <>
          <div className="bg-white p-4 rounded-lg space-y-4 shadow-lg shadow-gray-200">
            <h2 className="text-lg font-semibold">Existing Knowledge Base</h2>
            <div className="space-y-3">
              {knowledgeBase.map((doc) => (
                <Card
                  key={doc._id}
                  className={`bg-purple-50 border-purple-200 ${
                    selectedDocument && selectedDocument._id === doc._id
                      ? "ring-2 ring-purple-400"
                      : ""
                  }`}
                  onClick={() => handleSelectDocument(doc)}
                  style={{ cursor: "pointer" }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {doc.name}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {new Date(doc.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(doc.fileUri)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={(e) => handleDelete(doc, e)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {knowledgeBase?.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No documents uploaded yet.</p>
              <p className="text-sm text-gray-400">
                Upload your first document to get started.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default KnowledgeBase;
