import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { Wand, Lightbulb, Play, Download, History } from "lucide-react";

export interface Language {
  id: number;
  name: string;
  selected: boolean;
}

export interface Tone {
  id: number;
  name: string;
  selected: boolean;
}

export const PersonaAndBehavior = ({
  languages,
  handleLanguageClick,
  tones,
  handleToneClick,
  voicePrompt,
  emailPrompt,
  chatPrompt,
  allowedCharacters,
  agentName,
  setVoicePrompt,
  setEmailPrompt,
  setChatPrompt,
  setAgentName,
}: {
  languages: Language[];
  handleLanguageClick: (id: number) => void;
  tones: Tone[];
  handleToneClick: (id: number) => void;
  voicePrompt: string;
  emailPrompt: string;
  chatPrompt: string;
  allowedCharacters: number;
  agentName: string;
  setVoicePrompt: (prompt: string) => void;
  setEmailPrompt: (prompt: string) => void;
  setChatPrompt: (prompt: string) => void;
  setAgentName: (name: string) => void;
}) => {
  return (
    <>
      {/* Basic Information */}
      <div className="p-4 bg-white rounded-lg w-full flex flex-col gap-4 shadow-lg shadow-gray-200">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <div className="flex gap-4 w-full">
          <div className="flex flex-col gap-2 flex-1">
            <Label htmlFor="name" className="text-sm font-medium">
              Assistant Name
            </Label>
            <Input
              id="name"
              placeholder="Enter name"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
            />
          </div>
          {/* <div className="flex flex-col gap-2 flex-1">
            <Label htmlFor="role" className="text-sm font-medium">
              Role
            </Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="customer-service">
                  Customer Service
                </SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="technical-support">
                  Technical Support
                </SelectItem>
              </SelectContent>
            </Select>
          </div> */}
        </div>

        <div className="flex gap-4 w-full">
          {/* <div className="flex flex-col gap-2 flex-1">
            <Label htmlFor="description" className="text-sm font-medium">
              Languages
            </Label>
            <ul className="flex gap-2 flex-wrap">
              {languages.map((language) => (
                <li
                  onClick={() => handleLanguageClick(language.id)}
                  className={`text-gray-500 text-sm border border-gray-200 px-2 py-1 rounded-full cursor-pointer ${
                    language.selected
                      ? "bg-purple-200 text-purple-700 font-semibold"
                      : ""
                  }`}
                  key={language.id}
                >
                  {language.name}
                </li>
              ))}
            </ul>
          </div> */}
          <div className="flex flex-col gap-2 flex-1">
            <Label htmlFor="description" className="text-sm font-medium">
              Languages
            </Label>
            <ul className="flex gap-2 flex-wrap">
              {languages.map((language) => (
                <li
                  onClick={() => handleLanguageClick(language.id)}
                  className={`text-gray-500 text-sm border border-gray-200 px-2 py-1 rounded-full cursor-pointer ${
                    language.selected
                      ? "bg-purple-200 text-purple-700 font-semibold"
                      : ""
                  }`}
                  key={language.id}
                >
                  {language.name}
                </li>
              ))}
            </ul>
          


          </div>
          <div className="flex flex-col gap-2 flex-1">
            <Label htmlFor="timezone" className="text-sm font-medium">
              Timezone
            </Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC-5">
                  UTC-5 (Eastern Standard Time)
                </SelectItem>
                <SelectItem value="UTC-7">
                  UTC-7 (Pacific Standard Time)
                </SelectItem>
                <SelectItem value="UTC-6">
                  UTC-6 (Central Standard Time)
                </SelectItem>
                <SelectItem value="UTC-8">
                  UTC-8 (Pacific Standard Time)
                </SelectItem>
                <SelectItem value="UTC-9">
                  UTC-9 (Hawaii Standard Time)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Personality & Tone */}
      <div className="p-4 bg-white rounded-lg w-full flex flex-col gap-4 shadow-lg shadow-gray-200">
        <h3 className="text-lg font-semibold">Personality & Tone</h3>
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="tone" className="text-sm font-medium">
              Tone
            </Label>
            <ul className="flex gap-2 flex-wrap" id="tones">
              {tones.map((tone) => (
                <li
                  key={tone.id}
                  className={`text-gray-500 text-sm border border-gray-200 px-4 py-2 rounded-lg cursor-pointer ${
                    tone.selected
                      ? "bg-purple-200 text-purple-700 font-semibold"
                      : ""
                  }`}
                  onClick={() => handleToneClick(tone.id)}
                >
                  {tone.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <h4 className="text-sm font-medium">Operating Hours</h4>
            <div className="flex gap-4 w-full">
              <div className="flex flex-col gap-1 flex-1">
                <Label
                  htmlFor="operating-hours"
                  className="text-xs font-medium text-gray-500"
                >
                  Start Time
                </Label>
                <Input id="operating-hours" type="time" />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <Label
                  htmlFor="operating-hours"
                  className="text-xs font-medium text-gray-500"
                >
                  End Time
                </Label>
                <Input id="operating-hours" type="time" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Prompts */}
      <div className="p-4 bg-white rounded-lg w-full flex flex-col gap-6 shadow-lg shadow-gray-200">
        <h3 className="text-lg font-semibold">System Prompts</h3>

        {/* Voice Prompt */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="voice-instructions" className="text-sm font-medium">
              Voice Instructions
            </Label>
            <span className="text-xs text-gray-500">
              Characters: {voicePrompt.length}/{allowedCharacters}
            </span>
          </div>
          <Textarea
            id="voice-instructions"
            placeholder="Enter voice-specific instructions for phone calls..."
            className="h-32"
            value={voicePrompt}
            onChange={(e) => setVoicePrompt(e.target.value)}
          />
        </div>

        {/* Email Prompt */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="email-instructions" className="text-sm font-medium">
              Email Instructions
            </Label>
            <span className="text-xs text-gray-500">
              Characters: {emailPrompt.length}/{allowedCharacters}
            </span>
          </div>
          <Textarea
            id="email-instructions"
            placeholder="Enter email-specific instructions for written communication..."
            className="h-32"
            value={emailPrompt}
            onChange={(e) => setEmailPrompt(e.target.value)}
          />
        </div>

        {/* Chat Prompt */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="chat-instructions" className="text-sm font-medium">
              Chat Instructions
            </Label>
            <span className="text-xs text-gray-500">
              Characters: {chatPrompt.length}/{allowedCharacters}
            </span>
          </div>
          <Textarea
            id="chat-instructions"
            placeholder="Enter chat-specific instructions for messaging platforms..."
            className="h-32"
            value={chatPrompt}
            onChange={(e) => setChatPrompt(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between px-2 bg-yellow-50 rounded-lg border border-yellow-400">
          <div className="flex items-center gap-2">
            <Lightbulb className="size-4 text-yellow-700" />
            <span className="text-xs text-yellow-800">
              Use specific examples to guide the assistant
            </span>
          </div>
          <Button className=" text-yellow-500 bg-transparent hover:bg-transparent text-xs font-semibold">
            View Examples
          </Button>
        </div>

        <div className="flex gap-2">
          <Button className="flex items-center gap-2 bg-purple-600 border border-purple-600 text-white px-2 h-8 rounded-lg text-sm font-semibold hover:bg-purple-700">
            <Play className="h-4 w-4" />
            Test Prompt
          </Button>
          <Button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-2 h-8 rounded-lg text-sm font-semibold hover:bg-gray-100">
            <History className="h-4 w-4" />
            Version History
          </Button>
          <Button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-2 h-8 rounded-lg text-sm font-semibold hover:bg-gray-100">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
    </>
  );
};
