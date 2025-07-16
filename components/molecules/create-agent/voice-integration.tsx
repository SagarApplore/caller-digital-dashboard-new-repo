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
}: {
  voiceIntegration: any;
  setVoiceIntegration: (voiceIntegration: any) => void;
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

  useEffect(() => {
    const getData = async () =>
      Promise.all([
        new Promise((resolve) => {
          apiRequest(endpoints.ttsModels.getProviders, "GET").then((res) => {
            resolve(res.data?.data ?? []);
          });
        }),
        new Promise((resolve) => {
          apiRequest(endpoints.sttModels.getProviders, "GET").then((res) => {
            resolve(res.data?.data ?? []);
          });
        }),
        new Promise((resolve) => {
          apiRequest(endpoints.llmModels.getProviders, "GET").then((res) => {
            resolve(res.data?.data ?? []);
          });
        }),
      ]).then((results) => {
        setConfigs({
          tts: {
            providers: results[0] as any,
            models: [],
          },
          stt: {
            providers: results[1] as any,
            models: [],
          },
          llm: {
            providers: results[2] as any,
            models: [],
          },
        });
        setLoading(false);
      });
    getData();
  }, []);

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
