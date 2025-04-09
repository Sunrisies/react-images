import { useAppAxios } from "@/hooks/useAppAxios";
import { IThird } from "@/types/third.type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const getThirdApi = ({
    page,
    limit,
}: {
    page: number;
    limit: number;
}) => {
    const { get } = useAppAxios();
    return useQuery<{ data: IThird[] }, AxiosError>({
        queryKey: ["thirdPartyLibrary", page, limit],
        queryFn: async () =>
            (await get<IThird[]>(`/thirdPartyLibrary?page=${page}&limit=${limit}`)).data,
        placeholderData: keepPreviousData,
    });
}