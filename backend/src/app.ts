import "dotenv/config";
import { DatabaseService } from "./database/database.service.js";

/**
 * App entry point.
 *
 * Export `db` để các module khác import trực tiếp khi cần.
 * DatabaseService là singleton — pool chỉ khởi tạo một lần.
 */
export const db = DatabaseService.getInstance().db;
export { DatabaseService };
