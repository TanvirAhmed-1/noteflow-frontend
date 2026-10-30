import { baseApi } from "../../api/baseApi";

export const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: (body: { title: string; content: string }) => ({
        url: "/posts",
        method: "POST",
        body,
      }),
      invalidatesTags: ["post"],
    }),

    getPosts: builder.query({
      query: (params?: { page?: number; limit?: number }) => ({
        url: "/posts",
        params,
      }),
      providesTags: ["post"],
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
  }),
});

export const {
  useCreatePostMutation,
  useGetPostsQuery,
  useGetUserPostsQuery,
  useGetSinglePostQuery,
} = postApi;

