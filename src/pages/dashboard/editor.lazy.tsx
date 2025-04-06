import DrawerPublic from "@/components/editor/drawer-public";
import { MediaLibrary } from "@/components/media-library";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layout } from "@/layout";
import { usePostEdit } from "@/services/edit";
import { ArticleFormValues } from "@/utils/schemas";
import { uploadImage } from "@/utils/update";
import { createLazyFileRoute } from "@tanstack/react-router";
import { ImageIcon, Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createLazyFileRoute("/dashboard/editor")({
  component: RouteComponent,
});

function RouteComponent() {
  const { mutateAsync } = usePostEdit();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const handleSubmit = () => {
    setTitle(() => "");
    setContent(() => "");
    console.log(content, title, "清除内容");
  };
  const onSubmit = async (item: ArticleFormValues) => {
    // item.categoryId = +item.categoryId;
    const data = await mutateAsync({
      title,
      content,
      ...item,
      categoryId: +item.categoryId,
      author: "朝阳",
    });
    if (data === 200) {
      setTitle(() => "");
      setContent(() => "");
      console.log(content, title, "清除内容");
      setShowSettings(false);
      toast.success("发布成功");
    }
    console.log(data, "提交数据");
    console.log(content, title, "提交内容", item);
  };
  const onUploadImg = async (
    files: File[],
    callback: (urls: string[]) => void
  ) => {
    const res = await uploadImage(files[0]);
    callback([res]);
  };
  return (
    <Layout>
      <div className="flex-1 h-full">
        <div className="flex flex-col gap-2 h-full">
          <div className="h-full flex flex-col gap-3">
            <div className="space-y-2 flex justify-between gap-2 items-center">
              <div className="flex-1 flex gap-2 items-center">
                <Label className="w-10" htmlFor="title">
                  标题
                </Label>
                <Input
                  id="title"
                  placeholder="输入文章标题"
                  value={title}
                  // defaultValue={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowMediaLibrary(true)}
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      插入媒体
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowSettings(true)}
                    >
                      <Settings className="mr-2" />
                      发布设置
                    </Button>
                    <DrawerPublic
                      content={content}
                      title={title}
                      handleSubmit={handleSubmit}
                      open={showSettings}
                      onOpenChange={setShowSettings}
                      onSubmit={onSubmit}
                      onCancel={() => {
                        console.log("取消发布");
                        setShowSettings(false);
                      }}
                      description={content
                        .replace(/#{1,6}\s?/g, "") // 移除标题符号
                        .replace(/\*\*(.*?)\*\*/g, "$1") // 移除加粗
                        .replace(/\*(.*?)\*/g, "$1") // 移除斜体
                        .replace(/\[(.*?)\]\(.*?\)/g, "$1") // 移除链接
                        .slice(0, 200)}
                      //   onSubmit={() => {
                      //     // 提交逻辑
                      //     setShowSettings(false);
                      //   }}
                    ></DrawerPublic>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <RichTextEditor
                value={content}
                onChange={setContent}
                onUploadImg={onUploadImg}
              />
            </div>
          </div>
        </div>

        {showMediaLibrary && (
          <MediaLibrary onClose={() => setShowMediaLibrary(false)} />
        )}
      </div>
    </Layout>
  );
}
