export type TInterestStatus = "published" | "draft";

export interface IInterest {
  _id: string;
  title: string;
  description?: string;
  status: TInterestStatus;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InterestQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  searchTerm?: string;
}

