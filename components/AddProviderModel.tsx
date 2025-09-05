"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import apiRequest from "@/utils/api";
import { toast } from "react-toastify";

export function AddProviderModal() {
  const [open, setOpen] = useState(false);
  const [providerType, setProviderType] = useState<string>("");

  const [formData, setFormData] = useState<any>({
    companyName: "",
    modelName: "",
    modelType: "",
    description: "",
    type: "",
    languages: "",
    voiceIds: [],
  });

  // handle text inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let payload: any = { ...formData, type: providerType };

      if (providerType === "stt") {
        // STT does not need modelType
        delete payload.modelType;
      }

      if (providerType === "tts") {
        // convert languages from CSV string to array
        payload.languages = payload.languages
          ? payload.languages.split(",").map((l: string) => l.trim())
          : ["en"];
      }

      const endpoint =
        providerType === "llm"
          ? "/providers/llm"
          : providerType === "stt"
          ? "/providers/stt"
          : "/providers/tts";

      const response = await apiRequest(endpoint, "POST", payload);
      console.log("Provider saved:", response);

      // Reset form & close modal
      setFormData({
        companyName: "",
        modelName: "",
        modelType: "",
        description: "",
        type: "",
        languages: "",
        voiceIds: [],
      });
      toast.success(response.data.message)
      setProviderType("");
      setOpen(false);
    } catch (error) {
        toast.error(error.message)
      console.error("Error saving provider:", error);
    }
  };

  return (
    <>
      <Button
        className="w-fit bg-purple-100 text-purple-700 hover:bg-purple-200"
        onClick={() => setOpen(true)}
      >
        Add Provider
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Provider</DialogTitle>
          </DialogHeader>

          {/* Provider Type Selection */}
          <div className="space-y-4">
            <Label>Select Provider Type</Label>
            <Select value={providerType} onValueChange={setProviderType}>
              <SelectTrigger>
                <SelectValue placeholder="Choose provider type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="llm">LLM</SelectItem>
                <SelectItem value="stt">STT</SelectItem>
                <SelectItem value="tts">TTS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* LLM & STT Form */}
          {(providerType === "llm" || providerType === "stt") && (
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="e.g. OpenAI"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="modelName">Model Name</Label>
                <Input
                  id="modelName"
                  placeholder="e.g. GPT-4 Turbo"
                  value={formData.modelName}
                  onChange={handleChange}
                  required
                />
              </div>

              {providerType === "llm" && (
                <div>
                  <Label htmlFor="modelType">Model Type</Label>
                  <Input
                    id="modelType"
                    placeholder="e.g. Chat, Embedding"
                    value={formData.modelType}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter description..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-purple-600 text-white">
                  Save Provider
                </Button>
              </DialogFooter>
            </form>
          )}

          {/* TTS Form */}
          {providerType === "tts" && (
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="e.g. ElevenLabs"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="modelName">Model Name</Label>
                <Input
                  id="modelName"
                  placeholder="e.g. Voice Cloner v1"
                  value={formData.modelName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter description..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Languages */}
              <div>
                <Label htmlFor="languages">Languages (comma separated)</Label>
                <Input
                  id="languages"
                  placeholder="e.g. en, es, fr"
                  value={formData.languages}
                  onChange={handleChange}
                />
              </div>

              {/* VoiceIds Key-Value */}
              <div>
                <Label>Voice IDs</Label>
                {(formData.voiceIds || []).map((item: any, index: number) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      placeholder="Voice ID"
                      value={item.voiceId}
                      onChange={(e) => {
                        const updated = [...(formData.voiceIds || [])];
                        updated[index].voiceId = e.target.value;
                        setFormData({ ...formData, voiceIds: updated });
                      }}
                    />
                    <Input
                      placeholder="Voice Name"
                      value={item.voiceName}
                      onChange={(e) => {
                        const updated = [...(formData.voiceIds || [])];
                        updated[index].voiceName = e.target.value;
                        setFormData({ ...formData, voiceIds: updated });
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const updated = (formData.voiceIds || []).filter(
                          (_: any, i: number) => i !== index
                        );
                        setFormData({ ...formData, voiceIds: updated });
                      }}
                    >
                      -
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      voiceIds: [
                        ...(formData.voiceIds || []),
                        { voiceId: "", voiceName: "" },
                      ],
                    })
                  }
                >
                  + Add Voice
                </Button>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-purple-600 text-white">
                  Save Provider
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
