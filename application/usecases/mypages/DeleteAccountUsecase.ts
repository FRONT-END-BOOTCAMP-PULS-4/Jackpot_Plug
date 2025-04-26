import { UserRepository } from "@/domain/repositories/UserRepository";

export class DeleteAccountUsecase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string): Promise<void> {
    const user = await this.userRepository.getUserById(userId);
    
    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    await this.userRepository.deleteUser(userId);
  }
}