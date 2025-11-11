"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/organisms/card";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import apiRequest from "@/utils/api";

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const res = await apiRequest("/integrations","GET");
     
      
      setIntegrations(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load integrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Your Integrations</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchIntegrations}
          disabled={loading}
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <div className="grid gap-4">
        {integrations.map((intg) => (
          <Card key={intg._id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span className="capitalize">{intg.sourceType}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(intg.apiKey)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>
                <strong>API Key:</strong> {intg.apiKey}
              </p>
              <p>
                <strong>Webhook URL:</strong>{" "}
                <code className="text-xs break-all bg-muted p-1 rounded">
                  {`${
                    process.env.NEXT_PUBLIC_REACT_APP_BASE_URL ||
                    "https://yourapi.com"
                  }/api/v1/leads/import?api_key=${intg.apiKey}`}
                </code>
              </p>
              <p className="text-muted-foreground">
                Created: {new Date(intg.createdAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}

        {!loading && integrations.length === 0 && (
          <p className="text-center text-muted-foreground">
            No integrations yet. Click “Add Integration” above to create one.
          </p>
        )}
      </div>
    </div>
  );
}
