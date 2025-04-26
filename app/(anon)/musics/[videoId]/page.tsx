"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./page.module.scss";

import { useAuthStore } from "@/store/authStore";
import { MusicDto } from "@/application/usecases/musics/dto/Music.dto";
import { sortByOriginalOrder, toggleSelection } from "@/utils/musicUtils";

import VideoExtractor from "../../components/VideoExtractor";
import MusicInfoCard from "../../components/musicInfoCard/MusicInfoCard";
import ListItem from "@/app/components/list/ListItem";
import { RoundBtn } from "@/app/components/button/Buttons";
import RouteModal from "@/app/components/modal/RouteModal";
import { useVideoExtract } from "@/hooks/useVideoExtract";
import PlaylistSaveFunnelModal from "../../components/PlaylistSaveFunnelModal/PlaylistSaveFunnelModal";
import useModal from "@/hooks/useModal";

interface VideoData {
  title: string;
  channelTitle: string;
  thumbnail: string;
  duration: string;
  musicList: string[];
  videoUrl: string;
}

export default function MusicPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isLogin, setIsLogin] = useState(isAuthenticated);
  const { videoId } = useParams() as { videoId: string };
  const [data, setData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const { extract, routeModal, modalMessage } = useVideoExtract();

  const [selectedMusicList, setSelectedMusicList] = useState<string[]>([]);
  const [saveTrackList, setSaveTrackList] = useState<MusicDto[]>([]);
  const playlistSaveModal = useModal();

  useEffect(() => {
    const cached = sessionStorage.getItem(videoId);

    if (cached) {
      setData(JSON.parse(cached));
      setLoading(false);
    } else {
      extract({
        videoId,
        onSuccess: (data) => {
          setData(data);
          setLoading(false);
        },
      });
    }
  }, [videoId]);

  const handleAddMusic = (title: string) => {
    setSelectedMusicList((prev) => toggleSelection(prev, title));
  };

  const handleSearchMusic = async (selectedMusicList: string[]) => {
    const sortedSelectMusiclist = sortByOriginalOrder(
      data!.musicList,
      selectedMusicList
    );

    try {
      const { data } = await axios.get(`/api/musics/search`, {
        params: {
          lists: sortedSelectMusiclist.join(","),
        },
      });

      setSaveTrackList(data);
      playlistSaveModal.open();
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <>
      {loading ? (
        <p>로딩 중...</p>
      ) : !data ? (
        <p>데이터 없음</p>
      ) : (
        <div>
          <VideoExtractor defaultUrl={data.videoUrl} size="small" />
          <div className={styles.container}>
            <MusicInfoCard
              thumbnailSrc={data.thumbnail}
              title={data.title}
              channelTitle={data.channelTitle}
              duration={data.duration}
            />
            <div className={styles.musiclist_container}>
              <ul className={styles.musiclist}>
                {data.musicList.map((music, index) => (
                  <ListItem
                    mode="extract"
                    title={music}
                    key={index}
                    isLogin={isLogin}
                    onSelectToggle={() => handleAddMusic(music)}
                    isSelected={selectedMusicList.includes(music)}
                  />
                ))}
              </ul>
              <div className={styles.button_container}>
                {!isLogin && (
                  <div className={styles.animation}>
                    로그인 하면 사용할 수 있어요! 👉
                  </div>
                )}
                <RoundBtn
                  text="플레이리스트 만들기"
                  size="md"
                  color="accent"
                  customClassName={
                    !isLogin || selectedMusicList.length === 0 ? "disabled" : ""
                  }
                  onClick={() => handleSearchMusic(selectedMusicList)}
                />
              </div>
            </div>
          </div>
          <PlaylistSaveFunnelModal
            isOpen={playlistSaveModal.isOpen}
            onClose={playlistSaveModal.close}
            mode="extract"
            initialTracks={saveTrackList}
          />
        </div>
      )}
      <RouteModal
        isOpen={routeModal.isOpen}
        onClose={routeModal.close}
        buttonText="네, 검색하러 갈게요."
        targetRoute="/search"
        message={modalMessage}
      />
    </>
  );
}
