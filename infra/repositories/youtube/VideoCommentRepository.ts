import { VideoCommentRepository } from "@/domain/repositories/VideoCommentRepository";
import { NextResponse } from "next/server";
import { axiosInstance } from "./ApiClient";
import axios from "axios";

export class YoutubeApiCommentRepository implements VideoCommentRepository {
  async fetchVideoComment(videoId: string): Promise<{
    comment: string;
  }> {
    try {
      const { data } = await axiosInstance.get("/commentThreads", {
        params: {
          part: "snippet",
          videoId: videoId,
          maxResults: 2,
          order: "time",
          textFormat: "plainText",
        },
      });

      const [first, second] = data.items;
      const firstDate = new Date(
        first.snippet.topLevelComment.snippet.publishedAt
      );
      const secondDate = new Date(
        second.snippet.topLevelComment.snippet.publishedAt
      );

      const isPinnedLikely = firstDate < secondDate;

      const comment = isPinnedLikely
        ? first.snippet.topLevelComment.snippet.textDisplay
        : "no pinned comment";

      return {
        comment,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw NextResponse.json(
          { error: "Failed to fetch video comments" },
          { status: error.response?.status || 500 }
        );
      } else {
        throw NextResponse.json(
          { error: "Unexpected server error" },
          { status: 500 }
        );
      }
    }
  }
}
