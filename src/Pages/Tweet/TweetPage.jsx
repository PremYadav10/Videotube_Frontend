import React, { useEffect, useState } from "react";
import useAxios from "../../Utils/useAxios.jsx";
import Input from "../../Components/Input.jsx";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";

function TweetPage() {
    const { sendRequest } = useAxios();
    const [tweets, setTweets] = useState([]);
    const [showMyTweets, setShowMyTweets] = useState(false);
    const [editingTweetId, setEditingTweetId] = useState(null);
    const [myTweets, setMyTweets] = useState([])
    const { register, handleSubmit, reset, setValue } = useForm();
    const currentUser = useSelector((state) => state.user?.userData);
    const isLoggedIn = useSelector((state) => state.user.status);
    const [alert,setAleart] = useState(false);
    const [myTweetAlert,setMyTweetAleart] = useState(false);




    const fetchTweets = async () => {
        try {
            const res = await sendRequest({ url: "/tweets", method: "GET" });
            setTweets(res.data);
            console.log("fetch tweet :",res);
            
        } catch (error) {
            console.log(error);
        }
    }; 


    const fetchMyTweets = async () => {
        try {
            const userId = currentUser.user._id
            const response = await sendRequest({ url: `/tweets/user/${userId}`, method: "GET" })
            console.log("fetch my tweet's:",response);
            setMyTweets(response.data);
        } catch (error) {
            console.log("Error while fetching my tweets :",error);
        }
    };


    useEffect(()=>{
        fetchTweets()
    },[])

    const publishTweet = async (data) => {
        try {
            const res = await sendRequest({ url: "/tweets", method: "POST", body: data });
            await fetchTweets();
            reset();
            console.log("publish tweet :",res);
            
        } catch (error) {
            console.log(error);
        }
    };

    const deleteTweet = async (tweetId) => {
        //if (!window.confirm("Are you sure you want to delete this tweet?")) return;
        console.log("delete tweet id : ",tweetId);
        try {
            const res = await sendRequest({method:"delete" , url:`/tweets/${tweetId}` , body:{} });
            console.log("delete tweet :",res);
            await fetchTweets();    
        } catch (error) {
            console.log(error);
        }
    };

    const startEditing = (tweet) => {
        setEditingTweetId(tweet._id);
        setValue("content", tweet.content); // fill textarea with current content
    };

    const updateTweet = async (data) => {
        try {
            const res = await sendRequest({
                url: `/tweets/${editingTweetId}`,
                method: "PATCH",
                body: data,
            });
            setEditingTweetId(null);
            reset();
            await fetchTweets();
            console.log("update tweet",res);   
        } catch (error) {
            console.log(error);
        }
    };

    const onSubmit = (formData) => {
        if (editingTweetId) {
            updateTweet(formData);
        } else {
            isLoggedIn ? publishTweet(formData) : setAleart(true)

            
        }
    };    

    const handleMytweetClick = ()=>{
        
        isLoggedIn ?  fetchMyTweets() : setMyTweetAleart(true)
        isLoggedIn && setShowMyTweets(true)
    }

    return (
        <div className="text-white p-6 w-full max-w-2xl mx-auto">
            {/* Toggle Buttons */}
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold">{editingTweetId ? "Edit Tweet" : "Tweets"}</h1>

                {showMyTweets ? (
                     <button onClick={() => setShowMyTweets(false)} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg">
                        All Tweets
                </button>
                ) : (
                    <button onClick={handleMytweetClick} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg">
                        My Tweets
                </button>
                )}
                
            </div> 


                {myTweetAlert && (
        <div className="relative">
           <div className="bg-white text-black h-25 w-65 flex flex-col justify-center items-center absolute right-0 border border-gray-700 rounded-2xl">
             <div className="flex flex-row gap-2">
              <h1 className="font-bold">Sign-In for see your Tweet's</h1>
              <button onClick={()=>{setMyTweetAleart(false)}} className="text-3xl"><RxCross2/></button>
             </div>
             <Link to="/login">
                          <button  className="px-6 py-1.5 bg-gray-600 hover:bg-blue-600 rounded-xl transition-all duration-200 font-medium">Sign In</button>
             </Link>
           </div>
        </div>
      )}


            {/* Tweet Box */}
            <div className="bg-gray-900 p-4 rounded-xl mt-5 mb-2">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        type="textarea"
                        placeholder="What's happening?"
                        className="bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register("content", { required: "Tweet content is required" })}
                    />
                    <button
                        type="submit"
                        className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl hover:scale-105"
                    >
                        {editingTweetId ? "Update" : "Tweet"}
                    </button>
                    {editingTweetId && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingTweetId(null);
                                reset();
                            }}
                            className="ml-2 mt-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-xl hover:scale-105"
                        >
                            Cancel
                        </button>
                    )}
                </form>
            </div>

            {alert && (
        <div className="relative">
           <div className="bg-white text-black h-25 w-65 flex flex-col justify-center items-center absolute left-14 border border-gray-700 rounded-2xl">
             <div className="flex flex-row gap-2">
              <h1 className="font-bold">Sign-In for post your Tweet's</h1>
              <button onClick={()=>{setAleart(false)}} className="text-3xl"><RxCross2/></button>
             </div>
             <Link to="/login">
                          <button  className="px-6 py-1.5 bg-gray-600 hover:bg-blue-600 rounded-xl transition-all duration-200 font-medium">Sign In</button>
             </Link>
           </div>
        </div>
      )}

            {/* Tweet Feed */}
            <div className="space-y-4 mt-6">
                {(showMyTweets?myTweets:tweets).map((tweet) => (
                    <div
                        key={tweet._id}
                        className="bg-gray-800 p-4 rounded-lg border border-gray-700"
                    >
                        {/* Owner Info */}
                        <div className="flex items-center gap-3">
                            <img
                                src={tweet.owner?.avatar || "/default-avatar.png"}
                                alt="avatar"
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <h4 className="font-semibold">{tweet.owner?.name || tweet.owner?.username}</h4>
                                <p className="text-gray-400 text-sm">
                                    {new Date(tweet.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Content */}
                        <p className="mt-3">{tweet.content}</p>

                        {/* Actions */}
                        <div className="flex gap-6 mt-3 text-gray-400">
                            <button className="hover:text-red-500">
                                ❤️ {tweet.likesCount ? tweet.likesCount : 0}
                            </button>
                            <button className="hover:text-green-500">🔁</button>
                            <button className="hover:text-blue-500">🔗 Share</button>

                            {isLoggedIn && tweet.owner?._id === currentUser.user?._id && (
                                <div className="ml-auto flex gap-3">
                                    <button
                                        onClick={() => deleteTweet(tweet._id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => startEditing(tweet)}
                                        className="text-yellow-500 hover:text-yellow-700"
                                    >
                                        Edit
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TweetPage;
