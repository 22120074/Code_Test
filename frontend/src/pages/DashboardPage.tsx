import { Link } from "react-router-dom";
import { Search, BarChart2 } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6 w-full">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-primary tracking-tight mb-1 md:mb-2">
          Dashboard
        </h2>
        <p className="text-gray-500 text-sm">
          Tổng quan về hệ thống điểm thi THPT Quốc Gia 2024
        </p>
      </div>

      <div className="bg-surface rounded-xl p-5 md:p-8 border border-gray-200 shadow-sm">
        <h3 className="text-lg md:text-xl font-semibold text-text-main mb-3 md:mb-4">
          Về hệ thống điểm thi THPT Quốc Gia
        </h3>
        <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-3xl mb-6 md:mb-8">
          Hệ thống tra cứu điểm thi THPT Quốc Gia 2024 với dữ liệu lớn.
          Lựa chọn các chức năng dưới đây để bắt đầu tra cứu điểm số
          hoặc xem báo cáo phân tích phổ điểm chi tiết.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full">
          <Link
            to="/search"
            className="flex items-start gap-3 md:gap-4 bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm transition-all hover:border-primary hover:bg-blue-50 group"
          >
            <div className="p-2.5 md:p-3 bg-blue-50 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
              <Search size={22} />
            </div>
            <div>
              <h4 className="text-base md:text-lg font-bold text-text-main group-hover:text-primary transition-colors">
                Tra cứu điểm thi
              </h4>
              <p className="text-xs md:text-sm text-gray-500 mt-1 leading-relaxed">
                Tìm kiếm và xem kết quả điểm thi chi tiết theo số báo danh của thí sinh.
              </p>
            </div>
          </Link>

          <Link
            to="/reports"
            className="flex items-start gap-3 md:gap-4 bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm transition-all hover:border-primary hover:bg-blue-50 group"
          >
            <div className="p-2.5 md:p-3 bg-blue-50 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
              <BarChart2 size={22} />
            </div>
            <div>
              <h4 className="text-base md:text-lg font-bold text-text-main group-hover:text-primary transition-colors">
                Báo cáo phổ điểm
              </h4>
              <p className="text-xs md:text-sm text-gray-500 mt-1 leading-relaxed">
                Xem biểu đồ phân tích phổ điểm các môn thi theo từng cấp độ khác nhau.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
