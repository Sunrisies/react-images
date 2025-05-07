import { IParams } from "@/types";
import { MediaItem } from "@/types/media.type";
import { request, RequestType} from '@/utils/fetch'
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
type DataOnly<T> = Pick<RequestType<T>, 'data'>['data'];
// 获取文件列表
export const getFileListApi = (
  params: Partial<IParams> & { search?: string; type?: string } = {}
) => {
  const mergedParams: IParams = {
    ...({ page: 1, limit: 8 } as IParams),
    ...params,
  };

  return useQuery < DataOnly< MediaItem[]>, AxiosError>({
    queryKey: ["fileList", params.search, params.type, params.page, params.limit],
    queryFn: async (): Promise<DataOnly<MediaItem[]>> => {
      const searchParams = new URLSearchParams();
      Object.entries(mergedParams).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          searchParams.append(key, value.toString());
        }
      });
      const { code, data } = await request.get<MediaItem[]>(`/storage?${searchParams}`);
      if (code !== 200) {
        toast.error("获取文件列表失败");
      }
      const newData = {
        ...data,
        data: data.data.map(item => ({ ...item, url: item.path }))
      };
      console.log(newData,'11==1=1=1=1=');
      return newData;
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
