"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/atoms/input";
import apiRequest from "@/utils/api";
import { toast } from "react-toastify";

export function AddConfigurationModal({ isOpen, onClose, clientId }: any) {
  const [configurations, setConfigurations] = useState<any[]>([]);
  const [selectedConfigs, setSelectedConfigs] = useState<Record<string, boolean>>({});
  const [editedValues, setEditedValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) fetchConfigurations();
  }, [isOpen]);

const fetchConfigurations = async () => {
  try {
    const res = await apiRequest(`/clientParticularConfigurations?clientId=${clientId}`, "GET");
    const configs = res.data || [];
    setConfigurations(configs);

    const initialToggles = {};
    configs.forEach((config) => {
      if (config.isSelected) initialToggles[config._id] = true;
    });
    setSelectedConfigs(initialToggles);
  } catch (err) {
    console.error("Failed to load configurations:", err);
  }
};


  const handleToggle = (id: string) => {
    setSelectedConfigs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleValueChange = (configId: string, key: string, value: any) => {
    setEditedValues((prev) => ({
      ...prev,
      [configId]: {
        ...prev[configId],
        [key]: value,
      },
    }));
  };

 const handleSubmit = async () => {
  try {
    setLoading(true);

    for (const config of configurations) {
      const isSelected = !!selectedConfigs[config._id];
      const values = editedValues[config._id] || config.currentValues || {};

      await apiRequest("/clientParticularConfigurations/update", "PUT", {
        clientId,
        configurationId: config._id,
        values,
        isActive: isSelected, // ✅ tell backend ON or OFF
      });
    }

    toast.success("Configurations updated successfully!");
    onClose();
  } catch (err) {
    console.error(err);
    toast.error("Failed to update configurations.");
  } finally {
    setLoading(false);
  }
};


  // Helper: Render inputs dynamically from settingsSchema
 const renderSettingsFields = (config: any) => {
  const schema = config.settingsSchema || {};
  const currentValues = {
    ...schema,                        // default values
    ...config.currentValues,          // client overrides
    ...editedValues[config._id],      // live user edits
  };

  return Object.entries(schema).map(([key, defaultValue]: any) => {
    const inputType =
      typeof defaultValue === "number"
        ? "number"
        : typeof defaultValue === "boolean"
        ? "checkbox"
        : "text";

    return (
      <div key={key} className="flex flex-col mb-2">
        <label className="text-xs font-medium text-gray-600 mb-1">{key}</label>
        {inputType === "checkbox" ? (
          <input
            type="checkbox"
            checked={!!currentValues[key]}
            onChange={(e) =>
              handleValueChange(config._id, key, e.target.checked)
            }
            className="h-4 w-4"
          />
        ) : (
          <Input
            type={inputType}
            value={currentValues[key] ?? ""}
            onChange={(e) =>
              handleValueChange(config._id, key, e.target.value)
            }
            className="h-8 text-sm"
          />
        )}
      </div>
    );
  });
};


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Configurations</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {configurations.map((config) => (
            <div
              key={config._id}
              className="border p-3 rounded-lg flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{config.name}</p>
                  <p className="text-xs text-gray-500">
                    {config.description || "No description"}
                  </p>
                </div>
                <Switch
                  checked={!!selectedConfigs[config._id]}
                  onCheckedChange={() => handleToggle(config._id)}
                   className={`${
    selectedConfigs[config._id]
      ? "data-[state=checked]:bg-green-500"
      : "data-[state=unchecked]:bg-gray-300"
  }`}
                />
              </div>

              {/* Editable Settings */}
              {selectedConfigs[config._id] && (
                <div className="mt-2 bg-gray-50 p-3 rounded">
                  {renderSettingsFields(config)}
                </div>
              )}
            </div>
          ))}
        </div>

        <DialogFooter className="pt-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white disabled:bg-green-300">
            {loading ? "Saving..." : "Save Configurations"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
