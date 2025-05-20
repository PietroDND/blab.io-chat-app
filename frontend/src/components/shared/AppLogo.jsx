import React from 'react'
import logo from '../../assets/blab_logo.png';

const AppLogo = ({animate}) => {
  return (
    <div className={`size-9 flex items-center justify-center ${animate ? 'animate-bounce' : ''}`}>
      <img src={logo} alt="Blab.io Logo" />
    </div>
  )
}

export default AppLogo