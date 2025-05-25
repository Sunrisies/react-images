import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  DrawerDescription,
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
import { request } from "@/utils/fetch";
import { Textarea } from "@/components/ui/textarea";
import { Save, Tag, Upload, X } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { ArticleFormValues, articleSchema } from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
type TypeOptions = {
  value: number;
  label: string;
};

const getTags = async (): Promise<TypeOptions[]> => {
  const { data, code } = await request.get<TypeOptions[]>(`/tags`);
  return code === 200 ? data.data : [];
};
const getCategories = async (): Promise<TypeOptions[]> => {
  const { data, code } = await request.get<TypeOptions[]>(`/categories`);
  return code === 200 ? data.data : [];
};

interface DrawerPublicProps {
  children?: React.ReactNode;
  content: string;
  title: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  handleSubmit: () => void;
  readonly onSubmit: (values: ArticleFormValues) => void;
  readonly onCancel: () => void;
  description: string;
}
type FormValues = {
  firstName: string;
  lastName: string;
};
const DrawerPublic: FC<DrawerPublicProps> = ({
  children,
  content,
  open,
  onOpenChange,
  title,
  // handleSubmit,
  onSubmit,
  onCancel,
  description,
}) => {
  console.log("DrawerPublic", content, title, description);
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      categoryId: "",
      tagIds: [],
      description: description || "",
      // coverImage: "",
    },
  });

  const {
    data: tags,
    isLoading: isTagsLoading,
    isError: isTagsError,
  } = useQuery<TypeOptions[]>({
    queryKey: ["tags"], // 查询的唯一标识
    queryFn: getTags, // 查询函数
  });
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useQuery<TypeOptions[]>({
    queryKey: ["categories"], // 查询的唯一标识
    queryFn: getCategories, // 查询函数
  });
  const setShowSettings = () => {
    console.log("setShowSettings", content, title, selectedTags);
    // handleSubmit();
  };
  // 内部状态管理
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  // 在组件顶部添加状态管理
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  // 标签处理函数
  const handleAddTag = (tagId: number) => {
    if (!selectedTags.includes(tagId)) {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleRemoveTag = (tagId: number) => {
    setSelectedTags(selectedTags.filter((id) => id !== tagId));
  };
  // 新增 useEffect 重置表单
  useEffect(() => {
    if (open || internalOpen) {
      form.reset({
        categoryId: "",
        tagIds: [],
        description: description || "",
      });
    }
  }, [open, internalOpen]);

  // console.log(form, "form");
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
      <DrawerContent className="max-w-2xl ml-auto rounded-none h-[calc(100%-64px)] -top-8 z-[9999]">
        <div className="p-6 space-y-6">
          <DrawerHeader className="p-0">
            <DrawerTitle>发布设置</DrawerTitle>
            <DrawerDescription className="pt-2">
              文章发布参数配置及元数据设置
            </DrawerDescription>
          </DrawerHeader>
          <Form {...form}>
            <form
              className="space-y-4 max-w-2xl"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="w-20">
                      摘要<span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="flex flex-col gap-2">
                      <FormControl>
                        <Textarea
                          {...field}
                          id="excerpt"
                          placeholder="输入文章摘要"
                          className="min-h-[100px]"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="w-20">
                      分类<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isCategoriesLoading || isCategoriesError}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择分类" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((category) => (
                            <SelectItem
                              key={category.value}
                              value={category.value.toString()}
                            >
                              {category.label}
                            </SelectItem>
                          ))}
                          {(isCategoriesLoading || isCategoriesError) && (
                            <div className="px-2 py-1.5 text-sm text-muted-foreground">
                              {isCategoriesLoading ? "加载中..." : "加载失败"}
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="w-20">
                      状态<span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="flex flex-col gap-2 ">
                      <FormControl>
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
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="tagIds"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="w-20">
                      标签<span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="flex flex-col gap-2">
                      <FormControl>
                        <div className="flex flex-wrap gap-2">
                          {field.value?.map((tagId) => {
                            const tag = tags?.find((t) => t.value === +tagId);
                            return (
                              <Badge
                                key={+tagId}
                                variant="outline"
                                className="flex items-center gap-1 cursor-pointer"
                              >
                                {tag?.label || "未知标签"}

                                <X
                                  size="20"
                                  onClick={() => {
                                    const newTags = field.value.filter(
                                      (id) => id !== tagId
                                    );
                                    field.onChange(newTags);
                                  }}
                                  className="ml-1 rounded-full hover:bg-muted"
                                />
                              </Badge>
                            );
                          })}
                          <Select
                            key={field.value?.join(",")}
                            onValueChange={(value) => {
                              const numericValue = Number(value);
                              if (!isNaN(numericValue)) {
                                const currentValues = field.value || [];
                                if (!currentValues.includes(numericValue)) {
                                  field.onChange([
                                    ...currentValues,
                                    numericValue,
                                  ]);
                                }
                              }
                            }}
                            disabled={isTagsLoading || isTagsError}
                          >
                            <SelectTrigger className="h-7 gap-1 w-[100px]">
                              <SelectValue placeholder="添加标签" />
                            </SelectTrigger>
                            <SelectContent>
                              {tags?.map((tag) => (
                                <SelectItem
                                  key={tag.value}
                                  value={String(tag.value)}
                                  disabled={field.value!.includes(tag.value)}
                                >
                                  {tag.label}
                                </SelectItem>
                              ))}
                              {(isTagsLoading || isTagsError) && (
                                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                  {isTagsLoading ? "加载中..." : "加载失败"}
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={onCancel}>
                  取消
                </Button>
                <Button type="submit">确定并发布</Button>
              </div>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
export default DrawerPublic;
