import Image from 'next/image'
import React from 'react'

export default function Footer() {
	return (
		<div className="bg-[#f5f7fa] px-[10px]">
			<div className="flex justify-between border-b border-[#ccc] py-[90px] flex-wrap gap-6">
				<div className="flex gap-2 flex-wrap">
					<p className="font-semibold text-xl md:w-[230px]">Download Paytm App to Pay from anywhere</p>
					<Image src="/downloadApple.svg" alt="downloadApple" width={170} height={56} />
					<Image src="/downloadGoogle.svg" alt="downloadGoogle" width={189} height={56} />
				</div>
				<div className="flex items-center gap-8">
					<Image src="/twitter.svg" alt="twitter" width={25} height={25} />
					<Image src="/instagram.svg" alt="instagram" width={25} height={25} />
					<Image src="/facebook.svg" alt="facebook" width={25} height={25} className="size-[25px]" />
				</div>
			</div>

			<div className='mt-[60px] text-[#505050] flex flex-col gap-6 pb-[100px]'>
				<div className="flex justify-start gap-2">
					<Image src="/plus.svg" width={13} height={13} alt="plus" />
					<span className="font-semibold text-[15px]">Investor Relations</span>
					<div className="flex-grow border-b border-[#ccc]"></div>
				</div>
                <div className="flex justify-start gap-4">
					<Image src="/plus.svg" width={13} height={13} alt="plus" />
					<span className="font-semibold text-[15px]">More about Paytm</span>
					<div className="flex-grow border-b border-[#ccc]"></div>
				</div>
                <div className="flex justify-start gap-4">
					<Image src="/plus.svg" width={13} height={13} alt="plus" />
					<span className="font-semibold text-[15px]">Company</span>
					<div className="flex-grow border-b border-[#ccc]"></div>
				</div>
			</div>

            <div className='bg-[#00baf2] h-3 -mx-[10px]'></div>
            <div className='bg-[#002970] h-3 -mx-[10px]'></div>

		</div>
	)
}
