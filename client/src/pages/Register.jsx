import React, { useState } from 'react'
import CommonForm from '../components/CommonForm'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../redux/authSlice'
import { toast } from 'react-toastify'

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading } = useSelector(state => state.auth)

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: ''
  })

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    dispatch(registerUser(formData)).unwrap()
      .then(payload => {
        if (payload?.success) {
          toast.success(payload.message)
          navigate('/login')
        } else {
          toast.error(payload.message || 'Registration failed')
        }
      })
      .catch(err => {
        toast.error(err?.message || 'Something went wrong')
      })
  }

  const fields = [
    { name: 'userName', type: 'text', placeholder: 'Username', value: formData.userName, onChange: handleChange },
    { name: 'email', type: 'email', placeholder: 'Email', value: formData.email, onChange: handleChange },
    { name: 'password', type: 'password', placeholder: 'Password', value: formData.password, onChange: handleChange }
  ]

  return (
    <CommonForm
      title="Register"
      fields={fields}
      onSubmit={handleSubmit}
      buttonText="Register"
      loading={isLoading}
      linkText="Already have an account?"
      linkPath="/login"
      linkLabel="Login"
    />
  )
}

export default Register;