import { baseApi } from "../../api/baseApi";
import { TNoteType } from "@/types/note";

export interface PostQueryParams {
  page?: number;
  limit?: number;
  interest?: string;
  userName?: string;
  type?: string;
  date?: string;
  searchTerm?: string;
}

export const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: (body: {
        title: string;
        content: string;
        interest?: string;
        type?: TNoteType;
      }) => ({
        url: "/posts",
        method: "POST",
        body,
      }),
      invalidatesTags: ["post"],
    }),

    getPosts: builder.query({
      query: (params?: PostQueryParams) => ({
        url: "/posts",
        params,
      }),
      providesTags: ["post"],
    }),

    getAdminPostsTable: builder.query({
      query: (params?: PostQueryParams) => ({
        url: "/posts/admin-table",
        params,
      }),
      providesTags: ["post", "note", "user"],
    }),

    getUserPosts: builder.query({
      query: ({
        userId,
        page,
        limit,
      }: {
        userId: string;
        page?: number;
        limit?: number;
      }) => ({
        url: `/users/${userId}/posts`,
        params: { page, limit },
      }),
      providesTags: ["post"],
    }),

    getSinglePost: builder.query({
      query: (postId: string) => `/posts/${postId}`,
      providesTags: ["post"],
    }),

    updatePost: builder.mutation({
      query: ({
        postId,
        data,
      }: {
        postId: string;
        data: {
          title?: string;
          content?: string;
          interest?: string;
          type?: TNoteType;
        };
      }) => ({
        url: `/posts/${postId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["post"],
    }),

    deletePost: builder.mutation({
      query: (postId: string) => ({
        url: `/posts/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["post"],
    }),
  }),
});

export const {
  useCreatePostMutation,
  useGetPostsQuery,
  useGetAdminPostsTableQuery,
  useGetUserPostsQuery,
  useGetSinglePostQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postApi;
