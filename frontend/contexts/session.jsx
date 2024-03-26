'use client'
import React, { createContext, useState } from 'react'

const SessionContext = createContext(null)

const SessionProvider = ({ children }) => {
	const storedSession = typeof window !== 'undefined' ? localStorage.getItem('session') : null
	const [session, setSession] = useState(storedSession ? JSON.parse(storedSession) : null)

	const updateSession = (newSession) => {
		if (newSession === null) localStorage.removeItem('session')
		else localStorage.setItem('session', JSON.stringify(newSession))
		setSession(newSession)
	}

	return <SessionContext.Provider value={{ session, updateSession }}>{children}</SessionContext.Provider>
}

export default SessionProvider

export const useSession = () => {
	const context = React.useContext(SessionContext)
	if (!context) {
		throw new Error('useSession must be used within a SessionProvider')
	}
	return context
}
