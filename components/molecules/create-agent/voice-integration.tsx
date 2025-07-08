import React from "react";
import { Card, CardContent } from "@/components/organisms/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Play, Speaker, Volume, Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const ttsModels = [
  {
    id: "elevenlabs-turbo",
    name: "ElevenLabs Turbo v2",
    description: "Ultra-low latency, natural voice",
    badge: "Recommended",
    badgeColor: "bg-green-100 text-green-800 border-green-300",
  },
  {
    id: "playht",
    name: "PlayHT 2.0",
    description: "High quality, emotional range",
    badge: null,
    badgeColor: "",
  },
  {
    id: "azure-neural",
    name: "Azure Neural Voice",
    description: "Enterprise-grade, multilingual",
    badge: null,
    badgeColor: "",
  },
  {
    id: "ux-pilot-tts",
    name: "UX Pilot AI TTS",
    description: "Cost-effective, reliable",
    badge: null,
    badgeColor: "",
  },
];

const sttModels = [
  {
    id: "deepgram-nova",
    name: "Deepgram Nova-2",
    description: "Highest accuracy, real-time",
    badge: "Best",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
  },
  {
    id: "ux-pilot-whisper",
    name: "UX Pilot AI Whisper",
    description: "Robust, noise-resistant",
    badge: null,
    badgeColor: "",
  },
  {
    id: "azure-speech",
    name: "Azure Speech Services",
    description: "Enterprise integration",
    badge: null,
    badgeColor: "",
  },
  {
    id: "google-speech",
    name: "Google Speech-to-Text",
    description: "Wide language support",
    badge: null,
    badgeColor: "",
  },
];

const VoiceIntegration = ({
  voiceIntegration,
  setVoiceIntegration,
}: {
  voiceIntegration: any;
  setVoiceIntegration: (voiceIntegration: any) => void;
}) => {
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
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                      <SelectItem value="playht">PlayHT</SelectItem>
                      <SelectItem value="azure">Azure</SelectItem>
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
                    onValueChange={(value) =>
                      setVoiceIntegration({
                        ...voiceIntegration,
                        voiceModel: value,
                      })
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sophia-professional">
                        Sophia - Professional Female
                      </SelectItem>
                      <SelectItem value="alex-casual">
                        Alex - Casual Male
                      </SelectItem>
                      <SelectItem value="emma-friendly">
                        Emma - Friendly Female
                      </SelectItem>
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

      {/* Voice Parameters */}
      <Card className="bg-white shadow-lg shadow-gray-200 rounded-lg border-none">
        <CardContent className="p-4 space-y-4">
          <h2 className="text-lg font-semibold">Voice Parameters</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Speaking Speed
                </label>
                <div className="px-3">
                  <Slider
                    value={voiceIntegration.speakingSpeed}
                    onValueChange={(value) =>
                      setVoiceIntegration({
                        ...voiceIntegration,
                        speakingSpeed: value,
                      })
                    }
                    max={2}
                    min={0.5}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Slow (0.5x)</span>
                    <span>Normal (1x)</span>
                    <span>Fast (2x)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Pitch
                </label>
                <div className="px-3">
                  <Slider
                    value={voiceIntegration.pitch}
                    onValueChange={(value) =>
                      setVoiceIntegration({
                        ...voiceIntegration,
                        pitch: value,
                      })
                    }
                    max={2}
                    min={0.5}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Lower</span>
                    <span>Normal</span>
                    <span>Higher</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Emotion
                </label>
                <Select
                  value={voiceIntegration.emotion}
                  onValueChange={(value) =>
                    setVoiceIntegration({
                      ...voiceIntegration,
                      emotion: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="happy">Happy</SelectItem>
                    <SelectItem value="sad">Sad</SelectItem>
                    <SelectItem value="excited">Excited</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Language
                </label>
                <Select
                  value={voiceIntegration.language}
                  onValueChange={(value) =>
                    setVoiceIntegration({
                      ...voiceIntegration,
                      language: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-us">English (US)</SelectItem>
                    <SelectItem value="en-gb">English (UK)</SelectItem>
                    <SelectItem value="es-es">Spanish (Spain)</SelectItem>
                    <SelectItem value="fr-fr">French (France)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TTS & ASR Models */}
      <Card className="bg-white shadow-lg shadow-gray-200 rounded-lg border-none">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-6">TTS & ASR Models</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Text-to-Speech Models */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Volume2 className="w-5 h-5 text-purple-600" />
                <h3 className="font-medium text-gray-900">
                  Text-to-Speech Models
                </h3>
              </div>
              <div className="space-y-3">
                {ttsModels.map((model) => (
                  <div key={model.id} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id={model.id}
                      name="tts-model"
                      checked={voiceIntegration.selectedTTS === model.id}
                      onChange={() =>
                        setVoiceIntegration({
                          ...voiceIntegration,
                          selectedTTS: model.id,
                        })
                      }
                      className="w-4 h-4 text-purple-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <label
                          htmlFor={model.id}
                          className="font-medium text-gray-900 cursor-pointer"
                        >
                          {model.name}
                        </label>
                        {model.badge && (
                          <Badge className={model.badgeColor}>
                            {model.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {model.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Speech-to-Text Models */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-600 rounded"></div>
                </div>
                <h3 className="font-medium text-gray-900">
                  Speech-to-Text Models
                </h3>
              </div>
              <div className="space-y-3">
                {sttModels.map((model) => (
                  <div key={model.id} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id={model.id}
                      name="stt-model"
                      checked={voiceIntegration.selectedSTT === model.id}
                      onChange={() =>
                        setVoiceIntegration({
                          ...voiceIntegration,
                          selectedSTT: model.id,
                        })
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <label
                          htmlFor={model.id}
                          className="font-medium text-gray-900 cursor-pointer"
                        >
                          {model.name}
                        </label>
                        {model.badge && (
                          <Badge className={model.badgeColor}>
                            {model.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {model.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">~200ms</div>
              <div className="text-sm text-gray-600">Avg. Latency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">99.2%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversation Settings */}
      <Card className="bg-white shadow-lg shadow-gray-200 rounded-lg border-none">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-6">Conversation Settings</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Interrupt Sensitivity
              </label>
              <div className="px-3">
                <Slider
                  value={voiceIntegration.interruptSensitivity}
                  onValueChange={(value) =>
                    setVoiceIntegration({
                      ...voiceIntegration,
                      interruptSensitivity: value,
                    })
                  }
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                How easily the AI can be interrupted by user speech
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Response Delay
              </label>
              <div className="px-3">
                <Slider
                  value={voiceIntegration.responseDelay}
                  onValueChange={(value) =>
                    setVoiceIntegration({
                      ...voiceIntegration,
                      responseDelay: value,
                    })
                  }
                  max={2000}
                  min={0}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0ms</span>
                  <span>1000ms</span>
                  <span>2000ms</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Pause before AI responds to user input
              </p>
            </div>
          </div>

          <div className="space-y-4 mt-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Enable DTMF Input</h3>
                <p className="text-sm text-gray-600">
                  Allow users to input numbers using keypad
                </p>
              </div>
              <Switch
                checked={voiceIntegration.enableDTMF}
                onCheckedChange={(value) =>
                  setVoiceIntegration({
                    ...voiceIntegration,
                    enableDTMF: value,
                  })
                }
                className="data-[state=checked]:bg-purple-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">
                  Background Noise Suppression
                </h3>
                <p className="text-sm text-gray-600">
                  Filter out background noise during calls
                </p>
              </div>
              <Switch
                checked={voiceIntegration.backgroundNoiseSuppression}
                onCheckedChange={(value) =>
                  setVoiceIntegration({
                    ...voiceIntegration,
                    backgroundNoiseSuppression: value,
                  })
                }
                className="data-[state=checked]:bg-purple-600"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default VoiceIntegration;
