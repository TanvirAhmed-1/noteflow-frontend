import { baseApi } from "../../api/baseApi";

export const noteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createNote: builder.mutation({
      query: (body: { title: string; content: string }) => ({
        url: "/notes",
        method: "POST",
        body,
      }),
      invalidatesTags: ["note"],
    }),

    getNotes: builder.query({
      query: (params?: {
        page?: number;
        limit?: number;
        scope?: "own" | "all";
        userId?: string;
      }) => ({
        url: "/notes",
        params,
      }),
      providesTags: ["note"],
    }),

    getAllNotesByAdmin: builder.query({
      query: (params?: { page?: number; limit?: number; userId?: string }) => ({
        url: "/notes/all",
        params,
      }),
      providesTags: ["note"],
    }),

    getSingleNote: builder.query({
      query: (noteId: string) => `/notes/${noteId}`,
      providesTags: ["note"],
    }),

    updateNote: builder.mutation({
      query: ({
        noteId,
        data,
      }: {
        noteId: string;
        data: { title?: string; content?: string };
      }) => ({
        url: `/notes/${noteId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["note"],
    }),

    deleteNote: builder.mutation({
      query: (noteId: string) => ({
        url: `/notes/${noteId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["note"],
    }),
  }),
});

export const {
  useCreateNoteMutation,
  useGetNotesQuery,
  useGetAllNotesByAdminQuery,
  useGetSingleNoteQuery,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = noteApi;

