import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/lib/i18n";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  multiple?: boolean;
}

export default function ImageUpload({ value, onChange, multiple = false }: ImageUploadProps) {
  const { toast } = useToast();
  const t = useTranslations();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const images = value ? value.split(",").filter(Boolean) : [];

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      if (multiple) {
        const updated = images.length > 0 ? [...images, data.url].join(",") : data.url;
        onChange(updated);
      } else {
        onChange(data.url);
      }
      toast({ title: t.admin.success, description: t.admin.imageUploaded });
    } catch {
      toast({ title: t.admin.error, description: t.admin.failedToUploadImage, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      await handleUpload(files[i]);
    }
  };

  const removeImage = async (index: number) => {
    const url = images[index];
    if (url.startsWith("/uploads/")) {
      try {
        const res = await fetch("/api/admin/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
          credentials: "include",
        });
        if (!res.ok) {
          toast({ title: t.admin.error, description: t.admin.removeImage, variant: "destructive" });
          return;
        }
      } catch {
        toast({ title: t.admin.error, description: t.admin.removeImage, variant: "destructive" });
        return;
      }
    }
    const updated = images.filter((_, i) => i !== index);
    onChange(updated.join(","));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {images.map((img, i) => (
          <div key={i} className="relative group w-24 h-24 rounded-lg overflow-hidden border border-border bg-muted">
            <img
              src={img}
              alt=""
              className="w-full h-full object-cover"
              data-testid={`img-preview-${i}`}
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              data-testid={`button-remove-image-${i}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {(multiple || images.length === 0) && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-24 h-24 rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-muted/50 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-upload-image"
          >
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span className="text-[10px] leading-tight text-center px-1">
                  {t.admin.uploadImage}
                </span>
              </>
            )}
          </button>
        )}
      </div>

      {images.length === 0 && !uploading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ImageIcon className="h-3.5 w-3.5" />
          <span>{t.admin.clickToUpload} ({t.admin.maxFileSize})</span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
        data-testid="input-file-upload"
      />
    </div>
  );
}
