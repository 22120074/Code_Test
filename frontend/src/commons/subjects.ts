export const SUBJECT_MAP: Record<string, string> = {
  math: "Toán",
  literature: "Ngữ Văn",
  foreignLanguage: "Ngoại Ngữ",
  physics: "Vật Lý",
  chemistry: "Hóa Học",
  biology: "Sinh Học",
  history: "Lịch Sử",
  geography: "Địa Lý",
  civicEducation: "GDCD",
};

export const SUBJECT_LIST = Object.entries(SUBJECT_MAP).map(([code, name]) => ({
  code,
  name,
}));
