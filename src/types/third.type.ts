export interface IThird {
    id: number;
    name: string;
    officialUrl: string;
    description: string;
    metadata: string;
    created_at: string;
    updated_at: string;
    category: ICategory;
    tags: ITags[];
}

export interface ITags {
    id: number;
    name: string;
}

export interface ICategory {
    id: number;
    name: string;
}