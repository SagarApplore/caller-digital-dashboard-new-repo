"use client";

import { Copy, Pause, Play, Search, Smile, Star, Volume2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import WaveSurfer from "wavesurfer.js";
import utils from "@/utils/index.util";
import apiRequest from "@/utils/api";

interface SenderDetails {
  name: string;
  img?: string;
  time: string;
  message: string;
  tags: string[];
}

const Transcript = ({
  user,
  senderDetails,
}: {
  user: string;
  senderDetails: SenderDetails;
}) => {
  return (
    <div className="flex w-full gap-2 items-start">
      {senderDetails.img ? (
        <Image src={senderDetails.img} alt="avatar" width={30} height={30} />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-sm font-bold text-gray-500">
            {utils.string.getInitials(senderDetails.name).toUpperCase()}
          </span>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">
            {senderDetails.name}
          </span>
          <span className="text-xs text-gray-500">{senderDetails.time}</span>
          <div className="flex items-center gap-2">
            {senderDetails.tags.map((tag, index) => (
              <span
                key={index}
                className={`text-xs ${utils.colors.getRandomColor()} px-2 py-1 rounded-full font-semibold`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <span
          className={`text-sm p-2 rounded-lg ${
            user === "user" ? "bg-gray-100" : "bg-purple-100"
          } text-left`}
        >
          {senderDetails.message}
        </span>
      </div>
    </div>
  );
};

const transcript = [
  {
    id: 1,
    name: "John Smith",
    phone: "+1234567890",
    time: "00:35",
    message:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    tags: ["Billing", "Payment", "Account"],
  },
];

const ViewCallLog = ({ id }: { id: string }) => {
  const [play, setPlay] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCallLog = async () => {
    try {
      const response = await apiRequest(`/vapi/call-logs/${id}`, "GET");
      setLoading(false);
    } catch (err) {
      console.error("Error fetching call log:", err);
      setLoading(false);
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
  useEffect(() => {
    setAudioUrl(
      "https://caller-recordings.s3.ap-south-1.amazonaws.com/recording/91fa171e-f401-462f-9603-58afbe84d8df/recording_20250708_124907.ogg"
    );
  }, []);

  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (!waveformRef.current) return;

    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#ddd",
      progressColor: "#4f46e5", // Indigo
      height: 30,
      barWidth: 2,
    });

    wavesurfer.current.load(audioUrl).then(() => {
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
  }, [audioUrl]);

  const handlePlayPause = () => {
    if (wavesurfer.current) {
      wavesurfer.current?.playPause();
    }
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
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-lg shadow-gray-200 flex flex-col gap-4">
          <h2 className="text-lg font-bold">Customer Information</h2>
          <div className="flex items-center gap-2">
            <Image
              src="/call.svg"
              alt="avatar"
              width={50}
              height={50}
              className="rounded-full"
            />
            <div className="flex flex-col">
              <span className="text-sm  text-gray-500">John Smith</span>
              <span className="text-sm font-bold">+1234567890</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm  text-gray-500">Customer ID</span>
            <span className="text-sm font-bold">1234567890</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm  text-gray-500">Location</span>
            <span className="text-sm font-bold">New York, USA</span>
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
            <span className="text-sm font-bold">4m 32s</span>
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
            <span className="text-sm font-bold">2</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg shadow-gray-200 flex flex-col gap-4">
          <h2 className="text-lg font-bold">Assistant Details</h2>
          <div className="flex items-center gap-2">
            <Image
              src="/call.svg"
              alt="avatar"
              width={50}
              height={50}
              className="rounded-full"
            />
            <div className="flex flex-col">
              <span className="text-sm  text-gray-500">John Smith</span>
              <span className="text-sm font-bold">+1234567890</span>
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
            <span className="text-sm font-bold">Billing Inquiry</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm  text-gray-500">Resolution</span>
            <span className="text-sm font-bold">
              Account balance clarified, payment plan adjusted
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm  text-gray-500">Tags</span>
            <div className="">
              <ul className="flex flex-wrap gap-2">
                <li className="text-xs font-bold bg-blue-100 px-2 py-1 rounded-full text-blue-700">
                  Billing
                </li>
                <li className="text-xs font-bold bg-green-100 px-2 py-1 rounded-full text-green-700">
                  Payment
                </li>
                <li className="text-xs font-bold bg-purple-100 px-2 py-1 rounded-full text-purple-700">
                  Account
                </li>
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
              March 15, 2025 2:18 pm
            </span>
          </div>

          <div className="flex flex-col bg-white p-4 rounded-lg gap-4">
            <div className="flex items-center justify-between">
              <Button
                className="bg-blue-500 text-white"
                onClick={handlePlayPause}
              >
                {play ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                Play Audio
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                <Volume2 className="w-4 h-4 text-gray-500" />
              </div>
            </div>
            <div ref={waveformRef} />
          </div>
        </div>

        <div className="flex flex-col gap-4 bg-white p-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">Conversation Transcript</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 cursor-pointer">
                <Search className="w-3 h-3" />
                <span className="text-sm">Search</span>
              </div>
              <div className="flex items-center gap-1 cursor-pointer">
                <Copy className="w-3 h-3" />
                <span className="text-sm">Copy</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 max-h-[500px] overflow-y-scroll">
            {transcript.map((item) => (
              <Transcript key={item.id} user="user" senderDetails={item} />
            ))}
          </div>
          <div className="p-2 bg-gray-100 rounded-md text-sm text-gray-600">
            AI analysis: Customer happy
          </div>
          <div className="flex flex-col items-center space-y-4 p-4 bg-gray-100 rounded-md w-fit">
            <div className="text-lg font-bold">Sentiment Analysis</div>
            <div className="flex flex-col gap-2 items-center">
              <Smile />
              <span>Positive</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCallLog;
