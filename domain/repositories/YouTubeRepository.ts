import { YouTubeVideo } from "../entities/YouTubeVideo";
import { NextResponse } from "next/server";

export interface YouTubeRepository {
  searchByIsrc(isrcCodes: string[]): Promise<YouTubeVideo[]>;
  searchDirectly(query: string): Promise<NextResponse>;
}
