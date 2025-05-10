export interface ICommit {
    author: IAuthor;
    committer: ICommitter;
    message: string;
    tree: ITree;
    url: string;
    comment_count: number;
    verification: IVerification;
}

export interface IAuthor {
    name: string;
    email: string;
    date: string;
}

export interface ICommitter {
    name: string;
    email: string;
    date: string;
}

export interface ITree {
    sha: string;
    url: string;
}

export interface IVerification {
    verified: boolean;
    reason: string;
    signature: string;
    payload: string;
    verified_at: string;
}

export interface IAuthor {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    user_view_type: string;
    site_admin: boolean;
}

export interface ICommitter {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    user_view_type: string;
    site_admin: boolean;
}

export interface IParents {
    sha: string;
    url: string;
    html_url: string;
}

export interface IGithubCommit {
    sha: string;
    node_id: string;
    commit: ICommit;
    url: string;
    html_url: string;
    comments_url: string;
    author: IAuthor;
    committer: ICommitter;
    parents: IParents[];
}