import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaUsers, FaLock } from 'react-icons/fa'; 
import useAxios from '../Utils/useAxios'; 


function ChannelSubscribedPage() {
    // 1. Get Login Status
    const isLoggedIn = useSelector((state) => state.user.status);
    const currentUser = useSelector((state) => state.user.userData);
    
    const { sendRequest } = useAxios();
    const subscriberId = currentUser?.user?._id; 
    
    const [subscribedChannels, setSubscribedChannels] = useState(null);
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null);

    const fetchSubscribedChannels = async () => {
        setLoading(true);
        setError(null);
        try {
            if (!subscriberId) {
                 // This should be caught by the isLoggedIn check, but is a safe guard
                 throw new Error("User ID is missing."); 
            }
            
            console.log("API CALL: Fetching Subscribed Channels for User ID:", subscriberId);

            // Use your actual API call with sendRequest
            const response = await sendRequest({ url: `subscriptions/u/${subscriberId}`, method: 'GET' });
            console.log("response ",response);
            
            setSubscribedChannels(response.data); 
            
        } catch (err) {
            console.error("Failed to fetch subscribed channels:", err);
            setError(err.message || "Failed to load subscribed channels.");
            setSubscribedChannels([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 2. Only fetch data if the user is logged in
        if (isLoggedIn) {
            fetchSubscribedChannels();
        } else {
            // If logged out, stop loading and clear data/error
            setLoading(false);
            setSubscribedChannels(null);
            setError(null);
        }
    }, [isLoggedIn, subscriberId]); // Depend on isLoggedIn and subscriberId

    // --- Conditional Rendering ---
    
    // 3. Case: Not Logged In (Show Login Prompt)
    if (!isLoggedIn) {
        return (
            <div className='p-10 flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-md'>
                <FaLock className='w-16 h-16 text-red-500 mb-4' />
                <h1 className='text-2xl font-semibold text-gray-800 dark:text-white mb-3'>Login to Track Subscriptions</h1>
                <p className='text-gray-500 dark:text-gray-400 mb-6'>
                    Please sign in to see the list of channels you follow.
                </p>
                <Link 
                    to="/login" 
                    className="bg-blue-600 text-white py-2 px-6 rounded-full font-medium hover:bg-blue-700 transition"
                >
                    Sign In
                </Link>
            </div>
        );
    }
    
    // 4. Case: Loading (Only runs if isLoggedIn is true)
    if (loading || subscribedChannels === null) {
        return (
            <div className="text-center p-12 text-gray-500 dark:text-gray-400">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                Loading channels you follow...
            </div>
        );
    }

    // 5. Case: Error
    if (error) {
        return <div className="p-4 text-red-600 dark:text-red-400">Error: {error}</div>;
    }

    // 6. Case: Logged In but Empty Data
    if (subscribedChannels.length === 0) {
        return (
            <div className='p-10 text-center bg-white dark:bg-gray-800 rounded-lg shadow-md'>
                <FaUserFriends className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                <h1 className='text-2xl font-semibold text-gray-800 dark:text-white mb-4'>You Are Not Subscribed to Any Channels</h1>
                <p className='text-gray-500 dark:text-gray-400'>Start following creators to see their content here!</p>
            </div>
        );
    }

    // --- Main Content Rendering (if logged in and data exists) ---
    return (
        <div className='w-full text-gray-900 dark:text-white'>
            <h2 className='text-2xl font-bold mb-6 border-b pb-2'>Channels You Follow ({subscribedChannels.length})</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {subscribedChannels.map((item) => (
                    <div 
                        key={item.channel._id} 
                        className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col items-center text-center hover:shadow-lg transition duration-200"
                    >
                        <Link to={`/c/${item.channel._id}`} className='hover:opacity-80'>
                            <img 
                                src={item.channel.avatar} 
                                alt={item.channel.username} 
                                className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 mb-3"
                            />
                        </Link>
                        <Link to={`/c/${item.channel._id}`} className="text-lg font-semibold dark:text-white hover:text-blue-500">
                            {item.channel.username}
                        </Link>
                        <button className="mt-2 text-sm text-red-600 hover:text-red-800 transition duration-150">
                            Unsubscribe
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ChannelSubscribedPage;