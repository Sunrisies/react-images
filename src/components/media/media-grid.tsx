import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MediaItem } from "@/types/media.type";
import { FileText, ImageIcon, MoreHorizontal, Video } from "lucide-react";

interface MediaGridProps {
  items: MediaItem[];
  selectedItems: number[];
  onSelect: (id: number) => void;
  onShowDetails: (media: MediaItem) => void;
  onDelete: (id: number) => Promise<void>;
}

export function MediaGrid({
  items,
  selectedItems,
  onSelect,
  onShowDetails,
  onDelete,
}: MediaGridProps) {
  const getMediaIcon = (type: string | null) => {
    if (!type) return <FileText className="h-12 w-12 text-muted-foreground" />;
    if (type.startsWith("image")) {
      return <ImageIcon className="h-12 w-12 text-muted-foreground" />;
    } else if (type.startsWith("video")) {
      return <Video className="h-12 w-12 text-muted-foreground" />;
    }
    return <FileText className="h-12 w-12 text-muted-foreground" />;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map((item) => (
        <Card
          key={item.id}
          className={`overflow-hidden cursor-pointer ${selectedItems.includes(item.id) ? "ring-2 ring-primary" : ""}`}
          onClick={() => onSelect(item.id)}
        >
          <CardContent className="p-0">
            <div className="aspect-video relative group">
              {item.type?.startsWith("image") ? (
                <div className="h-full w-full bg-muted flex items-center justify-center">
                  <img
                    src={item.url || "/placeholder.svg"}
                    alt={item.title || "媒体文件"}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center">
                  {getMediaIcon(item.type)}
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShowDetails(item);
                  }}
                >
                  查看详情
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-2 text-xs flex justify-between items-center">
            <div className="truncate flex-1">
              <div className="font-medium truncate">{item.title}</div>
              <div className="text-muted-foreground">{item.size}</div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onShowDetails(item)}>
                  查看详情
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(item.id)}>
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}