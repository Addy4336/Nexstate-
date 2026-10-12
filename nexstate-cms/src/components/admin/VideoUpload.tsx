"use client";

import { useState } from "react";
import { X, Upload, Loader2, Video, Play } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { uploadMedia } from "@/lib/upload-client";

interface VideoUploadProps {
    onVideoChange: (url: string | null) => void;
    defaultVideo?: string | null;
    folderName?: string;
}

export function VideoUpload({
    onVideoChange,
    defaultVideo = null,
    folderName = "properties",
}: VideoUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(defaultVideo);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!e.target.files || e.target.files.length === 0) return;

            const file = e.target.files[0];
            
            // Check file size (Supabase free plan caps objects at 50MB)
            const maxSize = 50 * 1024 * 1024; // 50MB
            if (file.size > maxSize) {
                toast.error("Video file size must be less than 50MB");
                return;
            }

            // Check if it's a video file
            if (!file.type.startsWith('video/')) {
                toast.error("Please upload a valid video file");
                return;
            }

            setUploading(true);

            const url = await uploadMedia(file, "video", folderName);
            setVideoUrl(url);
            onVideoChange(url);
            toast.success("Video uploaded");

        } catch (error: any) {
            console.error(error);
            toast.error("Error uploading video: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const removeVideo = () => {
        setVideoUrl(null);
        onVideoChange(null);
        toast.success("Video removed");
    };

    return (
        <div className="flex flex-col gap-3">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Video className="w-4 h-4" />
                Property Video
            </Label>

            <div className="group relative w-full rounded-2xl overflow-hidden border border-border bg-muted/20 hover:bg-muted/30 transition-all duration-300 aspect-video">
                {!videoUrl ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <input
                            type="file"
                            accept="video/mp4,video/webm,video/quicktime"
                            onChange={handleUpload}
                            disabled={uploading}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        {uploading ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-20">
                                <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                                <p className="text-sm text-muted-foreground">Uploading...</p>
                                <p className="text-xs text-muted-foreground mt-1">This may take a while for large files</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-full bg-background shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Upload className="w-6 h-6 text-primary" />
                                </div>
                                <p className="font-semibold text-sm text-foreground">Upload Property Video</p>
                                <p className="text-xs text-muted-foreground mt-2 px-4">
                                    MP4, WebM or MOV (max 50MB)
                                </p>
                                <p className="text-xs text-muted-foreground/70 mt-1">
                                    Click to browse or drag and drop
                                </p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="absolute inset-0 w-full h-full">
                        <video src={videoUrl} controls preload="metadata" className="w-full h-full bg-black" />
                        <div className="absolute top-3 right-3 z-20">
                            <button
                                type="button"
                                onClick={removeVideo}
                                className="p-2.5 bg-black/60 backdrop-blur-md text-white rounded-full hover:bg-red-600 transition-all transform hover:scale-110 shadow-lg border border-white/10"
                                title="Remove video"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-white/10">
                            <Play className="w-3 h-3 fill-white" />
                            VIDEO
                        </div>
                    </div>
                )}
            </div>

            <p className="text-xs text-muted-foreground">
                Upload a video showcasing the property (optional). Shown on the property page.
            </p>
        </div>
    );
}
