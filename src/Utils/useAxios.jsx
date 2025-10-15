import { useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
});

const useAxios = () => {
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const sendRequest = useCallback(
    async ({ method = "get", url, body = null, params = null, headers = {} }) => {
      setLoading(true);
      setError(null);

      try {
        const isFormData = body instanceof FormData;

        const response = await axiosInstance({
          method,
          url,
          data: body,
          params,
          headers: {
            ...headers,
            "Content-Type": isFormData ? "multipart/form-data" : "application/json",
          },
        });

        setData(response.data);
        setLoading(false);
        return response.data;
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
        throw err;
      }
    },
    [user]
  );

  return { loading, error, data, sendRequest };
};

export default useAxios;
