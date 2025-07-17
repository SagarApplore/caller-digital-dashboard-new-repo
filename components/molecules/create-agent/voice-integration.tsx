import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/organisms/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Play, Volume2 } from "lucide-react";
import apiRequest from "@/utils/api";
import endpoints from "@/lib/endpoints";

const VoiceIntegration = ({
  voiceIntegration,
  setVoiceIntegration,
  mode = "create",
}: {
  voiceIntegration: any;
  setVoiceIntegration: (voiceIntegration: any) => void;
  mode?: "create" | "edit";
}) => {
  const [configs, setConfigs] = useState<{
    stt: {
      models: any[];
      providers: any[];
    };
    tts: {
      models: any[];
      providers: any[];
    };
    llm: {
      models: any[];
      providers: any[];
    };
  }>({
    stt: {
      models: [],
      providers: [],
    },
    tts: {
      models: [],
      providers: [],
    },
    llm: {
      models: [],
      providers: [],
    },
  });

  const [loading, setLoading] = useState(true);

  // Helper function to find provider by name
  const findProviderByName = (providers: any[], name: string) => {
    return providers.find((provider) => provider.companyName === name);
  };

  // Helper function to find model by name
  const findModelByName = (models: any[], name: string) => {
    return models.find((model) => model.name === name);
  };

  // Helper function to fetch models by provider name (for edit mode)
  const fetchModelsByName = async (endpoint: string, providerName: string) => {
    try {
      // Try to fetch by name first using POST with provider name in body
      const response = await apiRequest(endpoint, "POST", {
        name: providerName,
      });
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
        const [ttsProviders, sttProviders, llmProviders] = await Promise.all([
          apiRequest(endpoints.ttsModels.getProviders, "GET").then(
            (res) => res.data?.data ?? []
          ),
          apiRequest(endpoints.sttModels.getProviders, "GET").then(
            (res) => res.data?.data ?? []
          ),
          apiRequest(endpoints.llmModels.getProviders, "GET").then(
            (res) => res.data?.data ?? []
          ),
        ]);

        setConfigs({
          tts: { providers: ttsProviders, models: [] },
          stt: { providers: sttProviders, models: [] },
          llm: { providers: llmProviders, models: [] },
        });

        // If in edit mode and we have existing selections, fetch the models
        if (mode === "edit") {
          const promises = [];

          // Fetch TTS models if provider name is available
          if (voiceIntegration.selectedTTSProviderName) {
            const ttsProvider = findProviderByName(
              ttsProviders,
              voiceIntegration.selectedTTSProviderName
            );
            if (ttsProvider) {
              promises.push(
                fetchModelsByName(
                  endpoints.ttsModels.getModelsByName,
                  voiceIntegration.selectedTTSProviderName
                ).then((models) => ({
                  type: "tts",
                  models,
                  providerId: ttsProvider._id,
                }))
              );
            }
          }

          // Fetch STT models if provider name is available
          if (voiceIntegration.selectedSTTProviderName) {
            const sttProvider = findProviderByName(
              sttProviders,
              voiceIntegration.selectedSTTProviderName
            );
            if (sttProvider) {
              promises.push(
                fetchModelsByName(
                  endpoints.sttModels.getModelsByName,
                  voiceIntegration.selectedSTTProviderName
                ).then((models) => ({
                  type: "stt",
                  models,
                  providerId: sttProvider._id,
                }))
              );
            }
          }

          // Fetch LLM models if provider name is available
          if (voiceIntegration.selectedLLMProviderName) {
            const llmProvider = findProviderByName(
              llmProviders,
              voiceIntegration.selectedLLMProviderName
            );
            if (llmProvider) {
              promises.push(
                fetchModelsByName(
                  endpoints.llmModels.getModelsByName,
                  voiceIntegration.selectedLLMProviderName
                ).then((models) => ({
                  type: "llm",
                  models,
                  providerId: llmProvider._id,
                }))
              );
            }
          }

          // Wait for all model fetching to complete
          const results = await Promise.all(promises);

          // Update configs with fetched models and set the provider IDs
          let updatedVoiceIntegration = { ...voiceIntegration };

          results.forEach((result) => {
            if (result.type === "tts") {
              setConfigs((prev) => ({
                ...prev,
                tts: { ...prev.tts, models: result.models },
              }));
              updatedVoiceIntegration.selectedTTSProvider = result.providerId;
            } else if (result.type === "stt") {
              setConfigs((prev) => ({
                ...prev,
                stt: { ...prev.stt, models: result.models },
              }));
              updatedVoiceIntegration.selectedSTTProvider = result.providerId;
            } else if (result.type === "llm") {
              setConfigs((prev) => ({
                ...prev,
                llm: { ...prev.llm, models: result.models },
              }));
              updatedVoiceIntegration.selectedLLMProvider = result.providerId;
            }
          });

          // Set model IDs based on model names
          if (voiceIntegration.selectedTTSModelName) {
            const ttsModel = findModelByName(
              configs.tts.models,
              voiceIntegration.selectedTTSModelName
            );
            if (ttsModel) {
              updatedVoiceIntegration.selectedTTSModel = ttsModel._id;
            }
          }

          if (voiceIntegration.selectedSTTModelName) {
            const sttModel = findModelByName(
              configs.stt.models,
              voiceIntegration.selectedSTTModelName
            );
            if (sttModel) {
              updatedVoiceIntegration.selectedSTTModel = sttModel._id;
            }
          }

          if (voiceIntegration.selectedLLMModelName) {
            const llmModel = findModelByName(
              configs.llm.models,
              voiceIntegration.selectedLLMModelName
            );
            if (llmModel) {
              updatedVoiceIntegration.selectedLLMModel = llmModel._id;
            }
          }

          // Update the voice integration state
          setVoiceIntegration(updatedVoiceIntegration);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching providers:", error);
        setLoading(false);
      }
    };

    getData();
  }, [mode]);

  // FETCH TTS MODELS
  useEffect(() => {
    const fetchTTSModels = async () => {
      try {
        const response = await apiRequest(
          endpoints.ttsModels.getModels +
            "/" +
            voiceIntegration.selectedTTSProvider,
          "GET"
        );
        console.log(response?.data?.data);

        setConfigs((prev) => ({
          ...prev,
          tts: {
            models: response?.data?.data,
            providers: prev.tts.providers,
          },
        }));
      } catch (error) {
        setConfigs((prev) => ({
          ...prev,
          tts: {
            models: [],
            providers: prev.tts.providers,
          },
        }));
      }
    };

    if (voiceIntegration.selectedTTSProvider) {
      fetchTTSModels();
    }
  }, [voiceIntegration.selectedTTSProvider]);

  // FETCH STT MODELS
  useEffect(() => {
    const fetchSTTModels = async () => {
      try {
        const response = await apiRequest(
          endpoints.sttModels.getModels +
            "/" +
            voiceIntegration.selectedSTTProvider,
          "GET"
        );
        setConfigs((prev) => ({
          ...prev,
          stt: {
            models: response?.data?.data,
            providers: prev.stt.providers,
          },
        }));
      } catch (error) {
        setConfigs((prev) => ({
          ...prev,
          stt: {
            models: [],
            providers: prev.stt.providers,
          },
        }));
      }
    };
    if (voiceIntegration.selectedSTTProvider) {
      fetchSTTModels();
    }
  }, [voiceIntegration.selectedSTTProvider]);

  // FETCH LLM MODELS
  useEffect(() => {
    const fetchLLMModels = async () => {
      try {
        const response = await apiRequest(
          endpoints.llmModels.getModels +
            "/" +
            voiceIntegration.selectedLLMProvider,
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
    if (voiceIntegration.selectedLLMProvider) {
      fetchLLMModels();
    }
  }, [voiceIntegration.selectedLLMProvider]);

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

            <div className="flex gap-4">
              <div className="flex flex-col gap-4 flex-1">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Voice Provider
                  </label>
                  <div className="flex items-center space-x-3">
                    <Select
                      value={voiceIntegration.selectedTTSProvider}
                      onValueChange={(value) => {
                        const selectedProvider = configs.tts.providers.find(
                          (provider: any) => provider._id === value
                        );
                        setVoiceIntegration({
                          ...voiceIntegration,
                          selectedTTSProvider: value,
                          selectedTTSProviderName: selectedProvider
                            ? selectedProvider.companyName
                            : null,
                        });
                      }}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a provider..." />
                      </SelectTrigger>
                      <SelectContent>
                        {configs.tts.providers.map((provider: any) => (
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
                      value={voiceIntegration.selectedTTSModel}
                      disabled={!voiceIntegration.selectedTTSProvider}
                      onValueChange={(value) => {
                        const selectedModel = configs.tts.models.find(
                          (model: any) => model._id === value
                        );
                        setVoiceIntegration({
                          ...voiceIntegration,
                          selectedTTSModel: value,
                          selectedTTSModelName: selectedModel
                            ? selectedModel.name
                            : null,
                        });
                      }}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a model..." />
                      </SelectTrigger>
                      <SelectContent>
                        {configs.tts.models.map((model: any) => (
                          <SelectItem key={model._id} value={model._id}>
                            {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 flex-1 bg-gray-100 rounded-lg">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-200 rounded-full">
                  <Volume2 className="w-6 h-6 text-purple-700" />
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white h-8">
                  <Play className="w-4 h-4" />
                  Preview Voice
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Speech-to-Text */}
        <Card className="bg-white shadow-lg shadow-gray-200 rounded-lg border-none">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Speech-to-Text</h2>
              <span className="text-gray-600 text-sm">
                Choose AI text characteristics
              </span>
            </div>

            <div className="flex flex-col gap-4 flex-1">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  STT Provider
                </label>
                <div className="flex items-center space-x-3">
                  <Select
                    value={voiceIntegration.selectedSTTProvider}
                    onValueChange={(value) => {
                      const selectedProvider = configs.stt.providers.find(
                        (provider: any) => provider._id === value
                      );
                      setVoiceIntegration({
                        ...voiceIntegration,
                        selectedSTTProvider: value,
                        selectedSTTProviderName: selectedProvider
                          ? selectedProvider.companyName
                          : null,
                      });
                    }}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a provider..." />
                    </SelectTrigger>
                    <SelectContent>
                      {configs.stt.providers.map((provider: any) => (
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
                    value={voiceIntegration.selectedSTTModel}
                    disabled={!voiceIntegration.selectedSTTProvider}
                    onValueChange={(value) => {
                      const selectedModel = configs.stt.models.find(
                        (model: any) => model._id === value
                      );
                      setVoiceIntegration({
                        ...voiceIntegration,
                        selectedSTTModel: value,
                        selectedSTTModelName: selectedModel
                          ? selectedModel.name
                          : null,
                      });
                    }}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a model..." />
                    </SelectTrigger>
                    <SelectContent>
                      {configs.stt.models.map((model: any) => (
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

        {/* LLM */}
        <Card className="bg-white shadow-lg shadow-gray-200 rounded-lg border-none">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">LLM</h2>
              <span className="text-gray-600 text-sm">Choose LLM</span>
            </div>

            <div className="flex flex-col gap-4 flex-1">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  LLM Provider
                </label>
                <div className="flex items-center space-x-3">
                  <Select
                    value={voiceIntegration.selectedLLMProvider}
                    onValueChange={(value) => {
                      const selectedProvider = configs.llm.providers.find(
                        (provider: any) => provider._id === value
                      );
                      setVoiceIntegration({
                        ...voiceIntegration,
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
                    value={voiceIntegration.selectedLLMModel}
                    disabled={!voiceIntegration.selectedLLMProvider}
                    onValueChange={(value) => {
                      const selectedModel = configs.llm.models.find(
                        (model: any) => model._id === value
                      );
                      setVoiceIntegration({
                        ...voiceIntegration,
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

export default VoiceIntegration;
