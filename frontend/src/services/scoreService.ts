import api from './api';

export interface ScoreResult {
  registrationNumber: string;
  math: string | null;
  literature: string | null;
  foreignLanguage: string | null;
  physics: string | null;
  chemistry: string | null;
  biology: string | null;
  history: string | null;
  geography: string | null;
  civicEducation: string | null;
  foreignLanguageCode: string | null;
}

export interface SubjectStat {
  subject: string;
  ">_8": number;
  "6_8": number;
  "4_6": number;
  "<_4": number;
}

export interface TopGroupA {
  registrationNumber: string;
  math?: number | string | null;
  physics?: number | string | null;
  chemistry?: number | string | null;
  totalScore?: number | string;
}

export const scoreService = {
  getScoreByRegistrationNumber: (registrationNumber: string): Promise<{ success: boolean; data: ScoreResult }> => {
    return api.get(`/score/look-up/${registrationNumber}`);
  },
  
  getStatistics: (): Promise<{ success: boolean; data: SubjectStat[] }> => {
    return api.get('/score/reports/statistics');
  },

  getTopGroupA: (): Promise<{ success: boolean; data: TopGroupA[] }> => {
    return api.get('/score/reports/top-group-a');
  }
};
