import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Save, Tag, Upload } from "lucide-react";
import { FC, useState } from "react";

interface DrawerPublicProps {
  children?: React.ReactNode;
  content: string;
  title: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  handleSubmit: () => void;
}

const DrawerPublic: FC<DrawerPublicProps> = ({
  children,
  content,
  open,
  onOpenChange,
  title,
  handleSubmit,
}) => {
  const setShowSettings = () => {
    console.log("setShowSettings", content, title);
    handleSubmit();
  };
  // 内部状态管理
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  return (
    <Drawer
      direction="right"
      open={isControlled ? open : internalOpen}
      onOpenChange={(val) => {
        if (isControlled) {
          onOpenChange?.(val);
        } else {
          setInternalOpen(val);
        }
      }}
    >
      {/* <DrawerTrigger asChild>
        {children || (
          <Button className="bg-primary">
            <Save className="mr-2 h-4 w-4" />
            保存
          </Button>
        )}
      </DrawerTrigger> */}
      <DrawerContent className="max-w-2xl ml-auto h-full rounded-none">
        <div className="p-6 space-y-6">
          <DrawerHeader className="p-0">
            <DrawerTitle>发布设置</DrawerTitle>
          </DrawerHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="excerpt">摘要</Label>
              <Textarea
                id="excerpt"
                placeholder="输入文章摘要"
                className="min-h-[100px]"
                defaultValue="本文探讨了中国传统文化元素如何在现代设计中得到创新应用，以及如何在保持传统精髓的同时赋予其现代感。"
              />
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>发布设置</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">状态</Label>
                    <Select defaultValue="published">
                      <SelectTrigger>
                        <SelectValue placeholder="选择状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="published">已发布</SelectItem>
                        <SelectItem value="draft">草稿</SelectItem>
                        <SelectItem value="scheduled">计划发布</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">分类</Label>
                    <Select defaultValue="1">
                      <SelectTrigger>
                        <SelectValue placeholder="选择分类" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">设计</SelectItem>
                        <SelectItem value="2">文化</SelectItem>
                        <SelectItem value="3">艺术</SelectItem>
                        <SelectItem value="4">科技</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>标签</Label>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        中国文化
                        <button className="ml-1 rounded-full hover:bg-muted">
                          <span className="sr-only">移除</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </button>
                      </Badge>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        设计
                        <button className="ml-1 rounded-full hover:bg-muted">
                          <span className="sr-only">移除</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </button>
                      </Badge>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        传统
                        <button className="ml-1 rounded-full hover:bg-muted">
                          <span className="sr-only">移除</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </button>
                      </Badge>
                      <Button variant="outline" size="sm" className="h-7 gap-1">
                        <Tag className="h-3.5 w-3.5" />
                        <span>添加</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>特色图片</CardTitle>
                  <CardDescription>设置文章的特色图片</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className=" overflow-hidden rounded-md border border-dashed border-muted flex items-center justify-center">
                    <div className=" flex flex-col items-center justify-center space-y-2 text-center">
                      <div className="rounded-full bg-primary/10 p-3">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-sm font-medium">
                        拖放图片或点击上传
                      </div>
                      <div className="text-xs text-muted-foreground">
                        推荐尺寸: 1200 x 630 像素
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-4 justify-end">
              <DrawerClose>
                <Button variant="outline">取消</Button>
              </DrawerClose>
              <Button
                onClick={() => {
                  setShowSettings();
                }}
              >
                确认发布
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
export default DrawerPublic;
