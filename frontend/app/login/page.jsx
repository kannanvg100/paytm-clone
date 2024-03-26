'use client'
import { useSession } from '@/contexts/session'
import useAxios from '@/hooks/useAxios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

export default function page() {
	const [email, setEmail] = useState('test@gmail.com')
	const [password, setPassword] = useState('1111')
	const [errors, setErrors] = useState({ email: '', password: '' })
    const axios = useAxios()
    const router = useRouter()
    const { updateSession } = useSession()
	const handleLogin = async (e) => {
		e.preventDefault()
		let newErrors = {}
		if (email === '') newErrors.email = 'Please enter your email'
		else if (email.indexOf('@') === -1 || email.indexOf('.') === -1) newErrors.email = 'Please enter a valid email'
		if (password === '') newErrors.password = 'Please enter your password'

		if (Object.keys(newErrors).length === 0) {
			try {
				const res = await axios.post('/api/login', { email, password })
				if (res.status === 200) {
					updateSession(res.data)
					router.replace('/')
				}
			} catch (error) {
				const res = error?.response?.data?.errors
				if (res) return setErrors(res)
				toast.error(error?.response?.data?.message || 'Something went wrong')
			}
		} else setErrors(newErrors)
	}

	return (
		<div className="w-[350px] mx-auto pt-10 pb-[100px]">
			<div className="flex gap-4">
				<h1 className="text-xl text-[#00baf2] border-b-2 border-[#00baf2] pb-2">Login</h1>
				<Link href="/signup">
					<h1 className="text-xl text-[#ccc] pb-2">Signup</h1>
				</Link>
			</div>
			<form className="flex flex-col gap-2 mt-8 text-sm">
				<input
					type="email"
					value={email}
					onChange={(e) => {
						setEmail(e.target.value.trim())
						setErrors({ ...errors, email: '' })
					}}
					placeholder="Email"
					className="border p-2 rounded outline-none focus:border-[#00baf2]"
				/>
				<p className="text-xs text-red-500">{errors.email}</p>
				<input
					type="password"
					value={password}
					onChange={(e) => {
						setPassword(e.target.value.trim())
						setErrors({ ...errors, password: '' })
					}}
					placeholder="Password"
					className="mt-4 border p-2 rounded outline-none focus:border-[#00baf2]"
				/>
				<p className="text-xs text-red-500">{errors.password}</p>
				<button className="bg-[#00baf2] text-white p-2 rounded" onClick={handleLogin}>
					Login
				</button>
			</form>
		</div>
	)
}
