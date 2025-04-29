import { ProfileResponse } from "./profile";

export interface WriteArticleRequest {
    article: {
        title: string;
        description: string;
        body: string;
        tagList: string[];
    }
}

export interface EditArticleRequest {
    article: {
        title: string;
        description: string;
        body: string;
    }
}

export interface ArticleResponse {
    slug: string;
    title: string;
    description: string;
    body: string;
    tagList: string[];
    createdAt: string;
    updatedAt: string;
    favorited: boolean;
    favoritesCount: number;
    author: ProfileResponse;
}

export interface MultipleArticlesResponse {
    articles: ArticleResponse[];
    articlesCount: number;
}

export interface SingleArticleResponse {
    article: ArticleResponse;
}