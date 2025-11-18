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
}: {
  languages: Language[];
  handleLanguageClick: (id: number) => void;
  tones: Tone[];
  handleToneClick: (id: number) => void;
  agentName: string;
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
              maxLength={32}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                Maximum 32 characters
              </span>
              <span className="text-xs text-gray-500">
                {agentName.length}/32
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 w-full">
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
        </div>
      </div>
    </>
  );
};
