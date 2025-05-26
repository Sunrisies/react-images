import { DataOnly, request } from "@/utils/fetch";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
export type warehouseType = (string | number)[][]
export const useGetUploadTime = () => {
    return useQuery<DataOnly<warehouseType>>({
      queryKey: ["uploadTime"],
      queryFn: async () => {
        const response = await request.get<warehouseType>(`/article/uploadTime`);
        return response.data;
      },
        // await request.get<warehouseType>(`/article/uploadTime`),
      placeholderData: keepPreviousData,
    });
  };