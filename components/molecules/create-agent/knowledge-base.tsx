import React from "react";
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
  selectedKnowledgeBase,
  selectKnowledgeBase,
}: {
  knowledgeBases: KnowledgeBaseItem[];
  selectedKnowledgeBase: KnowledgeBaseItem | null;
  selectKnowledgeBase: (knowledgeBase: KnowledgeBaseItem) => void;
}) => {
  const router = useRouter();
  return (
    <div className="h-full overflow-y-auto">
      <Card className="border-none p-4 h-full">
        <CardContent className="p-0 space-y-4">
          <h2 className="text-lg font-bold">Select Knowledge Base</h2>
          <Select
            value={selectedKnowledgeBase?._id || ""}
            onValueChange={(value) => {
              const selected = knowledgeBases.find((kb) => kb._id === value);
              if (selected) selectKnowledgeBase(selected);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Knowledge Base" />
            </SelectTrigger>
            <SelectContent>
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
                knowledgeBases.map((item) => (
                  <SelectItem key={item._id} value={item._id}>
                    {item.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeBase;
