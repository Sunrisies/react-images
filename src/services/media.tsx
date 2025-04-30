import { IParams } from "@/types";
import { MediaItem } from "@/types/media.type";
import { request} from '@/utils/fetch'
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file, file.name);
      const { code, message } = await request.upload(`/storage/`, formData);
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
export const getFileListApi = (
  params: Partial<IParams> & { search?: string } = {}
) => {
  const mergedParams: IParams = {
    ...({ page: 1, limit: 10 } as IParams),
    ...params,
  };

  return useQuery<{ data: MediaItem[]; total?: number }, AxiosError>({
    queryKey: ["fileList", params.search],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      Object.entries(mergedParams).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          searchParams.append(key, value.toString());
        }
      });
      const {code,data} = await request.get<MediaItem[]>(`/storage?${searchParams}`)
      if (code !== 200) {
        toast.error("获取文件列表失败");
      }
      const newData = {
        ...data,
       data: data.data.map(item => ({...item,url:item.path}))
      }
      return  newData
    },
    placeholderData: keepPreviousData,
  });
};
// 删除文件
export const deleteFileApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const {data,code} = await request.delete(`/storage/${id}`);
      if (code === 200) {
        toast.success("删除成功");
      } else {
        toast.error( "删除失败");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fileList"] });
    },
  });
};
