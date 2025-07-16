"use client";

import { Card, CardContent } from "@/components/organisms/card";
import { FileText, Trash2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/atoms/input";
import { useAuth } from "@/hooks/use-auth";
import apiRequest from "@/utils/api";

export interface KnowledgeBaseItem {
  _id: string;
  fileUri: string;
  name: string;

  createdAt: string;
}

interface KnowledgeBaseProps {
  knowledgeBase: {
    documents: KnowledgeBaseItem[];
  };
  setKnowledgeBase: React.Dispatch<
    React.SetStateAction<{
      documents: KnowledgeBaseItem[];
    }>
  >;
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
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Only support CSV and PDF files
  const supportedFileTypes = [
    'application/pdf',
    'text/csv',
    'application/csv'
  ];

  const getFileExtension = (fileName: string) => {
    return fileName.split('.').pop()?.toLowerCase();
  };

  const isValidFileType = (file: File) => {
    // Check MIME type first
    if (supportedFileTypes.includes(file.type)) {
      return true;
    }
    
    // Fallback to file extension check
    const extension = getFileExtension(file.name);
    const validExtensions = ['pdf', 'csv'];
    return validExtensions.includes(extension || '');
  };

  // Only validates and sets pendingFile, does not update knowledgeBase
  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const validFiles = Array.from(files).filter(isValidFileType);
      if (validFiles.length !== files.length) {
        alert('Some files were skipped. Only PDF and CSV files are supported.');
      }
      setPendingFiles(validFiles);
    }
    console.log(files);
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
      const validFiles = Array.from(files).filter(isValidFileType);
      if (validFiles.length !== files.length) {
        alert('Some files were skipped. Only PDF and CSV files are supported.');
      }
      setPendingFiles(validFiles);
    }
  };

  // Only on submit, add to knowledgeBase
  const handleSubmit = async () => {
    if (!pendingFiles.length) return;
    if (pendingFiles[0].size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit. Please upload a smaller file.");
      return;
    }
    setUploading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', pendingFiles[0]);
      formData.append('name', pendingFiles[0].name);
      formData.append('createdBy', user?.id || '');
      formData.append('prompt', prompt);

      // Upload to backend using apiRequest utility
      const response = await apiRequest('/knowledgeBase', 'POST', formData);
      const result = response.data;
      
      // Add to local state
      const newDocument: KnowledgeBaseItem = {
        fileUri: result.data.fileUri,
        _id: result.data._id,
        name: result.data.name,
        createdAt: result.data.createdAt,
      };

      setKnowledgeBase((prev) => ({
        ...prev,
        documents: [...(prev.documents || []), newDocument],
      }));
      setSelectedDocument(newDocument);
      setPendingFiles([]);
      setPrompt('');
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(`Error uploading file:`, error);
      
      // Better error handling
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      }
      
      alert(`Error uploading file: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSelectDocument = (doc: KnowledgeBaseItem) => {
    setSelectedDocument(doc);
    setPendingFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancelPending = () => {
    setPendingFiles([]);
    setPrompt('');
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
                multiple={true}
              />
              <label
                htmlFor="document-upload"
                className="cursor-pointer block"
              >
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
                {pendingFiles.length > 0 ? (
                  <div className="mb-2 flex items-center justify-center gap-2 relative">
                    <span className="text-gray-700 text-sm font-medium">
                      Selected files:{" "}
                      <span className="text-purple-700">
                        {pendingFiles.map((file) => file.name).join(", ")}
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
          {pendingFiles.length > 0 && (
            <div className="w-full space-y-2">
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
                Prompt (Optional)
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter a prompt or description for this file..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
              />
            </div>
          )}
          <Button
            variant="outline"
            className=""
            disabled={uploading || !pendingFiles.length}
            onClick={handleSubmit}
          >
            {uploading ? "Uploading..." : "Submit Document"}
          </Button>
          {/* Removed "Clear Selected File" button, now handled by cross in upload box */}
        </div>
      </div>

      {/* Existing Knowledge Base Documents */}
      <div className="bg-white p-4 rounded-lg shadow-lg shadow-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Knowledge Base Documents
          </h3>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <FileText className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div className="space-y-2">
          {knowledgeBase.documents
            ?.filter((doc) =>
              doc.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((doc) => (
              <div
                key={doc._id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedDocument?._id === doc._id
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleSelectDocument(doc)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{doc.name}</h4>
                      <p className="text-sm text-gray-500">
                        Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle delete functionality here
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>

        {knowledgeBase.documents?.length === 0 && (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No documents uploaded yet.</p>
            <p className="text-sm text-gray-400">
              Upload your first document to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBase;
