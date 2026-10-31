import { baseApi } from "../../api/baseApi";
import { setTokenCookie } from "../../server/storeCookies";
import { login } from "./authSlice";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const result = data?.result;
          if (result?.token) {
            dispatch(
              login({
                id: result.id,
                name: result.name,
                email: result.email,
                role: result.role,
                interests: result.interests || [],
                token: result.token,
              })
            );
            await setTokenCookie(result.token);
          }
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
      invalidatesTags: ["user", "note", "post"],
    }),

    register: builder.mutation({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const result = data?.result;
          if (result?.token) {
            dispatch(
              login({
                id: result.id || result._id,
                name: result.name,
                email: result.email,
                role: result.role,
                interests: result.interests || [],
                token: result.token,
              })
            );
            await setTokenCookie(result.token);
          }
        } catch (error) {
          console.error("Registration failed:", error);
        }
      },
      invalidatesTags: ["user", "note", "post"],
    }),

    getMyProfile: builder.query({
      query: () => "/user-profile",
      providesTags: ["user"],
    }),

    updateProfile: builder.mutation({
      query: (body) => ({
        url: "/update-profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["user"],
    }),

    changePassword: builder.mutation({
      query: (body: { currentPassword: string; newPassword: string }) => ({
        url: "/change-password",
        method: "PUT",
        body,
      }),
    }),

    createAdminUser: builder.mutation({
      query: (body) => ({
        url: "/create-admin-user",
        method: "POST",
        body,
      }),
      invalidatesTags: ["user"],
    }),

    getAllUsers: builder.query({
      query: (params?: {
        page?: number;
        limit?: number;
        searchTerm?: string;
        role?: string;
        isActive?: string;
      }) => ({
        url: "/all-users",
        params,
      }),
      providesTags: ["user"],
    }),

    getSingleUser: builder.query({
      query: (userId: string) => `/users/${userId}`,
      providesTags: ["user"],
    }),

    updateUser: builder.mutation({
      query: ({ userId, data }: { userId: string; data: Record<string, unknown> }) => ({
        url: `/users/${userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),

    deleteUser: builder.mutation({
      query: (userId: string) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),

    getUsersGroupedByInterests: builder.query({
      query: (params?: { page?: number; limit?: number }) => ({
        url: "/users/grouped-by-interests",
        params,
      }),
      providesTags: ["user"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMyProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useCreateAdminUserMutation,
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUsersGroupedByInterestsQuery,
} = authApi;

