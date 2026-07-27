import api from './api';

export interface ScoreResult {
  sbd: string;
  toan: string | null;
  ngu_van: string | null;
  ngoai_ngu: string | null;
  vat_li: string | null;
  hoa_hoc: string | null;
  sinh_hoc: string | null;
  lich_su: string | null;
  dia_li: string | null;
  gdcd: string | null;
  ma_ngoai_ngu: string | null;
}

export interface SubjectStat {
  subject: string;
  ">_8": number;
  "6_8": number;
  "4_6": number;
  "<_4": number;
}

export interface TopGroupA {
  sbd: string;
  toan?: number | string | null;
  vat_li?: number | string | null;
  hoa_hoc?: number | string | null;
  totalScore?: number | string;
  total_score?: number | string;
}

export const scoreService = {
  getScoreBySbd: (sbd: string): Promise<{ success: boolean; data: ScoreResult }> => {
    return api.get(`/score/look-up/${sbd}`);
  },
  
  getStatistics: (): Promise<{ success: boolean; data: SubjectStat[] }> => {
    return api.get('/score/reports/statistics');
  },

  getTopGroupA: (): Promise<{ success: boolean; data: TopGroupA[] }> => {
    return api.get('/score/reports/top-group-a');
  }
};
