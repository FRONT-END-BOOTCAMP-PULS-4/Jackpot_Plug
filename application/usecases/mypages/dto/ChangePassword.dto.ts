export class ChangePasswordDto {
    constructor(
      public readonly userId: string,
      public readonly currentPassword: string,
      public readonly newPassword: string
    ) {}
  }