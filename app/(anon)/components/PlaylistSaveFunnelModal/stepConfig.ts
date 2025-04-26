export type FunnelStep = "review" | "select" | "createNew";

export const stepConfig: Record<
  FunnelStep,
  {
    title: string;
    buttonTitle: string;
  }
> = {
  review: {
    title: "플레이리스트 확인",
    buttonTitle: "리스트 저장하기",
  },
  select: {
    title: "플레이리스트에 담기",
    buttonTitle: "저장하기",
  },
  createNew: {
    title: "",
    buttonTitle: "생성하기",
  },
};
