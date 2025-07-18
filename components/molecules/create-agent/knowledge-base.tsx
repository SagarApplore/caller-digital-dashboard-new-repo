import React, { useState, useEffect } from "react";
import { KnowledgeBaseItem } from "../knowledge-base";
import { IFunctionTool } from "@/types/common";
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
import apiRequest from "@/utils/api";
import endpoints from "@/lib/endpoints";

const KnowledgeBase = ({
  knowledgeBases,
  selectedKnowledgeBases,
  selectKnowledgeBase,
  selectedFunctionTools,
  selectFunctionTools,
}: {
  knowledgeBases: KnowledgeBaseItem[];
  selectedKnowledgeBases: KnowledgeBaseItem[];
  selectKnowledgeBase: (knowledgeBases: KnowledgeBaseItem[]) => void;
  selectedFunctionTools: IFunctionTool[];
  selectFunctionTools: (functionTools: IFunctionTool[]) => void;
}) => {
  const router = useRouter();
  const [knowledgeBaseDropdownOpen, setKnowledgeBaseDropdownOpen] =
    useState(false);
  const [functionToolsDropdownOpen, setFunctionToolsDropdownOpen] =
    useState(false);
  const [functionTools, setFunctionTools] = useState<IFunctionTool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFunctionTools = async () => {
      setLoading(true);
      try {
        const response = await apiRequest(
          endpoints.functionTools.getAll,
          "GET"
        );
        const tools = response?.data?.data || [];
        setFunctionTools(tools);
      } catch (error) {
        console.error("Error fetching function tools:", error);
      }
      setLoading(false);
    };
    fetchFunctionTools();
  }, []);

  return (
    <div className="h-full overflow-y-auto">
      <Card className="border-none p-4 h-full">
        <CardContent className="p-0 space-y-6">
          {/* Knowledge Base Section */}
          <div>
            <h2 className="text-lg font-bold mb-4">Select Knowledge Base(s)</h2>
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
                      setKnowledgeBaseDropdownOpen((open) => !open);
                    }}
                    tabIndex={0}
                    onBlur={() => {
                      setKnowledgeBaseDropdownOpen(false);
                    }}
                  >
                    <span>
                      {selectedKnowledgeBases.length === 0
                        ? "Select knowledge base(s)..."
                        : selectedKnowledgeBases
                            .map((kb) => kb.name)
                            .join(", ")}
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
                  {/* Knowledge Base Dropdown */}
                  <div
                    className={`absolute z-10 mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-y-auto ${
                      knowledgeBaseDropdownOpen ? "" : "hidden"
                    }`}
                    style={{
                      display: knowledgeBaseDropdownOpen ? "block" : "none",
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
                          onMouseDown={(e) => e.preventDefault()}
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
          </div>

          {/* Function Tools Section */}
          <div>
            <h2 className="text-lg font-bold mb-4">Select Function Tools</h2>
            {loading ? (
              <div className="p-4 flex flex-col items-center">
                <span className="text-gray-500">Loading function tools...</span>
              </div>
            ) : functionTools.length === 0 ? (
              <div className="p-4 flex flex-col items-center">
                <span className="text-gray-500 mb-2">
                  No function tools found.
                </span>
                {/* <Button
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                  onClick={() => router.push("/function-tools")}
                >
                  <Plus className="w-4 h-4" />
                  Create New Function Tool
                </Button> */}
              </div>
            ) : (
              <div>
                <div className="relative w-full">
                  <button
                    type="button"
                    className="w-full flex justify-between items-center border rounded px-3 py-2 bg-white text-left focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onClick={() => {
                      setFunctionToolsDropdownOpen((open) => !open);
                    }}
                    tabIndex={0}
                    onBlur={() => {
                      setFunctionToolsDropdownOpen(false);
                    }}
                  >
                    <span>
                      {selectedFunctionTools.length === 0
                        ? "Select function tools..."
                        : selectedFunctionTools
                            .map((tool) => tool.name)
                            .join(", ")}
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
                  {/* Function Tools Dropdown */}
                  <div
                    className={`absolute z-10 mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-y-auto ${
                      functionToolsDropdownOpen ? "" : "hidden"
                    }`}
                    style={{
                      display: functionToolsDropdownOpen ? "block" : "none",
                    }}
                  >
                    {functionTools.map((item) => {
                      const isChecked = selectedFunctionTools.some(
                        (tool: IFunctionTool) => tool._id === item._id
                      );
                      return (
                        <label
                          key={item._id}
                          className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-purple-50 transition"
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                selectFunctionTools(
                                  selectedFunctionTools.filter(
                                    (tool) => tool._id !== item._id
                                  )
                                );
                              } else {
                                selectFunctionTools([
                                  ...selectedFunctionTools,
                                  item,
                                ]);
                              }
                            }}
                            className="accent-purple-600"
                            tabIndex={-1}
                          />
                          <span>{item.name}</span>
                          <span className="text-xs text-gray-500 ml-auto">
                            ({item.type})
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeBase;
