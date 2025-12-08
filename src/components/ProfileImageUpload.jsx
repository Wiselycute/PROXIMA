"use client";
import { useState } from "react";
import Image from "next/image";
import { Upload, Loader2 } from "lucide-react";

export default function ProfileImageUpload({ currentImage, onImageUpdate }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      // Update user profile with new image URL
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const updateRes = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileImage: data.url }),
      });

      if (updateRes.ok) {
        // Update localStorage
        user.profileImage = data.url;
        localStorage.setItem("user", JSON.stringify(user));
        
        // Trigger storage event for other components
        window.dispatchEvent(new Event("storage"));
        
        // Notify parent component
        if (onImageUpdate) onImageUpdate(data.url);
        
        setPreview(data.url);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please try again.");
      setPreview(currentImage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <Image
          src={preview || "/avatar.jpg"}
          width={120}
          height={120}
          className="rounded-full object-cover border-2 border-white/10 w-30 h-30"
          alt="Profile"
        />
        
        <label
          htmlFor="profile-upload"
          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : (
            <Upload className="w-6 h-6 text-white" />
          )}
        </label>

        <input
          id="profile-upload"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
      </div>

      <p className="text-sm text-gray-400">
        {uploading ? "Uploading..." : "Click to upload"}
      </p>
    </div>
  );
}
