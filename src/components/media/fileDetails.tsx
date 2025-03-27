import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, ImageIcon, Trash, Video } from "lucide-react";
import { FC } from "react";
import { MediaItem } from "@/types/media.type";

interface Props {
  showDetailsDialog: boolean;
  setShowDetailsDialog: (value: boolean) => void;
  selectedMedia: MediaItem;
}
const fileDetails: FC<Props> = ({
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>文件详情</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">文件名</p>
              <p className="text-sm text-muted-foreground">
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
        <DialogFooter className="flex gap-4">
          <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
            关闭
          </Button>
          <Button variant="destructive">
            <Trash className="mr-2 h-4 w-4" />
            删除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default fileDetails;
