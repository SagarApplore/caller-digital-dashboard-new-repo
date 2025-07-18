"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./card";
import { Button } from "../ui/button";
import { Select, SelectItem, SelectContent, SelectTrigger } from "../ui/select";
import { ChevronDown, ChevronRight } from "lucide-react";
import apiRequest from "@/utils/api";
import endpoints from "@/lib/endpoints";
import { toast } from "react-toastify";
import ToolTable from "./ToolTable";

// Backend structure for api field
const apiMethodOptions = ["GET", "POST", "PUT", "DELETE"] as const;
const apiResponseTypeOptions = ["JSON", "XML"] as const;
const apiAuthTypeOptions = ["Basic"] as const;

const initialApi = {
  url: "",
  Headers: "",
  auth: "Basic", // CHANGED: auth is now a string, not an object
  username: "",
  password: "",
  Body: {},
  Method: "GET" as (typeof apiMethodOptions)[number],
  Response: {},
  ResponseType: "JSON" as (typeof apiResponseTypeOptions)[number],
  ResponseHeaders: "",
  ResponseBody: {},
};

const validateApi = (api: typeof initialApi) => {
  const errors: Record<string, string> = {};
  if (!api.url.trim()) errors.url = "URL is required";
  // Optionally, validate URL format
  try {
    if (api.url.trim()) new URL(api.url);
  } catch {
    errors.url = "Invalid URL format";
  }
  if (!api.Method || !apiMethodOptions.includes(api.Method as any)) {
    errors.Method = "Invalid method";
  }
  if (
    !api.ResponseType ||
    !apiResponseTypeOptions.includes(api.ResponseType as any)
  ) {
    errors.ResponseType = "Invalid response type";
  }
  if (!api.auth || !apiAuthTypeOptions.includes(api.auth as any)) {
    errors.auth = "Invalid auth type";
  }
  // Username and password are optional, but if auth is Basic, username is recommended
  // Validate Headers and ResponseHeaders as JSON if not empty
  if (api.Headers) {
    try {
      JSON.parse(api.Headers);
    } catch {
      errors.Headers = "Headers must be valid JSON";
    }
  }
  if (api.ResponseHeaders) {
    try {
      JSON.parse(api.ResponseHeaders);
    } catch {
      errors.ResponseHeaders = "Response Headers must be valid JSON";
    }
  }
  // Body and ResponseBody are objects, so no need to validate here (handled in input)
  return errors;
};

const FunctionTools = () => {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [existingTools, setExistingTools] = useState<
    {
      name: string;
      type: "API";
      prompt: string;
      api: {
        url: string;
        Headers: string;
        auth: string; // CHANGED: auth is now a string
        username: string;
        password: string;
        Body: Record<string, any>;
        Method: "GET" | "POST" | "PUT" | "DELETE";
        Response: Record<string, any>;
        ResponseType: string;
        ResponseHeaders: string;
        ResponseBody: Record<string, any>;
      };
    }[]
  >([]);
  const [newTool, setNewTool] = useState<{
    name: string;
    type: "API";
    prompt: string;
    api: typeof initialApi;
  }>({
    name: "",
    type: "API",
    prompt: "",
    api: {
      ...initialApi,
      auth: "Basic", // CHANGED: auth is now a string
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});
  const [jsonFields, setJsonFields] = useState<{ [key: string]: string }>({
  Body: "",
  ResponseBody: "",
});

  // Fetch tools from API on mount
  useEffect(() => {
    const fetchTools = async () => {
      try {
        const res = await apiRequest(endpoints.functionTools.getAll, "GET");
        setExistingTools(res.data?.data || []);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchTools();
  }, []);

  // Add tool handler (calls create API)
  const handleAddTool = async () => {
    // Validate top-level fields
    const newErrors: Record<string, string> = {};
    if (!newTool.name.trim()) newErrors.name = "Name is required";
    if (!newTool.type) newErrors.type = "Type is required";
    // Prompt is optional

    // Validate API fields if type is API
    let apiFieldErrors: Record<string, string> = {};
    if (newTool.type === "API") {
      apiFieldErrors = validateApi(newTool.api);
    }

    setErrors(newErrors);
    setApiErrors(apiFieldErrors);

    if (
      Object.keys(newErrors).length > 0 ||
      Object.keys(apiFieldErrors).length > 0
    ) {
      return;
    }

    try {
      // CHANGED: Ensure auth is a string before sending to backend
      const toolToSend = {
        ...newTool,
        api: {
          ...newTool.api,
          auth: newTool.api.auth, // already a string
        },
      };
      const res = await apiRequest(
        endpoints.functionTools.create,
        "POST",
        toolToSend
      );
      setExistingTools((prev) => [...prev, res.data?.data]);
      setNewTool({
        name: "",
        type: "API",
        prompt: "",
        api: {
          ...initialApi,
          auth: "Basic", // CHANGED: auth is now a string
        },
      });
      setErrors({});
      setApiErrors({});
      setIsCreateFormOpen(false); // Close the form after successful addition
      toast.success("Tool added successfully");
    } catch (err) {
      // Optionally handle error
    }
  };

  // Helper for updating nested api fields
  const updateApiField = (field: keyof typeof initialApi, value: any) => {
    setNewTool((prev) => ({
      ...prev,
      api: {
        ...prev.api,
        [field]: value,
      },
    }));
    setApiErrors((prev) => ({ ...prev, [field]: "" }));
  };

  useEffect(() => {
  setJsonFields({
    Body: newTool.api.Body
      ? JSON.stringify(newTool.api.Body, null, 2)
      : "",
    ResponseBody: newTool.api.ResponseBody
      ? JSON.stringify(newTool.api.ResponseBody, null, 2)
      : "",
  });
}, [newTool]);
  // Helper for updating Body and ResponseBody (as JSON)
  const handleJsonFieldChange = (
    field: "Body" | "ResponseBody",
    value: string
  ) => {
    try {

      const parsed = value ? JSON.parse(value) : {};
      updateApiField(field, parsed);
      setApiErrors((prev) => ({ ...prev, [field]: "" }));
    } catch {
      setApiErrors((prev) => ({
        ...prev,
        [field]: "Invalid JSON",
      }));
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4">
      <Card className="border-none p-4">
        <CardContent className="p-0 space-y-4">
          {/* Collapsible Create New Function Tool Section */}
          <div className="border rounded-lg bg-white shadow-sm">
            <button
              type="button"
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors rounded-lg"
              onClick={() => setIsCreateFormOpen(!isCreateFormOpen)}
            >
              <div>
                <h2 className="text-lg font-bold text-gray-900">Create new Function Tool</h2>
                {!isCreateFormOpen && (
                  <p className="text-sm text-gray-500 mt-1">Click to expand and add a new function tool</p>
                )}
              </div>
              {isCreateFormOpen ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            {isCreateFormOpen && (
              <div className="px-4 pb-4 border-t">
                <form
                  className="space-y-4 pt-4"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await handleAddTool();
                  }}
                >
                  <div className="flex gap-2 w-full">
                    <div className="flex-1">
                      <input
                        type="text"
                        className={`border rounded px-3 py-2 w-full ${
                          errors.name ? "border-red-500" : ""
                        }`}
                        placeholder="Enter function tool name"
                        value={newTool.name}
                        onChange={(e) =>
                          setNewTool({ ...newTool, name: e.target.value })
                        }
                        required
                      />
                      {errors.name && (
                        <div className="text-xs text-red-500 mt-1">{errors.name}</div>
                      )}
                    </div>
                    <Select
                      value={newTool.type}
                      onValueChange={(value) =>
                        setNewTool({
                          ...newTool,
                          type: value as "API",
                        })
                      }
                    >
                      <SelectTrigger
                        className={`border rounded px-3 py-2 w-fit ${
                          errors.type ? "border-red-500" : ""
                        }`}
                      >
                        {newTool.type}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="API">API</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Prompt</label>
                    <input
                      type="text"
                      className="border rounded px-3 py-2 w-full"
                      placeholder="Enter prompt"
                      value={newTool.prompt}
                      onChange={(e) =>
                        setNewTool({ ...newTool, prompt: e.target.value })
                      }
                    />
                  </div>
                  {newTool.type === "API" && (
                    <div className="space-y-3 border rounded p-3 bg-gray-50">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          API URL <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className={`border rounded px-3 py-2 w-full ${
                            apiErrors.url ? "border-red-500" : ""
                          }`}
                          placeholder="https://api.example.com/endpoint"
                          value={newTool.api.url}
                          onChange={(e) => updateApiField("url", e.target.value)}
                        />
                        {apiErrors.url && (
                          <div className="text-xs text-red-500 mt-1">
                            {apiErrors.url}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Headers (JSON)
                        </label>
                        <input
                          type="text"
                          className={`border rounded px-3 py-2 w-full font-mono ${
                            apiErrors.Headers ? "border-red-500" : ""
                          }`}
                          placeholder='e.g. {"Authorization": "Bearer ..."}'
                          value={newTool.api.Headers}
                          onChange={(e) => updateApiField("Headers", e.target.value)}
                        />
                        {apiErrors.Headers && (
                          <div className="text-xs text-red-500 mt-1">
                            {apiErrors.Headers}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Auth Type <span className="text-red-500">*</span>
                        </label>
                        <Select
                          value={newTool.api.auth}
                          onValueChange={(value) => updateApiField("auth", value)}
                        >
                          <SelectTrigger
                            className={`border rounded px-3 py-2 min-w-[100px] ${
                              apiErrors.auth ? "border-red-500" : ""
                            }`}
                          >
                            {newTool.api.auth}
                          </SelectTrigger>
                          <SelectContent>
                            {apiAuthTypeOptions.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {apiErrors.auth && (
                          <div className="text-xs text-red-500 mt-1">
                            {apiErrors.auth}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-sm font-medium mb-1">
                            Username
                          </label>
                          <input
                            type="text"
                            className="border rounded px-3 py-2 w-full"
                            value={newTool.api.username}
                            onChange={(e) =>
                              updateApiField("username", e.target.value)
                            }
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium mb-1">
                            Password
                          </label>
                          <input
                            type="password"
                            className="border rounded px-3 py-2 w-full"
                            value={newTool.api.password}
                            onChange={(e) =>
                              updateApiField("password", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Method <span className="text-red-500">*</span>
                        </label>
                        <select
                          className={`border rounded px-3 py-2 w-full ${
                            apiErrors.Method ? "border-red-500" : ""
                          }`}
                          value={newTool.api.Method}
                          onChange={(e) =>
                            updateApiField(
                              "Method",
                              e.target.value as (typeof apiMethodOptions)[number]
                            )
                          }
                        >
                          {apiMethodOptions.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                        {apiErrors.Method && (
                          <div className="text-xs text-red-500 mt-1">
                            {apiErrors.Method}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Body (JSON)
                        </label>
                        <textarea
                          className={`border rounded px-3 py-2 w-full font-mono ${
                            apiErrors.Body ? "border-red-500" : ""
                          }`}
                          rows={2}
                          placeholder='e.g. {"key": "value"}'
                          value={
                            newTool.api.Body && Object.keys(newTool.api.Body).length
                              ? JSON.stringify(newTool.api.Body, null, 2)
                              : ""
                          }
                          onChange={(e) =>
                            handleJsonFieldChange("Body", e.target.value)
                          }
                        />
                        {apiErrors.Body && (
                          <div className="text-xs text-red-500 mt-1">
                            {apiErrors.Body}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Response Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          className={`border rounded px-3 py-2 w-full ${
                            apiErrors.ResponseType ? "border-red-500" : ""
                          }`}
                          value={newTool.api.ResponseType}
                          onChange={(e) =>
                            updateApiField("ResponseType", e.target.value)
                          }
                        >
                          {apiResponseTypeOptions.map((rt) => (
                            <option key={rt} value={rt}>
                              {rt}
                            </option>
                          ))}
                        </select>
                        {apiErrors.ResponseType && (
                          <div className="text-xs text-red-500 mt-1">
                            {apiErrors.ResponseType}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Response Headers (JSON)
                        </label>
                        <input
                          type="text"
                          className={`border rounded px-3 py-2 w-full font-mono ${
                            apiErrors.ResponseHeaders ? "border-red-500" : ""
                          }`}
                          placeholder='e.g. {"Content-Type": "application/json"}'
                          value={newTool.api.ResponseHeaders}
                          onChange={(e) =>
                            updateApiField("ResponseHeaders", e.target.value)
                          }
                        />
                        {apiErrors.ResponseHeaders && (
                          <div className="text-xs text-red-500 mt-1">
                            {apiErrors.ResponseHeaders}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Response Body (JSON)
                        </label>
                        <textarea
                          className={`border rounded px-3 py-2 w-full font-mono ${
                            apiErrors.ResponseBody ? "border-red-500" : ""
                          }`}
                          rows={2}
                          placeholder='e.g. {"result": "value"}'
                          // value={
                          //   newTool.api.ResponseBody &&
                          //   Object.keys(newTool.api.ResponseBody).length
                          //     ? JSON.stringify(newTool.api.ResponseBody, null, 2)
                          //     : ""
                          // }
                          value={jsonFields.ResponseBody}
                           onChange={(e) => {
    const value = e.target.value;
    setJsonFields((prev) => ({ ...prev, ResponseBody: value }));

    try {
      const parsed = JSON.parse(value);
      updateApiField("ResponseBody", parsed);
      setApiErrors((prev) => ({ ...prev, ResponseBody: "" }));
    } catch {
      setApiErrors((prev) => ({
        ...prev,
        ResponseBody: "Invalid JSON",
      }));
    }
  }}
                          // onChange={(e) =>
                          //   handleJsonFieldChange("ResponseBody", e.target.value)
                          // }
                        />
                        {apiErrors.ResponseBody && (
                          <div className="text-xs text-red-500 mt-1">
                            {apiErrors.ResponseBody}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <Button type="submit" className="bg-purple-600 text-white">
                    Add
                  </Button>
                </form>
              </div>
            )}
          </div>

          {/* Existing Tools Section */}
          <div>
            <h3 className="text-lg font-bold mb-3">Existing Function Tools</h3>
            {existingTools.length === 0 ? (
              <div className="text-gray-500">No function tools added yet.</div>
            ) : (
            <ToolTable existingTools={existingTools} setExistingTools={setExistingTools} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FunctionTools;
