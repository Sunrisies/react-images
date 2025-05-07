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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";

export const Route = createFileRoute("/dashboard/media")({
  component: RouteComponent,
  validateSearch: (search: { page: string }) => ({
    page: search.page ? Number(search.page) : 1,
  }),
});

function RouteComponent() {
  const { mutateAsync } = deleteFileApi();
  const [search, setSearch] = useState("");
  const [fileType, setFileType] = useState("all");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const { page } = Route.useSearch();
  const [pageSize] = useState(10);
  const navigate = Route.useNavigate();

  const { data, isLoading, isError } = getFileListApi({
    search,
    type: fileType,
    page: page,
    limit: pageSize
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;
  const mediaItems: MediaItem[] = data?.data || [];
  const total = data?.pagination?.total || 0;

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

        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => navigate({ search: { page: 1 } })}
                  className={page === 1 ? "opacity-50 cursor-not-allowed" : ""}
                />
              </PaginationItem>
              {Array.from(
                { length: Math.ceil(total / pageSize) },
                (_, i) => i + 1
              ).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={p === page}
                    onClick={() => navigate({ search: { page: p } })}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    navigate({
                      search: (prev) => ({
                        ...prev,
                        page: Math.min(
                          Math.ceil(
                            data!.pagination!.total / data!.pagination!.limit
                          ),
                          page + 1
                        ),
                      }),
                    })
                  }
                  className={
                    page === Math.ceil(total / pageSize)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

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
