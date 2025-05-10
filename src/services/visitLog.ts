import { IParams } from '@/types';
import { request } from '@/utils/fetch'
import { useQuery } from "@tanstack/react-query";
import { URLSearchParamsUtils } from 'sunrise-utils';

// 访问日志的类型定义
interface VisitSession {
    session_id: string;
    website_id: string;
    hostname: string;
    browser: string;
    os: string;
    device: string;
    screen: string;
    language: string;
    country: string;
    subdivision1: string;
    subdivision2: string | null;
    city: string;
    created_at: string;
}

interface VisitLog {
    event_id: string;
    website_id: string;
    session_id: string;
    visit_id: string;
    created_at: string;
    url_path: string;
    url_query: string;
    referrer_path: string | null;
    referrer_query: string | null;
    referrer_domain: string | null;
    page_title: string | null;
    event_type: number;
    event_name: string | null;
    tag: string | null;
    session: VisitSession;
}

interface VisitLogParams {
    page?: number;
    limit?: number;
}

// 获取访问日志的查询 hook
export const useVisitLogs = (params: VisitLogParams = {}) => {
    const mergedParams: IParams = {
        ...({ page: 1, limit: 10 } as IParams),
        ...params,
    };
    const newParams = URLSearchParamsUtils(mergedParams)
    return useQuery({
        queryKey: ['visitLogs', params],
        queryFn: async () => {
            const response = await request.get<VisitLog[]>(`/visitLog?${newParams}`);
            return response.data;
        }
    });
};