"use client";

import { useRef } from "react";
import { Camera, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReceiptCaptureProps {
  onImageSelected: (file: File) => void;
  disabled?: boolean;
}

export function ReceiptCapture({ onImageSelected, disabled }: ReceiptCaptureProps) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onImageSelected(file);
    e.target.value = "";
  }

  return (
    <div className="flex gap-3 justify-center">
      {/* Camera button — uses device camera directly */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />
      <Button
        type="button"
        size="lg"
        onClick={() => cameraRef.current?.click()}
        disabled={disabled}
        className="flex-1 gap-2"
      >
        <Camera className="h-5 w-5" />
        拍照
      </Button>

      {/* Gallery button — no capture attr so iOS Safari opens photo library */}
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      <Button
        type="button"
        size="lg"
        variant="outline"
        onClick={() => galleryRef.current?.click()}
        disabled={disabled}
        className="flex-1 gap-2"
      >
        <ImageIcon className="h-5 w-5" />
        相簿
      </Button>
    </div>
  );
}
