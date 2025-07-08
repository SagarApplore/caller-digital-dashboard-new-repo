import { Card, CardContent } from "@/components/organisms/card";
import React from "react";
import { Button } from "@/components/ui/button";

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconBg: string;
  connected: boolean;
}

const IntegrationCard = ({ integration }: { integration: Integration }) => (
  <Card className="bg-white hover:shadow-md transition-shadow">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className={`w-12 h-12 rounded-lg ${integration.iconBg} flex items-center justify-center text-xl`}
          >
            {integration.icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {integration.name}
            </h3>
            <p className="text-gray-600 text-sm">{integration.description}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {integration.connected ? (
            <>
              <span className="text-green-600 font-medium text-sm">
                Connected
              </span>
              <Button variant="outline" className="bg-transparent h-8">
                Configure
              </Button>
            </>
          ) : (
            <>
              <span className="text-gray-500 font-medium text-sm">
                Not connected
              </span>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white h-8">
                Connect
              </Button>
            </>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

const Integrations = ({
  crmIntegrations,
  communicationIntegrations,
}: {
  crmIntegrations: Integration[];
  communicationIntegrations: Integration[];
}) => {
  return (
    <>
      {/* CRM & Ticketing Systems */}
      <div className="bg-white p-4 rounded-lg space-y-6 shadow-lg shadow-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">CRM & Ticketing Systems</h1>
          <span className="text-gray-600">Connect customer data platforms</span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {crmIntegrations.map((integration) => (
            <IntegrationCard key={integration.id} integration={integration} />
          ))}
        </div>
      </div>

      {/* Communication Platforms */}
      <div className="bg-white p-4 rounded-lg space-y-6 shadow-lg shadow-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Communication Platforms</h1>
          <span className="text-gray-600">
            Connect messaging & voice services
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {communicationIntegrations.map((integration) => (
            <IntegrationCard key={integration.id} integration={integration} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Integrations;
