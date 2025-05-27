import React from 'react'
import AppLogo from './shared/AppLogo'

const ChatPlaceholder = () => {
  return (
    <div className='hidden md:flex flex-1 justify-center items-center h-full'>
        <div className='flex flex-col items-center gap-2'>
            <AppLogo animate={true}/>
            <span className='font-bold text-xl text-base-content/90'>Welcome to Blab.io!</span>
            <span className='text-sm text-base-content/80'>Select a chat from the sidebar</span>
        </div>
    </div>
  )
}

export default ChatPlaceholder