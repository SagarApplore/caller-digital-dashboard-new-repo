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
import React, { useEffect, useState } from "react";

const ChatIntegration = ({
  chatIntegration,
  setChatIntegration,
}: {
  chatIntegration: any;
  setChatIntegration: (chatIntegration: any) => void;
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

  useEffect(() => {
    const getData = async () =>
      Promise.all([
        new Promise((resolve) => {
          apiRequest(endpoints.llmModels.getProviders, "GET").then((res) => {
            resolve(res.data?.data ?? []);
          });
        }),
      ]).then((results) => {
        setConfigs({
          llm: {
            providers: results[0] as any,
            models: [],
          },
        });
        setLoading(false);
      });
    getData();
  }, []);

  // FETCH LLM MODELS
  useEffect(() => {
    const fetchLLMModels = async () => {
      try {
        const response = await apiRequest(
          endpoints.llmModels.getModels +
            "/" +
            chatIntegration.selectedLLMProvider,
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
    if (chatIntegration.selectedLLMProvider) {
      fetchLLMModels();
    }
  }, [chatIntegration.selectedLLMProvider]);

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
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Voice Model
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
              </div>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }
};

export default ChatIntegration;
