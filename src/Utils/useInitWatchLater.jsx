// hooks/useInitWatchLater.js
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import useAxios from "../Utils/useAxios";
import { setWatchLaterId, setSavedVideoIds } from "../features/Video/watchLaterSlice";

export const useInitWatchLater = () => {
  const dispatch = useDispatch();
  const { sendRequest } = useAxios();

  const initializeWatchLater = useCallback(async () => {
    try {
      const apiRes = await sendRequest({ method: "get", url: "/playlist/watch-later-id" });
      // sendRequest returns the backend ApiResponse object (your useAxios returns response.data)
      // apiRes = { statusCode, data: { _id, videos }, message, success }
      const payload = apiRes?.data;

      if (!payload) {
        // fallback: reset
        dispatch(setWatchLaterId(null));
        dispatch(setSavedVideoIds([]));
        return;
      }

      // payload._id might be null if not found
      const playlistId = payload._id || null;
      const videosArr = Array.isArray(payload.videos) ? payload.videos : [];

      // Save playlist id and video ids in redux
      dispatch(setWatchLaterId(playlistId));
      // store only ids (strings) for fast lookups
      dispatch(setSavedVideoIds(videosArr.map(v => (typeof v === "string" ? v : v._id?.toString()))));
    } catch (err) {
      console.error("Failed to initialize Watch Later:", err);
      // reset safely
      dispatch(setWatchLaterId(null));
      dispatch(setSavedVideoIds([]));
    }
  }, [dispatch, sendRequest]);

  return { initializeWatchLater };
};
