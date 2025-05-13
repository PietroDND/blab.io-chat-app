import React from 'react'
import { Users } from 'lucide-react'

const SidebarHeader = () => {
  return (
    <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
            <Users className="w-6 h-6" />
            <span className="font-medium hidden lg:block">Contacts</span>
        </div>
    </div>
    )
}

export default SidebarHeader