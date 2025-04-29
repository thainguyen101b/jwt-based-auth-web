import { TOKEN_KEY } from "../contexts/AuthContext";
import {
  EditArticleRequest,
  MultipleArticlesResponse,
  SingleArticleResponse,
  WriteArticleRequest,
} from "../types/article";
import { ApiError } from "../types/error";

const API_URL = import.meta.env.VITE_API_URL;

export const postArticle = async (
  request: WriteArticleRequest
): Promise<SingleArticleResponse> => {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_URL}/articles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorData = data as ApiError;
    throw errorData;
  }

  return data;
};

export const getArticles = async (
  tag?: string,
  author?: string,
  favorited?: string,
  offset: number = 0,
  limit: number = 20
): Promise<MultipleArticlesResponse> => {
  const token = localStorage.getItem(TOKEN_KEY);

  const params = new URLSearchParams({
    tag: tag ? tag.toString() : "",
    author: author ? author.toString() : "",
    favorited: favorited ? favorited.toString() : "",
    offset: offset.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(`${API_URL}/articles?${params.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const errorData = data as ApiError;
    throw errorData;
  }

  return data;
};

export const getArticle = async (
  slug: string
): Promise<SingleArticleResponse> => {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_URL}/articles/${slug}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const errorData = data as ApiError;
    throw errorData;
  }

  return data;
};

export const updateArticle = async (
  slug: string,
  request: EditArticleRequest
): Promise<SingleArticleResponse> => {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_URL}/articles/${slug}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorData = data as ApiError;
    throw errorData;
  }

  return data;
};

export const deleteArticle = async (slug: string): Promise<void> => {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_URL}/articles/${slug}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = (await response.json()) as ApiError;
    throw errorData;
  }
};

export const getArticlesFeed = async (
  offset: number = 0,
  limit: number = 20
): Promise<MultipleArticlesResponse> => {
  const token = localStorage.getItem(TOKEN_KEY);

  const params = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
  });
  const response = await fetch(
    `${API_URL}/articles/feed?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const errorData = data as ApiError;
    throw errorData;
  }

  return data;
};
