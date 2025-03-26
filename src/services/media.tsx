import { useAppAxios } from "@/hooks/useAppAxios";
import { MediaItem } from "@/types/media.type";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
interface IParams {
  page: number;
  limit: number;
}
// 获取文件列表
export const getFileListApi = (
  params: Partial<IParams> & { search?: string } = {}
) => {
  const { get } = useAppAxios();
  const mergedParams: IParams = {
    ...({ page: 1, limit: 10 } as IParams),
    ...params,
  };

  return useQuery<{ data: MediaItem[]; total?: number }, AxiosError>({
    queryKey: ["fileList", params.search],
    queryFn: async () => {
      // 创建带过滤条件的查询参数
      const searchParams = new URLSearchParams();
      Object.entries(mergedParams).forEach(([key, value]) => {
        // 过滤空值参数（包括空字符串和undefined）
        if (value !== undefined && value !== "") {
          searchParams.append(key, value.toString());
        }
      });
      return await get<MediaItem[]>(`/oss?${searchParams}`);
    },
    placeholderData: keepPreviousData,
  });
};
// 删除文件
export const deleteFileApi = () => {
  const { del } = useAppAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { code, message } = await del(`/oss/?id=${id}`);
      console.log(code, message);

      if (code === 200) {
        toast.success("删除成功");
      } else {
        toast.error(message || "删除失败");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fileList"] });
    },
  });
};
