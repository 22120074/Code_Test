import { pgTable, serial, varchar, numeric, index } from "drizzle-orm/pg-core";

/**
 * Bảng lưu điểm thi THPT Quốc Gia 2024
 *
 * Columns:
 *  - id          : PK tự tăng (nội bộ)
 *  - sbd         : Số báo danh thí sinh (8 ký tự, VD: 01000001)
 *  - toan        : Điểm Toán          (0–10, bước 0.25)
 *  - ngu_van     : Điểm Ngữ Văn
 *  - ngoai_ngu   : Điểm Ngoại Ngữ
 *  - vat_li      : Điểm Vật Lý
 *  - hoa_hoc     : Điểm Hóa Học
 *  - sinh_hoc    : Điểm Sinh Học
 *  - lich_su     : Điểm Lịch Sử
 *  - dia_li      : Điểm Địa Lý
 *  - gdcd        : Điểm GDCD (Giáo dục công dân)
 *  - ma_ngoai_ngu: Mã ngoại ngữ (N1=Anh, N2=Nga, N3=Pháp, N4=Trung, N5=Đức, N6=Nhật, N7=Hàn)
 */
export const diemThi = pgTable(
  "diem_thi",
  {
    id: serial("id").primaryKey(),
    sbd: varchar("sbd", { length: 8 }).notNull().unique(),
    toan: numeric("toan", { precision: 4, scale: 2 }),
    ngu_van: numeric("ngu_van", { precision: 4, scale: 2 }),
    ngoai_ngu: numeric("ngoai_ngu", { precision: 4, scale: 2 }),
    vat_li: numeric("vat_li", { precision: 4, scale: 2 }),
    hoa_hoc: numeric("hoa_hoc", { precision: 4, scale: 2 }),
    sinh_hoc: numeric("sinh_hoc", { precision: 4, scale: 2 }),
    lich_su: numeric("lich_su", { precision: 4, scale: 2 }),
    dia_li: numeric("dia_li", { precision: 4, scale: 2 }),
    gdcd: numeric("gdcd", { precision: 4, scale: 2 }),
    ma_ngoai_ngu: varchar("ma_ngoai_ngu", { length: 4 }),
  },
  (table) => [index("idx_sbd").on(table.sbd)]
);

export type DiemThi = typeof diemThi.$inferSelect;
export type NewDiemThi = typeof diemThi.$inferInsert;
