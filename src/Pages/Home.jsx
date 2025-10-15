import React, { useEffect } from 'react'
import VideoCard from '../Components/VideoCard'
import { useDispatch, useSelector } from 'react-redux';
import useAxios from '../Utils/useAxios';
import { setLikedVideoIds } from '../features/Video/likedVideoSlice.js';
import {setVideos} from "../features/Video/videoSlice.js"
import { setWatchLaterId } from '../features/Video/watchLaterSlice.js'

function Home() {
  const { sendRequest } = useAxios();
  const [allVideoData, setAllVideoData] = React.useState([]);
    const isLoggedIn = useSelector((state) => state.user.status);
    const currentUser = useSelector((state) => state.user.userData);
    const dispatch = useDispatch()
    const userId = currentUser?.user?._id; 

    useEffect(() => {
    const getAllVideos = async () => {
      try {
        const response = await sendRequest({
          method: "get",
          url: "/videos",
        });
        console.log("All videos data", response);
        setAllVideoData(response.data.videos); 
        dispatch(setVideos(response.data.videos))
      } catch (error) {
        console.log("Fetch video error", error);
        setAllVideoData([]);
      }
    };
    getAllVideos();
  }, []); 


  const fetchLikedVideos = async () => {
          try {
              // Safety check
              if (!userId) {
                  throw new Error("User ID is missing.");
              }
              const Response = await sendRequest({ method: "get", url: `/likes/videos` }); 
              console.log("like vid res :",Response);
              dispatch(setLikedVideoIds(Response.data))
          } catch (err) {
              console.error("Failed to fetch liked videos:", err);
          } 
      };

    const fetchWLid = async()=>{
      try {
        console.log("enter");
        
                const wlRes = await sendRequest({ method: "get", url: "/playlist/watch-later-id" });
                console.log("watch later res :",wlRes);
                
                if (wlRes.data) {
                    dispatch(setWatchLaterId(wlRes.data)); 
                    console.log("Watch Later ID saved globally:", wlRes.data);
                }
            } catch (error) {
                console.error("Error fetching global IDs:", error);
            }
    }
  
      useEffect(() => {
          // Only fetch data if the user is logged in
          if (isLoggedIn && userId) {
              fetchLikedVideos();
              fetchWLid();
          }
      }, [isLoggedIn,userId, sendRequest]);
  

  return (
    <div className='min-h-screen p-2'>
      <div className='flex flex-row gap-6 flex-wrap p-4'>
        {allVideoData.map(video => (
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
    </div>
  );
}

export default Home;