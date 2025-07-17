'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/atoms/input';
import { Switch } from '@/components/ui/switch';
import Dashboard from '@/components/templates/dashboard';

export default function CreateInboundTrunkPage() {
  const [trunkName, setTrunkName] = useState('');
  const [trunkId, setTrunkId] = useState('');
  const [status, setStatus] = useState(true);
  const [primaryUri, setPrimaryUri] = useState('');
  const [fallbackUri, setFallbackUri] = useState('');
  const [primaryUris, setPrimaryUris] = useState<string[]>([]);
  const [fallbackUris, setFallbackUris] = useState<string[]>([]);
  const [messageUrl, setMessageUrl] = useState('');

  const handleAddPrimaryUri = () => {
    if (primaryUri && !primaryUris.includes(primaryUri)) {
      setPrimaryUris([...primaryUris, primaryUri]);
      setPrimaryUri('');
    }
  };
  const handleAddFallbackUri = () => {
    if (fallbackUri && !fallbackUris.includes(fallbackUri)) {
      setFallbackUris([...fallbackUris, fallbackUri]);
      setFallbackUri('');
    }
  };

  return (
    <Dashboard
      header={{
        title: 'Create Inbound Trunk',
        subtitle: { text: 'Add a new inbound SIP trunk' },
      }}
    >
      <div className="p-8 max-w-3xl mx-auto">
        {/* 1. Trunk Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 border">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">1. Trunk Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Trunk Name</label>
              <p className="text-xs text-gray-500 mb-1">Provide a friendly name to identify this inbound SIP trunk.</p>
              <Input value={trunkName} onChange={e => setTrunkName(e.target.value)} placeholder="My_Trunk" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Trunk ID</label>
              <Input value={trunkId} onChange={e => setTrunkId(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex-1">Trunk Status:</label>
              <Switch checked={status} onCheckedChange={setStatus} />
              <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${status ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-500'}`}>{status ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
        </div>

        {/* 2. Trunk Authentication */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 border">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">2. Trunk Authentication</h2>
          <p className="text-sm text-gray-600 mb-4">Provide a fully qualified domain name (FQDN) or IP address of your VoIP infrastructure to which Plivo should forward an incoming call.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-semibold text-gray-700">Primary URI</label>
                <button type="button" className="text-green-700 text-xs font-semibold hover:underline" onClick={handleAddPrimaryUri}>+ Add New URI</button>
              </div>
              <select className="w-full border rounded px-3 py-2" value={primaryUri} onChange={e => setPrimaryUri(e.target.value)}>
                <option value="">-----</option>
                {primaryUris.map((uri, idx) => <option key={idx} value={uri}>{uri}</option>)}
              </select>
              <p className="text-xs text-gray-500 mt-1">FQDN or IP address to which all the calls will be forwarded first.</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-semibold text-gray-700">Fallback URI</label>
                <button type="button" className="text-green-700 text-xs font-semibold hover:underline" onClick={handleAddFallbackUri}>+ Add New URI</button>
              </div>
              <select className="w-full border rounded px-3 py-2" value={fallbackUri} onChange={e => setFallbackUri(e.target.value)}>
                <option value="">-----</option>
                {fallbackUris.map((uri, idx) => <option key={idx} value={uri}>{uri}</option>)}
              </select>
              <p className="text-xs text-gray-500 mt-1">FQDN or IP address to which the calls will be forwarded if primary URI is unresponsive.</p>
            </div>
          </div>
        </div>

        {/* 3. Message URL Configuration (Optional) */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 border">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">3. Message URL Configuration (Optional)</h2>
          <p className="text-sm text-gray-600 mb-2">The message URL also supports PHLO application type. You can use the PHLO application here for SMS capability for the above Zentrunk number.</p>
          <Input value={messageUrl} onChange={e => setMessageUrl(e.target.value)} placeholder="Enter message URL (optional)" />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8">Create Trunk</Button>
        </div>
      </div>
    </Dashboard>
  );
} 