export interface IThird {
    id: number;
    name: string;
    officialUrl: string;
    description: string;
    created_at?: Date;
    updated_at?: Date;
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