import React from 'react'
import { Users, MessageSquareText } from 'lucide-react';

const SidebarSkeleton = () => {

    const placeholderContacts = Array(10).fill(null);

  return (
    <aside
        className="h-full w-20 lg:w-72 border-r border-base-300 
        flex flex-col transition-all duration-200"
    >
        <div className="w-full collapse collapse-arrow bg-base-100 border-b border-base-300 max-h-[80%]">
        <input type="radio" name="my-accordion-2" defaultChecked />
        <div className="flex items-center gap-2 collapse-title">
            <Users className="size-5" />
            <span className="hidden lg:block">Contacts</span>
        </div>
        <div className="collapse-content w-full overflow-y-auto">
            <div className="overflow-y-auto w-full py-3">
                {placeholderContacts.map((_, idx) => (
                    <div key={idx} className="w-full p-3 flex items-center gap-3 mb-1">
                        {/* Avatar skeleton */}
                        <div className="relative mx-auto lg:mx-0">
                            <div className="skeleton size-12" />
                        </div>

                        {/* User info skeleton - only visible on larger screens */}
                        <div className="hidden lg:block text-left min-w-0 flex-1">
                            <div className='flex justify-between'>
                                <div className="skeleton h-3 w-32 mb-2" />
                                <div className="skeleton h-3 w-6 mb-2" />
                            </div>
                            <div className="skeleton h-3 w-24" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      <div className="w-full collapse collapse-arrow bg-base-100 border-base-300 max-h-[90%]">
        <input type="radio" name="my-accordion-2" />
        <div className="flex items-center gap-2 collapse-title">
          <MessageSquareText className='size-5' />
          <span className="hidden lg:block">Chats</span>
        </div>
        <div className="collapse-content w-full overflow-y-auto">
            <div className="overflow-y-auto w-full py-3">
                {placeholderContacts.map((_, idx) => (
                    <div key={idx} className="w-full p-3 flex items-center gap-3 mb-1">
                        {/* Avatar skeleton */}
                        <div className="relative mx-auto lg:mx-0">
                            <div className="skeleton size-12" />
                        </div>

                        {/* User info skeleton - only visible on larger screens */}
                        <div className="hidden lg:block text-left min-w-0 flex-1">
                            <div className='flex justify-between'>
                                <div className="skeleton h-3 w-32 mb-2" />
                                <div className="skeleton h-3 w-6 mb-2" />
                            </div>
                            <div className="skeleton h-3 w-24" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>      
    </aside>
    )
}

export default SidebarSkeleton