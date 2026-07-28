import { useState } from "react";
import { Search } from "lucide-react";
import { useScoreSearch } from "../hooks/useScoreSearch";
import type { ScoreResult } from "../services/scoreService";

import { SUBJECT_LIST } from "../commons/subjects";
import LoadingSpinner from "../components/LoadingSpinner";

export default function SearchScoresPage() {
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [validationError, setValidationError] = useState("");
  const { result, loading, error: apiError, searchScore } = useScoreSearch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegistrationNumber(e.target.value);
    if (validationError) {
      setValidationError("");
    }
  };

  const handleSearch = () => {
    const trimmedRegNum = registrationNumber.trim();
    if (!trimmedRegNum) {
      setValidationError("Registration number is required.");
      return;
    }

    if (trimmedRegNum.length !== 8) {
      setValidationError("Registration number must be exactly 8 characters.");
      return;
    }

    setValidationError("");
    searchScore(trimmedRegNum);
  };

  return (
    <div className="space-y-6 w-full">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-primary tracking-tight mb-1 md:mb-2">
          Search Scores
        </h2>
        <p className="text-gray-500 text-sm">
          Tra cứu điểm thi chi tiết theo số báo danh
        </p>
      </div>

      {/* Search card */}
      <div className="bg-surface rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm transition-colors hover:border-primary">
        <label className="block text-sm font-semibold text-text-main mb-3">
          Registration Number
        </label>
        <div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <input
              type="text"
              value={registrationNumber}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Nhập số báo danh (VD: 01000001)"
              className={`flex-1 border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all text-text-main bg-white ${
                validationError
                  ? "border-red-500 focus:ring-red-200 focus:border-red-500"
                  : "border-gray-300 focus:ring-primary/20 focus:border-primary"
              }`}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 sm:min-w-[110px] w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <LoadingSpinner size={16} />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search size={16} />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
          {validationError && (
            <p className="mt-2 text-xs font-medium text-red-500">
              {validationError}
            </p>
          )}
        </div>

        {apiError && (
          <p className="mt-3 text-sm font-medium text-red-500">{apiError}</p>
        )}
      </div>

      {/* Result card */}
      {result && (
        <div className="bg-surface rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm transition-colors hover:border-primary animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-3 border-b border-gray-200 gap-1 sm:gap-0">
            <h3 className="text-lg font-semibold text-text-main">
              Detailed Scores
            </h3>
            <p className="text-sm font-medium text-gray-600">
              SBD:{" "}
              <span className="text-lg md:text-xl font-bold text-primary tracking-wide">
                {result.registrationNumber}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {result.foreignLanguageCode && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50/60 rounded-lg border border-blue-100 text-sm transition-colors hover:bg-blue-100/70">
                <span className="text-gray-600 font-medium">Mã ngoại ngữ:</span>
                <span className="font-bold text-primary">
                  {result.foreignLanguageCode}
                </span>
              </div>
            )}
            {SUBJECT_LIST.map((subject) => {
              const score = result[subject.code as keyof ScoreResult];
              return (
                <div
                  key={subject.code}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-50/60 rounded-lg border border-blue-100 text-sm transition-colors hover:bg-blue-100/70"
                >
                  <span className="text-gray-600 font-medium">
                    {subject.name}:
                  </span>
                  <span
                    className={`font-bold ${
                      score === null ? "text-gray-400" : "text-primary"
                    }`}
                  >
                    {score ?? "—"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
