import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { RotateCw } from "lucide-react";
import { useStatistics } from "../hooks/useStatistics";
import { useTopGroupA } from "../hooks/useTopGroupA";

import { SUBJECT_MAP } from "../commons/subjects";
import LoadingSpinner from "../components/LoadingSpinner";

const LEVEL_COLORS = {
  ">_8": "#1D4ED8", // blue-700
  "6_8": "#3B82F6", // blue-500
  "4_6": "#93C5FD", // blue-300
  "<_4": "#DBEAFE", // blue-100
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  const levelOrder = ["< 4", "4 – 6", "6 – 8", "≥ 8"];

  const sortedPayload = [...payload].sort(
    (a, b) => levelOrder.indexOf(a.name) - levelOrder.indexOf(b.name)
  );

  return (
    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md text-xs space-y-2 min-w-[150px]">
      <p className="font-semibold text-gray-800 border-b border-gray-100 pb-1">
        {label}
      </p>
      {sortedPayload.map((entry: any, index: number) => (
        <div key={`tooltip-item-${index}`} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600 font-medium">{entry.name}:</span>
          </div>
          <span className="font-bold text-gray-900">
            {Number(entry.value).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

const CustomLegend = () => {
  const legendItems = [
    { label: "< 4", color: LEVEL_COLORS["<_4"] },
    { label: "4 – 6", color: LEVEL_COLORS["4_6"] },
    { label: "6 – 8", color: LEVEL_COLORS["6_8"] },
    { label: "≥ 8", color: LEVEL_COLORS[">_8"] },
  ];

  return (
    <div className="flex items-center justify-center gap-6 pt-4 text-xs font-medium text-gray-600">
      {legendItems.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full inline-block"
            style={{ backgroundColor: item.color }}
          />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default function ReportsPage() {
  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useStatistics();
  const { topGroupA, loading: topLoading, error: topError, refetch: refetchTop } = useTopGroupA();

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 640
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isRefreshing = statsLoading || topLoading;

  const handleRefresh = () => {
    refetchStats();
    refetchTop();
  };

  const chartData = stats.map((s) => ({
    name: SUBJECT_MAP[s.subject] ?? s.subject,
    "< 4": s["<_4"],
    "4 – 6": s["4_6"],
    "6 – 8": s["6_8"],
    "≥ 8": s[">_8"],
  }));

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-primary tracking-tight mb-1 md:mb-2">
            Reports
          </h2>
          <p className="text-gray-500 text-sm">
            Phân tích phổ điểm và các bảng xếp hạng
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white border border-gray-200 hover:border-primary text-gray-700 hover:text-primary rounded-lg shadow-sm text-xs md:text-sm font-medium transition-colors disabled:opacity-50"
        >
          <RotateCw size={15} className={isRefreshing ? "animate-spin text-primary" : ""} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Chart Section */}
      <div className="bg-surface rounded-xl p-6 border border-gray-200 shadow-sm transition-colors hover:border-primary">
        <h3 className="text-lg font-semibold text-text-main mb-6">
          Phổ điểm theo 4 cấp độ
        </h3>
        {statsLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-500 text-sm">
            <LoadingSpinner size={24} className="text-primary" />
            <span>Đang tải dữ liệu biểu đồ...</span>
          </div>
        )}
        {statsError && (
          <p className="text-sm font-medium text-red-500 text-center py-20">
            {statsError}
          </p>
        )}
        {!statsLoading && !statsError && (
          <div className="overflow-x-auto">
            <div style={{ minWidth: 560 }}>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={false}
                    dy={8}
                    interval={0}
                  />
                  <YAxis
                    width={60}
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    tickFormatter={(v) => v.toLocaleString()}
                    axisLine={false}
                    tickLine={false}
                  />
                  {!isMobile && (
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f3f4f6" }} />
                  )}
                  <Legend content={<CustomLegend />} />
                  <Bar
                    dataKey="< 4"
                    stackId="a"
                    fill={LEVEL_COLORS["<_4"]}
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar dataKey="4 – 6" stackId="a" fill={LEVEL_COLORS["4_6"]} />
                  <Bar dataKey="6 – 8" stackId="a" fill={LEVEL_COLORS["6_8"]} />
                  <Bar
                    dataKey="≥ 8"
                    stackId="a"
                    fill={LEVEL_COLORS[">_8"]}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Top 10 Group A Section */}
      <div className="bg-surface rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm transition-colors hover:border-primary">
        <h3 className="text-base md:text-lg font-semibold text-text-main mb-4 md:mb-6">
          Top 10 Thí Sinh Khối A
        </h3>
        {topLoading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-500 text-sm">
            <LoadingSpinner size={24} className="text-primary" />
            <span>Đang tải danh sách Top 10...</span>
          </div>
        )}
        {topError && (
          <p className="text-sm font-medium text-red-500 text-center py-16">
            {topError}
          </p>
        )}
        {!topLoading && !topError && (
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Hạng</th>
                  <th className="py-2.5 px-3">Số báo danh</th>
                  <th className="hidden sm:table-cell py-2.5 px-3 text-center">Toán</th>
                  <th className="hidden sm:table-cell py-2.5 px-3 text-center">Vật Lý</th>
                  <th className="hidden sm:table-cell py-2.5 px-3 text-center">Hóa Học</th>
                  <th className="py-2.5 px-3 text-right">Tổng điểm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topGroupA.map((student, index) => {
                  const score = student.totalScore ?? 0;
                  return (
                    <tr
                      key={student.registrationNumber}
                      className="hover:bg-blue-50/60 transition-colors"
                    >
                      <td className="py-2.5 px-3 text-sm font-medium text-text-main">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                            index < 3
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-sm font-semibold text-text-main tracking-wide">
                        {student.registrationNumber}
                      </td>
                      <td className="hidden sm:table-cell py-2.5 px-3 text-sm text-center text-gray-700">
                        {student.math ?? "—"}
                      </td>
                      <td className="hidden sm:table-cell py-2.5 px-3 text-sm text-center text-gray-700">
                        {student.physics ?? "—"}
                      </td>
                      <td className="hidden sm:table-cell py-2.5 px-3 text-sm text-center text-gray-700">
                        {student.chemistry ?? "—"}
                      </td>
                      <td className="py-2.5 px-3 text-sm font-bold text-primary text-right">
                        {Number(score).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
