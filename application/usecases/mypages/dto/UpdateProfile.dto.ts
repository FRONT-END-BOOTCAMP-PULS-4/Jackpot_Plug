export class UpdateProfileDto {
    constructor(
      public readonly userId: string,
      public readonly profileName?: string,
      public readonly profileImage?: File | null
    ) {}
  }