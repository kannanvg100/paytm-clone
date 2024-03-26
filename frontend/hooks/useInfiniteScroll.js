import { useEffect, useRef } from 'react'

export default function useInfiniteScroll({ hasNextPage, fetchNextPage }) {
	const loaderRef = useRef()
	const scrollerRef = useRef()

	useEffect(() => {
		if (!hasNextPage) return

		let observer

		const fetchAndObserve = async (entries) => {
			if (entries[0].isIntersecting) {
				await fetchNextPage()
				if (hasNextPage && entries[0].isIntersecting) {
					observer.observe(loaderRef.current)
				}
			}
		}

		observer = new IntersectionObserver(fetchAndObserve)

		if (loaderRef.current) {
			observer.observe(loaderRef.current)
		}

		return () => {
			observer.disconnect()
		}
	}, [hasNextPage, fetchNextPage])

	return [loaderRef, scrollerRef]
}