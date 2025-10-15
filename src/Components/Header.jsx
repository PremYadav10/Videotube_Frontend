import { useEffect, useState } from 'react';
import Logo from './Logo'
import { FaList, FaSearch,FaPlus,FaUser} from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../features/Sidebar/sidebarSlice';
import Dropdown from './DropDown.jsx'


function Header() {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state)=>state.user.status)
  const userData = useSelector((state)=>state.user.userData)
  const [userAvatar,setUserAvatar] = useState("");
  
useEffect(()=>{
  if(userData && userData.user.avatar) {
    setUserAvatar(userData.user.avatar);
  }
},[userData])  

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar())
  }


  const handleInput = ()=>{
    setValue(value)
  }

  
  return (
     <div className='bg-black text-white flex flex-row items-center justify-between h-16 fixed top-0 left-0 right-0 z-10 '>
        <div className='flex flex-row items-center ml-4'>
          <span onClick={handleSidebarToggle} className='border border-gray-700 p-2 m-2 rounded-xl cursor-pointer hover:scale-105 active:bg-white active:text-black'>
            <FaList  />
          </span>
         <Link to="/"> <span><Logo/></span> </Link>
        </div>

        <div className='flex flex-row items-center border border-gray-700 rounded-full bg-gray-900 '>
          <span className='border-r border-gray-600 pr-2'>
            <input value={value} onChange={handleInput} className='rounded-md w-full p-2 border-none focus:outline-none active:outline-none ' type="text" placeholder='Search' />
          </span>
          <span className='text-xl cursor-pointer px-4 p-2 hover:text-emerald-500 rounded-r-2xl'>
            <FaSearch />
          </span>
        </div>

      <div className="flex flex-row items-center mr-4">
      {/* Create Dropdown */}
      {isLoggedIn ? (
        <Dropdown
          triggerLabel={
            <span className="flex flex-row items-center border border-gray-700 p-2 rounded-2xl hover:scale-110 gap-2">
              <FaPlus /> Create
            </span>
          }
          items={[
            { label: "📹 Create Video", to: "/publish-video" },
            { label: "📝 Create Tweet", to: "/tweets" },
          ]}
        />
      ) : (
        <Link
          to="/login"
          className="flex flex-row items-center gap-2 border border-gray-700 p-2 m-2 rounded-xl cursor-pointer hover:scale-105"
        >
          <FaPlus /> Login
        </Link>
      )}

      {/* Profile Dropdown */}
      {isLoggedIn && (
        <Dropdown
          triggerLabel={
            userAvatar ? (
              <img
                className="h-9 w-9 border border-gray-700 rounded-full hover:scale-110"
                src={userAvatar}
                alt="user-avatar"
              />
            ) : (
              <FaUser className="h-9 w-9 border border-gray-700 m-2 rounded-full cursor-pointer hover:scale-110 p-2" />
            )
          }
          items={[
            { label: "👤 My Profile", to: "/profile" },
            { label: "⚙️ Settings", to: "/settings" },
            { label: "🚪 Logout", to:"/logout" },
          ]}
        />
      )}
    </div>
     </div>
  )
}

export default Header