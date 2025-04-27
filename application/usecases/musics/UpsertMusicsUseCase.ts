import { SupabaseMusicRepository } from "@/infra/repositories/supabase/SupabaseMusicRepository";
import { UpsertMusicsInput } from "./dto/UpsertMusics.dto";

export class UpsertMusicsUsecase {
  private repository: SupabaseMusicRepository;

  constructor() {
    this.repository = new SupabaseMusicRepository();
  }

  async execute({ musics }: UpsertMusicsInput): Promise<boolean> {
    return await this.repository.upsertMusics(musics);
  }
}
