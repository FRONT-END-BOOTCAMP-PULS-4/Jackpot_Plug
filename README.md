# <img width="1920" alt="plug-readme" src="https://github.com/user-attachments/assets/2aa23b1c-1e19-4cff-a56e-9d7be2045f8a" />

> **PLUG (플러그) - 플레이리스트 생성 재생 플랫폼**

> 개발 기간 : 25.04.07 ~ 25.04.28 (1차 개발 완료)

**📎 테스트 계정 (feat. 배포 예정)**
- 이메일 : plug@test.com
- 비밀번호 : 1q2w3e4r@

<br/>


### 🎰 Team JackPot

|  이름  | 역할                                                                      |
| :---- | :------------------------------------------------------------------------ |
|  송하 [@poan1221](https://github.com/poan1221)  | 아이디어 발의 / 기획 / 메인 페이지 음원 추출, 플레이리스트 저장 기능 개발 |
|  김별 [@lbyul](https://github.com/lbyul)  | 디자인 / 검색 페이지, 플레이리스트 조회, 재생 기능 개발                   |
| 임희건 [@HeekunLim](https://github.com/HeekunLim) | 회원가입, 로그인, 회원정보 수정 기능 개발                                 |
| 전진우 [@GiToon10100011](https://github.com/GiToon10100011) | 로그인 상태관리, 음원 ai 추천 기능 개발                                   |

👉 [Team Convention](https://github.com/FRONT-END-BOOTCAMP-PLUS-4/Jackpot_Plug/wiki/Team-Convention)

<br/>

## 🛠️ 프로젝트 소개

**"타임라인에서 내가 좋아하는 노래만 골라, 나만의 플레이리스트로!"**  
3시간짜리 플레이리스트 유튜브 영샹을 들으면서, '아 이 노래 빼고 듣고 싶다.', 'A, C, E, F 노래만 가진 플리어디 없나' 생각해본 적 없으신가요?

이 프로젝트는 그런 아이디어를 실현하기 위해 만들어졌습니다!

🎯 주요 목표:

- 긴 영상을 음악 리스트로 추출
- 추출된 리스트에서 원하는 곡만 골라 새로운 플레이리스트 생성
- 플레이리스트 저장 및 음악 재생
- Spotify 추천 기능 제공
- Youtube로 공유 및 플레이리스트 이동

 <br/>
 
## 📌 주요 기능

### 1. 원하는 곡만 선택해서 리스트 생성

- 유튜브 링크에 포함된 음악 리스트 추출
- (회원) 추출된 리스트 중 원하는 곡만 골라서 내 플레이리스트로!

![음원 추출 gif](https://github.com/user-attachments/assets/4d45a98d-3ed8-483d-929a-537f41a3e86f)


### 2. Spotify api / Youtube api 를 통한 정확한 음원 검색

- Spotify api를 통한 ISRC 코드를 기반으로 youtube 검색을 진행하여 공식 음원을 조회합니다.
- 검색한 음악도 바로 플레이리스트에 추가할 수 있어요!

![검색 기능 gif](https://github.com/user-attachments/assets/30567070-806a-427b-ac7a-37e7a7fec420)


### 3. 회원 전용 플레이리스트에서 음악 재생

- 저장된 플레이리스트 조회 및 재생 기능을 제공합니다.

![플레이리스트 재생 gif](https://github.com/user-attachments/assets/7ed07d8f-a7eb-4145-a9c9-c1303367ea35)

### 4. 회원가입, 로그인, 개인정보 수정

- 이메일 인증과 유효성 검사를 통과한 사용자만 가입 가능
- 가입 후 로그인, 개인정보 수정(이메일 제외), 회원 탈퇴 기능 제공

<img width="800" alt="이메일 인증 img" src="https://github.com/user-attachments/assets/35bf7471-fbf4-42a3-9ed3-10c123d35c5d" />

<br/><br/>

## 🔥 기술 스택

- **Web/DB**:
  ![React](https://img.shields.io/badge/react-61DAFB.svg?style=for-the-badge&logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white) ![nextjs](https://img.shields.io/badge/nextjs-000000.svg?style=for-the-badge&logo=nextdotjs&logoColor=white) ![zustand](https://img.shields.io/badge/zustand-F45D48.svg?style=for-the-badge&logo=zustand&logoColor=white) ![sass](https://img.shields.io/badge/sass-CC6699.svg?style=for-the-badge&logo=sass&logoColor=white)
  ![Supabase](https://img.shields.io/badge/supabase-3FCF8E.svg?style=for-the-badge&logo=firebase&logoColor=white)
- **외부 API 연동**:
  ![spotify](https://img.shields.io/badge/spotify.api-1ED760.svg?style=for-the-badge&logo=spotify&logoColor=white) ![youtubeAPI](https://img.shields.io/badge/youtube.API-FF0000.svg?style=for-the-badge&logo=youtube&logoColor=white)
- **Collabo**:
  ![figma](https://img.shields.io/badge/figma-F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white) ![jira](https://img.shields.io/badge/jira-0052CC.svg?style=for-the-badge&logo=jira&logoColor=white) ![discord](https://img.shields.io/badge/discord-5865F2.svg?style=for-the-badge&logo=discord&logoColor=white)

<br/>

## 🗓️ 프로젝트 관리
<img width="800" alt="지라 기획 이미지" src="https://github.com/user-attachments/assets/dedab5ab-9568-46d3-a8a1-e316d179849a" />
<br/>
- 이슈 추적 및 일정 관리를 위한 툴로 지라 사용

<br/>

## 📂 프로젝트 구조

```bash
├── app/
│   ├── api/
│   ├── (anon)/
│   │   ├── components/ # 페이지 내부 components
│   ├── (sign)/
│   ├── components/ # 공통 components (modal, button .. etc)
├── application/
│   ├── usecases/
│   ├── dto/
├── domain/
│   ├── entities/
│   ├── repositories/
├── hooks/
├── infra/
│   ├── repositories/
├── store/
├── utills/

```

- 4계층 클린아키텍쳐 구현 (app/api, application/usecase, domain, infra)
- app 외부에 hook, utills, store 등 공통 기능용 폴더 위치
- 공통 스타일을 위한 선언 파일만 public/styles 에 위치 (reset, mixin, variable) / 각 페이지별 스타일은 moduel.scss 로 적용

<br/>

## 📂 ERD
<img width="800" alt="Image" src="https://github.com/user-attachments/assets/049b7d9f-babd-4da2-adca-635a714398a9" />

<br/><br/>

## 🔫 트러블슈팅
### 1. YouTube 검색 API 는 짠돌이야..
<img width="500" alt="youtube api Image" src="https://github.com/user-attachments/assets/d4ccb267-331e-4bbd-a2d6-6d7a2375ffc7" /><br/>
- 문제점: 잘만 되던 검색 기능이 갑자기 api 오류로 진행되지 않는다면?
- 원인: 검색 api 의 사용 가능 하루 할당량이 너무 작음 ( 1검색 100 쿼터 / 1일 총 10,000 쿼터)
- 해결방안:

    <img width="500" alt="solution Image" src="https://github.com/user-attachments/assets/b538e4ca-143b-4073-8800-31b3f0b924d4" /> <br/>
  - Youtube 검색api 를 최소한으로 사용하기 위해, search-query 방안 등을 고려하였으나 법적 문제를 저지르지 않기 위해 할당량이 풍부한 다른 대체 api 와의 혼용을 고안.
  - Spotify api 에서 **ISRC 코드**를 얻어, 여러 번 검색할 필요 없이 **OR 연산자를 통해 Youtube 검색api에서는 동시 검색**
  - musics table 을 추가하여 한번 검색/플레이리스트 저장된 항목은 다시 진행하지 않고 db data를 검색할 수 있는 방향로 ERD 변경

### 2. 너는 바보야, spotify.. 검색 정확도가 이게 뭐야
- 문제점: BTS 의 Butter 를 검색헀는데, Butter-fly 가 나오는 등의 잘못된 검색 현상이 발생
- 원인: 검색어 유사도와 일치 단어를 기준으로 결과가 나옴
- 해결방안:

    <img width="500" alt="Image" src="https://github.com/user-attachments/assets/5c5eb7f9-b1c0-4fcd-bca1-7c2af6668e3e" /> <br/>
  - 명확한 검색어 유도를 통해 문제 최소화
 
<br/>

## 💫 개발 예정 기능
- 🎚️ 볼륨 조절 기능 추가
- 🔍 검색 방식 개선 (더 빠르고 정확하게)
- 📢 내가 만든 플레이리스트를 유튜브에도 공유 가능!

