import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: ""
  })
  const [loading, setLoading] = useState(false)
  const { user } = useSelector(store => store.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const signupHandler = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/login`, input, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      })
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user))
        navigate("/")
        toast.success(res.data.message)
        setInput({ email: "", password: "" })
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      navigate("/")
    }
  }, [user, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form 
        onSubmit={signupHandler} 
        className="bg-white shadow-lg rounded-lg flex flex-col gap-6 p-8 w-full max-w-sm"
      >
        <div className="text-center">
          <h1 className="font-bold text-2xl mb-2">LOGO</h1>
          <p className="text-sm text-gray-600">Login to see photos & videos from your friends</p>
        </div>
        <div>
          <label className="block font-medium text-sm mb-1" htmlFor="email">Email</label>
          <Input
            id="email"
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="focus:outline-none focus:ring-0 my-1"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block font-medium text-sm mb-1" htmlFor="password">Password</label>
          <Input
            id="password"
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="focus:outline-none focus:ring-0 my-1"
            placeholder="Enter your password"
          />
        </div>
        <div>
          {loading ? (
            <Button type="submit" className="w-full flex justify-center items-center" disabled>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full">Login</Button>
          )}
        </div>
        <div className="text-center text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Signup
          </Link>
        </div>
      </form>
    </div>
  )
}

export default Login