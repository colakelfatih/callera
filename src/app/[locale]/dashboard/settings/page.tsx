'use client'

import React, { useState } from 'react'
import { Search, Bell, HelpCircle, User, Settings, BellRing, Plug, CreditCard, Upload } from 'lucide-react'
// import { useLanguage } from '@/contexts/LanguageContext'

export default function SettingsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    // const { t } = useLanguage()

    return (
        <div className="flex flex-1 flex-col overflow-y-auto">
            {/* TopNavBar */}
            <header className="flex items-center justify-between sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 px-10 py-3">
                <label className="flex flex-col min-w-40 !h-10 max-w-64">
                    <div className="flex w-full flex-1 items-stretch rounded h-full">
                        <div className="text-gray-500 dark:text-gray-400 flex bg-white dark:bg-gray-800 items-center justify-center pl-4 rounded-l border border-gray-300 dark:border-gray-700 border-r-0">
                            <Search size={20} />
                        </div>
                        <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 rounded-l-none border-l-0 text-base font-normal leading-normal"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </label>
                <div className="flex flex-1 justify-end gap-4 items-center">
                    <div className="flex gap-2">
                        <button className="flex items-center justify-center rounded h-10 w-10 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <Bell size={20} />
                        </button>
                        <button className="flex items-center justify-center rounded h-10 w-10 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <HelpCircle size={20} />
                        </button>
                    </div>
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" data-alt="User profile picture of Alex Doe" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAHwe76qGY30mMftw8dc5YxwPW7vSaps5ybElvt16BsnR0im5QUHEPFFQ3WuG580VHDZJDJd-VmwBxjw_P2_jRh9ae4P9exbWgB90C_G4AlN0p8VA9fIxkORFHC5kZQyPE7sEJeKmEDD1ms1-2AO8dGn0-ibInt5ZLc8SDPdfpBB44rCc3ws21iCI_oj-Doe13yR6xaR3zwwN7U17TzkXBzIoH84fTFQ7PDR9pvKNheIBUI22djPCLb-d1WOBpT27JWJq0oGaj0TTE")' }}></div>
                </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 p-10">
                {/* PageHeading */}
                <div className="mb-8">
                    <p className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Settings</p>
                    <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal mt-2">Manage your account settings and preferences</p>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
                    <div className="flex gap-8">
                        <a className="flex items-center justify-center border-b-[3px] border-b-primary text-primary gap-2 pb-3 pt-1" href="#">
                            <User size={20} />
                            <p className="text-sm font-bold leading-normal tracking-[0.015em]">My Profile</p>
                        </a>
                        <a className="flex items-center justify-center border-b-[3px] border-b-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 gap-2 pb-3 pt-1" href="#">
                            <Settings size={20} />
                            <p className="text-sm font-bold leading-normal tracking-[0.015em]">Preferences</p>
                        </a>
                        <a className="flex items-center justify-center border-b-[3px] border-b-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 gap-2 pb-3 pt-1" href="#">
                            <BellRing size={20} />
                            <p className="text-sm font-bold leading-normal tracking-[0.015em]">Notifications</p>
                        </a>
                        <a className="flex items-center justify-center border-b-[3px] border-b-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 gap-2 pb-3 pt-1" href="#">
                            <Plug size={20} />
                            <p className="text-sm font-bold leading-normal tracking-[0.015em]">Integrations</p>
                        </a>
                        <a className="flex items-center justify-center border-b-[3px] border-b-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 gap-2 pb-3 pt-1" href="#">
                            <CreditCard size={20} />
                            <p className="text-sm font-bold leading-normal tracking-[0.015em]">Billing</p>
                        </a>
                    </div>
                </div>

                {/* Content Area */}
                <div className="max-w-4xl mx-auto flex flex-col gap-10">
                    {/* ProfileHeader */}
                    <div className="flex p-4 @container">
                        <div className="flex w-full flex-col gap-4 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
                            <div className="flex gap-6 items-center">
                                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32" data-alt="User profile picture of Alex Doe" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDwVNcB5wWyhr5XEY0cpH_8b0vb71gQJJtmSYnHJlu7988mGVjRtlrgqk8Am5vww4BPl0qYQVWNrgdY3ZaEYc2joaJ7skoHgPV1nJmKCW2wwIEpLQ9ewy1EdVltRnySJvjBGXjSBk8Ur25rVjxeCzZbZNMVK3GXWb8ZFVv3kSIrDPEEPuBurwD87cVeGcE393C1gWhUG1XwMLmCBFApqhfAUw4QnY-4Vx3jnhcyUXNQ-zYVm7OwmtBI7zJHhU6mcBgQ23jVoSkimuY")' }}></div>
                                <div className="flex flex-col justify-center gap-1">
                                    <p className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Alex Doe</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Ürün Yöneticisi</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">alex.doe@callera.ai</p>
                                </div>
                            </div>
                            <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded h-10 px-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] w-full max-w-[480px] @[480px]:w-auto border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700">
                                <Upload size={16} className="mr-2" />
                                <span className="truncate">Upload New Picture</span>
                            </button>
                        </div>
                    </div>

                    {/* Personal Info Form Card */}
                    <div className="bg-white dark:bg-gray-900/50 p-8 rounded-lg border border-gray-200 dark:border-gray-800">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Personal Information</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6">Update your personal details</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="firstName">First Name</label>
                                <input className="form-input w-full rounded border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" id="firstName" type="text" defaultValue="Alex" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="lastName">Last Name</label>
                                <input className="form-input w-full rounded border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" id="lastName" type="text" defaultValue="Doe" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="role">Role</label>
                                <input className="form-input w-full rounded border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" id="role" type="text" defaultValue="Ürün Yöneticisi" />
                            </div>
                        </div>
                    </div>

                    {/* Change Password Form Card */}
                    <div className="bg-white dark:bg-gray-900/50 p-8 rounded-lg border border-gray-200 dark:border-gray-800">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Password</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6">Change your password</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="currentPassword">Current Password</label>
                                <input className="form-input w-full rounded border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" id="currentPassword" type="password" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="newPassword">New Password</label>
                                <input className="form-input w-full rounded border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" id="newPassword" type="password" />
                            </div>
                        </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="flex justify-end gap-4 mt-4 pb-10">
                        <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded h-10 px-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700">
                            <span className="truncate">Cancel</span>
                        </button>
                        <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90">
                            <span className="truncate">Save Changes</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}