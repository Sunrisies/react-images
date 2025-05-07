import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MediaItem } from "@/types/media.type";
import { FC } from "react";
import { FileText, ImageIcon, Trash, Video } from "lucide-react";

interface FileDetailsProps {
  showDetailsDialog: boolean;
  setShowDetailsDialog: (show: boolean) => void;
  selectedMedia: MediaItem;
}
const FileDetails: FC<FileDetailsProps> = ({
  showDetailsDialog,
  setShowDetailsDialog,
  selectedMedia,
}) => {
  const getMediaIcon = (type: string | null) => {
    if (!type) return <FileText className="h-12 w-12 text-muted-foreground" />;

    if (type.startsWith("image")) {
      return <ImageIcon className="h-12 w-12 text-muted-foreground" />;
    } else if (type.startsWith("video")) {
      return <Video className="h-12 w-12 text-muted-foreground" />;
    } else {
      return <FileText className="h-12 w-12 text-muted-foreground" />;
    }
  };
  return (
    <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>文件详情</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            {selectedMedia.type?.startsWith("image") ? (
              <img
                src={selectedMedia.url || "/placeholder.svg"}
                alt={selectedMedia.title || "媒体文件"}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                {getMediaIcon(selectedMedia.type)}
                <span className="mt-2 text-sm font-medium">
                  {selectedMedia.title}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">文件名</h3>
              <p className="text-sm truncate hover:text-clip hover:whitespace-normal cursor-help" title={selectedMedia.title!}>
                {selectedMedia.title}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">类型</p>
              <p className="text-sm text-muted-foreground">
                {selectedMedia.type || "未知"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">大小</p>
              <p className="text-sm text-muted-foreground">
                {selectedMedia.size}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">上传日期</p>
              <p className="text-sm text-muted-foreground">
                {selectedMedia.created_at}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium">路径</p>
              <p className="text-sm text-muted-foreground truncate">
                {selectedMedia.path}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default FileDetails;
