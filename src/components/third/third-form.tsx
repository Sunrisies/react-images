import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
// import { getCategories, getTags } from "@/services/third";
import { getCategoriesApi, getTagsApi } from "@/services/common";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";
import { usePostThirdApi, usePutThirdApi } from "@/services/third";

export function ThirdForm({
  initialData,
  onSuccess,
}: {
  initialData?: any;
  onSuccess: () => void;
}) {
  const { mutateAsync: addThird } = usePostThirdApi();
  const { mutateAsync: updateThirdApi } = usePutThirdApi();
  console.log(initialData, "initialData");
  const hasValidInitialData = initialData?.id !== undefined;
  const form = useForm({
    defaultValues: hasValidInitialData
      ? {
          ...initialData,
          categoryId: initialData.category?.id.toString() || "",
          tagIds: initialData.tags?.map((tag) => tag.id) || [],
        }
      : {
          name: "",
          officialUrl: "",
          description: "",
          metadata: {},
          categoryId: "",
          tagIds: [] as number[],
        },
  });

  // 获取分类和标签选项
  //   const { data: categories } = useQuery(["categories"], getCategories);
  //   const { data: tags } = useQuery(["tags"], getTags);
  const {
    data: tags,
    isLoading: isTagsLoading,
    isError: isTagsError,
  } = getTagsApi();

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = getCategoriesApi();
  const handleSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        categoryId: +data.categoryId,
      };
      let response;
      if (hasValidInitialData) {
        const { name, officialUrl, categoryId, tagIds, description } = data;
        const payload = {
          description,
          metadata: {},
          name,
          officialUrl,
          categoryId: +categoryId,
          tagIds,
        };
        await updateThirdApi({ id: initialData.id, update: payload });
      } else {
        response = await addThird(payload);
      }
      // if (response!.code === 200) {
      onSuccess();
      // }
      //   onSuccess();
    } catch (error) {
      console.error("操作失败:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>名称</FormLabel>
              <FormControl>
                <Input {...field} placeholder="输入库名称" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="officialUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>官方链接</FormLabel>
              <FormControl>
                <Input {...field} placeholder="输入官网地址" />
              </FormControl>
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
                            field.onChange([...currentValues, numericValue]);
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

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>描述</FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="submit">提交</Button>
        </div>
      </form>
    </Form>
  );
}
