import DrawerPublic from "@/components/editor/drawer-public";
import { MediaLibrary } from "@/components/media-library";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layout } from "@/layout";
import { createLazyFileRoute } from "@tanstack/react-router";
import { ImageIcon, Settings } from "lucide-react";
import { useState } from "react";

export const Route = createLazyFileRoute("/dashboard/editor")({
  component: RouteComponent,
});

function RouteComponent() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const handleSubmit = () => {
    setTitle("");
    setContent("");
    console.log(content, title, "清除内容");
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
                  defaultValue={title}
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
                    <Button variant="outline">
                      <Settings className="mr-2" />
                      发布设置
                    </Button>
                    <DrawerPublic
                      content={content}
                      title={title}
                      handleSubmit={handleSubmit}
                      open={showSettings}
                      onOpenChange={setShowSettings}
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
              <RichTextEditor value={content} onChange={setContent} />
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
