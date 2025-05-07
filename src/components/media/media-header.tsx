import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface MediaHeaderProps {
  onUpload: () => void;
}

export function MediaHeader({ onUpload }: MediaHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold tracking-tight">媒体库</h2>
      <Button className="bg-primary" onClick={onUpload}>
        <Upload className="mr-2 h-4 w-4" />
        上传文件
      </Button>
    </div>
  );
}