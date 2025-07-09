"use client";

import {
  Copy,
  Frown,
  Loader2,
  Pause,
  Play,
  Search,
  Smile,
  Star,
  Volume2,
  VolumeX,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import WaveSurfer from "wavesurfer.js";
import utils from "@/utils/index.util";
import apiRequest from "@/utils/api";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  analyzeText,
  generateShortSummary,
  TextAnalysisResult,
} from "@/utils/openai.util";

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
                ? callLog?.clientId?.name
                : callLog?.agentId?.agentName
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

const ViewCallLog = ({ id }: { id: string }) => {
  const [play, setPlay] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState<any>({});
  const [transcripts, setTranscripts] = useState<any[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [shortSummary, setShortSummary] = useState<string>("");
  const [analysis, setAnalysis] = useState<TextAnalysisResult>({
    sentiment: "positive",
    intent: "",
    keywords: [],
    aiAnalysis: "",
  });

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
      const shortSummary = await generateShortSummary(response.data, 100);
      const analysis = await analyzeText(response.data);
      setAnalysis(analysis);
      setShortSummary(shortSummary);
      setSummary(response.data);
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  useEffect(() => {
    fetchCallLog();
  }, [id]);

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
                        .getInitials(apiData?.clientId?.name)
                        .toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm  text-gray-500">
                    {apiData?.clientId?.name}
                  </span>
                  <span className="text-sm font-bold">
                    {apiData?.customer_phone_number}
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm  text-gray-500">Customer ID</span>
                <span className="text-sm font-bold">
                  {apiData?.clientId?._id}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm  text-gray-500">Location</span>
                <span className="text-sm font-bold">Delhi, India</span>
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
                        .getInitials(apiData?.agentId?.agentName)
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
                <span className="text-sm font-bold">{analysis.intent}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm  text-gray-500">Resolution</span>
                <span className="text-sm font-bold">{shortSummary}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm  text-gray-500">Tags</span>
                <div className="">
                  <ul className="flex flex-wrap gap-2">
                    {analysis?.keywords?.map((keyword: string) => (
                      <li
                        className={`text-xs font-bold px-2 py-1 rounded-full ${utils.colors.getRandomColor()}`}
                      >
                        {keyword}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg">
            <div className="p-6 space-y-4 bg-gradient-to-r from-cyan-100 to-purple-100">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">Audio Recording</span>
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

              <div className="p-2 bg-gray-100 rounded-md text-sm text-gray-600">
                AI analysis: {analysis.aiAnalysis}
              </div>
              <div className="flex flex-col items-center space-y-4 p-4 bg-gray-100 rounded-md w-fit">
                <div className="text-lg font-bold">Sentiment Analysis</div>
                <div className="flex flex-col gap-2 items-center">
                  {analysis.sentiment === "positive" && (
                    <Smile className="text-green-500 w-10 h-10" />
                  )}
                  {analysis.sentiment === "neutral" && (
                    <Smile className="text-gray-400 w-10 h-10" />
                  )}
                  {analysis.sentiment === "negative" && (
                    <Frown className="text-red-500 -scale-x-100 w-10 h-10" />
                  )}
                  <span>{analysis.sentiment}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewCallLog;
