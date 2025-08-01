import React, { useEffect, useState, useRef } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
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
      voices: any[];
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
      voices: [],
    },
    llm: {
      models: [],
      providers: [],
    },
  });

  const [loading, setLoading] = useState(true);

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
  const fetchModelsByName = async (endpoint: string, providerId: string) => {
    try {
      // Use the provider ID-based endpoint to fetch models
      const response = await apiRequest(endpoint + "/" + providerId, "GET");
      return response?.data?.data || [];
    } catch (error) {
      console.warn(
        `Failed to fetch models for provider ${providerId}, error:`, error
      );
      return [];
    }
  };

  // Helper function to get voices from provider data
  const getVoicesFromProvider = (providerId: string) => {
    const provider = configs.tts.providers.find(
      (p: any) => p._id === providerId
    );
    return provider?.voiceIds || provider?.voices || [];
  };

  // To avoid double-setting model IDs before models are loaded, use refs to track if we've already set them
  const hasSetTTSModel = useRef(false);
  const hasSetSTTModel = useRef(false);
  const hasSetLLMModel = useRef(false);

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

        // Set providers first, models will be set after fetching
        setConfigs({
          tts: { providers: ttsProviders, models: [], voices: [] },
          stt: { providers: sttProviders, models: [] },
          llm: { providers: llmProviders, models: [] },
        });

        // If in edit mode and we have existing selections, fetch the models
        if (mode === "edit") {
          console.log("Edit mode - voice integration data:", voiceIntegration);
          console.log("TTS Provider Name:", voiceIntegration.selectedTTSProviderName);
          console.log("STT Provider Name:", voiceIntegration.selectedSTTProviderName);
          console.log("LLM Provider Name:", voiceIntegration.selectedLLMProviderName);
          console.log("TTS Model Name:", voiceIntegration.selectedTTSModelName);
          console.log("STT Model Name:", voiceIntegration.selectedSTTModelName);
          console.log("LLM Model Name:", voiceIntegration.selectedLLMModelName);
          
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
                  endpoints.ttsModels.getModels,
                  ttsProvider._id
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
                  endpoints.sttModels.getModels,
                  sttProvider._id
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
                  endpoints.llmModels.getModels,
                  llmProvider._id
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

          // Prepare updated configs and voiceIntegration
          let updatedVoiceIntegration = { ...voiceIntegration };
          let updatedConfigs = {
            tts: { providers: ttsProviders, models: [], voices: [] },
            stt: { providers: sttProviders, models: [] },
            llm: { providers: llmProviders, models: [] },
          };

          results.forEach((result) => {
            if (result.type === "tts") {
              updatedConfigs.tts.models = result.models;
              updatedVoiceIntegration.selectedTTSProvider = result.providerId;
              
              // Load voices for TTS provider
              const ttsProvider = ttsProviders.find((p: any) => p._id === result.providerId);
              if (ttsProvider) {
                updatedConfigs.tts.voices = ttsProvider.voiceIds || ttsProvider.voices || [];
              }
            } else if (result.type === "stt") {
              updatedConfigs.stt.models = result.models;
              updatedVoiceIntegration.selectedSTTProvider = result.providerId;
            } else if (result.type === "llm") {
              updatedConfigs.llm.models = result.models;
              updatedVoiceIntegration.selectedLLMProvider = result.providerId;
            }
          });

          setConfigs(updatedConfigs);

          // Set model IDs based on model names (after models are loaded)
          // We'll do this in a separate useEffect below, after configs are updated

          // Update the voice integration state with provider IDs (model IDs will be set in next effect)
          setVoiceIntegration(updatedVoiceIntegration);
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

  // Set model IDs based on model names after models are loaded (for edit mode)
  useEffect(() => {
    if (mode !== "edit") return;

    console.log("Model setting useEffect triggered");
    console.log("TTS Model Name:", voiceIntegration.selectedTTSModelName);
    console.log("TTS Models loaded:", configs.tts.models.length);
    console.log("TTS Models:", configs.tts.models);
    console.log("STT Model Name:", voiceIntegration.selectedSTTModelName);
    console.log("STT Models loaded:", configs.stt.models.length);
    console.log("STT Models:", configs.stt.models);
    console.log("LLM Model Name:", voiceIntegration.selectedLLMModelName);
    console.log("LLM Models loaded:", configs.llm.models.length);
    console.log("LLM Models:", configs.llm.models);

    // TTS
    if (
      voiceIntegration.selectedTTSModelName &&
      configs.tts.models.length > 0 &&
      !voiceIntegration.selectedTTSModel &&
      !hasSetTTSModel.current
    ) {
      console.log("Setting TTS model for:", voiceIntegration.selectedTTSModelName);
      const ttsModel = findModelByName(
        configs.tts.models,
        voiceIntegration.selectedTTSModelName
      );
      console.log("Found TTS model:", ttsModel);
      if (ttsModel) {
        setVoiceIntegration((prev: any) => ({
          ...prev,
          selectedTTSModel: ttsModel._id,
        }));
        hasSetTTSModel.current = true;
      }
    }

    // STT
    if (
      voiceIntegration.selectedSTTModelName &&
      configs.stt.models.length > 0 &&
      !voiceIntegration.selectedSTTModel &&
      !hasSetSTTModel.current
    ) {
      console.log("Setting STT model for:", voiceIntegration.selectedSTTModelName);
      const sttModel = findModelByName(
        configs.stt.models,
        voiceIntegration.selectedSTTModelName
      );
      console.log("Found STT model:", sttModel);
      if (sttModel) {
        setVoiceIntegration((prev: any) => ({
          ...prev,
          selectedSTTModel: sttModel._id,
        }));
        hasSetSTTModel.current = true;
      }
    }

    // LLM
    if (
      voiceIntegration.selectedLLMModelName &&
      configs.llm.models.length > 0 &&
      !voiceIntegration.selectedLLMModel &&
      !hasSetLLMModel.current
    ) {
      console.log("Setting LLM model for:", voiceIntegration.selectedLLMModelName);
      const llmModel = findModelByName(
        configs.llm.models,
        voiceIntegration.selectedLLMModelName
      );
      console.log("Found LLM model:", llmModel);
      if (llmModel) {
        setVoiceIntegration((prev: any) => ({
          ...prev,
          selectedLLMModel: llmModel._id,
        }));
        hasSetLLMModel.current = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    configs.tts.models,
    configs.stt.models,
    configs.llm.models,
    mode,
    voiceIntegration.selectedTTSModelName,
    voiceIntegration.selectedSTTModelName,
    voiceIntegration.selectedLLMModelName,
  ]);

  // Set voice ID based on voice name after voices are loaded (for edit mode)
  useEffect(() => {
    if (mode !== "edit") return;

    if (
      voiceIntegration.selectedTTSVoiceName &&
      configs.tts.voices.length > 0 &&
      !voiceIntegration.selectedTTSVoiceId
    ) {
      const voice = configs.tts.voices.find(
        (v: any) => v.voiceName === voiceIntegration.selectedTTSVoiceName
      );
      if (voice) {
        setVoiceIntegration((prev: any) => ({
          ...prev,
          selectedTTSVoiceId: voice.voiceId,
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    configs.tts.voices,
    mode,
    voiceIntegration.selectedTTSVoiceName,
  ]);

  // Set voice name based on voice ID after voices are loaded (for edit mode)
  useEffect(() => {
    if (mode !== "edit") return;

    if (
      voiceIntegration.selectedTTSVoiceId &&
      configs.tts.voices.length > 0 &&
      !voiceIntegration.selectedTTSVoiceName
    ) {
      const voice = configs.tts.voices.find(
        (v: any) => v.voiceId === voiceIntegration.selectedTTSVoiceId
      );
      if (voice) {
        setVoiceIntegration((prev: any) => ({
          ...prev,
          selectedTTSVoiceName: voice.voiceName,
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    configs.tts.voices,
    mode,
    voiceIntegration.selectedTTSVoiceId,
  ]);

  // FETCH TTS MODELS
  useEffect(() => {
    // Don't fetch if in edit mode and models are already loaded
    if (
      mode === "edit" &&
      configs.tts.models.length > 0 &&
      voiceIntegration.selectedTTSProvider
    ) {
      return;
    }
    const fetchTTSModels = async () => {
      try {
        let response;
        if (mode === "edit") {
          response = await apiRequest(
            endpoints.ttsModels.getModelsByName,
            "POST",
            { name: voiceIntegration.selectedTTSProviderName }
          );
        } else {
          response = await apiRequest(
            endpoints.ttsModels.getModels +
              "/" +
              voiceIntegration.selectedTTSProvider,
            "GET"
          );
        }
        setConfigs((prev) => ({
          ...prev,
          tts: {
            models: response?.data?.data,
            providers: prev.tts.providers,
            voices: prev.tts.voices,
          },
        }));
      } catch (error) {
        setConfigs((prev) => ({
          ...prev,
          tts: {
            models: [],
            providers: prev.tts.providers,
            voices: prev.tts.voices,
          },
        }));
      }
    };

    if (voiceIntegration.selectedTTSProvider) {
      fetchTTSModels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceIntegration.selectedTTSProvider, mode]);

  // FETCH STT MODELS
  useEffect(() => {
    if (
      mode === "edit" &&
      configs.stt.models.length > 0 &&
      voiceIntegration.selectedSTTProvider
    ) {
      return;
    }
    const fetchSTTModels = async () => {
      try {
        let response;
        if (mode === "edit") {
          response = await apiRequest(
            endpoints.sttModels.getModelsByName,
            "POST",
            { name: voiceIntegration.selectedSTTProviderName }
          );
        } else {
          response = await apiRequest(
            endpoints.sttModels.getModels +
              "/" +
              voiceIntegration.selectedSTTProvider,
            "GET"
          );
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceIntegration.selectedSTTProvider, mode]);

  // FETCH LLM MODELS
  useEffect(() => {
    if (
      mode === "edit" &&
      configs.llm.models.length > 0 &&
      voiceIntegration.selectedLLMProvider
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
            { name: voiceIntegration.selectedLLMProviderName }
          );
        } else {
          response = await apiRequest(
            endpoints.llmModels.getModels +
              "/" +
              voiceIntegration.selectedLLMProvider,
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
    if (voiceIntegration.selectedLLMProvider) {
      fetchLLMModels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceIntegration.selectedLLMProvider, mode]);

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
                                          onValueChange={async (value) => {
                        const selectedProvider = configs.tts.providers.find(
                          (provider: any) => provider._id === value
                        );

                        // Get voices from the selected provider
                        let voices = [];
                        if (selectedProvider) {
                          voices = selectedProvider.voiceIds || selectedProvider.voices || [];
                        }

                      // Clear current models and fetch new ones
                      setConfigs((prev) => ({
                        ...prev,
                        tts: {
                          ...prev.tts,
                          models: [],
                          voices,
                        },
                      }));

                        setVoiceIntegration({
                          ...voiceIntegration,
                          selectedTTSProvider: value,
                          selectedTTSProviderName: selectedProvider
                            ? selectedProvider.companyName
                            : null,
                          selectedTTSModel: null,
                          selectedTTSModelName: null,
                          selectedTTSVoiceId: null,
                          selectedTTSVoiceName: null,
                        });

                      // Fetch new models for the selected provider
                      if (value) {
                        try {
                          const response = await apiRequest(
                            endpoints.ttsModels.getModels + "/" + value,
                            "GET"
                          );
                          const newModels = response?.data?.data || [];
                          
                        setConfigs((prev) => ({
                          ...prev,
                          tts: {
                            ...prev.tts,
                              models: newModels,
                            voices,
                          },
                        }));
                        } catch (error) {
                          console.error("Error fetching TTS models:", error);
                          setConfigs((prev) => ({
                            ...prev,
                            tts: {
                              ...prev.tts,
                              models: [],
                              voices,
                            },
                          }));
                        }
                      }

                        hasSetTTSModel.current = false;
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
                  {/* Display the provider name from backend if available */}
                  {voiceIntegration.selectedTTSProviderName && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded border">
                      <strong>Selected Provider:</strong> {voiceIntegration.selectedTTSProviderName}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Model
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
                  {/* Display the model name from backend if available */}
                  {voiceIntegration.selectedTTSModelName && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded border">
                      <strong>Selected Model:</strong> {voiceIntegration.selectedTTSModelName}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Voice
                  </label>
                  <div className="flex items-center space-x-3">
                    <Select
                      value={voiceIntegration.selectedTTSVoiceId}
                      disabled={!voiceIntegration.selectedTTSProvider}
                      onValueChange={(value) => {
                        const selectedVoice = configs.tts.voices?.find(
                          (voice: any) => voice.voiceId === value
                        );
                        setVoiceIntegration({
                          ...voiceIntegration,
                          selectedTTSVoiceId: value,
                          selectedTTSVoiceName: selectedVoice
                            ? selectedVoice.voiceName
                            : null,
                        });
                      }}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a voice..." />
                      </SelectTrigger>
                      <SelectContent>
                        {configs.tts.voices?.map((voice: any) => (
                          <SelectItem key={voice.voiceId} value={voice.voiceId}>
                            {voice.voiceName}
                          </SelectItem>
                        )) || []}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Display the voice name from backend if available */}
                  {voiceIntegration.selectedTTSVoiceName && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded border">
                      <strong>Selected Voice:</strong> {voiceIntegration.selectedTTSVoiceName}
                    </div>
                  )}
                </div>
              </div>

              {/* <div className="flex flex-col items-center justify-center gap-2 flex-1 bg-gray-100 rounded-lg">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-200 rounded-full">
                  <Volume2 className="w-6 h-6 text-purple-700" />
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white h-8">
                  <Play className="w-4 h-4" />
                  Preview Voice
                </Button>
              </div> */}
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
                    onValueChange={async (value) => {
                      const selectedProvider = configs.stt.providers.find(
                        (provider: any) => provider._id === value
                      );

                      // Clear current models
                      setConfigs((prev) => ({
                        ...prev,
                        stt: {
                          ...prev.stt,
                          models: [],
                        },
                      }));

                      setVoiceIntegration({
                        ...voiceIntegration,
                        selectedSTTProvider: value,
                        selectedSTTProviderName: selectedProvider
                          ? selectedProvider.companyName
                          : null,
                        selectedSTTModel: null,
                        selectedSTTModelName: null,
                      });

                      // Fetch new models for the selected provider
                      if (value) {
                        try {
                          const response = await apiRequest(
                            endpoints.sttModels.getModels + "/" + value,
                            "GET"
                          );
                          const newModels = response?.data?.data || [];
                          
                          setConfigs((prev) => ({
                            ...prev,
                            stt: {
                              ...prev.stt,
                              models: newModels,
                            },
                          }));
                        } catch (error) {
                          console.error("Error fetching STT models:", error);
                          setConfigs((prev) => ({
                            ...prev,
                            stt: {
                              ...prev.stt,
                              models: [],
                            },
                          }));
                        }
                      }

                      hasSetSTTModel.current = false;
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
                {/* Display the provider name from backend if available */}
                {voiceIntegration.selectedSTTProviderName && (
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded border">
                    <strong>Selected Provider:</strong> {voiceIntegration.selectedSTTProviderName}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Model
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
                {/* Display the model name from backend if available */}
                {voiceIntegration.selectedSTTModelName && (
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded border">
                    <strong>Selected Model:</strong> {voiceIntegration.selectedSTTModelName}
                  </div>
                )}
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
                    onValueChange={async (value) => {
                      const selectedProvider = configs.llm.providers.find(
                        (provider: any) => provider._id === value
                      );

                      // Clear current models
                      setConfigs((prev) => ({
                        ...prev,
                        llm: {
                          ...prev.llm,
                          models: [],
                        },
                      }));

                      setVoiceIntegration({
                        ...voiceIntegration,
                        selectedLLMProvider: value,
                        selectedLLMProviderName: selectedProvider
                          ? selectedProvider.companyName
                          : null,
                        selectedLLMModel: null,
                        selectedLLMModelName: null,
                      });

                      // Fetch new models for the selected provider
                      if (value) {
                        try {
                          const response = await apiRequest(
                            endpoints.llmModels.getModels + "/" + value,
                            "GET"
                          );
                          const newModels = response?.data?.data || [];
                          
                          setConfigs((prev) => ({
                            ...prev,
                            llm: {
                              ...prev.llm,
                              models: newModels,
                            },
                          }));
                        } catch (error) {
                          console.error("Error fetching LLM models:", error);
                          setConfigs((prev) => ({
                            ...prev,
                            llm: {
                              ...prev.llm,
                              models: [],
                            },
                          }));
                        }
                      }

                      hasSetLLMModel.current = false;
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
                {voiceIntegration.selectedLLMProviderName && (
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded border">
                    <strong>Selected Provider:</strong> {voiceIntegration.selectedLLMProviderName}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Model
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
                {/* Display the model name from backend if available */}
                {voiceIntegration.selectedLLMModelName && (
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded border">
                    <strong>Selected Model:</strong> {voiceIntegration.selectedLLMModelName}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Background Noise Checkbox */}
        <Card className="bg-white shadow-lg shadow-gray-200 rounded-lg border-none">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Background Noise</h2>
              <span className="text-gray-600 text-sm">
                Enable background noise addition
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="backgroundNoise"
                checked={voiceIntegration.backgroundNoiseEnabled}
                onCheckedChange={(checked) => {
                  console.log("🔍 Background noise checkbox changed:", checked);
                  setVoiceIntegration((prev: any) => {
                    const updated = {
                      ...prev,
                      backgroundNoiseEnabled: checked,
                    };
                    console.log("🔍 Updated voice integration:", updated);
                    return updated;
                  });
                }}
              />
              <label htmlFor="backgroundNoise" className="text-sm text-gray-700">
                Enable background noise addition
              </label>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }
};

export default VoiceIntegration;
