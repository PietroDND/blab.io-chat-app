import React from 'react'
import AppLogo from './shared/AppLogo'

const ChatPlaceholder = () => {
  return (
    <div className='flex flex-1 justify-center items-center'>
        <div className='flex flex-col items-center gap-2'>
            <AppLogo animate={true}/>
            <span className='font-bold text-xl text-gray-200'>Welcome to Blab.io!</span>
            <span className='text-gray-200 text-sm'>Select a chat from the sidebar</span>
        </div>
    </div>
  )
}

export default ChatPlaceholder