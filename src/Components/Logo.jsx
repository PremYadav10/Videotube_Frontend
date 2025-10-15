import React from 'react'
import VideotubeLogo from "../assets/Videotube.png"

function Logo({width = "100px" , height = "100px"}) {
  return (
    <div className='p-1'>
      <img width={width} height={height} className='rounded-2xl' src={VideotubeLogo} alt="VideotubeLogo" />
    </div>
  )
}

export default Logo