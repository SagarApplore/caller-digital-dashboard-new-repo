import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Textarea } from "@/components/ui/textarea";

export interface Language {
  id: number;
  key: string;
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
  agentName,
  setAgentName,
  summaryPrompt,
  handleSummaryPrompt,
  successEvaluationPrompt,
  handleSuccessEvaluationPrompt,
  failureEvaluationPrompt,
  hanldeFailureEvaluationPrompt,
}: {
  languages: Language[];
  handleLanguageClick: (id: number) => void;
  tones: Tone[];
  handleToneClick: (id: number) => void;
  agentName: string;
  setAgentName: (name: string) => void;
  summaryPrompt: string;
  handleSummaryPrompt: (name: string) => void;
  successEvaluationPrompt: string;
  handleSuccessEvaluationPrompt: (name: string) => void;
  failureEvaluationPrompt: string;
  hanldeFailureEvaluationPrompt: (name: string) => void;
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
          {/* <div className="flex flex-col gap-2 flex-1">
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
          </div> */}
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
          {/* <div className="flex flex-col gap-2 w-full">
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
          </div> */}
        </div>
      </div>

      {/* Extra prompts */}
      <div className="p-4 bg-white rounded-lg w-full flex flex-col gap-4 shadow-lg shadow-gray-200">
        <h3 className="text-lg font-semibold">Extra Prompts</h3>
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="tone" className="text-sm font-medium">
              Summary Prompt
            </Label>
            <Textarea
              className="h-32"
              placeholder="Enter summary prompt"
              value={summaryPrompt}
              onChange={(e: any) => handleSummaryPrompt(e.currentTarget.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="tone" className="text-sm font-medium">
              Success Evaluation Prompt
            </Label>
            <Textarea
              className="h-32"
              placeholder="Enter Success Evaluation Prompt"
              value={successEvaluationPrompt}
              onChange={(e: any) =>
                handleSuccessEvaluationPrompt(e.currentTarget.value)
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="tone" className="text-sm font-medium">
              Failure Evaluation Prompt
            </Label>
            <Textarea
              className="h-32"
              placeholder="Failure Evaluation Prompt"
              value={failureEvaluationPrompt}
              onChange={(e: any) =>
                hanldeFailureEvaluationPrompt(e.currentTarget.value)
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};
