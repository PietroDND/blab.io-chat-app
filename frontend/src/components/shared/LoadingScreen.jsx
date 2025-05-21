import React from 'react'
import { LoaderCircle } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
        <LoaderCircle className='size-10 animate-spin mb-0.5' />
        <span>Loading</span>
    </div>
  )
}

export default LoadingScreen