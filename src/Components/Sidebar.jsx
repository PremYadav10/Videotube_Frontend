import { FaHome,FaHistory,FaUserAlt,FaDownload,FaTwitter  } from "react-icons/fa";
import { MdOutlinePlaylistPlay } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Sidebar() {

    const isLoggedIn = useSelector((state)=>state.user.status)



  return (
    <div>
        <div className='h-screen bg-black text-white p-2 '>
            <ul className="flex flex-col gap-6 justify-center items-center pt-6">
                <Link to={'/'}>
                    <li className="flex flex-col justify-center items-center cursor-pointer h-16 w-16 hover:bg-gray-800 rounded-md">
                    <span className="text-xl">
                        <FaHome />
                    </span>
                    <span className="text-sm p-1">
                        Home
                    </span>
                </li>
                </Link>

                <Link to={'/tweets'}>
                    <li className="flex flex-col justify-center items-center cursor-pointer h-16 w-16 hover:bg-gray-800 rounded-md">
                    <span className="text-xl">
                        <FaTwitter />
                    </span>
                    <span className="text-sm p-1">
                        Tweet's
                    </span>
                </li>
                </Link>


                {isLoggedIn && <Link to={'/profile/playlists'}>
                <li className="flex flex-col justify-center items-center cursor-pointer h-16 w-16 hover:bg-gray-800 rounded-md">
                    <span className="text-3xl">
                        <MdOutlinePlaylistPlay />
                    </span>
                    <span className="text-sm p-1">
                        Playlists
                    </span>
                </li>
                </Link>}


                <Link to={'/profile/history'}>
                <li className="flex flex-col justify-center items-center cursor-pointer h-16 w-16 hover:bg-gray-800 rounded-md">
                    <span className="text-xl">
                        <FaHistory />
                    </span>
                    <span className="text-sm p-1">
                        History
                    </span>
                </li>
                </Link>

                {isLoggedIn && <Link to={'/download'}>
                <li className="flex flex-col justify-center items-center cursor-pointer h-16 w-16 hover:bg-gray-800 rounded-md">
                    <span className="text-xl">
                        <FaDownload />
                    </span>
                    <span className="text-sm p-1">
                        Download
                    </span>
                </li>
                </Link>}

                <Link to={'/profile'}>
                <li className="flex flex-col justify-center items-center cursor-pointer h-16 w-16 hover:bg-gray-800 rounded-md">
                    <span className="text-xl">
                        <FaUserAlt />
                    </span>
                    <span className="text-sm p-1">
                        You
                    </span>
                </li>
                </Link>
            </ul>
        </div>
    </div>
  )
}

export default Sidebar