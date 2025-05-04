import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const PrivateRouter = ({ children }) => {
    const navigate = useNavigate()
    const isAuth = useSelector(state => state.user.isAuth)
    useEffect(() => {
        if (!isAuth) {
            navigate('/login')
        }
    }, [isAuth, navigate])

    return children
}

export default PrivateRouter