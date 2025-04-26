import { User } from "@/domain/entities/Mypage";

export interface UserRepository {
  getUserById(userId: string): Promise<User | null>;
  getUserPasswordById(userId: string): Promise<string | null>;
  uploadProfileImage(file: File): Promise<string>;
  updateUser(userId: string, updates: { profileName?: string; profileImage?: string }): Promise<void>;
  updatePassword(userId: string, newPasswordHash: string): Promise<void>;
  deleteUser(userId: string): Promise<void>;
}