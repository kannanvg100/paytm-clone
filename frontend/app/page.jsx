'use client'
import AddMoney from '@/components/AddMoney'
import useAxios from '@/hooks/useAxios'
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { useSession } from '@/contexts/session'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'
import Loader from '@/components/Loader'
import LoaderCircle from '@/components/LoaderCircle'

export default function Page() {
	const [isOpenAddMoney, setIsOpenAddMoney] = useState(false)
	const [transactions, setTransactions] = useState([])
	const [balance, setBalance] = useState(0)
	const [total, setTotal] = useState(0)
	const [loading, setLoading] = useState(true)
	const [hasMore, setHasMore] = useState(false)
	const axios = useAxios()
	let lastDate = null
	const { session } = useSession()
	const [showSpinner, setShowSpinner] = useState(true)

	const limit = 6
	const [page, setPage] = useState(1)

	const getTransactions = async () => {
		try {
			const res = await axios.get(`/api/transactions?page=${page}&limit=${limit}`)
			setTransactions((prev) => [...prev, ...res.data.transactions])
			setHasMore(res.data.total > page * limit)
			setTotal(res.data.total)
		} catch (error) {
			toast.error(error?.response?.data?.message || 'Something went wrong')
		} finally {
			setLoading(false)
		}
	}

	const loaderRef = useInfiniteScroll(setPage, loading, hasMore)

	const getBalance = async () => {
		try {
			const res = await axios.get('/api/balance')
			setBalance(res.data.balance)
		} catch (error) {
			toast.error(error?.response?.data?.message || 'Something went wrong')
		}
	}

	useEffect(() => {
		if (session) {
			setLoading(true)
			getTransactions()
		}
		setShowSpinner(false)
	}, [page])

	useEffect(() => {
		if (session) {
			getBalance()
		}
	}, [])

	const refetchData = () => {
		setTransactions([])
		setPage(1)
		getBalance()
	}

	const formatDate = (date) => {
		return format(date, 'dd MMM, h:mm aa')
	}

	const formatBalance = (balance) => {
		return Number.isInteger(balance) ? Math.floor(balance) : balance
	}

	const renderMonth = (date) => {
		const month = format(date, 'MMMM yyyy')
		if (lastDate !== month) {
			lastDate = month
			return <p className="py-[5px] ms-[90px] font-semibold text-black uppercase">{month}</p>
		}
		return null
	}

	return (
		<div>
			<div className="bg-[#00174d] h-[240px] text-center">
				<p className="py-8  text-white text-xs">Home &gt; Passbook</p>
			</div>
			<div className="-mt-[150px] max-w-[1260px] px-[3%] mx-auto mb-[100px]">
				<div className="rounded-2xl border border-[#deeaee] bg-white min-h-[500px] pt-5">
					<div className="min-h-[100px] flex justify-between items-end border-b border-[#ccc] px-10">
						<ul className="flex flex-grow gap-5">
							<li className="flex items-center gap-1 border-b-2 border-[#00baf2]">
								<Image src="/wallet.svg" alt="wallet" width={45} height={45} />
								<div className="py-5 px-[15px]">
									<p className="font-semibold text-xs uppercase">Wallet</p>
									<p className="font-semibold text-sm">₹{formatBalance(balance)}</p>
								</div>
							</li>
							<li className="flex items-center gap-1 li2">
								<Image src="/2f79044b.svg" alt="wallet" width={45} height={45} />
								<div className="py-5 px-[15px]">
									<p className="font-semibold text-xs uppercase">Gift Voucher</p>
									<p className="font-semibold text-sm">₹0</p>
								</div>
							</li>
						</ul>
						<div className="mb-5 border-s border-[#ccc] px-[40px]">
							<p className="font-semibold text-xs uppercase">Total Balance</p>
							<p className="font-semibold text-2xl">₹{formatBalance(balance)}</p>
						</div>
					</div>

					<div className="flex justify-between bg-[#f5f7fa] py-[15px] ps-[20px] pe-[55px]">
						<div className="flex gap-4">
							<button className="bg-white py-[8px] px-[30px] font-semibold text-sm">Wallet</button>
							<button
								className="bg-white py-[8px] px-[30px] font-semibold text-sm hover:bg-[#00baf2] hover:text-white"
								onClick={(e) => setIsOpenAddMoney(true)}>
								Add Money
							</button>
						</div>
						<Image src="/ppblLogo.svg" alt="ppblLogo" width={112} height={16} />
					</div>

					{/* transaction history */}
					{transactions.length > 0 && (
						<>
							<div className="flex text-[11px] font-normal text-[#4f4f4f] px-[65px] py-[20px] border-b border-[#ccc] mb-5">
								<div className="flex-[6_1] ps-[25px]">
									<span>TRANSACTIONS{`(${total})`}</span>
								</div>
								<div className="flex-[2_1]">
									<span>AMOUNT</span>
								</div>
								<div className="flex-[2_1]">
									<span>STATUS</span>
								</div>
								<div className="flex-[3_1]">
									<span>COMMENTS</span>
								</div>
							</div>

							<div className="text-xs text-[#4f4f4f]">
								<div className="flex flex-col gap-2">
									{transactions &&
										transactions.map((item, index) => (
											<React.Fragment key={index}>
												{renderMonth(item.createdAt)}
												<div className="flex mx-[65px] py-[10px] border-b border-[#ccc]">
													<div className="flex-[6_1] ps-[25px]">
														<div className="flex">
															<div className="size-[50px] me-[15px] rounded-full border border-[#ccc]">
																{item.type === 'credit' ? (
																	<Image
																		className=""
																		src="/AddedMoney.png"
																		alt="wallet"
																		width={50}
																		height={50}
																	/>
																) : (
																	<Image
																		className=""
																		src="/SentMoney.png"
																		alt="wallet"
																		width={50}
																		height={50}
																	/>
																)}
															</div>
															<div className="flex flex-col">
																<span className="text-sm text-black">
																	{item?.description || 'Wallet transaction'}
																</span>
																<span className=" mb-[10px]">
																	{formatDate(item.createdAt)}
																</span>
																<span>Order ID : 1234567890</span>
																<span>Transaction ID {item.id}</span>
															</div>
														</div>
													</div>
													<div className="flex-[2_1]">
														{item.type === 'debit' ? <span>- </span> : <span>+ </span>}
														<span>₹{formatBalance(item.amount)}</span>
													</div>
													<div className="flex-[2_1] uppercase">
														<span>Success</span>
													</div>
													<div className="flex-[3_1]">
														<span>{item.comments}</span>
													</div>
												</div>
											</React.Fragment>
										))}
								</div>
							</div>
						</>
					)}

					<div className="w-1 h-1 border" ref={loaderRef}></div>

					{loading && !showSpinner && <Loader />}
					{transactions.length === 0 && (
						<p className="text-sm py-[50px] ps-[25px]">
							No Paytm transactions associated with your account.
						</p>
					)}
				</div>
			</div>
			{isOpenAddMoney && <AddMoney onClose={setIsOpenAddMoney} refetchData={refetchData} />}
			{showSpinner && (
				<div className="fixed inset-0 flex justify-center items-center z-50">
					<div className="z-50">
						<LoaderCircle />
					</div>
					<div className="fixed inset-0 z-40 bg-black opacity-80"></div>
				</div>
			)}
		</div>
	)
}
