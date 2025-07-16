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
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  } else {
    console.log(voiceIntegration);

    return (
      <>
        {/* Text-to-Speech Voice */}
        <Card className="bg-white shadow-lg shadow-gray-200 rounded-lg border-none">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Text-to-Speech Voice</h2>
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
                      value={voiceIntegration.voiceProvider}
                      onValueChange={(value) =>
                        setVoiceIntegration({
                          ...voiceIntegration,
                          voiceProvider: value,
                        })
                      }
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
                      value={voiceIntegration.voiceModel}
                      disabled
                      onValueChange={(value) =>
                        setVoiceIntegration({
                          ...voiceIntegration,
                          voiceModel: value,
                        })
                      }
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

        {/* Speech-to-Text Voice */}
        <Card className="bg-white shadow-lg shadow-gray-200 rounded-lg border-none">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Text-to-Speech Voice</h2>
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
                      value={voiceIntegration.voiceProvider}
                      onValueChange={(value) =>
                        setVoiceIntegration({
                          ...voiceIntegration,
                          voiceProvider: value,
                        })
                      }
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
                      value={voiceIntegration.voiceModel}
                      disabled
                      onValueChange={(value) =>
                        setVoiceIntegration({
                          ...voiceIntegration,
                          voiceModel: value,
                        })
                      }
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

        {/* Text-to-Speech Voice */}
        <Card className="bg-white shadow-lg shadow-gray-200 rounded-lg border-none">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Text-to-Speech Voice</h2>
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
                      value={voiceIntegration.voiceProvider}
                      onValueChange={(value) =>
                        setVoiceIntegration({
                          ...voiceIntegration,
                          voiceProvider: value,
                        })
                      }
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
                      value={voiceIntegration.voiceModel}
                      disabled
                      onValueChange={(value) =>
                        setVoiceIntegration({
                          ...voiceIntegration,
                          voiceModel: value,
                        })
                      }
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
      </>
    );
  }
};

export default VoiceIntegration;
