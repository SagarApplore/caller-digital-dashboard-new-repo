import { Card, CardContent } from "@/components/organisms/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import endpoints from "@/lib/endpoints";
import { apiRequest } from "@/utils/api";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";

const ChatIntegration = ({
  chatIntegration,
  setChatIntegration,
  mode = "create",
}: {
  chatIntegration: any;
  setChatIntegration: (chatIntegration: any) => void;
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

  // To avoid double-setting model IDs before models are loaded, use refs to track if we've already set them
  const hasSetLLMModel = useRef(false);

  // Helper function to find provider by name
  const findProviderByName = (providers: any[], name: string) => {
    return providers.find((provider) => 
      provider.companyName === name || 
      provider.name === name ||
      provider.providerName === name
    );
  };

  // Helper function to find model by name
  const findModelByName = (models: any[], name: string) => {
    return models.find((model) => 
      model.name === name || 
      model.model === name
    );
  };

  // Helper function to fetch models by provider name (for edit mode)
  const fetchModelsByName = async (endpoint: string, providerName: string) => {
    try {
      // Use the getModelsByName endpoint with POST request and provider name in body
      const response = await apiRequest(endpoints.llmModels.getModelsByName, "POST", {
        name: providerName,
      });
      return response?.data?.data || [];
    } catch (error) {
      console.warn(
        `Failed to fetch models for provider ${providerName}, error:`, error
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
        if (mode === "edit") {
          console.log("Edit mode - chat integration data:", chatIntegration);
          console.log("LLM Provider Name:", chatIntegration.selectedLLMProviderName);
          console.log("LLM Model Name:", chatIntegration.selectedLLMModelName);
          
          if (chatIntegration.selectedLLMProviderName) {
            const llmProvider = findProviderByName(
              llmProviders,
              chatIntegration.selectedLLMProviderName
            );
            if (llmProvider) {
              const models = await fetchModelsByName(
                endpoints.llmModels.getModelsByName,
                chatIntegration.selectedLLMProviderName
              );

              setConfigs((prev) => ({
                ...prev,
                llm: { ...prev.llm, models },
              }));

              // Update the chat integration with provider ID (model ID will be set in next effect)
              let updatedChatIntegration = { ...chatIntegration };
              updatedChatIntegration.selectedLLMProvider = llmProvider._id;
              setChatIntegration(updatedChatIntegration);
            }
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching providers:", error);
        setLoading(false);
      }
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Set model ID based on model name after models are loaded (for edit mode)
  useEffect(() => {
    if (mode !== "edit") return;

    console.log("Chat Model setting useEffect triggered");
    console.log("LLM Model Name:", chatIntegration.selectedLLMModelName);
    console.log("LLM Models loaded:", configs.llm.models.length);
    console.log("LLM Models:", configs.llm.models);

    // LLM
    if (
      chatIntegration.selectedLLMModelName &&
      configs.llm.models.length > 0 &&
      !chatIntegration.selectedLLMModel &&
      !hasSetLLMModel.current
    ) {
      console.log("Setting LLM model for:", chatIntegration.selectedLLMModelName);
      const llmModel = findModelByName(
        configs.llm.models,
        chatIntegration.selectedLLMModelName
      );
      console.log("Found LLM model:", llmModel);
      if (llmModel) {
        setChatIntegration((prev: any) => ({
          ...prev,
          selectedLLMModel: llmModel._id,
        }));
        hasSetLLMModel.current = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    configs.llm.models,
    mode,
    chatIntegration.selectedLLMModelName,
  ]);

  // FETCH LLM MODELS
  useEffect(() => {
    // Don't fetch if in edit mode and models are already loaded
    if (
      mode === "edit" &&
      configs.llm.models.length > 0 &&
      chatIntegration.selectedLLMProvider
    ) {
      return;
    }
    
    const fetchLLMModels = async () => {
      try {
        let response;
        if (mode === "edit") {
          response = await apiRequest(
            endpoints.llmModels.getModelsByName,
            "POST",
            { name: chatIntegration.selectedLLMProviderName }
          );
        } else {
          response = await apiRequest(
            endpoints.llmModels.getModels +
              "/" +
              chatIntegration.selectedLLMProvider,
            "GET"
          );
        }
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
    if (chatIntegration.selectedLLMProvider) {
      fetchLLMModels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatIntegration.selectedLLMProvider, mode]);

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
              <h2 className="text-lg font-semibold">LLM</h2>
              <span className="text-gray-600 text-sm">
                Choose AI voice characteristics
              </span>
            </div>

            <div className="flex flex-col gap-4 flex-1">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                 Provider
                </label>
                <div className="flex items-center space-x-3">
                  <Select
                    value={chatIntegration.selectedLLMProvider}
                    onValueChange={(value) => {
                      const selectedProvider = configs.llm.providers.find(
                        (provider: any) => provider._id === value
                      );
                      setChatIntegration({
                        ...chatIntegration,
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
                {/* Display the provider name from backend if available */}
                {chatIntegration.selectedLLMProviderName && (
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded border">
                    <strong>Selected Provider:</strong> {chatIntegration.selectedLLMProviderName}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                   Model
                </label>
                <div className="flex items-center space-x-3">
                  <Select
                    value={chatIntegration.selectedLLMModel}
                    disabled={!chatIntegration.selectedLLMProvider}
                    onValueChange={(value) => {
                      const selectedModel = configs.llm.models.find(
                        (model: any) => model._id === value
                      );
                      setChatIntegration({
                        ...chatIntegration,
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
                {/* Display the model name from backend if available */}
                {chatIntegration.selectedLLMModelName && (
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded border">
                    <strong>Selected Model:</strong> {chatIntegration.selectedLLMModelName}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }
};

export default ChatIntegration;
