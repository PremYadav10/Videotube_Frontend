import {Outlet,Link} from 'react-router-dom'
import Header from './Components/Header'
import Sidebar from './Components/Sidebar'
import SidebarMenu from './Components/SidebarMenu'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

function App() {

  const isOpen = useSelector((state)=>state.sidebar.isOpen)

  return (
    <div className='min-h-screen  bg-gradient-to-br from-gray-900 via-gray-800 to-black'>
        <Header />

        {/* Conditional rendering with animation classes */}
      <div className={`fixed top-16 left-0 z-20 overflow-y-auto transition-all duration-300  ${isOpen ? 'w-60' : 'w-18'}`}>
        {isOpen ? <SidebarMenu /> : <Sidebar />}
      </div>

      {/* Main content area with dynamic margin */}
      <div className={`mt-16 transition-all duration-300 ${isOpen ? 'ml-60' : 'ml-18'}`}>
        <Outlet />
      </div>
    </div>
  )
}

export default App