import {
  EditArticleRequest,
  MultipleArticlesResponse,
  SingleArticleResponse,
  WriteArticleRequest,
} from "../types/article";
import apiClient from "./axiosConfig";

export const postArticle = async (
  request: WriteArticleRequest
): Promise<SingleArticleResponse> => {
  const response = await apiClient.post<SingleArticleResponse>(
    "/articles",
    request
  );
  return response.data;
};

export const getArticles = async (
  tag?: string,
  author?: string,
  favorited?: string,
  offset: number = 0,
  limit: number = 20
): Promise<MultipleArticlesResponse> => {
  const params = {
    ...(tag && { tag }),
    ...(author && { author }),
    ...(favorited && { favorited }),
    offset,
    limit,
  };

  const response = await apiClient.get<MultipleArticlesResponse>("/articles", {
    params,
  });
  return response.data;
};

export const getArticle = async (
  slug: string
): Promise<SingleArticleResponse> => {
  const response = await apiClient.get<SingleArticleResponse>(
    `/articles/${slug}`
  );
  return response.data;
};

export const updateArticle = async (
  slug: string,
  request: EditArticleRequest
): Promise<SingleArticleResponse> => {
  const response = await apiClient.put<SingleArticleResponse>(
    `/articles/${slug}`,
    request
  );
  return response.data;
};

export const deleteArticle = async (slug: string): Promise<void> => {
  await apiClient.delete(`/articles/${slug}`);
};

export const getArticlesFeed = async (
  offset: number = 0,
  limit: number = 20
): Promise<MultipleArticlesResponse> => {
  const params = {
    offset,
    limit,
  };
  const response = await apiClient.get<MultipleArticlesResponse>(
    `/articles/feed`,
    { params }
  );
  return response.data;
};
