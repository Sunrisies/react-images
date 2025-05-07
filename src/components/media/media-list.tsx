import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MediaItem } from "@/types/media.type";
import { FileText, ImageIcon, MoreHorizontal, Video } from "lucide-react";

interface MediaListProps {
  items: MediaItem[];
  selectedItems: number[];
  onSelect: (id: number) => void;
  onShowDetails: (media: MediaItem) => void;
  onDelete: (id: number) => Promise<void>;
}

export function MediaList({
  items,
  selectedItems,
  onSelect,
  onShowDetails,
  onDelete,
}: MediaListProps) {
  const getMediaIcon = (type: string | null) => {
    if (!type) return <FileText className="h-4 w-4 text-muted-foreground" />;
    if (type.startsWith("image")) {
      return <ImageIcon className="h-4 w-4 text-muted-foreground" />;
    } else if (type.startsWith("video")) {
      return <Video className="h-4 w-4 text-muted-foreground" />;
    }
    return <FileText className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="h-12 px-4 text-left align-middle font-medium">文件名</th>
            <th className="h-12 px-4 text-left align-middle font-medium">类型</th>
            <th className="h-12 px-4 text-left align-middle font-medium">大小</th>
            <th className="h-12 px-4 text-right align-middle font-medium">操作</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className={`border-b transition-colors hover:bg-muted/50 cursor-pointer ${
                selectedItems.includes(item.id) ? "bg-primary/10" : ""
              }`}
              onClick={() => onSelect(item.id)}
            >
              <td className="p-4">
                <div className="flex items-center gap-2">
                  {getMediaIcon(item.type)}
                  <span className="font-medium">{item.title}</span>
                </div>
              </td>
              <td className="p-4">{item.type || "未知"}</td>
              <td className="p-4">{item.size}</td>
              <td className="p-4 text-right">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}