// import React, { useEffect } from 'react'
// import VideoCard from '../Components/VideoCard'
// import { useDispatch, useSelector } from 'react-redux';
// import useAxios from '../Utils/useAxios';
// import { setLikedVideoIds } from '../features/Video/likedVideoSlice.js';
// import {setVideos} from "../features/Video/videoSlice.js"
// import { setWatchLaterId } from '../features/Video/watchLaterSlice.js'

// function Home() {
//   const { sendRequest } = useAxios();
//   const [allVideoData, setAllVideoData] = React.useState([]);
//     const isLoggedIn = useSelector((state) => state.user.status);
//     const currentUser = useSelector((state) => state.user.userData);
//     const dispatch = useDispatch()
//     const userId = currentUser?.user?._id; 

//     useEffect(() => {
//     const getAllVideos = async () => {
//       try {
//         const response = await sendRequest({
//           method: "get",
//           url: "/videos",
//         });
//         console.log("All videos data", response);
//         setAllVideoData(response.data.videos); 
//         dispatch(setVideos(response.data.videos))
//       } catch (error) {
//         console.log("Fetch video error", error);
//         setAllVideoData([]);
//       }
//     };
//     getAllVideos();
//   }, []); 


//   const fetchLikedVideos = async () => {
//           try {
//               // Safety check
//               if (!userId) {
//                   throw new Error("User ID is missing.");
//               }
//               const Response = await sendRequest({ method: "get", url: `/likes/videos` }); 
//               console.log("like vid res :",Response);
//               dispatch(setLikedVideoIds(Response.data))
//           } catch (err) {
//               console.error("Failed to fetch liked videos:", err);
//           } 
//       };

   


  
//       useEffect(() => {
//           // Only fetch data if the user is logged in
//           if (isLoggedIn && userId) {
//               fetchLikedVideos();
          

//           }
//       }, [isLoggedIn,userId, sendRequest]);
  

//   return (
//     <div className='min-h-screen p-2'>
//       <div className='flex flex-row gap-6 flex-wrap p-4'>
//         {allVideoData.map(video => (
//           <VideoCard 
//       key={video._id} 
//       videoId={video._id} 
//       thumbnail={video.thumbnail} 
//       title={video.title} 
//       channelName={video.owner.username} 
//       duration={video.duration} 
//       views={video.views} 
//       createdAt={video.createdAt}
//       channelAvatar={video.owner.avatar} 
//     />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Home;


import React, { useEffect } from 'react';
import VideoCard from '../Components/VideoCard';
import { useDispatch, useSelector } from 'react-redux';
import useAxios from '../Utils/useAxios';
import { setLikedVideoIds } from '../features/Video/likedVideoSlice.js';
import { setVideos } from '../features/Video/videoSlice.js';
import { setWatchLaterId, setSavedVideoIds } from '../features/Video/watchLaterSlice.js';

function Home() {
  const { sendRequest } = useAxios();
  const [allVideoData, setAllVideoData] = React.useState([]);
  const isLoggedIn = useSelector((state) => state.user.status);
  const currentUser = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const userId = currentUser?.user?._id;

  // ------------------ Fetch All Videos ------------------
  useEffect(() => {
    const getAllVideos = async () => {
      try {
        const response = await sendRequest({
          method: 'get',
          url: '/videos',
        });
        console.log('All videos data', response);
        setAllVideoData(response.data.videos);
        dispatch(setVideos(response.data.videos));
      } catch (error) {
        console.log('Fetch video error', error);
        setAllVideoData([]);
      }
    };
    getAllVideos();
  }, [dispatch, sendRequest]);

  // ------------------ Fetch Liked Videos ------------------
  const fetchLikedVideos = async () => {
    try {
      if (!userId) throw new Error('User ID is missing.');
      const res = await sendRequest({ method: 'get', url: '/likes/videos' });
      console.log('Liked videos res:', res);
      dispatch(setLikedVideoIds(res.data));
    } catch (err) {
      console.error('Failed to fetch liked videos:', err);
    }
  };

  // ------------------ Fetch Watch Later Playlist ID + Videos ------------------
  // const fetchWatchLaterPlaylist = async () => {
  //   try {
  //     if (!userId) throw new Error('User ID is missing.');
  //     const wlRes = await sendRequest({ method: 'get', url: '/playlist/watch-later-id', headers: { withCredentials: true } });
  //     console.log('Watch Later response:', wlRes);

  //     const payload = wlRes?.data;
  //     if (!payload) {
  //       dispatch(setWatchLaterId(null));
  //       dispatch(setSavedVideoIds([]));
  //       return;
  //     }

  //     const playlistId = payload._id || null;
  //     const videosArr = Array.isArray(payload.videos) ? payload.videos : [];

  //     dispatch(setWatchLaterId(playlistId));
  //     dispatch(setSavedVideoIds(videosArr.map((v) => (typeof v === 'string' ? v : v._id?.toString()))));

  //     console.log('Watch Later ID saved:', playlistId);
  //   } catch (err) {
  //     console.error('Failed to fetch Watch Later playlist:', err);
  //     dispatch(setWatchLaterId(null));
  //     dispatch(setSavedVideoIds([]));
  //   }
  // };


  // ------------------ Fetch Watch Later Playlist from User Playlists ------------------
const fetchWatchLaterFromPlaylists = async () => {
  try {
    if (!userId) throw new Error("User ID is missing.");

    const res = await sendRequest({ method: "get", url: `/playlist/user/${userId}` });
    console.log("All user playlists:", res);

    if (!res.data || res.data.length === 0) {
      // No playlists found
      dispatch(setWatchLaterId(null));
      dispatch(setSavedVideoIds([]));
      return;
    }

    // Find Watch Later playlist
    const watchLaterPlaylist = res.data.find(pl => pl.name.toLowerCase() === "watch later");

    if (!watchLaterPlaylist) {
      dispatch(setWatchLaterId(null));
      dispatch(setSavedVideoIds([]));
      return;
    }

    // Save Watch Later ID and video IDs to Redux
    dispatch(setWatchLaterId(watchLaterPlaylist._id));
    const videoIds = Array.isArray(watchLaterPlaylist.videos)
      ? watchLaterPlaylist.videos.map(v => (typeof v === "string" ? v : v._id?.toString()))
      : [];
    dispatch(setSavedVideoIds(videoIds));

    console.log("Watch Later playlist saved:", watchLaterPlaylist._id, videoIds);
  } catch (err) {
    console.error("Failed to fetch Watch Later from playlists:", err);
    dispatch(setWatchLaterId(null));
    dispatch(setSavedVideoIds([]));
  }
};


  // ------------------ Init after login ------------------
  useEffect(() => {
    if (isLoggedIn && userId) {
      fetchLikedVideos();
      // fetchWatchLaterPlaylist(); // 👈 add this here
      fetchWatchLaterFromPlaylists();
    }
  }, [isLoggedIn, userId, sendRequest]);

  // ------------------ Render ------------------
  return (
    <div className="min-h-screen p-2">
      <div className="flex flex-row gap-6 flex-wrap p-4">
        {allVideoData.map((video) => (
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
