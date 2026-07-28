import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type * as schema from "../database/schema/index.js";
import { examScore } from "../database/schema/index.js";
import { eq, sql, desc, and, isNotNull } from "drizzle-orm";

type Db = NodePgDatabase<typeof schema>;

export class ExamScoreService {
  constructor(private readonly db: Db) {}

  async getScoreByRegistrationNumber(registrationNumber: string) {
    const result = await this.db
      .select()
      .from(examScore)
      .where(eq(examScore.registrationNumber, registrationNumber))
      .limit(1);
    return result[0] ?? null;
  }

  /**
   * 2. Statistics by 4 score levels
   */
  async getStatistics() {
    const subjects = [
      "math",
      "literature",
      "foreignLanguage",
      "physics",
      "chemistry",
      "biology",
      "history",
      "geography",
      "civicEducation",
    ] as const;

    const selects: Record<string, any> = {};

    for (const sub of subjects) {
      const col = examScore[sub];

      selects[`${sub}_level1`] =
        sql`SUM(CASE WHEN ${col} >= 8 THEN 1 ELSE 0 END)::int`;
      selects[`${sub}_level2`] =
        sql`SUM(CASE WHEN ${col} >= 6 AND ${col} < 8 THEN 1 ELSE 0 END)::int`;
      selects[`${sub}_level3`] =
        sql`SUM(CASE WHEN ${col} >= 4 AND ${col} < 6 THEN 1 ELSE 0 END)::int`;
      selects[`${sub}_level4`] =
        sql`SUM(CASE WHEN ${col} IS NOT NULL AND ${col} < 4 THEN 1 ELSE 0 END)::int`;
    }

    const result = await this.db.select(selects).from(examScore);
    const row = result[0];

    if (!row) return [];

    return subjects.map((sub) => ({
      subject: sub,
      ">_8": row[`${sub}_level1`] ?? 0,
      "6_8": row[`${sub}_level2`] ?? 0,
      "4_6": row[`${sub}_level3`] ?? 0,
      "<_4": row[`${sub}_level4`] ?? 0,
    }));
  }

  /**
   * 3. Top 10 Group A
   */
  async getTop10GroupA() {
    const totalScore = sql`(${examScore.math} + ${examScore.physics} + ${examScore.chemistry})`;

    return await this.db
      .select({
        registrationNumber: examScore.registrationNumber,
        math: examScore.math,
        physics: examScore.physics,
        chemistry: examScore.chemistry,
        totalScore: sql<number>`ROUND(${totalScore}::numeric, 2)::float`,
      })
      .from(examScore)
      .where(
        and(
          isNotNull(examScore.math),
          isNotNull(examScore.physics),
          isNotNull(examScore.chemistry),
        ),
      )
      .orderBy(desc(totalScore))
      .limit(10);
  }
}
