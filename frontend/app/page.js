'use client'
import AddMoney from '@/components/AddMoney'
import useAxios from '@/hooks/useAxios'
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns';
import toast from 'react-hot-toast'
import { useSession } from '@/contexts/session'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'

export default function page() {
    const [isOpenAddMoney, setIsOpenAddMoney] = useState(false)
    const [transactions, setTransactions] = useState([])
    const [total, setTotal] = useState(10)
    const [balance, setBalance] = useState(0)
    const [isLoading, setLoading] = useState(false)
    const axios = useAxios()
    let lastDate = null
    const { session } = useSession()

    const limit = 6
    const [page, setPage] = useState(1)

    // const fetchNextPage = async () => {
    //     getTransactions(page + 1)
    //     setPage(page + 1)
    // }

    // const hasNextPage = useMemo(() => {
    //     return total > limit * page
    // }, [page, total])

    // const [loaderRef, scrollerRef] = useInfiniteScroll({ hasNextPage, fetchNextPage })

    const getTransactions = async (page = 1) => {
        setLoading(true)
        try {
            const res = await axios.get(`/api/transactions?page=${page}&limit=${limit}`)
            if (res.status === 200) {
                setTransactions(res.data.transactions)
                setTotal(res.data.total)
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const getBalance = async () => {
        try {
            const res = await axios.get('/api/balance')
            if (res.status === 200) {
                setBalance(res.data.balance)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something went wrong')
        }
    }

    useEffect(() => {
        if (session) {
            getTransactions(page)
            getBalance(page)
        }
    }, [page, isOpenAddMoney])

    const formatDate = (date) => {
        return format(date, "dd MMM, h:mm aa");
    };

    const formatBalance = (balance) => {
        return Number.isInteger(balance) ? Math.floor(balance) : balance
    }

    const renderMonth = (date) => {
        const month = format(date, "MMMM yyyy");
        if (lastDate !== month) {
            lastDate = month;
            return <p className='py-[5px] ms-[90px] font-semibold text-black uppercase'>{month}</p>
        }
        return null
    }

    if (session === null) return <p className='text-sm font-semibold ps-[25px] pt-[25px] pb-[200px]'>Signin to view Passbook</p>

    return (
        <div>
            <div className='bg-[#00174d] h-[240px] text-center'>
                <p className='py-8  text-white text-xs'>Home  &gt;  Passbook</p>
            </div>
            <div className='-mt-[150px] max-w-[1260px] px-[3%] mx-auto mb-[100px]'>
                <div className='rounded-2xl border border-[#deeaee] bg-white min-h-[500px] pt-5'>
                    <div className='min-h-[100px] flex justify-between items-end border-b border-[#ccc] px-10'>
                        <ul className='flex flex-grow gap-5'>
                            <li className='flex items-center gap-1 border-b-2 border-[#00baf2]'>
                                <Image src='/wallet.svg' alt='wallet' width={45} height={45} />
                                <div className='py-5 px-[15px]'>
                                    <p className='font-semibold text-xs uppercase'>Wallet</p>
                                    <p className='font-semibold text-sm'>₹{formatBalance(balance)}</p>
                                </div>
                            </li>
                            <li className='flex items-center gap-1 li2'>
                                <Image src='/2f79044b.svg' alt='wallet' width={45} height={45} />
                                <div className='py-5 px-[15px]'>
                                    <p className='font-semibold text-xs uppercase'>Gift Voucher</p>
                                    <p className='font-semibold text-sm'>₹0</p>
                                </div>
                            </li>
                        </ul>
                        <div className='mb-5 border-s border-[#ccc] px-[40px]'>
                            <p className='font-semibold text-xs uppercase'>Total Balance</p>
                            <p className='font-semibold text-2xl'>₹{formatBalance(balance)}</p>
                        </div>
                    </div>

                    <div className='flex justify-between bg-[#f5f7fa] py-[15px] ps-[20px] pe-[55px]'>
                        <div className='flex gap-4'>
                            <button className='bg-white py-[8px] px-[30px] font-semibold text-sm'>Wallet</button>
                            <button className='bg-white py-[8px] px-[30px] font-semibold text-sm hover:bg-[#00baf2] hover:text-white' onClick={(e) => setIsOpenAddMoney(true)}>Add Money</button>
                        </div>
                        <Image src='/ppblLogo.svg' alt='ppblLogo' width={112} height={16} />
                    </div>

                    {/* transaction history */}

                    {transactions.length === 0 ? <p className='text-sm py-[50px] ps-[25px]'>No Paytm transactions associated with your account.</p> : (
                        <>
                            <div className="flex text-[11px] font-normal text-[#4f4f4f] px-[65px] py-[20px] border-b border-[#ccc] mb-5">
                                <div className="flex-[6_1] ps-[25px]"><span>TRANSACTIONS</span></div>
                                <div className="flex-[2_1]"><span>AMOUNT</span></div>
                                <div className="flex-[2_1]"><span>STATUS</span></div>
                                <div className="flex-[3_1]"><span>COMMENTS</span></div>
                            </div>

                            <div className='text-xs text-[#4f4f4f]'>

                                <div className='flex flex-col gap-2'>
                                    {transactions && transactions.map((item) => (
                                        <React.Fragment key={item.id}>
                                            {renderMonth(item.createdAt)}
                                            <div className='flex mx-[65px] py-[10px] border-b border-[#ccc]'>
                                                <div className='flex-[6_1] ps-[25px]'>
                                                    <div className='flex'>
                                                        <div className='size-[50px] me-[15px] rounded-full border border-[#ccc]'>
                                                            {item.type === 'credit' ?
                                                                <Image className='' src='/AddedMoney.png' alt='wallet' width={50} height={50} />
                                                                :
                                                                <Image className='' src='/SentMoney.png' alt='wallet' width={50} height={50} />}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className='text-sm text-black'>{item?.description || 'Wallet transaction'}</span>
                                                            <span className=" mb-[10px]">{formatDate(item.createdAt)}</span>
                                                            <span>Order ID :  1234567890</span>
                                                            <span>Transaction ID {item.id}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='flex-[2_1]'>
                                                    {item.type === 'debit' ? <span>- </span> : <span>+ </span>}
                                                    <span>₹{formatBalance(item.amount)}</span>
                                                </div>
                                                <div className='flex-[2_1] uppercase'><span>Success</span></div>
                                                <div className='flex-[3_1]'><span>{item.comments}</span></div>
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                            {/* <div className="w-1 h-1 border" ref={loaderRef}></div>
                            {isLoading && <p className='text-xs font-semibold text-center p-2'>Loading...</p>} */}
                            <div className='flex gap-2 justify-center items-center py-4'>
                                {Array.from({ length: Math.ceil(total / limit) }, (_, i) => (
                                    <p key={i} className={page === i + 1 ? 'border border-[#00baf2] rounded-md px-2 py-1 cursor-pointer' : 'px-2 py-1 cursor-pointer text-[#ccc]'}
                                        onClick={() => {
                                            setPage(i + 1)
                                        }}
                                    >{i + 1}</p>
                                ))}
                            </div>

                        </>
                    )}
                </div>
            </div>
            {isOpenAddMoney && <AddMoney onClose={setIsOpenAddMoney} setPage={setPage}/>}
        </div>
    )
}
