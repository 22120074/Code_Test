import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type * as schema from "../database/schema/index.js";
import { diemThi } from "../database/schema/index.js";
import { eq, sql, desc, and, isNotNull } from "drizzle-orm";

type Db = NodePgDatabase<typeof schema>;

export class DiemThiService {
  constructor(private readonly db: Db) {}

  async getScoreBySbd(sbd: string) {
    const result = await this.db
      .select()
      .from(diemThi)
      .where(eq(diemThi.sbd, sbd))
      .limit(1);
    return result[0] ?? null;
  }

  /**
   * 2. Thống kê theo 4 mức điểm
   */
  async getStatistics() {
    const subjects = [
      "toan",
      "ngu_van",
      "ngoai_ngu",
      "vat_li",
      "hoa_hoc",
      "sinh_hoc",
      "lich_su",
      "dia_li",
      "gdcd",
    ] as const;

    const selects: Record<string, any> = {};

    for (const sub of subjects) {
      const col = diemThi[sub];

      selects[`${sub}_level1`] =
        sql`SUM(CASE WHEN ${col} >= 8 THEN 1 ELSE 0 END)::int`;
      selects[`${sub}_level2`] =
        sql`SUM(CASE WHEN ${col} >= 6 AND ${col} < 8 THEN 1 ELSE 0 END)::int`;
      selects[`${sub}_level3`] =
        sql`SUM(CASE WHEN ${col} >= 4 AND ${col} < 6 THEN 1 ELSE 0 END)::int`;
      selects[`${sub}_level4`] =
        sql`SUM(CASE WHEN ${col} IS NOT NULL AND ${col} < 4 THEN 1 ELSE 0 END)::int`;
    }

    const result = await this.db.select(selects).from(diemThi);
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
   * 3. Top 10 khối A
   */
  async getTop10GroupA() {
    const totalScore = sql`(${diemThi.toan} + ${diemThi.vat_li} + ${diemThi.hoa_hoc})`;

    return await this.db
      .select({
        sbd: diemThi.sbd,
        toan: diemThi.toan,
        vat_li: diemThi.vat_li,
        hoa_hoc: diemThi.hoa_hoc,
        totalScore: sql<number>`ROUND(${totalScore}::numeric, 2)::float`,
      })
      .from(diemThi)
      .where(
        and(
          isNotNull(diemThi.toan),
          isNotNull(diemThi.vat_li),
          isNotNull(diemThi.hoa_hoc),
        ),
      )
      .orderBy(desc(totalScore))
      .limit(10);
  }
}
