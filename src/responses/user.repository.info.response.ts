export interface UserRepositoryInfoResponseUserInfoRoot {
  userInfo: UserRepositoryInfoResponseUserInfo;
  seoProps: any;
}

export interface UserRepositoryInfoResponseUserInfo {
  id: number;
  shortId: string;
  uniqueId: string;
  nickname: string;
  avatarLarger: string;
  avatarMedium: string;
  avatarThumb: string;
  signature: string;
  createTime: number;
  verified: boolean;
  secUid: string;
  ftc: boolean;
  relation: number;
  openFavorite: boolean;
  bioLink: any;
  commentSetting: number;
  duetSetting: number;
  stitchSetting: number;
  privateAccount: boolean;
  secret: boolean;
  isADVirtual: boolean;
  roomId: number;
  isUnderAge18: boolean;
  uniqueIdModifyTime: number;
  ttSeller: boolean;
  extraInfo: any;
  stats: UserRepositoryInfoResponseUserStats;
  itemList: Array<any>;
}

export interface UserRepositoryInfoResponseUserStats {
  followerCount: number;
  followingCount: number;
  heart: number;
  heartCount: number;
  videoCount: number;
  diggCount: number;
  needFix: boolean;
}

export interface UserRepositoryInfoResponseUserItemList {
  id: number;
  desc: string;
  createTime: string;
  scheduleTime: number;
  videoCount: number;
  diggCount: number;
  needFix: boolean;
}
