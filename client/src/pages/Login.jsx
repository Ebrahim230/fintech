import React, { useState } from 'react'
import CommonForm from '../components/CommonForm';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../redux/authSlice'
import { toast } from 'react-toastify';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData)).then(({ payload }) => {
      if (payload?.token) {
        if (payload?.role === 'admin') {
          toast.success(`${payload?.user} ${payload?.message} as ${payload?.role}`)
          navigate('/admin/dashboard');
        } else {
          toast.success(`${payload?.user} ${payload?.message} as ${payload?.role}`)
          navigate('/user-dashboard');
        }
      } else {
        navigate('/login');
      }
    });
  };

  const fields = [
    { name: "email", type: "email", placeholder: "Email", value: formData.email, onChange: handleChange },
    { name: "password", type: "password", placeholder: "Password", value: formData.password, onChange: handleChange },
  ];

  return (
    <CommonForm
      title="Login"
      fields={fields}
      onSubmit={handleSubmit}
      buttonText="Login"
      loading={isLoading}
      linkText="Don't have an account?"
      linkPath="/register"
      linkLabel="Register"
    />
  );
}

export default Login;