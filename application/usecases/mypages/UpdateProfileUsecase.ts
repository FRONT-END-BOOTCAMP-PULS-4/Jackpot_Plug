import { UserRepository } from "@/domain/repositories/UserRepository";
import { UpdateProfileDto } from "./dto/UpdateProfile.dto";

export class UpdateProfileUsecase {
  constructor(private userRepository: UserRepository) {}

  async execute(dto: UpdateProfileDto) {
    if (dto.profileName && (dto.profileName.length < 2 || dto.profileName.length > 10)) {
      throw new Error("닉네임은 2자 이상 10자 이하로 입력해주세요.");
    }

    const hasChanges = dto.profileName || dto.profileImage;
    if (!hasChanges) {
      throw new Error("수정할 항목이 없습니다.");
    }

    // 현재 사용자 이름 가져오기
    const currentUser = await this.userRepository.getUserById(dto.userId);
    if (!currentUser) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    // 프로필 이미지 업로드 및 업데이트 처리
    let profileImageUrl: string | undefined;
    if (dto.profileImage instanceof File) {
      profileImageUrl = await this.userRepository.uploadProfileImage(dto.profileImage);
    }

    // 사용자 정보 업데이트
    const updates: {
      profileName?: string;
      profileImage?: string;
    } = {};

    if (dto.profileName) {
      updates.profileName = dto.profileName;
    }

    if (profileImageUrl) {
      updates.profileImage = profileImageUrl;
    }

    await this.userRepository.updateUser(dto.userId, updates);

    return {
      profileName: updates.profileName,
      profileImage: updates.profileImage
    };
  }
}