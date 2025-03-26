import { useAppAxios } from "@/hooks/useAppAxios";
import { MediaItem } from "@/types/media.type";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
// 上传文件
export const uploadFileApi = () => {
  const { post } = useAppAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file, file.name);
      const { code, message } = await post(`/oss/upload/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (code === 200) {
        toast.success("上传成功");
      } else {
        toast.error(message || "上传失败");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fileList"] });
    },
  });
};
// 获取文件列表
export const getFileListApi = () => {
  const { get } = useAppAxios();
  return useQuery<{ data: MediaItem[]; total?: number }, AxiosError>({
    queryKey: ["fileList"],
    queryFn: async () => await get<MediaItem[]>(`/oss`),
  });
};
