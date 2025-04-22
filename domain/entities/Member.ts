export class Member {
    constructor(
      public email: string,
      public password: string,
      public profileName: string,
      public profilePicUrl: string,
      public recentLogin: Date
    ) {}
  }
  