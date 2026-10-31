import { baseApi } from "../../api/baseApi";
import { IInterest, InterestQueryParams, TInterestStatus } from "@/types/interest";

export const interestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInterests: builder.query<
      {
        success: boolean;
        statusCode: number;
        message: string;
        meta: {
          page: number;
          limit: number;
          total: number;
          totalPage: number;
        };
        result: IInterest[];
      },
      InterestQueryParams | void
    >({
      query: (params) => ({
        url: "/interests",
        params: params || {},
      }),
      providesTags: ["interest"],
    }),

    getSingleInterest: builder.query<{ success: boolean; result: IInterest }, string>({
      query: (interestId) => ({
        url: `/interests/${interestId}`,
      }),
      providesTags: ["interest"],
    }),

    createInterest: builder.mutation<
      { success: boolean; message: string; result: IInterest },
      { title: string; description?: string; status?: TInterestStatus; color?: string }
    >({
      query: (body) => ({
        url: "/interests",
        method: "POST",
        body,
      }),
      invalidatesTags: ["interest"],
    }),

    updateInterest: builder.mutation<
      { success: boolean; message: string; result: IInterest },
      { interestId: string; data: Partial<IInterest> }
    >({
      query: ({ interestId, data }) => ({
        url: `/interests/${interestId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["interest"],
    }),

    toggleInterestStatus: builder.mutation<
      { success: boolean; message: string; result: IInterest },
      { interestId: string; status: TInterestStatus }
    >({
      query: ({ interestId, status }) => ({
        url: `/interests/${interestId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["interest"],
    }),

    deleteInterest: builder.mutation<{ success: boolean; message: string }, string>({
      query: (interestId) => ({
        url: `/interests/${interestId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["interest"],
    }),
  }),
});

export const {
  useGetInterestsQuery,
  useGetSingleInterestQuery,
  useCreateInterestMutation,
  useUpdateInterestMutation,
  useToggleInterestStatusMutation,
  useDeleteInterestMutation,
} = interestApi;

