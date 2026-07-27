import { useState } from "react";
import { scoreService } from "../services/scoreService";
import type { ScoreResult } from "../services/scoreService";
import type { AxiosError } from "axios";

export function useScoreSearch() {
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchScore = async (sbd: string) => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await scoreService.getScoreBySbd(sbd.trim());
      setResult(response.data);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;

      if (axiosError.response) {
        const statusCode = axiosError.response.status;
        const serverMessage = axiosError.response.data?.message;

        switch (statusCode) {
          case 400:
            setError(
              serverMessage ||
                "Invalid data, please check your registration number.",
            );
            break;
          case 404:
            setError(
              serverMessage ||
                "No student information found for this registration number.",
            );
            break;
          case 500:
          case 502:
          case 503:
            setError("System error encountered. Please try again later.");
            break;
          default:
            setError(
              serverMessage || `An unexpected error occurred (${statusCode}).`,
            );
            break;
        }
      } else if (axiosError.request || axiosError.code === "ERR_NETWORK") {
        setError(
          "Unable to connect to server. Please check your internet connection.",
        );
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setResult(null);
    setError("");
  };

  return { result, loading, error, searchScore, resetSearch };
}
