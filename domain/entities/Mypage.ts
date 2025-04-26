export interface User {
    id: string;
    email: string;
    profileName: string;
    profileImage: string | null;
  }
  
  export class UserProfile {
    constructor(
      public readonly id: string,
      public readonly email: string,
      public readonly profileName: string,
      public readonly profileImage: string | null
    ) {}
  
    public static fromData(data: User): UserProfile {
      return new UserProfile(
        data.id,
        data.email,
        data.profileName,
        data.profileImage
      );
    }
  
    public isValidProfileName(): boolean {
      return this.profileName.length >= 2 && this.profileName.length <= 10;
    }
  }