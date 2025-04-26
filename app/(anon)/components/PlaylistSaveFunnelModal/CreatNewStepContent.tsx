import TextInput from "@/app/components/input/TextInput"; // 너 쓰는 TextInput 컴포넌트에 맞게

import styles from "./styles.module.scss";

interface CreateNewStepContentProps {
  setPlaylistName: (value: string) => void;
}

export default function CreateNewStepContent({
  setPlaylistName,
}: CreateNewStepContentProps) {
  return (
    <div className={styles.create_new_container}>
      <div className={styles.create_new_title}>새 리스트 제목</div>
      <TextInput
        placeholder="플레이리스트 이름을 작성해주세요. (최대 50자)"
        label="playlistName"
        maxLength={50}
        setChangeText={setPlaylistName}
      />
    </div>
  );
}
