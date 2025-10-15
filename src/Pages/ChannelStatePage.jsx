import React,{useState,useEffect} from 'react';
import { FaUsers, FaVideo, FaEye, FaThumbsUp } from 'react-icons/fa';
import useAxios from '../Utils/useAxios';

// Utility to format large numbers (e.g., 15500 -> 15,500)
const formatNumber = (num) => num ? num.toLocaleString() : 0;

const StatBlock = ({ icon: Icon, title, value }) => (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <Icon className="w-8 h-8 text-blue-600 mb-3" />
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{value}</p>
    </div>
);

const ChannelStatsPage = () => {
 // State for channel statistics (STILL NEEDED TO PASS TO THE CHILD COMPONENT)
    const [stats, setStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(false);
    const {sendRequest} = useAxios()

    const fetchStats = async () => {
        setLoadingStats(true);
        try {
            const response = await sendRequest({ url: '/dashboard/stats', method: 'GET' }); 
            setStats(response.data);
            console.log("stats response:",response);
            
        } catch (error) {
            console.error("Failed to fetch channel stats:", error);
            setStats(null);
        } finally {
            setLoadingStats(false);
        }
    };
    
    useEffect(()=>{
        fetchStats()
    },[sendRequest])

    if (loadingStats) {
        return (
            <div className="text-center p-12 text-gray-500 dark:text-gray-400">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                Loading Channel Analytics...
            </div>
        );
    }
    
    // Fallback if stats are null after loading (API error)
    if (!stats) {
         return (
            <div className="p-8 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 rounded-lg">
                <h2 className="text-xl font-bold">Error Loading Data</h2>
                <p>Failed to retrieve channel statistics. Please check the API endpoint and try again.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Channel Analytics Overview</h2>
            <p className="text-gray-600 dark:text-gray-400">A snapshot of your channel's overall performance.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatBlock icon={FaUsers} title="Total Subscribers" value={formatNumber(stats.totalSubscribers)} />
                <StatBlock icon={FaVideo} title="Videos Uploaded" value={formatNumber(stats.totalVideos)} />
                <StatBlock icon={FaEye} title="Cumulative Views" value={formatNumber(stats.totalViews)} />
                <StatBlock icon={FaThumbsUp} title="Total Likes Received" value={formatNumber(stats.totalLikes)} />
            </div>

            <div className='pt-8'>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Performance</h3>
                <div className="h-64 mt-4 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500">
                    [Placeholder for Chart / Graph]
                </div>
            </div>
        </div>
    );
};

export default ChannelStatsPage;