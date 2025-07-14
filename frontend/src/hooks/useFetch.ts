import apiClient from "@/api/axiosConfig";
import { useState, useEffect, useCallback } from "react";

const useFetch = <T>(url: string | (() => string)) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const getUrl = useCallback(() => {
    return typeof url === "function" ? url() : url;
  }, [url]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<T>(getUrl());
      setData(response.data);
    } catch (err: unknown) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [getUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
};

export default useFetch;