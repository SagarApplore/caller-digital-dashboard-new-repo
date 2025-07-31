import React, { useState } from "react";
import { Card, CardContent } from "@/components/organisms/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/atoms/input";
import { Plus, Edit, Trash2 } from "lucide-react";

interface EntityDataItem {
  key: string;
  value: any;
  id: string;
}

interface EntityDataProps {
  entityData: EntityDataItem[];
  onEntityDataChange: (entityData: EntityDataItem[]) => void;
}

const EntityData: React.FC<EntityDataProps> = ({
  entityData,
  onEntityDataChange,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState("");
  const [editingValue, setEditingValue] = useState("");

  const addEntityData = () => {
    const newItem: EntityDataItem = {
      key: "",
      value: "",
      id: Date.now().toString(),
    };
    console.log("EntityData - addEntityData called:", newItem);
    onEntityDataChange([...entityData, newItem]);
    // Automatically start editing the new item
    setEditingId(newItem.id);
    setEditingKey("");
    setEditingValue("");
  };

  const updateEntityData = (id: string, field: "key" | "value", value: any) => {
    const updatedData = entityData.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    console.log("EntityData - updateEntityData called:", { id, field, value, updatedData });
    onEntityDataChange(updatedData);
  };

  const deleteEntityData = (id: string) => {
    const filteredData = entityData.filter((item) => item.id !== id);
    onEntityDataChange(filteredData);
  };

  const startEditing = (item: EntityDataItem) => {
    setEditingId(item.id);
    setEditingKey(item.key);
    setEditingValue(typeof item.value === "object" ? JSON.stringify(item.value) : String(item.value));
  };

  const saveEditing = () => {
    console.log("EntityData - saveEditing called:", { editingId, editingKey, editingValue });
    if (editingId && editingKey.trim() !== "") { // Only save if key is not empty
      // Try to parse as JSON for complex values, otherwise use as string
      let parsedValue: any = editingValue;
      try {
        if (editingValue.trim().startsWith("{") || editingValue.trim().startsWith("[")) {
          parsedValue = JSON.parse(editingValue);
        } else if (editingValue.toLowerCase() === "true" || editingValue.toLowerCase() === "false") {
          parsedValue = editingValue.toLowerCase() === "true";
        } else if (!isNaN(Number(editingValue)) && editingValue.trim() !== "") {
          parsedValue = Number(editingValue);
        }
      } catch (e) {
        // If parsing fails, use as string
        parsedValue = editingValue;
      }

      console.log("EntityData - saving item:", { key: editingKey.trim(), value: parsedValue });
      
      // Update both key and value in a single operation
      const updatedData = entityData.map((item) =>
        item.id === editingId 
          ? { ...item, key: editingKey.trim(), value: parsedValue }
          : item
      );
      console.log("EntityData - updated data:", updatedData);
      onEntityDataChange(updatedData);
      
      setEditingId(null);
      setEditingKey("");
      setEditingValue("");
    } else if (editingId && editingKey.trim() === "") {
      // If key is empty, just cancel editing
      console.log("EntityData - cancelling due to empty key");
      cancelEditing();
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingKey("");
    setEditingValue("");
  };

  const getValueDisplay = (value: any) => {
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return String(value);
  };

  return (
    <div className="h-full overflow-y-auto">
      <Card className="border-none p-4 h-full">
        <CardContent className="p-0 space-y-6">
          {/* Entity Data Section */}
          <div>
            <h2 className="text-lg font-bold mb-4">Entity Data</h2>
            <div className="space-y-3">
              {entityData.length === 0 ? (
                <div className="text-gray-500 text-sm">
                  No entity data configured. Add key-value pairs to customize your agent.
                </div>
              ) : (
                entityData.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg bg-gray-50"
                  >
                    {editingId === item.id ? (
                      // Editing mode
                      <div className="flex-1 flex items-center space-x-3">
                        <Input
                          placeholder="e.g. CLIENT_KEY"
                          value={editingKey}
                          onChange={(e) => setEditingKey(e.target.value)}
                          className="flex-1"
                        />
                        <div className="flex-1 flex flex-col">
                          <Input
                            placeholder="Value"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            className="flex-1"
                          />
                          {editingKey.trim() === "" && (
                            <span className="text-xs text-red-500 mt-1">Key is required</span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={saveEditing}
                          disabled={editingKey.trim() === ""}
                          className={`${
                            editingKey.trim() === "" 
                              ? "bg-gray-400 cursor-not-allowed" 
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      // Display mode
                      <>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-700">
                            {item.key || "Key"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getValueDisplay(item.value)}
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditing(item)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteEntityData(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
              <Button
                onClick={addEntityData}
                variant="outline"
                className="w-full border-dashed border-gray-300 hover:border-gray-400"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Entity Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EntityData; 