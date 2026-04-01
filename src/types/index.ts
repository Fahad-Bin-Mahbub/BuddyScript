export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPost {
  _id: string;
  author: IUser;
  content: string;
  image?: string;
  visibility: "public" | "private";
  likes: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IComment {
  _id: string;
  post: string;
  author: IUser;
  parentComment?: string;
  content: string;
  likes: string[];
  likesCount: number;
  repliesCount: number;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  nextCursor?: string;
  hasMore: boolean;
}
