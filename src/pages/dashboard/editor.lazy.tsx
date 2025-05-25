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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { request } from '@/utils/fetch';

export const Route = createLazyFileRoute("/dashboard/editor")({
  component: RouteComponent,
});

function RouteComponent() {
  const search = Route.useSearch();
  const articleId = search.id;
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
  // 加载文章详情（编辑模式）
  useEffect(() => {
    if (articleId) {
      request.get(`/article/${articleId}`).then(res => {
        const article = res.data;
        setTitle(article.title);
        setContent(article.content);
        // 其他字段同理
      });
    }
  }, [articleId]);

  // 提交逻辑
  const onSubmit = async (item: ArticleFormValues) => {
    if (articleId) {
      // 编辑
      await request.put(`/article/${articleId}`, {
        title,
        content,
        ...item,
        categoryId: +item.categoryId,
        author: "朝阳",
      });
      toast.success("更新成功");
    } else {
      // 新增
      await mutateAsync({
        title,
        content,
        ...item,
        categoryId: +item.categoryId,
        author: "朝阳",
      });
      toast.success("发布成功");
    }
    setTitle("");
    setContent("");
    setShowSettings(false);
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
                        .replace(/\s+/g, " ") // 合并所有空白字符（包括换行）
                        .replace(/\s{2,}/g, " ") // 合并连续空格
                        .slice(0, 200)}
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
