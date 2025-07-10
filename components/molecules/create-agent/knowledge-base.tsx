import { Input } from "@/components/atoms/input";
import { Card, CardContent } from "@/components/organisms/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Link,
  Badge,
  Info,
  RefreshCw,
  Database,
  Clock,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Brain,
  Volume2,
  Mail,
  MessageSquare,
} from "lucide-react";
import React, { useState } from "react";
import utils from "@/utils/index.util";

export interface Document {
  id: string;
  name: string;
  type: "pdf" | "url" | "csv";
  size?: string;
  pages?: number;
  status: "processed" | "processing" | "error";
  updatedAt: string;
  icon: React.ReactNode;
}

export interface RecentUpdate {
  id: string;
  name: string;
  status: "processed" | "processing";
  time: string;
  icon: React.ReactNode;
}

interface KnowledgeBaseItem {
  file: string;
  prompt: string;
  _id: string;
}

interface KnowledgeBaseProps {
  knowledgeBase: {
    voiceDocuments: KnowledgeBaseItem[];
    emailDocuments: KnowledgeBaseItem[];
    chatDocuments: KnowledgeBaseItem[];
  };
  setKnowledgeBase: React.Dispatch<
    React.SetStateAction<{
      voiceDocuments: KnowledgeBaseItem[];
      emailDocuments: KnowledgeBaseItem[];
      chatDocuments: KnowledgeBaseItem[];
    }>
  >;
}

const KnowledgeBase = ({
  knowledgeBase,
  setKnowledgeBase,
}: KnowledgeBaseProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState<string | null>(null);

  const handleFileUpload = async (
    file: File,
    type: "voice" | "email" | "chat"
  ) => {
    setUploading(type);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      // Here you would typically upload to your API
      // For now, we'll simulate the upload and add to local state
      const newDocument: KnowledgeBaseItem = {
        file: `s3://knowledgebasecaller/${type}/${Date.now()}-${file.name}`,
        prompt: `Use this ${type} document to assist with ${type} interactions.`,
        _id: `temp_${Date.now()}`,
      };

      // Add to appropriate knowledge base array
      setKnowledgeBase((prev) => ({
        ...prev,
        [`${type}Documents`]: [
          ...(prev[
            `${type}Documents` as keyof typeof prev
          ] as KnowledgeBaseItem[]),
          newDocument,
        ],
      }));
    } catch (error) {
      console.error(`Error uploading ${type} file:`, error);
    } finally {
      setUploading(null);
    }
  };

  const handleFileInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "voice" | "email" | "chat"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file, type);
    }
  };

  const handleDragOver = (
    e: React.DragEvent,
    type: "voice" | "email" | "chat"
  ) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-purple-400", "bg-purple-50");
  };

  const handleDragLeave = (
    e: React.DragEvent,
    type: "voice" | "email" | "chat"
  ) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-purple-400", "bg-purple-50");
  };

  const handleDrop = (e: React.DragEvent, type: "voice" | "email" | "chat") => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-purple-400", "bg-purple-50");

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0], type);
    }
  };

  const stats = {
    totalDocuments: 47,
    tokenCount: "2.3M",
    lastUpdated: "2 hours ago",
  };

  const recentUpdates: RecentUpdate[] = [
    {
      id: "1",
      name: "Product_Manual_v2.pdf",
      status: "processed",
      time: "2 hours ago",
      icon: <FileText className="w-4 h-4 text-red-600" />,
    },
    {
      id: "2",
      name: "help.company.com/faq",
      status: "processing",
      time: "5 minutes ago",
      icon: <Link className="w-4 h-4 text-blue-600" />,
    },
  ];

  const documents: Document[] = [
    {
      id: "1",
      name: "Customer Service Guidelines.pdf",
      type: "pdf",
      size: "2.3 MB",
      pages: 47,
      status: "processed",
      updatedAt: "3 days ago",
      icon: <FileText className="w-5 h-5 text-red-600" />,
    },
  ];

  return (
    <>
      {/* Knowledge Base Overview */}
      {/* <div className="bg-white p-4 rounded-lg space-y-4 shadow-lg shadow-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Knowledge Base Overview</h1>
          <div className="flex items-center space-x-8 text-sm">
            <div className="text-center">
              <div className="text-gray-600">Total Documents</div>
              <div className="text-purple-600 font-bold text-sm">
                {stats.totalDocuments}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-600">Token Count</div>
              <div className="text-gray-900 font-bold text-sm">
                {stats.tokenCount}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-600">Last Updated</div>
              <div className="text-green-600 font-bold text-sm">
                {stats.lastUpdated}
              </div>
            </div>
          </div>
        </div>

        <Card className="border-blue-200 bg-blue-50 rounded-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">
                    AI Training Status
                  </h3>
                  <p className="text-blue-700 text-sm">
                    Knowledge base is up to date and optimized
                  </p>
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retrain Model
              </Button>
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Upload Documents */}
      <div className="bg-white p-4 rounded-lg space-y-4 shadow-lg shadow-gray-200">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Upload Documents</h2>
            <span className="text-gray-600 text-sm">
              Add new knowledge sources
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Upload Voice */}
            <Card
              className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer p-4"
              onDragOver={(e) => handleDragOver(e, "voice")}
              onDragLeave={(e) => handleDragLeave(e, "voice")}
              onDrop={(e) => handleDrop(e, "voice")}
            >
              <CardContent className="p-0 text-center">
                <input
                  type="file"
                  id="voice-upload"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.mp3,.wav,.m4a"
                  onChange={(e) => handleFileInput(e, "voice")}
                />
                <label htmlFor="voice-upload" className="cursor-pointer">
                  <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-lg flex items-center justify-center">
                    {uploading === "voice" ? (
                      <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Volume2 className="w-6 h-6 text-purple-600" />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {uploading === "voice" ? "Uploading..." : "Upload Voice"}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Drag & drop or click to browse
                  </p>
                  <p className="text-gray-600 text-sm">Max limit: 10MB</p>
                </label>
              </CardContent>
            </Card>

            {/* Upload Email */}
            <Card
              className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer p-4"
              onDragOver={(e) => handleDragOver(e, "email")}
              onDragLeave={(e) => handleDragLeave(e, "email")}
              onDrop={(e) => handleDrop(e, "email")}
            >
              <CardContent className="p-0 text-center">
                <input
                  type="file"
                  id="email-upload"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.eml"
                  onChange={(e) => handleFileInput(e, "email")}
                />
                <label htmlFor="email-upload" className="cursor-pointer">
                  <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-lg flex items-center justify-center">
                    {uploading === "email" ? (
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Mail className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {uploading === "email" ? "Uploading..." : "Upload Email"}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Drag & drop or click to browse
                  </p>
                  <p className="text-gray-600 text-sm">Max limit: 5MB</p>
                </label>
              </CardContent>
            </Card>

            {/* Upload Chats */}
            <Card
              className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer p-4"
              onDragOver={(e) => handleDragOver(e, "chat")}
              onDragLeave={(e) => handleDragLeave(e, "chat")}
              onDrop={(e) => handleDrop(e, "chat")}
            >
              <CardContent className="p-0 text-center">
                <input
                  type="file"
                  id="chat-upload"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.json,.csv"
                  onChange={(e) => handleFileInput(e, "chat")}
                />
                <label htmlFor="chat-upload" className="cursor-pointer">
                  <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-lg flex items-center justify-center">
                    {uploading === "chat" ? (
                      <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <MessageSquare className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {uploading === "chat" ? "Uploading..." : "Upload Chats"}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Drag & drop or click to browse
                  </p>
                  <p className="text-gray-600 text-sm">Max limit: 5MB</p>
                </label>
              </CardContent>
            </Card>

            {/* Web URLs */}
            {/* <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer p-4">
              <CardContent className="p-0 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Link className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Web URLs</h3>
                <p className="text-gray-600 text-sm">Scrape website content</p>
              </CardContent>
            </Card> */}

            {/* CSV/JSON */}
            {/* <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer p-4">
              <CardContent className="p-0 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-lg flex items-center justify-center">
                  <Database className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">CSV/JSON</h3>
                <p className="text-gray-600 text-sm">Structured data files</p>
              </CardContent>
            </Card> */}
          </div>
        </div>

        {/* <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recent Updates</h2>
          <div className="space-y-2">
            {recentUpdates.map((update) => (
              <Card key={update.id} className="bg-gray-100 border-none">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {update.icon}
                      <span className="font-medium text-gray-900">
                        {update.name}
                      </span>
                      <div
                        className={`${utils.colors.getStatusColor(
                          update.status
                        )} px-2 py-1 rounded-md text-xs`}
                      >
                        {update.status}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{update.time}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div> */}
      </div>

      {/* Existing Knowledge Base Documents */}
      {(knowledgeBase.voiceDocuments.length > 0 ||
        knowledgeBase.emailDocuments.length > 0 ||
        knowledgeBase.chatDocuments.length > 0) && (
        <div className="bg-white p-4 rounded-lg space-y-4 shadow-lg shadow-gray-200">
          <h2 className="text-lg font-semibold">Existing Knowledge Base</h2>

          {/* Voice Documents */}
          {knowledgeBase.voiceDocuments.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-md font-medium text-purple-700 flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Voice Documents
              </h3>
              {knowledgeBase.voiceDocuments.map((doc) => (
                <Card key={doc._id} className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Volume2 className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {doc.file.split("/").pop()}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {doc.prompt}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => {
                          setKnowledgeBase((prev) => ({
                            ...prev,
                            voiceDocuments: prev.voiceDocuments.filter(
                              (d) => d._id !== doc._id
                            ),
                          }));
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Email Documents */}
          {knowledgeBase.emailDocuments.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-md font-medium text-blue-700 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Documents
              </h3>
              {knowledgeBase.emailDocuments.map((doc) => (
                <Card key={doc._id} className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Mail className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {doc.file.split("/").pop()}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {doc.prompt}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => {
                          setKnowledgeBase((prev) => ({
                            ...prev,
                            emailDocuments: prev.emailDocuments.filter(
                              (d) => d._id !== doc._id
                            ),
                          }));
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Chat Documents */}
          {knowledgeBase.chatDocuments.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-md font-medium text-green-700 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Chat Documents
              </h3>
              {knowledgeBase.chatDocuments.map((doc) => (
                <Card key={doc._id} className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <MessageSquare className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {doc.file.split("/").pop()}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {doc.prompt}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => {
                          setKnowledgeBase((prev) => ({
                            ...prev,
                            chatDocuments: prev.chatDocuments.filter(
                              (d) => d._id !== doc._id
                            ),
                          }));
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Knowledge Sources */}
      <div className="bg-white p-4 rounded-lg space-y-4 shadow-lg shadow-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Knowledge Sources</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {documents.map((doc) => (
            <Card
              key={doc.id}
              className="bg-white hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      {doc.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {doc.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        {doc.size && <span>{doc.size}</span>}
                        {doc.pages && <span>• {doc.pages} pages</span>}
                        <span>• Updated {doc.updatedAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-red-600"
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
    </>
  );
};

export default KnowledgeBase;
