import { request } from "@/utils/fetch";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
type TypeOptions = {
  value: number;
  label: string;
};
export const getTagsApi = () => {
  return useQuery<TypeOptions[], AxiosError>({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await request.get<TypeOptions[]>(`/tags`);
      console.log(response, "response"); // 打印响应数据以进行调试
      return response.data.data;
    },
    placeholderData: keepPreviousData,
  });
};
export const getCategoriesApi = () => {
  return useQuery<TypeOptions[], AxiosError>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await request.get<TypeOptions[]>(
        `/categories?type=library`
      );
      console.log(response, "response"); // 打印响应数据以进行调试
      return response.data.data;
    },
    placeholderData: keepPreviousData,
  });
};
