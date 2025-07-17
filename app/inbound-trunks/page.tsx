import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import React from 'react';
import Dashboard from '@/components/templates/dashboard';

const trunks = [
  {
    name: 'for_jk_poc',
    id: '20938939400699000',
    primaryUri: 'for_JK_pluto_live',
    fallbackUri: '',
    numbers: ['+91 80 3573 8518'],
    status: 'Enabled',
  },
  {
    name: 'indoorwaala',
    id: '72621297183844913',
    primaryUri: 'for_indoorwaala',
    fallbackUri: '',
    numbers: ['+91 80 3574 3300'],
    status: 'Enabled',
  },
  {
    name: 'poc_test',
    id: '22426174133602436',
    primaryUri: 'for_indoorwaala',
    fallbackUri: '',
    numbers: ['+91 80 3573 8726', '+91 80 3573 8002'],
    status: 'Enabled',
  },
  {
    name: 'reach_mobile',
    id: '18519403542834197',
    primaryUri: 'test_sanyam',
    fallbackUri: '',
    numbers: ['+91 80 3573 8001'],
    status: 'Enabled',
  },
];

export default function InboundTrunksPage() {
  return (
    <Dashboard
      header={{
        title: 'Inbound Trunks',
        subtitle: { text: 'Manage your inbound SIP trunks' },
      }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold">Inbound Trunks</h1>
          <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow">
            Create New Inbound Trunk
          </Button>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-lg">{trunks.length} Trunks</span>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 font-medium hover:underline flex items-center gap-1"
          >
            See Configuration Guides
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 3h7m0 0v7m0-7L10 17m-4 4h7"/></svg>
          </a>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trunk Name</TableHead>
                <TableHead>Trunk ID</TableHead>
                <TableHead>Primary URI</TableHead>
                <TableHead>Fallback URI</TableHead>
                <TableHead>Numbers</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trunks.map((trunk, idx) => (
                <TableRow key={trunk.id}>
                  <TableCell className="font-bold text-green-800">{trunk.name}</TableCell>
                  <TableCell>{trunk.id}</TableCell>
                  <TableCell>{trunk.primaryUri}</TableCell>
                  <TableCell>{trunk.fallbackUri}</TableCell>
                  <TableCell>
                    {trunk.numbers.length > 1 ? (
                      <>
                        {trunk.numbers[0]}, <span className="text-blue-600 cursor-pointer">View More</span>
                      </>
                    ) : (
                      trunk.numbers[0]
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-semibold">{trunk.status}</span>
                  </TableCell>
                  <TableCell>
                    <button className="text-gray-400 hover:text-red-600">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Dashboard>
  );
} 