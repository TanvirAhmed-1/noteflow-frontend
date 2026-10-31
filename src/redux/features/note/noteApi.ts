import { baseApi } from "../../api/baseApi";
import { TNoteType } from "@/types/note";

export interface NoteQueryParams {
  page?: number;
  limit?: number;
  scope?: "own" | "all";
  type?: string;
  searchTerm?: string;
  userName?: string;
  date?: string;
  userId?: string;
}

export const noteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createNote: builder.mutation({
      query: (body: { title: string; content: string; type?: TNoteType }) => ({
        url: "/notes",
        method: "POST",
        body,
      }),
      invalidatesTags: ["note"],
    }),

    getNotes: builder.query({
      query: (params?: NoteQueryParams) => ({
        url: "/notes",
        params,
      }),
      providesTags: ["note"],
    }),

    getAllNotesByAdmin: builder.query({
      query: (params?: NoteQueryParams) => ({
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
        data: { title?: string; content?: string; type?: TNoteType };
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
