'use client'
import { useSession } from '@/contexts/session'
import useAxios from '@/hooks/useAxios'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import toast from 'react-hot-toast'

export default function Header() {
	const axios = useAxios()
	const { session, updateSession } = useSession()
	const router = useRouter()
	const handleLogout = async () => {
		try {
			const res = await axios.get('/api/logout')
			if (res.status === 200) {
				updateSession(null)
				router.push('/login')
			}
		} catch (error) {
			const res = error?.response?.data?.errors
			if (res) return setErrors(res)
			toast.error(error?.response?.data?.message || 'Something went wrong')
		}
	}
	return (
		<div className="fixed bg-white top-0 left-0 right-0 w-full shadow-sm">
			<div className="max-w-[1170px] h-[92px] mx-auto flex justify-between items-center gap-2">
				<Image src="/logo.svg" alt="logo" width={180} height={55} />
				<ul className="hidden lg:flex gap-10 font-semibold whitespace-nowrap">
					<li>Paytm for Consumer</li>
					<li>Paytm For Business</li>
					<li>Investor Relations</li>
					<li>Company</li>
					<li>Career</li>
				</ul>
				{session ? (
					<div className="group relative">
						<div className="bg-[#002970] p-[2px] ps-5 flex items-center gap-2 rounded-[20px] cursor-pointer">
							<span className="font-semibold text-[15px] text-white">Hi,&nbsp;User</span>
							<Image src="/logoutImg.svg" alt="login" width={34} height={34} />
						</div>
						<div className="invisible absolute right-0 z-50 flex w-[200px] flex-col bg-gray-100 py-1 text-gray-800 shadow-2xl border rounded-lg group-hover:visible">
							<p className="px-5 py-2 hover:bg-slate-200 font-medium whitespace-nowrap">View Profile</p>
							<p className="px-5 py-2 hover:bg-slate-200 font-medium whitespace-nowrap">Your Orders</p>
							<p className="px-5 py-2 hover:bg-slate-200 font-medium whitespace-nowrap">Your Wallet</p>
							<p className="px-5 py-2 hover:bg-slate-200 font-medium whitespace-nowrap">24x7 Help</p>
							<p
								className="px-5 py-2 hover:bg-slate-200 font-medium whitespace-nowrap cursor-pointer"
								onClick={handleLogout}>
								Sign Out
							</p>
						</div>
					</div>
				) : (
					<Link href="/login" className="cursor-pointer">
						<div className="bg-[#00baf2] p-[2px] ps-5 flex items-center gap-2 rounded-[20px]">
							<span className="font-semibold text-[15px] text-white">Sign&nbsp;In</span>
							<Image src="/loginImg.svg" alt="login" width={34} height={34} />
						</div>
					</Link>
				)}
			</div>
		</div>
	)
}
