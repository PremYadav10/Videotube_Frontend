import React, { useEffect, useState } from 'react';
import { FaUserCircle, FaUserFriends } from 'react-icons/fa';
import useAxios from '../Utils/useAxios'; 
import { useSelector } from 'react-redux'; 
import { Link } from 'react-router-dom';

function ChannelSubscribersPage() {
    const { sendRequest } = useAxios(); 
    const currentUser = useSelector((state) => state.user.userData);
    const channelId = currentUser?.user?._id; // Get the channel ID (owner ID)
    
    const [subscribers, setSubscribers] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSubscribers = async () => {
        if (!channelId) {
            setError("Channel ID not found.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            console.log("API CALL: Fetching Channel Subscribers for ID:", channelId);
            const response = await sendRequest({ url: `/subscriptions/c/${channelId}`, method: 'GET' });       
            console.log(response);
            setSubscribers(response.data); 
            
        } catch (err) {
            console.error("Failed to fetch subscribers:", err);
            setError(err.message || "Failed to load subscriber list.");
            setSubscribers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, []); 

    // --- Conditional Rendering ---

    if (loading) {
        return <div className="text-center p-12 text-gray-500 dark:text-gray-400">Loading your subscriber list...</div>;
    }

    if (error && subscribers?.length === 0) { // If an error occurred (e.g., 404 No Subscribers Found)
        return (
            <div className='p-10 text-center bg-white dark:bg-gray-800 rounded-lg shadow-md'>
                <FaUserFriends className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                <h1 className='text-2xl font-semibold text-gray-800 dark:text-white mb-4'>You Have No Subscribers Yet</h1>
                <p className='text-gray-500 dark:text-gray-400'>Share your channel to grow your audience!</p>
            </div>
        );
    }
    
    if (!subscribers || subscribers.length === 0) {
        // This handles both the initial empty state and the API returning an empty array
        return (
            <div className='p-10 text-center bg-white dark:bg-gray-800 rounded-lg shadow-md'>
                <h1 className='text-2xl font-semibold text-gray-800 dark:text-white'>No Active Subscribers</h1>
            </div>
        );
    }

    // --- Main Content Rendering ---

    return (
        <div className='w-full text-gray-900 dark:text-white'>
            <h2 className='text-2xl font-bold mb-6 border-b pb-2'>Your Subscribers ({subscribers.length})</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {subscribers.map((item) => (
                    <div 
                        key={item.subscriber._id} 
                        className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col items-center text-center hover:shadow-lg transition duration-200"
                    >
                        <Link to={`/c/${item.subscriber._id}`} className='hover:opacity-80'>
                            <img 
                                src={item.subscriber.avatar} 
                                alt={item.subscriber.username} 
                                className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 mb-3"
                            />
                        </Link>
                        <Link to={`/c/${item.subscriber._id}`} className="text-lg font-semibold dark:text-white hover:text-blue-500">
                            {item.subscriber.username}
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {/* You could optionally fetch subscriber count for each viewer here if needed */}
                            Viewer
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ChannelSubscribersPage;