import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaItem } from "@/types/media.type";
import { Trash } from "lucide-react";
import { MediaGrid } from "./media-grid";
import { MediaList } from "./media-list";

interface MediaContentProps {
  items: MediaItem[];
  selectedItems: number[];
  setSelectedItems: (items: number[]) => void;
  onShowDetails: (media: MediaItem) => void;
  onDelete: (id: number) => Promise<any>;
}

export function MediaContent({
  items,
  selectedItems,
  setSelectedItems,
  onShowDetails,
  onDelete,
}: MediaContentProps) {
  const toggleSelect = (id: number) => {
    setSelectedItems(
      selectedItems.includes(id)
        ? selectedItems.filter((item) => item !== id)
        : [...selectedItems, id]
    );
  };

  return (
    <Tabs defaultValue="grid" className="w-full">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="grid">网格视图</TabsTrigger>
          <TabsTrigger value="list">列表视图</TabsTrigger>
        </TabsList>
        {selectedItems.length > 0 && (
          <Button variant="destructive" size="sm">
            <Trash className="mr-2 h-4 w-4" />
            删除所选
          </Button>
        )}
      </div>

      <TabsContent value="grid" className="mt-4">
        <MediaGrid
          items={items}
          selectedItems={selectedItems}
          onSelect={toggleSelect}
          onShowDetails={onShowDetails}
          onDelete={onDelete}
        />
      </TabsContent>

      <TabsContent value="list" className="mt-4">
        <MediaList
          items={items}
          selectedItems={selectedItems}
          onSelect={toggleSelect}
          onShowDetails={onShowDetails}
          onDelete={onDelete}
        />
      </TabsContent>
    </Tabs>
  );
}