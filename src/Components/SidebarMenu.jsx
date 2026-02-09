import Item from './Item'
import { FaHome, FaHistory, FaUserAlt, FaDownload ,FaTwitter} from "react-icons/fa";
import { MdOutlinePlaylistPlay, MdSubscriptions, MdOutlineOndemandVideo, MdOutlineWatchLater, MdOutlineSettings } from "react-icons/md";
import { AiFillLike } from "react-icons/ai";
import { RxDashboard } from "react-icons/rx";

import '../App.css'
import { Link, Links } from 'react-router-dom';
import { useSelector } from 'react-redux';

function SidebarMenu() {

  const isLoggedIn = useSelector((state)=>state.user.status)

  return (
    <div className='text-white bg-black h-screen  border-r border-gray-700  flex flex-col gap-4 pt-5 pb-18 overflow-y-auto sidebar-scrollbar z-20'>
      
      <Link to="/" >
        <Item icon={<FaHome />} title='Home' iconSize='text-2xl' />
      </Link>

      <Link to="/tweets" >
        <Item icon={<FaTwitter />} title='Tweet' iconSize='text-2xl' />
      </Link>

      {isLoggedIn && <Link to="/dashboard/videos">      
      <Item icon={<MdOutlineOndemandVideo />} title='Your Videos' iconSize='text-2xl' />
      </Link>}

      {isLoggedIn && <Link to="/profile/watch-later">
      <Item icon={<MdOutlineWatchLater />} title='Watch Later' iconSize='text-2xl' />
      </Link> }

      <Link to="/profile/history">
      <Item icon={<FaHistory />} title='History' iconSize='text-2xl' />
      </Link>

      <Link to="/profile">
      <Item icon={<FaUserAlt />} title='You' iconSize='text-2xl' />
      </Link>

      <hr className='border-gray-700 my-1' />

      {!isLoggedIn && <Link className="flex flex-col items-center justify-center " to="/login">
      <p className='px-7 text-center'>Login to like , subscribe & other acitivities</p>
      <button className='m-2 bg-blue-600 px-4 py-2 rounded-xl cursor-pointer hover:bg-blue-800'>Login</button>
      </Link>}

      {isLoggedIn && <Link to="/profile/subscriptions">
      <Item icon={<MdSubscriptions />} title='Subscriptions' iconSize='text-2xl' />
      </Link> }

      {isLoggedIn && <Link to="/profile/playlists">
      <Item icon={<MdOutlinePlaylistPlay />} title='Playlist' iconSize='text-[40px]' />
      </Link> }

      {isLoggedIn && <Link to="/downloads">
      <Item icon={<FaDownload />} title='Download' iconSize='text-2xl' />
      </Link>}

      {isLoggedIn && <Link to="/profile/liked">
      <Item icon={<AiFillLike />} title='Liked Videos' iconSize='text-2xl' />
      </Link>}

      {isLoggedIn && <Link to="/dashboard">
      <Item icon={<RxDashboard />} title='Channel Dashboard' iconSize='text-2xl' />
      </Link>}

      <Link to="/settings">
      <Item icon={<MdOutlineSettings />} title='Settings' iconSize='text-2xl' />
      </Link>

      <hr className='border-gray-700 my-1' />

      

    </div>
  )
}

export default SidebarMenu