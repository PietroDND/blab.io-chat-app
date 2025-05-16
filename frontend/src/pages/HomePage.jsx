import React from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import { useOnlineStore } from '../stores/onlineStore'

const HomePage = () => {
  return (
    <div className='h-screen bg-base-200'>
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className='flex flex-col sm:flex-row h-full rounded-lg overflow-hidden'>
            <Sidebar />
            <ChatContainer />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage