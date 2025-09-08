"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/organisms/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Phone, 
  MessageSquare, 
  Mail, 
  Settings, 
  ArrowUpDown, 
  BarChart3, 
  ChevronDown, 
  Globe, 
  Languages, 
  Play, 
  Trash2, 
  MoreVertical, 
  Copy,
  Star,
  Smile,
  Frown,
  Download,
  Loader2,
  Brain,
  Mic,
  Ear,
  Pause,
  Volume2,
  VolumeX,
  Table
} from "lucide-react";
import Image from "next/image";
import WaveSurfer from "wavesurfer.js";
import utils from "@/utils/index.util";
import apiRequest from "@/utils/api";
import axios from "axios";
import { toast } from "react-toastify";

interface SenderDetails {
  name: string;
  img?: string;
  time: string;
  message: string;
  tags: string[];
}

const Transcript = ({
  transcript,
  callLog,
}: {
  transcript: any;
  callLog: any;
}) => {
  return (
    <div className="flex w-full gap-2 items-start">
      {transcript.sender?.img ? (
        <Image
          src={transcript.sender?.img}
          alt="avatar"
          width={30}
          height={30}
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-500">
          {utils.string
            .getInitials(
              transcript.role?.toLowerCase() === "user"
                ? (callLog?.clientId?.name || "User")
                : (callLog?.agentId?.agentName || "Agent")
            )
            .toUpperCase()}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">
            {transcript.role?.toLowerCase() === "user"
              ? callLog?.clientId?.name
              : callLog?.agentId?.agentName}
          </span>
          {/* <span className="text-xs text-gray-500">
            {transcript.sender?.time}
          </span> */}
          {/* <div className="flex items-center gap-2">
            {transcript.sender?.tags?.map((tag: string, index: number) => (
              <span
                key={index}
                className={`text-xs ${utils.colors.getRandomColor()} px-2 py-1 rounded-full font-semibold`}
              >
                {tag}
              </span>
            ))}
          </div> */}
        </div>
        <span
          className={`text-sm p-2 rounded-lg ${
            transcript.role?.toLowerCase() === "user"
              ? "bg-gray-100"
              : "bg-purple-100"
          } text-left`}
        >
          {transcript.content?.[0] ?? ""}
        </span>
      </div>
    </div>
  );
};

const EntityResult = ({
  entityResult,
  onExport,
}: {
  entityResult: any;
  onExport: () => void;
}) => {
  if (!entityResult) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
        <Table className="w-8 h-8 mb-2" />
        <span className="text-sm">No entity result data available</span>
      </div>
    );
  }

  // Handle both object and array formats
  let dataToDisplay: any[] = [];
  
  if (Array.isArray(entityResult)) {
    dataToDisplay = entityResult;
  } else if (typeof entityResult === 'object' && entityResult !== null) {
    // Convert object to array format for table display
    dataToDisplay = [entityResult];
  }

  if (dataToDisplay.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
        <Table className="w-8 h-8 mb-2" />
        <span className="text-sm">No entity result data available</span>
      </div>
    );
  }

  // Get all unique keys from the entity result data
  const allKeys = Array.from(
    new Set(
      dataToDisplay.flatMap((item: any) => 
        typeof item === 'object' && item !== null ? Object.keys(item) : []
      )
    )
  );

  return (
    <div className="flex flex-col gap-4 max-h-[500px] overflow-y-scroll">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Entity Data</h3>
        <Button
          onClick={onExport}
          className="bg-purple-600 text-white hover:bg-purple-700 text-sm px-3 py-1"
        >
          Export Entity Results
        </Button>
      </div>
      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                {allKeys.map((key: string) => (
                  <th key={key} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataToDisplay.map((item: any, index: number) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  {allKeys.map((key: string) => (
                    <td key={key} className="px-4 py-3 text-sm text-gray-600">
                      {typeof item[key] === 'object' 
                        ? JSON.stringify(item[key])
                        : String(item[key] || '-')
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ViewCallLog = ({ id }: { id: string }) => {
  const [play, setPlay] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState<any>({});
  const [transcripts, setTranscripts] = useState<any[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [showAllTags, setShowAllTags] = useState(false);

  const fetchCallLog = async () => {
    try {
      const response = await apiRequest(`/vapi/call-logs/${id}`, "GET");
      await fetchTranscript(response.data?.data?.transcript_uri);
      await fetchSummary(response.data?.data?.summary_uri);
      setApiData(response.data?.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching call log:", err);
      setLoading(false);
    }
  };

  const fetchTranscript = async (transcriptUri: string) => {
    try {
      const response = await axios.get(transcriptUri);
      setTranscripts(response.data?.items);
    } catch (err) {
      console.error("Error fetching transcript:", err);
      setTranscripts([]);
    }
  };

  const fetchSummary = async (summaryUri: string) => {
    try {
      const response = await axios.get(summaryUri);
      setSummary(response.data);
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  useEffect(() => {
    fetchCallLog();
  }, [id]);

  // Debug entity_result data
  useEffect(() => {
    if (apiData?.entity_result) {
      console.log("Entity Result Data:", apiData.entity_result);
      console.log("Entity Result Type:", typeof apiData.entity_result);
      console.log("Is Array:", Array.isArray(apiData.entity_result));
    }
  }, [apiData?.entity_result]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        <span className="text-sm font-bold">{rating}</span>
        <Star className="w-4 h-4 text-yellow-400 fill-current" />
      </div>
    );
  };

  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (apiData?.recording_uri) {
      if (!waveformRef.current) return;

      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#ddd",
        progressColor: "#4f46e5", // Indigo
        height: 30,
        barWidth: 2,
      });

      wavesurfer.current.load(apiData?.recording_uri).then(() => {
        // Get duration after audio is ready
        wavesurfer.current?.on("ready", () => {
          const dur = wavesurfer.current?.getDuration() ?? 0;
          setDuration(dur); // duration in seconds
          setCurrentTime(0);
        });
        // Update currentTime during playback
        wavesurfer.current?.on("audioprocess", () => {
          setCurrentTime(wavesurfer.current?.getCurrentTime() ?? 0);
        });

        // On pause or end, update one last time
        wavesurfer.current?.on("pause", () => {
          setCurrentTime(wavesurfer.current?.getCurrentTime() ?? 0);
        });
        wavesurfer.current?.on("finish", () => {
          setCurrentTime(wavesurfer.current?.getDuration() ?? 0);
        });
      });

      return () => wavesurfer.current?.destroy();
    }
  }, [apiData?.recording_uri]);

  const handlePlayPause = () => {
    if (wavesurfer.current) {
      wavesurfer.current?.playPause();
    }
    setPlay(!play);
  };

  const handleMute = () => {
    if (wavesurfer.current) {
      wavesurfer.current?.setMuted(!muted);
    }
    setMuted(!muted);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleDownloadRecording = async () => {
    if (!apiData?.recording_uri) {
      toast.warning("No recording available for download");
      return;
    }

    try {
      // Fetch the audio file
      const response = await axios.get(apiData.recording_uri, {
        responseType: 'blob'
      });

      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { type: 'audio/wav' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with timestamp
      const timestamp = new Date(apiData.createdAt).toISOString().split('T')[0];
      const customerName = apiData?.clientId?.name || 'customer';
      const agentName = apiData?.agentId?.agentName || 'agent';
      link.download = `call_recording_${customerName}_${agentName}_${timestamp}.wav`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Download started successfully!");
    } catch (error) {
      console.error("Error downloading recording:", error);
      toast.error("Failed to download recording. Please try again.");
    }
  };

  const handleExportEntityResults = async () => {
    if (!apiData?.entity_result) {
      toast.warning("No entity result data available for this call");
      return;
    }

    try {
      // Collect all unique keys from entity_result data
      const allKeys = new Set<string>();
      const entityResultsData: any[] = [];

      if (typeof apiData.entity_result === 'object' && apiData.entity_result !== null) {
        // Handle object format
        Object.keys(apiData.entity_result).forEach(key => allKeys.add(key));
        entityResultsData.push(apiData.entity_result);
      } else if (Array.isArray(apiData.entity_result)) {
        // Handle array format
        apiData.entity_result.forEach((item: any) => {
          if (typeof item === 'object' && item !== null) {
            Object.keys(item).forEach(key => allKeys.add(key));
            entityResultsData.push(item);
          }
        });
      }

      if (entityResultsData.length === 0) {
        toast.warning("No entity result data found to export");
        return;
      }

      // Convert Set to Array and sort for consistent order
      const sortedKeys = Array.from(allKeys).sort();

      console.log("Entity Results Export - Keys:", sortedKeys);
      console.log("Entity Results Export - Data:", entityResultsData);

      // Create CSV content with keys as headers
      const csvContent = [
        sortedKeys, // Headers (keys)
        ...entityResultsData.map(row => 
          sortedKeys.map(key => {
            const value = row[key];
            return typeof value === 'object' ? JSON.stringify(value) : String(value || '');
          })
        )
      ].map(row =>
        row
          .map(field => {
            // Escape quotes and commas
            if (typeof field === 'string' && /[",\n]/.test(field)) {
              return `"${field.replace(/"/g, '""')}"`;
            }
            return field;
          })
          .join(',')
      ).join('\n');

      console.log("Entity Results Export - CSV Content:", csvContent);

      const bom = "\uFEFF";
const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `entity_results_${apiData._id || 'call'}.csv`;
      link.click();

      toast.success("Entity results exported successfully!");
    } catch (error) {
      console.error("Error during entity results export:", error);
      toast.error("Entity results export failed. Please try again.");
    }
  };

  return (
    <div className="m-6 space-y-6 max-h-[calc(100vh-100px)] overflow-y-scroll">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-lg shadow-gray-200 flex flex-col gap-4">
              <h2 className="text-lg font-bold">Customer Information</h2>
              <div className="flex items-center gap-2">
                {apiData?.clientId?.image ? (
                  <Image
                    src={apiData?.clientId?.image}
                    alt="avatar"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-500">
                      {utils.string
                        .getInitials(apiData?.clientId?.name ?? "Customer")
                        .toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm  text-gray-500">
                    {apiData?.clientId?.name}
                  </span>
                  <span className="text-sm font-bold">web</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm  text-gray-500">Customer Number</span>
                <span className="text-sm font-bold">
                  {apiData?.customer_phone_number || "Not available"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm  text-gray-500">Agent Number</span>
                <span className="text-sm font-bold">
                  {apiData?.agent_phone_number || "Not available"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm  text-gray-500">Language</span>
                <span className="text-sm font-bold">English</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-lg shadow-gray-200 flex flex-col gap-4">
              <h2 className="text-lg font-bold">Conversation Metrics</h2>
              <div className="flex items-center justify-between">
                <span className="text-sm  text-gray-500">Duration</span>
                <span className="text-sm font-bold">
                  {utils.string.formatDuration(apiData?.call_duration)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm  text-gray-500">CSAT Score</span>
                <span className="text-sm font-bold">{renderStars(4)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm  text-gray-500">AI Confidence</span>
                <span className="text-sm font-bold">92%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm  text-gray-500">Interruptions</span>
                <span className="text-sm font-bold">
                  {transcripts.reduce((acc: number, item: any) => {
                    if (item.interruption === true) {
                      return acc + 1;
                    }
                    return acc;
                  }, 0)}
                </span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-lg shadow-gray-200 flex flex-col gap-4">
              <h2 className="text-lg font-bold">Assistant Details</h2>
              <div className="flex items-center gap-2">
                {apiData?.agentId?.image ? (
                  <Image
                    src={apiData?.agentId?.image}
                    alt="avatar"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-500">
                      {utils.string
                        .getInitials(apiData?.agentId?.agentName ?? "Agent")
                        .toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm  text-gray-500">
                    {apiData?.agentId?.agentName}
                  </span>
                  <span className="text-sm font-bold">
                    {apiData?.agent_phone_number}
                  </span>
                </div>
              </div>
              
              {/* LLM Provider */}
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  LLM Provider
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-bold">
                    {apiData?.agentId?.voice?.llmProvider?.providerName || "Not available"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {apiData?.agentId?.voice?.llmProvider?.model || "Model not specified"}
                  </span>
                </div>
              </div>

              {/* Voice Provider */}
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  Voice Provider
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-bold">
                    {apiData?.agentId?.voice?.voiceProvider?.providerName || "Not available"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {apiData?.agentId?.voice?.voiceProvider?.model || "Model not specified"}
                  </span>
                </div>
              </div>

              {/* Transcriber Provider */}
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 flex items-center gap-2">
                  <Ear className="w-4 h-4" />
                  Transcriber Provider
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-bold">
                    {apiData?.agentId?.voice?.transcriberProvider?.providerName || "Not available"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {apiData?.agentId?.voice?.transcriberProvider?.model || "Model not specified"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-sm  text-gray-500">Model Version</span>
                <span className="text-sm font-bold">v2.4.1</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm  text-gray-500">Specialization</span>
                <span className="text-sm font-bold">Customer Support</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm  text-gray-500">Resolution Rate</span>
                <span className="text-sm font-bold">89.3%</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-lg shadow-gray-200 flex flex-col gap-4">
              <h2 className="text-lg font-bold">Call Summary</h2>
              <div className="flex flex-col">
                <span className="text-sm  text-gray-500">Intent</span>
                <span className="text-sm font-bold">{apiData.intent || "Not available"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm  text-gray-500">Resolution</span>
                <span className="text-sm font-bold">{apiData.ai_analysis || summary || "Not available"}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm  text-gray-500">Sentiment</span>
                <div className="flex items-center gap-2">
                  {(apiData.sentiment || "positive") === "positive" && (
                    <Smile className="text-green-500 w-5 h-5" />
                  )}
                  {(apiData.sentiment || "neutral") === "neutral" && (
                    <Smile className="text-gray-400 w-5 h-5" />
                  )}
                  {(apiData.sentiment || "negative") === "negative" && (
                    <Frown className="text-red-500 -scale-x-100 w-5 h-5" />
                  )}
                  <span className="text-sm font-bold capitalize">
                    {apiData.sentiment || "Not available"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm  text-gray-500">Tags</span>
                <div className="max-h-24 overflow-hidden">
                  <ul className="flex flex-wrap gap-2">
                    {apiData.tags ? (
                      apiData.tags.split(',').slice(0, showAllTags ? undefined : 6).map((tag: string, index: number) => (
                        <li
                          key={index}
                          className={`text-xs font-bold px-2 py-1 rounded-full max-w-[120px] truncate`}
                          style={{
                            backgroundColor: "#F3F4F6", // static light gray bg
                            color: "#4B5563", // static gray text
                          }}
                          title={tag.trim()}
                        >
                          {tag.trim()}
                        </li>
                      ))
                    ) : (
                      <li
                        className={`text-xs font-bold px-2 py-1 rounded-full max-w-[120px] truncate`}
                        style={{
                          backgroundColor: "#F3F4F6", // static light gray bg
                          color: "#4B5563", // static gray text
                        }}
                        title="No tags available"
                      >
                        No tags available
                      </li>
                    )}
                  </ul>
                  {apiData.tags && apiData.tags.split(',').length > 6 && (
                    <button
                      onClick={() => setShowAllTags(!showAllTags)}
                      className="text-xs text-blue-600 hover:text-blue-800 mt-2 font-medium"
                    >
                      {showAllTags ? "Show less" : `View ${apiData.tags.split(',').length - 6} more`}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg">
            <div className="p-6 space-y-4 bg-gradient-to-r from-cyan-100 to-purple-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold">Audio Recording</span>
                  <Button
                    onClick={handleDownloadRecording}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1"
                    disabled={!apiData?.recording_uri}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Recording
                  </Button>
                </div>
                <span className="text-sm text-gray-500">
                  {utils.string.formatDateTime(apiData?.createdAt)}
                </span>
              </div>

              <div className="flex flex-col bg-white p-4 rounded-lg gap-4">
                <div className="flex items-center justify-between">
                  <Button
                    className="bg-blue-500 text-white hover:bg-blue-600"
                    onClick={handlePlayPause}
                  >
                    {play ? (
                      <>
                        <Pause className="w-4 h-4" />
                        Pause Audio
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Play Audio
                      </>
                    )}
                  </Button>
                  <div className="flex items-center gap-2">
                    {/* <span className="text-sm text-gray-500">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span> */}
                    {muted ? (
                      <VolumeX
                        className="w-6 h-6 text-gray-500 cursor-pointer"
                        onClick={handleMute}
                      />
                    ) : (
                      <Volume2
                        className="w-6 h-6 text-gray-500 cursor-pointer"
                        onClick={handleMute}
                      />
                    )}
                  </div>
                </div>
                <div ref={waveformRef} />
              </div>
            </div>

            <div className="flex flex-col gap-4 bg-white p-6">
              <div className="flex items-center justify-between">
                {/* <span className="text-lg font-bold">
                  Conversation Transcript
                </span> */}
                <Tabs defaultValue="transcript" className="space-y-6 w-full">
                  <TabsList className="bg-transparent">
                    <TabsTrigger
                      value="transcript"
                      className="text-lg font-bold data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 border-b-2 border-transparent rounded-none"
                    >
                      Transcript
                    </TabsTrigger>
                    <TabsTrigger
                      value="summary"
                      className="text-lg font-bold data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 border-b-2 border-transparent rounded-none"
                    >
                      Summary
                    </TabsTrigger>
                    <TabsTrigger
                      value="entity-result"
                      className="text-lg font-bold data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 border-b-2 border-transparent rounded-none"
                    >
                      Entity Result
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="transcript" className="w-full">
                    <div className="flex flex-col gap-4 max-h-[500px] overflow-y-scroll w-full">
                      {transcripts.map((item: any) => (
                        <Transcript
                          key={item.id}
                          transcript={item}
                          callLog={apiData}
                        />
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="summary">
                    <div className="flex flex-col gap-4 max-h-[500px] overflow-y-scroll">
                      <div className="text-sm text-gray-500">{summary}</div>
                    </div>
                  </TabsContent>
                  <TabsContent value="entity-result">
                    <EntityResult entityResult={apiData?.entity_result} onExport={handleExportEntityResults} />
                  </TabsContent>
                </Tabs>
                {/* <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <Search className="w-3 h-3" />
                    <span className="text-sm">Search</span>
                  </div>
                  <div className="flex items-center gap-1 cursor-pointer">
                    <Copy className="w-3 h-3" />
                    <span className="text-sm">Copy</span>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewCallLog;
