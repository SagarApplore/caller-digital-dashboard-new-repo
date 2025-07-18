'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import apiRequest from '@/utils/api';
import { toast } from 'react-toastify';

export default function ToolTable({ existingTools,setExistingTools }:any) {
  const [open, setOpen] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState('');

  const handleOpen = (body: any) => {
    setSelectedResponse(JSON.stringify(body, null, 2));
    setOpen(true);
  };
  const handleDelete = async (id: string) => {
  if (!id) return;
  try {
    await apiRequest(`/functionTools/${id}`, 'DELETE');
    // Optionally re-fetch tools or remove from state
    setExistingTools((prev:any) => prev.filter((tool: any) => tool._id !== id));
    toast.success("Deleted successfully");
    // OR if you're managing state: setTools(prev => prev.filter(t => t._id !== id));
  } catch (err) {
    console.error('Delete error:', err);
    toast.error("Failed to delete tool");
  }
};


  return (
    <>
      {/* Table */}
      <div className="overflow-auto">
        <table className="min-w-full border text-sm text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Prompt</th>
              <th className="px-4 py-2">URL</th>
              <th className="px-4 py-2">Method</th>
              <th className="px-4 py-2">Auth</th>
              <th className="px-4 py-2">Body</th>
              <th className="px-4 py-2">Response Body</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {existingTools.map((tool:any, idx:any) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{tool.name}</td>
                <td className="px-4 py-2">{tool.type}</td>
                <td className="px-4 py-2">{tool.prompt}</td>
                <td className="px-4 py-2">{tool.api?.url || '-'}</td>
                <td className="px-4 py-2">{tool.api?.Method || '-'}</td>
                <td className="px-4 py-2">
                  {tool.api?.auth ? `${tool.api.auth} | ${tool.api.username}` : '-'}
                </td>
                <td className="px-4 py-2 whitespace-pre-wrap max-w-xs">
                  {tool.api?.Body && Object.keys(tool.api.Body).length
                    ? JSON.stringify(tool.api.Body)
                    : '-'}
                </td>
                <td className="px-4 py-2">
                  {tool.api?.ResponseBody && Object.keys(tool.api.ResponseBody).length ? (
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleOpen(tool.api.ResponseBody)}
                    >
                      View Details
                    </button>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-4 py-2">
  <button
    onClick={() => handleDelete(tool._id)}
    className="text-red-600 hover:underline"
  >
    Delete
  </button>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30 z-40" />
          <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl border max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-semibold">Response Body</Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="text-gray-500 hover:text-gray-700 text-xl"
                  onClick={() => setOpen(false)}
                >
                  ×
                </button>
              </Dialog.Close>
            </div>
            <pre className="text-sm whitespace-pre-wrap bg-gray-100 p-4 rounded border overflow-x-auto max-h-[60vh]">
              {selectedResponse}
            </pre>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
