"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  onProgress?: (progress: number) => void;
}

export function VideoPlayer({ videoUrl, title, onProgress }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Detect video type and extract embed URL if needed
  const getVideoSource = (url: string) => {
    if (!url) return { type: "unknown", src: "" };

    // YouTube
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      return { type: "youtube", src: url };
    }

    // Vimeo
    if (url.includes("vimeo.com")) {
      return { type: "vimeo", src: url };
    }

    // Direct video file (MP4, WebM, etc.)
    if (url.includes(".mp4") || url.includes(".webm") || url.includes(".mov") || url.includes(".avi")) {
      return { type: "direct", src: url };
    }

    // Default to direct
    return { type: "direct", src: url };
  };

  const videoSource = getVideoSource(videoUrl);

  // Track watch time for YouTube videos (simulate progress)
  useEffect(() => {
    if (videoSource.type === "youtube") {
      // Simulate progress increase when user is on the page
      // This is a workaround since YouTube iframe doesn't allow direct progress tracking
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 0.1; // Increment by 0.1% every second
          const calculatedProgress = Math.min(newProgress, 95);
          
          if (onProgress) {
            onProgress(calculatedProgress);
          }
          
          return calculatedProgress;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [videoSource.type, onProgress]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const dur = videoRef.current.duration;
      const progressPercent = (current / dur) * 100;

      setCurrentTime(current);
      setProgress(progressPercent);

      if (onProgress) {
        onProgress(progressPercent);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = percent * duration;
    }
  };

  const handleError = () => {
    setError("Failed to load video. Please check the video URL.");
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // YouTube embed
  if (videoSource.type === "youtube") {
    let embedUrl = videoSource.src;
    let videoId = "";
    
    // Convert various YouTube URL formats to embed format
    if (embedUrl.includes("youtube.com/watch")) {
      videoId = embedUrl.split("v=")[1]?.split("&")[0] || "";
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
    } else if (embedUrl.includes("youtu.be/")) {
      videoId = embedUrl.split("youtu.be/")[1]?.split("?")[0] || "";
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
    } else if (!embedUrl.includes("/embed/")) {
      // Try to extract video ID from URL
      const match = embedUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      if (match) {
        videoId = match[1];
        embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
      }
    } else if (embedUrl.includes("/embed/")) {
      // Already in embed format, extract video ID
      const match = embedUrl.match(/\/embed\/([^?&]+)/);
      if (match) videoId = match[1];
      if (!embedUrl.includes("enablejsapi")) {
        embedUrl = embedUrl + (embedUrl.includes("?") ? "&" : "?") + "enablejsapi=1";
      }
    }

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={embedUrl}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                📺 YouTube video - Simulated progress tracking (YouTube API limitations)
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Progress will increase as you watch. Reach 90% to mark as complete.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Vimeo embed
  if (videoSource.type === "vimeo") {
    let embedUrl = videoSource.src;
    // Extract video ID from Vimeo URL
    const videoId = embedUrl.split("vimeo.com/")[1]?.split("?")[0];
    if (videoId) {
      embedUrl = `https://player.vimeo.com/video/${videoId}`;
    }

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <iframe
                src={embedUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                📺 Vimeo video - Controls provided by Vimeo player
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Direct video file
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Video Container */}
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            {error ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center">
                  <p className="text-white mb-2">⚠️ Video Error</p>
                  <p className="text-gray-300 text-sm">{error}</p>
                  <p className="text-gray-400 text-xs mt-2">URL: {videoUrl}</p>
                </div>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onError={handleError}
                  className="w-full h-full"
                  crossOrigin="anonymous"
                />

                {/* Play Button Overlay */}
                {!isPlaying && !error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <button
                      onClick={handlePlayPause}
                      className="w-16 h-16 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition"
                    >
                      <svg
                        className="w-8 h-8 text-black ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Controls */}
          <div className="space-y-2">
            {/* Progress Bar */}
            <div
              onClick={handleProgressClick}
              className="w-full h-2 bg-gray-300 rounded-full cursor-pointer hover:h-3 transition"
            >
              <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Time Display */}
            <div className="flex justify-between text-sm text-gray-600">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            {/* Play/Pause Button */}
            <Button
              onClick={handlePlayPause}
              className="w-full"
              variant={isPlaying ? "outline" : "default"}
              disabled={error !== null}
            >
              {isPlaying ? "⏸ Pause" : "▶ Play"}
            </Button>
          </div>

          {/* Progress Indicator */}
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold">Progress</span>
              <span className="text-sm font-bold text-blue-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-300 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Video URL Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-600">
              <strong>Video Type:</strong> Direct Video File (MP4, WebM, etc.)
            </p>
            <p className="text-xs text-gray-500 mt-1 break-all">
              <strong>URL:</strong> {videoUrl}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
