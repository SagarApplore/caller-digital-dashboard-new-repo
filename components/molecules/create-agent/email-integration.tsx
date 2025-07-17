import { Card, CardContent } from "@/components/organisms/card";
import configs from "@/services/config-service";
import { Loader2, Volume2, Play } from "lucide-react";
import React, { useEffect, useState } from "react";
import voiceIntegration from "./voice-integration";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import endpoints from "@/lib/endpoints";
import apiRequest from "@/utils/api";

const EmailIntegration = ({
  emailIntegration,
  setEmailIntegration,
  mode = "create",
}: {
  emailIntegration: any;
  setEmailIntegration: (emailIntegration: any) => void;
  mode?: "create" | "edit";
}) => {
  const [loading, setLoading] = useState(true);
  const [configs, setConfigs] = useState<{
    llm: {
      providers: any[];
      models: any[];
    };
  }>({
    llm: {
      providers: [],
      models: [],
    },
  });

  // Helper function to find provider by name
  const findProviderByName = (providers: any[], name: string) => {
    return providers.find((provider) => provider.name === name);
  };

  // Helper function to find model by name
  const findModelByName = (models: any[], name: string) => {
    return models.find((model) => model.name === name);
  };

  // Helper function to fetch models by provider name (for edit mode)
  const fetchModelsByName = async (endpoint: string, providerName: string) => {
    try {
      // Try to fetch by name first using POST with provider name in body
      const response = await apiRequest(endpoint, "POST", { providerName });
      return response?.data?.data || [];
    } catch (error) {
      console.warn(
        `Failed to fetch models by name for ${providerName}, falling back to ID-based approach`
      );
      return [];
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const llmProviders = await apiRequest(
          endpoints.llmModels.getProviders,
          "GET"
        ).then((res) => res.data?.data ?? []);

        setConfigs({
          llm: { providers: llmProviders, models: [] },
        });

        // If in edit mode and we have existing selections, fetch the models
        if (mode === "edit" && emailIntegration.selectedLLMProviderName) {
          const llmProvider = findProviderByName(
            llmProviders,
            emailIntegration.selectedLLMProviderName
          );
          if (llmProvider) {
            const models = await fetchModelsByName(
              endpoints.llmModels.getModelsByName,
              emailIntegration.selectedLLMProviderName
            );

            setConfigs((prev) => ({
              ...prev,
              llm: { ...prev.llm, models },
            }));

            // Update the email integration with provider ID and model ID
            let updatedEmailIntegration = { ...emailIntegration };
            updatedEmailIntegration.selectedLLMProvider = llmProvider._id;

            if (emailIntegration.selectedLLMModelName) {
              const llmModel = findModelByName(
                models,
                emailIntegration.selectedLLMModelName
              );
              if (llmModel) {
                updatedEmailIntegration.selectedLLMModel = llmModel._id;
              }
            }

            setEmailIntegration(updatedEmailIntegration);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching providers:", error);
        setLoading(false);
      }
    };

    getData();
  }, [mode]);

  // FETCH LLM MODELS
  useEffect(() => {
    const fetchLLMModels = async () => {
      try {
        const response = await apiRequest(
          endpoints.llmModels.getModels +
            "/" +
            emailIntegration.selectedLLMProvider,
          "GET"
        );
        setConfigs((prev) => ({
          ...prev,
          llm: {
            models: response?.data?.data,
            providers: prev.llm.providers,
          },
        }));
      } catch (error) {
        setConfigs((prev) => ({
          ...prev,
          llm: {
            models: [],
            providers: prev.llm.providers,
          },
        }));
      }
    };
    if (emailIntegration.selectedLLMProvider) {
      fetchLLMModels();
    }
  }, [emailIntegration.selectedLLMProvider]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  } else {
    return (
      <>
        {/* Text-to-Speech */}
        <Card className="bg-white shadow-lg shadow-gray-200 rounded-lg border-none">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Text-to-Speech</h2>
              <span className="text-gray-600 text-sm">
                Choose AI voice characteristics
              </span>
            </div>

            <div className="flex flex-col gap-4 flex-1">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Voice Provider
                </label>
                <div className="flex items-center space-x-3">
                  <Select
                    value={emailIntegration.selectedLLMProvider}
                    onValueChange={(value) => {
                      const selectedProvider = configs.llm.providers.find(
                        (provider: any) => provider._id === value
                      );
                      setEmailIntegration({
                        ...emailIntegration,
                        selectedLLMProvider: value,
                        selectedLLMProviderName: selectedProvider
                          ? selectedProvider.companyName
                          : null,
                      });
                    }}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a provider..." />
                    </SelectTrigger>
                    <SelectContent>
                      {configs.llm.providers.map((provider: any) => (
                        <SelectItem key={provider._id} value={provider._id}>
                          {provider.companyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Voice Model
                </label>
                <div className="flex items-center space-x-3">
                  <Select
                    value={emailIntegration.selectedLLMModel}
                    disabled={!emailIntegration.selectedLLMProvider}
                    onValueChange={(value) => {
                      const selectedModel = configs.llm.models.find(
                        (model: any) => model._id === value
                      );
                      setEmailIntegration({
                        ...emailIntegration,
                        selectedLLMModel: value,
                        selectedLLMModelName: selectedModel
                          ? selectedModel.name
                          : null,
                      });
                    }}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a model..." />
                    </SelectTrigger>
                    <SelectContent>
                      {configs.llm.models.map((model: any) => (
                        <SelectItem key={model._id} value={model._id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }
};

export default EmailIntegration;
