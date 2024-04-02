'use client'
import useAxios from '@/hooks/useAxios'
import Image from 'next/image'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

export default function AddMoney({ onClose, refetchData }) {
	const [amount, setAmount] = useState(0)
	const [errors, setErrors] = useState({ amount: '' })
	const axios = useAxios()
	const handleAddMoney = async (e) => {
		e.preventDefault()

		if (amount === '') return setErrors({ amount: 'Please enter amount' })
		if (isNaN(amount)) return setErrors({ amount: 'Please enter a valid amount' })
		if (amount < 1) return setErrors({ amount: 'Amount must be greater than 0' })

		try {
			const res = await axios.post('/api/transactions', {
				amount,
				type: 'credit',
			})
			toast.success('Money added successfully')
			onClose(false)
            refetchData()
		} catch (error) {
			const res = error?.response?.data?.errors
			if (res) return setErrors(res)
			toast.error(error?.response?.data?.message || 'Something went wrong')
		}
	}
	return (
		<>
			<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-30">
				<div className="relative w-[350px] my-6 mx-auto">
					<div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white p-5">
						<div className="flex justify-between items-center">
							<div>
								<p className="text-sm font-medium">AddMoney to</p>
								<p className="font-semibold text-xl">Paytm Wallet</p>
							</div>
							<Image src="/wallet.svg" alt="wallet" width={45} height={45} />
						</div>
						<div>
							<form className="flex flex-col gap-2 mt-6 text-sm">
								<input
									type="number"
									value={amount}
									onChange={(e) => {
										setAmount(e.target.value.trim())
										setErrors({ ...errors, amount: '' })
									}}
									placeholder=""
									className="border p-2 rounded outline-none focus:border-[#00baf2] w-full text-lg"
								/>
								<p className="text-xs text-red-500">{errors.amount}</p>
								<div className="flex gap-2 my-2">
									<p
										className="px-2 text-sm border rounded cursor-pointer"
										onClick={() => setAmount(Number(amount) + 100)}>
										+100
									</p>
									<p
										className="px-2 text-sm border rounded cursor-pointer"
										onClick={() => setAmount(Number(amount) + 500)}>
										+500
									</p>
									<p
										className="px-2 text-sm border rounded cursor-pointer"
										onClick={() => setAmount(Number(amount) + 1000)}>
										+1000
									</p>
								</div>
								<button className="bg-[#00baf2] text-white p-2 rounded mt-2" onClick={handleAddMoney}>
									Add Money to Wallet
								</button>
								<button className="mt-4 underline border-none" onClick={() => onClose(false)}>
									Close
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
			<div className="opacity-50 fixed inset-0 z-20 bg-black"></div>
		</>
	)
}
