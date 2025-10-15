import React from 'react'

function Item({icon,iconSize='text-xl', title}) {
  return (
    <div className='text-white flex flex-row items-center  pl-8 p-2 gap-8 h-12  text-5xl hover:bg-gray-800 rounded-md cursor-pointer'>
        <span className={`${iconSize}`}>{icon}</span>
        <span className='text-base'>{title}</span>
    </div>
  )
}

export default Item