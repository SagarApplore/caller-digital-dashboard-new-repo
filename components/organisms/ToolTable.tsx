'use client';

import { useState, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import apiRequest from '@/utils/api';
import { toast } from 'react-toastify';

export default function ToolTable({ existingTools,setExistingTools }:any) {
  const [open, setOpen] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState('');
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const handleOpen = (body: any) => {
    setSelectedResponse(JSON.stringify(body, null, 2));
    setOpen(true);
  };
  
  // Format JSON for display and tooltip
  const formatJSON = (data: any) => {
    return JSON.stringify(data);
  };
  
  // Format JSON for tooltip with better readability
  const formatJSONForTooltip = (data: any) => {
    return JSON.stringify(data, null, 2);
  };

  // Handle showing tooltip
  const handleMouseEnter = (content: string, e: React.MouseEvent) => {
    setTooltipContent(content);
    setTooltipPosition({ x: e.clientX, y: e.clientY });
    setShowTooltip(true);
  };

  // Handle hiding tooltip
  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // Handle tooltip position update on mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (showTooltip) {
      setTooltipPosition({ x: e.clientX, y: e.clientY + 20 });
    }
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
      {/* Custom Tooltip */}
      {showTooltip && (
        <div 
          className="fixed bg-white text-black p-4 rounded-md shadow-xl z-50 max-w-md whitespace-pre-wrap text-sm border border-gray-200"
          style={{ 
            left: `${tooltipPosition.x}px`, 
            top: `${tooltipPosition.y}px`,
            maxHeight: '400px',
            overflow: 'auto',
            fontFamily: 'monospace'
          }}
        >
          <pre className="text-xs">{tooltipContent}</pre>
        </div>
      )}
      
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
              <th className="px-4 py-2">Params</th>
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
                <td className="px-4 py-2">{tool.api?.Params || '-'}</td>
                <td className="px-4 py-2 whitespace-pre-wrap max-w-xs overflow-hidden text-ellipsis">
                  <div 
                    className="max-w-xs overflow-hidden text-ellipsis cursor-pointer" 
                    onMouseEnter={(e) => {
                      const content = tool.api?.Body && Object.keys(tool.api.Body).length
                        ? formatJSONForTooltip(tool.api.Body)
                        : '-';
                      handleMouseEnter(content, e);
                    }}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={handleMouseMove}
                  >
                    {tool.api?.Body && Object.keys(tool.api.Body).length
                      ? formatJSON(tool.api.Body)
                      : '-'}
                  </div>
                </td>
                <td className="px-4 py-2">
                  {tool.api?.ResponseBody && Object.keys(tool.api.ResponseBody).length ? (
                    <div className="flex items-center space-x-2">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => handleOpen(tool.api.ResponseBody)}
                      >
                        View Details
                      </button>
                      <span 
                        className="text-gray-500 cursor-pointer"
                        onMouseEnter={(e) => {
                          const content = formatJSONForTooltip(tool.api.ResponseBody);
                          handleMouseEnter(content, e);
                        }}
                        onMouseLeave={handleMouseLeave}
                        onMouseMove={handleMouseMove}
                      >
                        
                      </span>
                    </div>
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
