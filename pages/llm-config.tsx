"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/organisms/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  Zap,
  Shield,
  Plus,
  Edit,
  Trash2,
  Circle,
  RotateCcw,
  Key,
  Route,
  Check,
  X,
  Mic,
  Speaker,
} from "lucide-react";
import Image from "next/image";
import utils from "@/utils/index.util";
import { Progress } from "@/components/ui/progress";
import React, { useCallback, useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { AddProviderModal } from "@/components/AddProviderModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import endpoints from "@/lib/endpoints";
import apiRequest from "@/utils/api";
import { toast } from "react-toastify";

// Sample providers data for fallback if API fails
const sampleProviders = {
  llm: [
    {
      id: "1",
      name: "OpenAI GPT-4",
      status: "Active",
      apiKey: "sk-proj-1234567890",
      usage: "2.3M tokens",
      cost: "$45.60",
      maxTpm: 90000,
      todayUsage: 68,
      provider: "OpenAI",
      companyName: "OpenAI",
      description: "Leading AI research lab",
      models: ["gpt-4-turbo", "gpt-3.5-turbo"],
      latency: "1.2s",
    },
    {
      id: "2",
      name: "Claude 3 Sonnet",
      status: "Active",
      apiKey: "sk-proj-1234567890",
      usage: "1.8M tokens",
      cost: "$36.00",
      maxTpm: 100000,
      todayUsage: 45,
      provider: "Anthropic",
      companyName: "Anthropic",
      description: "AI safety and research company",
      models: ["claude-3-sonnet", "claude-3-opus"],
      latency: "0.9s",
    },
    {
      id: "3",
      name: "Gemini Pro",
      status: "Limited",
      apiKey: "sk-proj-1234567890",
      usage: "0.5M tokens",
      cost: "$7.50",
      maxTpm: 60000,
      todayUsage: 85,
      provider: "Google",
      companyName: "Google",
      description: "Google's multimodal AI model",
      models: ["gemini-pro", "gemini-ultra"],
      latency: "1.5s",
    },
  ],
  stt: [
    {
      id: "4",
      name: "Whisper",
      status: "Active",
      apiKey: "sk-proj-1234567890",
      usage: "1.2M minutes",
      cost: "$18.00",
      maxTpm: 60000,
      todayUsage: 42,
      provider: "OpenAI",
      companyName: "OpenAI",
      description: "State-of-the-art speech recognition",
      models: ["whisper-1"],
      latency: "0.8s",
    },
    {
      id: "5",
      name: "Google Speech-to-Text",
      status: "Active",
      apiKey: "google-api-key-1234",
      usage: "0.9M minutes",
      cost: "$13.50",
      maxTpm: 50000,
      todayUsage: 35,
      provider: "Google",
      companyName: "Google",
      description: "Google's speech recognition service",
      models: ["standard", "enhanced"],
      latency: "1.0s",
    },
  ],
  tts: [
    {
      id: "6",
      name: "Amazon Polly",
      status: "Active",
      apiKey: "aws-key-1234567890",
      usage: "0.8M characters",
      cost: "$4.00",
      maxTpm: 40000,
      todayUsage: 30,
      provider: "AWS",
      companyName: "Amazon Web Services",
      description: "Lifelike speech synthesis",
      models: ["neural", "standard"],
      languages: ["English", "Spanish", "French", "German"],
      voiceIds: ["Joanna", "Matthew", "Lupe"],
      latency: "0.7s",
    },
    {
      id: "7",
      name: "ElevenLabs",
      status: "Active",
      apiKey: "eleven-key-1234567890",
      usage: "1.5M characters",
      cost: "$22.50",
      maxTpm: 70000,
      todayUsage: 55,
      provider: "ElevenLabs",
      companyName: "ElevenLabs",
      description: "High-quality voice cloning and synthesis",
      models: ["eleven_monolingual_v1", "eleven_multilingual_v1"],
      languages: ["English", "Spanish", "German", "Polish", "Italian"],
      voiceIds: ["Rachel", "Adam", "Antoni", "Domi", "Bella"],
      latency: "1.1s",
    },
  ],
};

const rules = [
  {
    id: 1,
    name: "Default Provider",
    description: "Primary model for all requests",
    model: "UX Pilot AI GPT-4",
  },
  {
    id: 2,
    name: "Latency Fallback",
    description: "If response time > 3s → Switch to UX Pilot AI GPT-4",
  },
];

// Helper function to get the appropriate icon for each provider type
const getProviderIcon = (type: string) => {
  switch (type) {
    case 'llm':
      return <Brain className="w-4 h-4" />;
    case 'stt':
      return <Mic className="w-4 h-4" />;
    case 'tts':
      return <Speaker className="w-4 h-4" />;
    default:
      return <Brain className="w-4 h-4" />;
  }
};

// Edit Provider Dialog Component
interface Model {
  _id?: string;
  name: string;
  description?: string;
  modelProvider?: string;
  isActive?: boolean;
  modelType?: string;
  maxTokens?: number;
  contextLength?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface Provider {
  id?: string;
  _id?: string;
  name: string;
  companyName?: string;
  apiKey: string;
  status: string;
  cost?: string;
  usage?: string;
  maxTpm?: number;
  todayUsage?: number;
  languages?: string[];
  type?: string;
  provider?: string;
  description?: string;
  models?: Model[];
  latency?: string;
  modelType?: string;
  voiceIds?: Array<{voiceId: string, voiceName: string}>;
  isActive?: boolean;
}

interface EditProviderDialogProps {
  provider: Provider | null;
  type: string | null;
  onSave: (provider: Provider, type: string) => void;
  onCancel?: () => void;
}

const EditProviderDialog = ({ provider, type, onSave, onCancel }: EditProviderDialogProps) => {
  const [editedProvider, setEditedProvider] = useState<Provider>(provider || {} as Provider);
  const [languages, setLanguages] = useState<string[]>(provider?.languages || []);
  const [newLanguage, setNewLanguage] = useState<string>("");
  const [voiceIds, setVoiceIds] = useState<any[]>(provider?.voiceIds || []);
  const [newModel, setNewModel] = useState<Partial<Model>>({ name: '', modelType: '', isActive: true });
  const [editingModelIndex, setEditingModelIndex] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProvider(prev => ({
      ...prev,
      [name]: name === 'maxTpm' ? Number(value) : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setEditedProvider(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle model input changes
  const handleModelInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewModel(prev => ({
      ...prev,
      [name]: name === 'maxTokens' || name === 'contextLength' ? parseInt(value) : value
    }));
  };

  // Handle model select changes
  const handleModelSelectChange = (name: string, value: any) => {
    setNewModel(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle adding a model
  const handleAddModel = () => {
    if (!newModel.name) return;
    
    const models = [...(editedProvider.models || [])];
    
    if (editingModelIndex !== null) {
      // Update existing model
      models[editingModelIndex] = {
        ...models[editingModelIndex],
        ...newModel,
      };
    } else {
      // Add new model
      models.push({
        ...newModel,
        _id: newModel._id || `temp-${Date.now()}`, // Temporary ID for new models
         modelProvider: editedProvider._id || editedProvider.id,
      } as Model);
    }
    
    setEditedProvider(prev => ({
      ...prev,
      models
    }));
    
    // Reset form
    setNewModel({ name: '', modelType: '', isActive: true });
    setEditingModelIndex(null);
  };

  // Handle editing a model
  const handleEditModel = (index: number) => {
    const model = editedProvider.models?.[index];
    if (model) {
      setNewModel(model);
      setEditingModelIndex(index);
    }
  };

  // Handle removing a model
  const handleRemoveModel = async (index: number) => {
    try {
      const model = editedProvider.models?.[index];
      if (!model) return;
      
      // If the model has an ID, delete it from the database
      if (model._id) {
        const modelType = type === 'llm' ? 'llm' : type === 'stt' ? 'stt' : 'tts';
        const response = await apiRequest(`/providers/${modelType}/model/${model._id}`, 'DELETE');
        
        if (response.status !== 200) {
          toast.error('Failed to delete model');
          return;
        }
        
        toast.success('Model deleted successfully');
      }
      
      // Remove from local state
      const models = [...(editedProvider.models || [])];
      models.splice(index, 1);
      setEditedProvider(prev => ({
        ...prev,
        models
      }));
    } catch (error: any) {
      console.error('Error deleting model:', error);
      toast.error(error?.message || 'Error deleting model');
    }
  };

  const handleAddLanguage = () => {
    if (newLanguage && !languages.includes(newLanguage)) {
      setLanguages(prev => [...prev, newLanguage]);
      setNewLanguage("");
    }
  };

  const handleRemoveLanguage = (lang: string) => {
    setLanguages(prev => prev.filter(l => l !== lang));
  };


  
  const handleSave = () => {
    // Include languages and voiceIds in the form data for TTS providers
    let updatedData = editedProvider;
    
    if (type === 'tts') {
      // Convert languages from array to proper format
      updatedData = { 
        ...editedProvider, 
        languages,
        voiceIds
      };
    }
    
    if (type) {
      onSave(updatedData, type);
    }
  };

  return (
   <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">

      <div className="grid gap-4 py-4">
        {/* Common fields for all provider types */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="companyName" className="text-right">
            Company Name
          </Label>
          <Input
            id="companyName"
            name="companyName"
            value={editedProvider.companyName || ''}
            onChange={handleInputChange}
            className="col-span-3"
            placeholder={type === 'tts' ? "e.g. ElevenLabs" : "e.g. OpenAI"}
            required
          />
        </div>
        
        {/* <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Provider Name
          </Label>
          <Input
            id="name"
            name="name"
            value={editedProvider.name || ''}
            onChange={handleInputChange}
            className="col-span-3"
            placeholder={type === 'tts' ? "e.g. Voice Cloner v1" : "e.g. GPT-4 Turbo"}
            required
          />
        </div>
         */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={editedProvider.description || ''}
            onChange={handleInputChange}
            className="col-span-3"
            placeholder="Enter description..."
            required
          />
        </div>
        
        {/* <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="apiKey" className="text-right">
            API Key
          </Label>
          <Input
            id="apiKey"
            name="apiKey"
            value={editedProvider.apiKey || ''}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div> */}
        
        {/* <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">
            Status
          </Label>
          <Select 
            value={editedProvider.status || ''} 
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Limited">Limited</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
        
        {/* <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="cost" className="text-right">
            Cost
          </Label>
          <Input
            id="cost"
            name="cost"
            value={editedProvider.cost || ''}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div> */}
{/*         
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="usage" className="text-right">
            Usage Unit
          </Label>
          <Input
            id="usage"
            name="usage"
            value={editedProvider.usage || ''}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div> */}
        
        {/* <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="maxTpm" className="text-right">
            Max TPM
          </Label>
          <Input
            id="maxTpm"
            name="maxTpm"
            value={editedProvider.maxTpm?.toString() || ''}
            onChange={handleInputChange}
            className="col-span-3"
            type="number"
          />
        </div> */}
        
        {/* Models section for LLM, STT, and TTS providers */}
        {(type === 'llm' || type === 'stt' || type === 'tts') && (
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right mt-2">
              Models
            </Label>
            <div className="col-span-3 space-y-4">
              <div className="flex flex-col gap-3 p-3 border rounded-md">
                <h4 className="font-medium">{editingModelIndex !== null ? 'Edit Model' : 'Add Model'}</h4>
                <div className="space-y-2">
                  <Input
                    name="name"
                    value={newModel.name || ''}
                    onChange={handleModelInputChange}
                    placeholder={type === 'llm' ? "Model Name (e.g. gpt-4-turbo)" : type === 'stt' ? "Model Name (e.g. whisper-1)" : "Model Name (e.g. neural, standard)"}
                    className="w-full"
                  />
                  
                  <div className="flex gap-2">
                    <Input
                      name="modelType"
                      value={newModel.modelType || ''}
                      onChange={handleModelInputChange}
                      placeholder={type === 'llm' ? "Model Type (e.g. text-generation, multimodal)" : type === 'stt' ? "Model Type (e.g. standard, enhanced)" : "Model Type (e.g. speech-synthesis, neural)"}
                      className="flex-1"
                    />
                    
                    <div className="flex items-center gap-2">
                      <Label htmlFor="isActive" className="text-sm">
                        Active
                      </Label>
                      <Switch
                        id="isActive"
                        checked={newModel.isActive || false}
                        onCheckedChange={(checked) => handleModelSelectChange("isActive", checked)}
                      />
                    </div>
                  </div>
                  
                  <Textarea
                    name="description"
                    value={newModel.description || ''}
                    onChange={handleModelInputChange}
                    placeholder="Model Description"
                    className="w-full"
                  />
                  
                  <div className="flex gap-2">
                    {/* <div className="flex-1">
                      <Label htmlFor="maxTokens" className="text-xs">
                        Max Tokens
                      </Label>
                      <Input
                        id="maxTokens"
                        name="maxTokens"
                        type="number"
                        value={newModel.maxTokens?.toString() || ''}
                        onChange={handleModelInputChange}
                        placeholder="4096"
                      />
                    </div> */}
                    
                    {/* <div className="flex-1">
                      <Label htmlFor="contextLength" className="text-xs">
                        Context Length
                      </Label>
                      <Input
                        id="contextLength"
                        name="contextLength"
                        type="number"
                        value={newModel.contextLength?.toString() || ''}
                        onChange={handleModelInputChange}
                        placeholder="16385"
                      />
                    </div> */}
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-2">
                    {editingModelIndex !== null && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setEditingModelIndex(null);
                          setNewModel({ name: '', modelType: '', isActive: true });
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button 
                      type="button" 
                      onClick={handleAddModel}
                    >
                      {editingModelIndex !== null ? 'Update' : 'Add'} Model
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 mt-4">
                <h4 className="font-medium">Current Models</h4>
                {editedProvider.models && editedProvider.models.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {editedProvider.models.map((model, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{model.name}</span>
                            <Badge variant={model.isActive ? "success" : "secondary"}>
                              {model.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500">{model.modelType}</span>
                          {model.description && (
                            <p className="text-xs text-gray-600 mt-1">{model.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditModel(index)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleRemoveModel(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No models added yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* TTS-specific fields */}
        {type === 'tts' && (
          <>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">
                Languages
              </Label>
              <div className="col-span-3 space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="e.g. en, es, fr"
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddLanguage}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {languages.map((lang, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {lang}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleRemoveLanguage(lang)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Voice IDs */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">
                Voice IDs
              </Label>
              <div className="col-span-3 space-y-2">
                {voiceIds.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      placeholder="Voice ID"
                      value={item.voiceId || ''}
                      onChange={(e) => {
                        const updated = [...voiceIds];
                        updated[index] = { ...updated[index], voiceId: e.target.value };
                        setVoiceIds(updated);
                      }}
                    />
                    <Input
                      placeholder="Voice Name"
                      value={item.voiceName || ''}
                      onChange={(e) => {
                        const updated = [...voiceIds];
                        updated[index] = { ...updated[index], voiceName: e.target.value };
                        setVoiceIds(updated);
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const updated = voiceIds.filter((_, i) => i !== index);
                        setVoiceIds(updated);
                      }}
                    >
                      -
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setVoiceIds([...voiceIds, { voiceId: "", voiceName: "" }])}
                >
                  + Add Voice
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="button" onClick={handleSave}>Save changes</Button>
      </DialogFooter>
    </div>
  );

};

// Define provider types
interface ProviderState {
  llm: Provider[];
  stt: Provider[];
  tts: Provider[];
}

interface FilteredProvider extends Provider {
  type: string;
}

export function LLMConfigPage() {
  // State for providers, filtering, and edit dialog
  const [providers, setProviders] = useState<ProviderState>({
    llm: [],
    stt: [],
    tts: []
  });
  const [filteredProviders, setFilteredProviders] = useState<FilteredProvider[]>([]);
  const [providerType, setProviderType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [currentProvider, setCurrentProvider] = useState<Provider | null>(null);
  const [currentProviderType, setCurrentProviderType] = useState<string | null>(null);
  
  // Add Provider state
  const [addProviderDialogOpen, setAddProviderDialogOpen] = useState<boolean>(false);
  
  // Fetch providers from API
  useEffect(() => { 
     const fetchProviders = async () => { 
       try { 
         // Fetch providers from API using apiRequest function
         const [llmResponse, sttResponse, ttsResponse] = await Promise.allSettled([ 
           apiRequest('/providers/llm', 'GET'), 
           apiRequest('/providers/stt', 'GET'), 
           apiRequest('/providers/tts', 'GET') 
         ]); 
         
         // Process responses 
         const llmProviders = llmResponse.status === 'fulfilled' ? llmResponse.value.data : sampleProviders.llm; 
         const sttProviders = sttResponse.status === 'fulfilled' ? sttResponse.value.data : sampleProviders.stt; 
         const ttsProviders = ttsResponse.status === 'fulfilled' ? ttsResponse.value.data : sampleProviders.tts; 
         
         // Ensure each provider has the correct type property
         const processedLlmProviders = llmProviders.providers?.map((provider: Provider) => ({
           ...provider,
           type: 'llm',
           // Convert string[] models to Model[] if needed
           models: Array.isArray(provider.models) 
             ? provider.models.map((model: any) => {
                 if (typeof model === 'string') {
                   return { name: model, isActive: true, _id: `temp-${Date.now()}-${Math.random()}` };
                 }
                 return model;
               })
             : provider.models || []
         })) || [];
         
         const processedSttProviders = sttProviders.providers?.map((provider: Provider) => ({
           ...provider,
           type: 'stt',
           // Convert string[] models to Model[] if needed for STT providers
           models: Array.isArray(provider.models) 
             ? provider.models.map((model: any) => {
                 if (typeof model === 'string') {
                   return { name: model, isActive: true, _id: `temp-${Date.now()}-${Math.random()}` };
                 }
                 return model;
               })
             : provider.models || []
         })) || [];
         
         const processedTtsProviders = ttsProviders.providers?.map((provider: Provider) => ({
           ...provider,
           type: 'tts',
           // Convert string[] models to Model[] if needed for TTS providers
           models: Array.isArray(provider.models) 
             ? provider.models.map((model: any) => {
                 if (typeof model === 'string') {
                   return { name: model, isActive: true, _id: `temp-${Date.now()}-${Math.random()}` };
                 }
                 return model;
               })
             : provider.models || []
         })) || [];
         
         // Process sample data if API fails
         const processSampleData = () => {
           if (!llmProviders.providers) {
             return {
               llm: sampleProviders.llm.map(provider => ({
                 ...provider,
                 models: Array.isArray(provider.models) 
                   ? provider.models.map((model: string) => ({ 
                       name: model, 
                       isActive: true, 
                       _id: `temp-${Date.now()}-${Math.random()}`,
                       modelType: 'text-generation'
                     }))
                   : []
               })),
               stt: sampleProviders.stt.map(provider => ({
                 ...provider,
                 models: Array.isArray(provider.models) 
                   ? provider.models.map((model: string) => ({ 
                       name: model, 
                       isActive: true, 
                       _id: `temp-${Date.now()}-${Math.random()}`,
                       modelType: 'speech-recognition'
                     }))
                   : []
               })),
               tts: sampleProviders.tts.map(provider => ({
                 ...provider,
                 models: Array.isArray(provider.models) 
                   ? provider.models.map((model: string) => ({ 
                       name: model, 
                       isActive: true, 
                       _id: `temp-${Date.now()}-${Math.random()}`,
                       modelType: 'speech-synthesis'
                     }))
                   : []
               }))
             }
           }
           return {
             llm: processedLlmProviders, 
             stt: processedSttProviders, 
             tts: processedTtsProviders
           }
         };
         
         setProviders(processSampleData()); 
       } catch (error) { 
         console.error('Error fetching providers:', error); 
         // Fallback to sample data if API fails with proper type conversion
         const convertedSampleProviders = {
           llm: sampleProviders.llm.map(provider => ({
             ...provider,
             models: Array.isArray(provider.models) 
               ? provider.models.map((model: string) => ({ 
                   name: model, 
                   isActive: true, 
                   _id: `temp-${Date.now()}-${Math.random()}`,
                   modelType: 'text-generation'
                 }))
               : []
           })),
           stt: sampleProviders.stt.map(provider => ({
             ...provider,
             models: Array.isArray(provider.models) 
               ? provider.models.map((model: string) => ({ 
                   name: model, 
                   isActive: true, 
                   _id: `temp-${Date.now()}-${Math.random()}`,
                   modelType: 'speech-recognition'
                 }))
               : []
           })),
           tts: sampleProviders.tts.map(provider => ({
             ...provider,
             models: Array.isArray(provider.models) 
               ? provider.models.map((model: string) => ({ 
                   name: model, 
                   isActive: true, 
                   _id: `temp-${Date.now()}-${Math.random()}`,
                   modelType: 'speech-synthesis'
                 }))
               : [],
             // Ensure other TTS-specific properties are properly formatted
             languages: provider.languages || [],
             voiceIds: provider.voiceIds ? provider.voiceIds.map((id: string) => ({ voiceId: id, voiceName: id })) : []
           }))
         };
         
         setProviders(convertedSampleProviders); 
       } 
     }; 
     
     fetchProviders(); 
   }, []);
  
  // Update filtered providers when provider type or search term changes
  useEffect(() => {
    let filtered: FilteredProvider[] = [];
    
    // Filter by provider type
    if (providerType === 'all') {
      // Combine all provider types
      Object.entries(providers).forEach(([type, typeProviders]) => {
        if (Array.isArray(typeProviders)) {
          filtered = [...filtered, ...typeProviders.map((provider: any) => ({ ...provider, type })) as FilteredProvider[]]
        }
      });
    } else {
      // Only include the selected provider type
      const typeProviders = providers[providerType as keyof ProviderState];
      if (Array.isArray(typeProviders)) {
        filtered = typeProviders.map((provider: any) => ({ ...provider, type: providerType })) as FilteredProvider[];
      }
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(provider => 
        provider.name.toLowerCase().includes(term) || 
        provider.companyName?.toLowerCase().includes(term) ||
        provider.description?.toLowerCase().includes(term)
      );
    }
    
    setFilteredProviders(filtered);
  }, [providers, providerType, searchTerm]);
  
  // Handle opening the edit dialog
  const handleEditProvider = (provider: FilteredProvider, type: string) => {
    setCurrentProvider(provider);
    setCurrentProviderType(type);
    setEditDialogOpen(true);
  };
  
  // Handle saving edited provider
  const handleSaveProvider = async (editedProvider: Provider, type: string) => {
    try {
      let payload = { ...editedProvider };
      
      // Format payload based on provider type
      if (type === 'tts') {
        // Make sure languages is properly formatted
        if (typeof payload.languages === 'string') {
          payload.languages = (payload.languages as string).split(',').map((l: string) => l.trim());
        }
      }
      
      // Ensure models are properly formatted if they exist
      if (payload.models && Array.isArray(payload.models)) {
        // Make sure each model has the required fields
        payload.models = payload.models.map(model => ({
          _id: model._id,
          name: model.name,
          description: model.description,
          modelProvider: model.modelProvider || payload._id || payload.id,
          isActive: model.isActive,
          modelType: model.modelType,
          maxTokens: model.maxTokens,
          contextLength: model.contextLength
        }));
      }
      
      // Call the appropriate API endpoint based on provider type using apiRequest
      const providerId = editedProvider.id || editedProvider._id;
      await apiRequest(`/providers/${type}/${providerId}`, 'PUT', payload, );
 
      // Update local state
      setProviders(prev => ({
        ...prev,
        [type as keyof ProviderState]: prev[type as keyof ProviderState].map(p => 
          (p.id === providerId || p._id === providerId) ? editedProvider : p
        )
      }));
      
      // Close dialog if open
      setEditDialogOpen(false);
      
      // Show success message
      toast.success('Provider updated successfully');
    } catch (error: any) {
      console.error('Error updating provider:', error);
      toast.error(error?.message || 'Error updating provider');
    }
  };
  
  const getProgressColor = useCallback((connectRate: number) => {
    if (connectRate >= 70) return "bg-green-500";
    if (connectRate >= 40) return "bg-yellow-500";
    return "bg-red-500";
  }, []);
  return (
    <>
      <Tabs defaultValue="providers" className="">
        <div className="bg-white px-4 pb-4 pt-2">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="models">Model Settings</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="addProvider">Add Provider</TabsTrigger>
          </TabsList>
        </div>
        
        {/* Edit Provider Dialog */}
         <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
           <DialogContent className="sm:max-w-[425px]">
             <DialogHeader>
               <DialogTitle>Edit {currentProviderType?.toUpperCase()} Provider</DialogTitle>
               <DialogDescription>
                 Update the provider details below.
               </DialogDescription>
             </DialogHeader>
             {currentProvider && (
               <EditProviderDialog
                 provider={currentProvider}
                 type={currentProviderType}
                 onSave={handleSaveProvider}
                 onCancel={() => setEditDialogOpen(false)}
               />
             )}
           </DialogContent>
         </Dialog>

        <TabsContent value="providers" className="p-4 mt-0 flex flex-col gap-8">
          {/* Filtering Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 w-full md:w-auto">
              <Input
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64"
              />
              <Select value={providerType} onValueChange={setProviderType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Provider Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  <SelectItem value="llm">LLM Providers</SelectItem>
                  <SelectItem value="stt">STT Providers</SelectItem>
                  <SelectItem value="tts">TTS Providers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Provider List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredProviders.length === 0 ? (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">No providers found. Try adjusting your filters.</p>
              </div>
            ) : (
              filteredProviders.map((provider) => {
                return (
                  
                  <Card
                    key={`${provider.type}-${provider.id}`}
                    className="border-none shadow-lg shadow-gray-200 hover:shadow-gray-300 transition-all duration-300 p-4 gap-4 flex flex-col"
                  >
                    <CardHeader className="flex flex-row items-center justify-between p-0">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg">
                            {getProviderIcon(provider.type)}
                          </div>
                          <div>
                            <CardTitle className="text-md font-medium">
                              {provider.companyName}
                            </CardTitle>
                            <CardDescription className="text-xs text-gray-500 flex items-center gap-1">
                              <div
                                className={`flex items-center gap-1 ${utils.colors.getStatusColor(
                                  provider.status
                                )} bg-transparent`}
                              >
                                <Circle
                                  className="w-2 h-2"
                                  fill="currentColor"
                                  stroke="currentColor"
                                />
                                <span className="text-xs">{provider.status}</span>
                              </div>
                              <span className="ml-2 text-xs">{provider.type.toUpperCase()}</span>
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 p-0">
                      {provider.type === 'tts' && provider.languages && (
                        <div className="flex flex-col gap-2">
                          <span className="text-sm text-gray-500">Languages</span>
                          <div className="flex flex-wrap gap-1">
                            {provider.languages.map((lang, index) => (
                              <Badge key={index} variant="outline">{lang}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {(provider.type === 'llm' || provider.type === 'stt' || provider.type === 'tts') && provider.models && provider.models.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <span className="text-sm text-gray-500">Models</span>
                          <div className="flex flex-col gap-1">
                            {provider.models.map((model, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">{model.name}</span>
                                  <span className="text-xs text-gray-500">{model.modelType}</span>
                                </div>
                                <Badge variant={model.isActive ? "success" : "secondary"}>
                                  {model.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {provider.description && (
                        <div className="flex flex-col gap-1 mt-2">
                          <span className="text-sm text-gray-500">Description</span>
                          <p className="text-sm">{provider.description}</p>
                        </div>
                      )}
                    </CardContent>
                    <Separator />
                    <CardFooter className="p-0 flex flex-row gap-4">
                      <Button 
                        className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                        onClick={() => handleEditProvider(provider, provider.type)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Edit</span>
                      </Button>
                      <Button 
                        className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                        onClick={() => {
                          // Toggle provider status
                          const newStatus = provider.status === 'Active' ? 'Inactive' : 'Active';
                          handleSaveProvider({...provider, status: newStatus}, provider.type);
                        }}
                      >
                        {provider.status === 'Active' ? (
                          <X className="w-4 h-4 mr-2" />
                        ) : (
                          <Check className="w-4 h-4 mr-2" />
                        )}
                        <span className="text-sm font-medium">
                          {provider.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </span>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })
            )}
          </div>

          {/* Rules */}
          <Card className="w-full max-w-md border-none shadow-lg shadow-gray-200 hover:shadow-gray-300 transition-all duration-300 p-4 max-h-[300px] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between p-0">
              <div className="flex items-center gap-2">
                <Route className="w-4 h-4 text-purple-500" />
                <span className="text-lg font-semibold">Routing Rules</span>
              </div>
              <Button className="w-fit bg-purple-100 text-purple-700 hover:bg-purple-200">
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add Rule</span>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 mt-6 p-0">
              {rules.map((rule) => {
                return (
                  <div
                    key={rule.id}
                    className="flex p-4 bg-gray-100 rounded-lg justify-between items-center"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{rule.name}</span>
                      <span className="text-xs text-gray-500">
                        {rule.description}
                      </span>
                    </div>
                    {rule.model && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700 font-medium">
                          {rule.model}
                        </span>
                        <Edit className="w-4 h-4 text-purple-500" />
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="p-4 mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Model Configuration</CardTitle>
              <CardDescription>
                Configure parameters for your AI models
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      min="0"
                      max="2"
                      defaultValue="0.7"
                    />
                    <p className="text-xs text-gray-500">
                      Controls randomness (0.0 = deterministic, 2.0 = very
                      random)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-tokens">Max Tokens</Label>
                    <Input id="max-tokens" type="number" defaultValue="2048" />
                    <p className="text-xs text-gray-500">
                      Maximum number of tokens to generate
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="top-p">Top P</Label>
                    <Input
                      id="top-p"
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      defaultValue="0.9"
                    />
                    <p className="text-xs text-gray-500">
                      Nucleus sampling parameter
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency-penalty">Frequency Penalty</Label>
                    <Input
                      id="frequency-penalty"
                      type="number"
                      step="0.1"
                      min="0"
                      max="2"
                      defaultValue="0.0"
                    />
                    <p className="text-xs text-gray-500">
                      Reduces repetition of tokens
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="system-prompt">System Prompt</Label>
                <Textarea
                  id="system-prompt"
                  placeholder="Enter the system prompt that will guide the AI's behavior..."
                  className="min-h-32"
                  defaultValue="You are a professional sales assistant helping with outbound calls. Be friendly, professional, and helpful."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="p-4 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Usage Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Enable usage alerts</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="usage-threshold">Usage Threshold (%)</Label>
                    <Input
                      id="usage-threshold"
                      type="number"
                      defaultValue="80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost-limit">Monthly Cost Limit ($)</Label>
                    <Input id="cost-limit" type="number" defaultValue="500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Enable latency alerts</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="latency-threshold">
                      Latency Threshold (ms)
                    </Label>
                    <Input
                      id="latency-threshold"
                      type="number"
                      defaultValue="2000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="error-threshold">
                      Error Rate Threshold (%)
                    </Label>
                    <Input
                      id="error-threshold"
                      type="number"
                      defaultValue="5"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="p-4 mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security and privacy settings for your LLM providers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Data Encryption</p>
                    <p className="text-sm text-gray-600">
                      Encrypt all data sent to LLM providers
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Data Retention</p>
                    <p className="text-sm text-gray-600">
                      Automatically delete conversation logs
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">PII Detection</p>
                    <p className="text-sm text-gray-600">
                      Detect and mask personally identifiable information
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="retention-period">
                  Data Retention Period (days)
                </Label>
                <Input id="retention-period" type="number" defaultValue="30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allowed-domains">Allowed Domains</Label>
                <Textarea
                  id="allowed-domains"
                  placeholder="Enter allowed domains, one per line..."
                  defaultValue="api.openai.com&#10;api.anthropic.com&#10;generativelanguage.googleapis.com"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="addProvider" className="p-4 mt-0 flex flex-col gap-8">
  <div className="flex justify-start">
    <AddProviderModal />
  </div>
</TabsContent>
      </Tabs>
    </>
  );
}

export default LLMConfigPage;
