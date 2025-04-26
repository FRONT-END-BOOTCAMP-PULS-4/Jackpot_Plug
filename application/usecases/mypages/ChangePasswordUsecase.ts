import { UserRepository } from "@/domain/repositories/UserRepository";
import { ChangePasswordDto } from "./dto/ChangePassword.dto";
import bcrypt from "bcryptjs";

export class ChangePasswordUsecase {
  constructor(private userRepository: UserRepository) {}

  async execute(dto: ChangePasswordDto): Promise<void> {
    // 사용자 비밀번호 가져오기
    const currentPasswordHash = await this.userRepository.getUserPasswordById(dto.userId);
    
    if (!currentPasswordHash) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    // 현재 비밀번호 확인
    const isMatch = await bcrypt.compare(dto.currentPassword, currentPasswordHash);
    if (!isMatch) {
      throw new Error("현재 비밀번호가 일치하지 않습니다.");
    }

    // 새 비밀번호 해싱
    const hashedNewPassword = await bcrypt.hash(dto.newPassword, 10);

    // 비밀번호 업데이트
    await this.userRepository.updatePassword(dto.userId, hashedNewPassword);
  }
}