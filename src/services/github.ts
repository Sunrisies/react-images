import { IGithubCommit } from '@/types/github.type';
import { request } from '@/utils/fetch';
import { useQuery } from '@tanstack/react-query';

interface CommitAuthor {
    name: string;
    email: string;
    date: string;
}

interface Commit {
    sha: string;
    commit: {
        author: CommitAuthor;
        committer: CommitAuthor;
        message: string;
    };
    html_url: string;
}

export const useCommitHistory = () => {
    return useQuery<IGithubCommit[]>({
        queryKey: ['commitHistory'],
        queryFn: async () => {
            const owner = 'Sunrisies';
            const repo = 'react-images';
            const branch = 'admin';
            const url = `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}&page=1&per_page=100`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                return data
            } catch (error) {
                console.error('获取提交历史失败:', error);
                throw error;
            }
        }
    });
};