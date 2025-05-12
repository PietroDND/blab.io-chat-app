import React from 'react'
import { useAuthStore } from '../stores/authStore'
import { LogOut, Settings, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from '../assets/blab_logo.png';

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  return (
    <header
      className='border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-md bg-base-100/80'
    >
      <div className="container mx-auto px-2 h-16">
        <div className='flex items-center justify-between h-full'>
          <div className='flex items-center gap-8'>
            <Link to='/' className='flex items-center gap-0.5 hover:opacity-80 transition-all'>
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <img src={logo} alt="Blab.io Logo" />
              </div>
              <h1 className="text-3xl font-bold">lab.io</h1>
            </Link>
          </div>

          <div className='flex items-center gap-2'>
            <Link
              to={'/settings'}
              className={'btn btn-sm gap-2 transition-colors'}
            >
              <Settings className='size-4' />
              <span className='hidden sm:inline'>Settings</span>
            </Link>

            {true && (
              <>
                <Link to='/profile' className='btn btn-sm gap-2'>
                  <User className='size-5' />
                  <span className='hidden sm:inline'>Profile</span>
                </Link>
                <Link className='flex gap-2 items-center cursor-pointer btn btn-sm' onClick={logout} to='/'>
                  <LogOut className='size-5' />
                  <span className="hidden sm:inline">Logout</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar