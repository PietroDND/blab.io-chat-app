import React from 'react'
import blabHeroImage from '../../assets/blab_hero_notext.png';

const AuthHeroSection = () => {
  return (
    <div className='hidden lg:flex items-center justify-center bg-base-200 p-12'>
      <div className='max-w-md text-center'>
        <img src={blabHeroImage} alt="Hero Image" />
      </div>
    </div>
  )
}

export default AuthHeroSection