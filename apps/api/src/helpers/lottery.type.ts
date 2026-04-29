export interface ILotteryCheck {
  id: string;
  date: string;
  formatted_date: string;
  province: Province;
  drawCode: string;
  jackpot: any;
  results: Result[];
  prizes: Prizes;
}

export interface Province {
  id: number;
  regionId: number;
  code: string;
  name: string;
  schedule: any;
  region: Region;
}

export interface Region {
  id: number;
  code: string;
  name: string;
  description: string;
}

export interface Result {
  prizeCode: string;
  prizeOrder: number;
  values: string[];
}

export interface Prizes {
  db: string[];
  g1: string[];
  g2: string[];
  g3: string[];
  g4: string[];
  g5: string[];
  g6: string[];
  g7: string[];
  g8: string[];
}
