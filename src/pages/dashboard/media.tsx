import FileDetails from "@/components/media/fileDetails";
import UploadFiles from "@/components/media/uploadFiles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/layout";
import { MediaItem } from "@/types/media.type";
import { deleteFileApi, getFileListApi } from "@/services/media";
import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronDown,
  FileText,
  Filter,
  ImageIcon,
  MoreHorizontal,
  Search,
  Trash,
  Upload,
  Video,
} from "lucide-react";
import { useState } from "react";
import { formatChineseDateTime } from "sunrise-utils";

export const Route = createFileRoute("/dashboard/media")({
  component: RouteComponent,
});

function RouteComponent() {
  const { mutateAsync } = deleteFileApi();
  const [search, setSearch] = useState("");

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const { data, isLoading, isError } = getFileListApi({ search });
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;
  const mediaItems: MediaItem[] = data?.data || [];

  const toggleSelect = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const showDetails = (media: MediaItem) => {
    setSelectedMedia(media);
    setShowDetailsDialog(true);
  };

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
  const deleteMedia = async (id: number) => {
    const data = await mutateAsync(id);
  };
  const handleSearch = async (search: string) => {
    setSearch(search);
    // await getFileListApi({ search });
  };
  return (
    <Layout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">媒体库</h2>
          <Button
            className="bg-primary"
            onClick={() => setShowUploadDialog(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            上传文件
          </Button>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索媒体文件..."
                className="w-full pl-8"
                //   回车事件
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const searchValue = (e.target as HTMLInputElement).value;
                    handleSearch(searchValue);
                  }
                }}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="mr-2 h-4 w-4" />
                  筛选
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>全部文件</DropdownMenuItem>
                <DropdownMenuItem>图片</DropdownMenuItem>
                <DropdownMenuItem>视频</DropdownMenuItem>
                <DropdownMenuItem>文档</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>共 {mediaItems.length} 个文件</span>
            {selectedItems.length > 0 && (
              <span className="ml-2">已选择 {selectedItems.length} 个文件</span>
            )}
          </div>
        </div>

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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {mediaItems.map((item) => (
                <Card
                  key={item.id}
                  className={`overflow-hidden cursor-pointer ${selectedItems.includes(item.id) ? "ring-2 ring-primary" : ""}`}
                  onClick={() => toggleSelect(item.id)}
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
                            showDetails(item);
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">更多选项</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            showDetails(item);
                          }}
                        >
                          查看详情
                        </DropdownMenuItem>
                        <DropdownMenuItem>下载</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 dark:text-red-400"
                          onClick={() => deleteMedia(item.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-4">
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="h-10 px-4 text-left font-medium">文件名</th>
                    <th className="h-10 px-4 text-left font-medium">类型</th>
                    <th className="h-10 px-4 text-left font-medium">大小</th>
                    <th className="h-10 px-4 text-left font-medium">
                      上传日期
                    </th>
                    <th className="h-10 px-4 text-right font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {mediaItems.map((item) => (
                    <tr
                      key={item.id}
                      className={`border-b hover:bg-muted/50 ${selectedItems.includes(item.id) ? "bg-primary/10" : ""}`}
                      onClick={() => toggleSelect(item.id)}
                    >
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          {item.type?.startsWith("image") ? (
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          ) : item.type?.startsWith("video") ? (
                            <Video className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="font-medium">{item.title}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        {item.type || "未知"}
                      </td>
                      <td className="p-4 align-middle">{item.size}</td>
                      <td className="p-4 align-middle">{item.created_at}</td>
                      <td className="p-4 align-middle text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">更多选项</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                showDetails(item);
                              }}
                            >
                              查看详情
                            </DropdownMenuItem>
                            <DropdownMenuItem>下载</DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 dark:text-red-400"
                              onClick={() => deleteMedia(item.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
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
          </TabsContent>
        </Tabs>

        {/* 上传文件对话框 */}
        <UploadFiles
          showUploadDialog={showUploadDialog}
          setShowUploadDialog={setShowUploadDialog}
        ></UploadFiles>

        {/* 文件详情对话框 */}
        {selectedMedia && (
          <FileDetails
            showDetailsDialog={showDetailsDialog}
            setShowDetailsDialog={setShowDetailsDialog}
            selectedMedia={selectedMedia}
          ></FileDetails>
        )}
      </div>
    </Layout>
  );
}
