import React, { useEffect } from 'react'
import Home from './Home'
import useAxios from '../Utils/useAxios'
import { useDispatch } from 'react-redux'
import { logout } from '../features/Auth/userSlice'
import { useNavigate } from 'react-router-dom'

function Logout() {

    const {sendRequest} = useAxios()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(()=>{
        const logoutUser = async()=>{
            const res = await sendRequest({method:"post" , url:"/users/logout",body:{}})
            console.log(res);
            dispatch(logout())
            navigate("/")
        }


        logoutUser()
    },[])

    return (
        <>
        <Home/>
        </>
    )
}

export default Logout