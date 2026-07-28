import { pgTable, serial, varchar, numeric, index } from "drizzle-orm/pg-core";

/**
 * Table storing the 2024 National High School Exam Scores
 */
export const examScore = pgTable(
  "exam_scores",
  {
    id: serial("id").primaryKey(),
    registrationNumber: varchar("registration_number", { length: 8 }).notNull().unique(),
    math: numeric("math", { precision: 4, scale: 2 }),
    literature: numeric("literature", { precision: 4, scale: 2 }),
    foreignLanguage: numeric("foreign_language", { precision: 4, scale: 2 }),
    physics: numeric("physics", { precision: 4, scale: 2 }),
    chemistry: numeric("chemistry", { precision: 4, scale: 2 }),
    biology: numeric("biology", { precision: 4, scale: 2 }),
    history: numeric("history", { precision: 4, scale: 2 }),
    geography: numeric("geography", { precision: 4, scale: 2 }),
    civicEducation: numeric("civic_education", { precision: 4, scale: 2 }),
    foreignLanguageCode: varchar("foreign_language_code", { length: 4 }),
  },
  (table) => [index("idx_registration_number").on(table.registrationNumber)]
);

export type ExamScore = typeof examScore.$inferSelect;
export type NewExamScore = typeof examScore.$inferInsert;
