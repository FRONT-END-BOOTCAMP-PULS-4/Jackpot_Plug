import { Member } from "../../domain/entities/Member";  // Member 클래스를 임포트

export interface IMemberRepository {
  createMember(member: Member): Promise<void>;
  getMemberByEmail(email: string): Promise<Member | null>;
}
