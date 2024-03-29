export type RecordType = {
  teamName: string;
  playerStat: PlayerStatType;
};

export type CutType = {
  clubCode: string;
  playDate: string;
  gameNo: string;
  quaterNo: number;
  seekTime: string;
  mainPlayer?: string;
  subPlayer?: string;
  skill?: string;
  videoName?: string;
  videoUrl?: string;
  team?: string;
  vsScore?: any;
  playerStat?: any;
};

export type VsType = {
  playDate: string;
  gameNo: number;
  gameCode?: string;
  dateInfo?: string;
  guest?: boolean;
  match: [VsInfoType, VsInfoType];
  label?: boolean;
};

export type VsInfoType = {
  teamName: string;
  score: number;
};

export type TeamInfoType = {
  id: string;
  name: string;
  place: string;
  cycle: string;
  method: string;
  lastPlayDate: string;
  memberCount: string;
  guestCount: string;
};

export type PlayerStatType = {
  tpm: number;
  ast: number;
  reb: number;
  orb: number;
  blk: number;
  stl: number;
  [x: string]: number;
};
