import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import VideoCard from "../Components/VideoCard";
import useAxios from "../Utils/useAxios";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [videos, setVideos] = useState([]);
  let query = searchParams.get("query");
  query = query.trim();
    const { sendRequest } = useAxios();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await sendRequest({
          url: `/videos?query=${query}`,
          method: "GET",
        });
        setVideos(res.data.videos || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    if (query) fetchVideos();
  }, [query]);

  return (
    <div className="p-4">
      <h2 className="text-md font-semibold mb-4 text-gray-500">
        Search Results for "{query}"
      </h2>
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {videos.map((video) => (
            <VideoCard
              key={video._id}
              videoId={video._id}
              thumbnail={video.thumbnail}
              title={video.title}
              channelName={video.owner.username}
              duration={video.duration}
              views={video.views}
              createdAt={video.createdAt}
              channelAvatar={video.owner.avatar}
            />
          ))}
        </div>
      ) : (
        <p className="text-xl font-semibold mb-4 text-white"
        >No videos found for "{query}".</p>
      )}
    </div>
  );
};

export default SearchPage;
