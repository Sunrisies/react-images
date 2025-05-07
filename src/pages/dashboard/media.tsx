import { Layout } from "@/layout";
import { MediaHeader } from "@/components/media/media-header";
import { MediaToolbar } from "@/components/media/media-toolbar";
import { MediaContent } from "@/components/media/media-content";
import { MediaItem } from "@/types/media.type";
import { deleteFileApi, getFileListApi } from "@/services/media";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import FileDetails from "@/components/media/file-details";
import UploadFiles from "@/components/media/upload-files";

export const Route = createFileRoute("/dashboard/media")({
  component: RouteComponent,
});

function RouteComponent() {
  const { mutateAsync } = deleteFileApi();
  const [search, setSearch] = useState("");
  const [fileType, setFileType] = useState("all");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const { data, isLoading, isError } = getFileListApi({ search, type: fileType });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;
  const mediaItems: MediaItem[] = data?.data || [];

  const handleSearch = async (search: string) => {
    setSearch(search);
  };

  const handleFilter = async (type: string) => {
    setFileType(type);
  };

  return (
    <Layout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <MediaHeader onUpload={() => setShowUploadDialog(true)} />
        <MediaToolbar 
          totalCount={mediaItems.length}
          selectedCount={selectedItems.length}
          onSearch={handleSearch}
          onFilter={handleFilter}
        />
        <MediaContent 
          items={mediaItems}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          onShowDetails={(media) => {
            setSelectedMedia(media);
            setShowDetailsDialog(true);
          }}
          onDelete={mutateAsync}
        />

        <UploadFiles
          showUploadDialog={showUploadDialog}
          setShowUploadDialog={setShowUploadDialog}
        />

        {selectedMedia && (
          <FileDetails
            showDetailsDialog={showDetailsDialog}
            setShowDetailsDialog={setShowDetailsDialog}
            selectedMedia={selectedMedia}
          />
        )}
      </div>
    </Layout>
  );
}
