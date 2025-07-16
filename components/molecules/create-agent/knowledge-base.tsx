import React, { useState } from "react";
import { KnowledgeBaseItem } from "../knowledge-base";
import { Card, CardContent } from "@/components/organisms/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const KnowledgeBase = ({
  knowledgeBases,
  selectedKnowledgeBases,
  selectKnowledgeBase,
}: {
  knowledgeBases: KnowledgeBaseItem[];
  selectedKnowledgeBases: KnowledgeBaseItem[];
  selectKnowledgeBase: (knowledgeBases: KnowledgeBaseItem[]) => void;
}) => {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <div className="h-full overflow-y-auto">
      <Card className="border-none p-4 h-full">
        <CardContent className="p-0 space-y-4">
          <h2 className="text-lg font-bold">Select Knowledge Base</h2>
          {/* Multi-select Knowledge Base */}
          {knowledgeBases.length === 0 ? (
            <div className="p-4 flex flex-col items-center">
              <span className="text-gray-500 mb-2">
                No knowledge bases found.
              </span>
              <Button
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                onClick={() => router.push("/knowledge-base")}
              >
                <Plus className="w-4 h-4" />
                Create New Knowledge Base
              </Button>
            </div>
          ) : (
            <div>
              <div className="relative w-full">
                <button
                  type="button"
                  className="w-full flex justify-between items-center border rounded px-3 py-2 bg-white text-left focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onClick={() => {
                    // Toggle dropdown open/close
                    setDropdownOpen?.((open: boolean) => !open);
                  }}
                  tabIndex={0}
                  onBlur={() => {
                    // Optionally close dropdown on blur
                    setDropdownOpen?.(false);
                  }}
                >
                  <span>
                    {selectedKnowledgeBases.length === 0
                      ? "Select knowledge base(s)..."
                      : selectedKnowledgeBases.map((kb) => kb.name).join(", ")}
                  </span>
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {/* Dropdown */}
                <div
                  className={`absolute z-10 mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-y-auto ${
                    typeof window !== "undefined" && dropdownOpen
                      ? ""
                      : "hidden"
                  }`}
                  style={{
                    display:
                      typeof window !== "undefined" && dropdownOpen
                        ? "block"
                        : "none",
                  }}
                >
                  {knowledgeBases.map((item) => {
                    const isChecked = selectedKnowledgeBases.some(
                      (kb: KnowledgeBaseItem) => kb._id === item._id
                    );
                    return (
                      <label
                        key={item._id}
                        className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-purple-50 transition"
                        onMouseDown={(e) => e.preventDefault()} // Prevents dropdown from closing on click
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              selectKnowledgeBase(
                                selectedKnowledgeBases.filter(
                                  (kb) => kb._id !== item._id
                                )
                              );
                            } else {
                              selectKnowledgeBase([
                                ...selectedKnowledgeBases,
                                item,
                              ]);
                            }
                          }}
                          className="accent-purple-600"
                          tabIndex={-1}
                        />
                        <span>{item.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeBase;
