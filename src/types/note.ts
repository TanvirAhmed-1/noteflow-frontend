export type TUserRole = "user" | "admin";
export type TNoteType = "personal" | "community";

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: TUserRole;
  isActive?: boolean;
  interests: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface INoteOwner {
  _id: string;
  name: string;
  email: string;
  role?: TUserRole;
  interests?: string[];
}

export interface INote {
  _id: string;
  title: string;
  content: string;
  type?: TNoteType;
  userId: string | INoteOwner;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPost {
  _id: string;
  title: string;
  content: string;
  interest?: string;
  type?: TNoteType;
  source?: "post" | "note";
  userId: string | INoteOwner;
  createdAt?: string;
  updatedAt?: string;
}

export interface IInterestGroup {
  interest: string;
  totalUsers: number;
  users: {
    _id: string;
    name: string;
    email: string;
    role: TUserRole;
  }[];
}
