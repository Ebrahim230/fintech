import React, { useState, useEffect } from 'react';
import CommonForm from '../components/CommonForm';
import { createAccountThunk, fetchAccountTypesThunk } from '../redux/adminSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateAccountPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ owner: '', IBAN: '', accountType: '', balance: 0 });
  const [loading, setLoading] = useState(false);
  const accountTypes = useSelector(state => state.adminAccounts.accountTypes || []);

  useEffect(() => {
    dispatch(fetchAccountTypesThunk());
  }, [dispatch]);

  const fields = [
    {
      name: 'owner',
      placeholder: 'Enter Owner ID',
      type: 'text',
      value: formData.owner,
      onChange: e => setFormData({ ...formData, owner: e.target.value })
    },
    {
      name: 'accountType',
      placeholder: 'Account Type',
      type: 'select',
      value: formData.accountType,
      onChange: e => setFormData({ ...formData, accountType: e.target.value }),
      options: [{ label: 'Select Account Type', value: '' }, ...accountTypes.map(t => ({ label: t, value: t }))]
    },
    {
      name: 'balance',
      placeholder: 'Balance',
      type: 'number',
      value: formData.balance,
      onChange: e => setFormData({ ...formData, balance: e.target.value })
    }
  ];

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(createAccountThunk(formData)).unwrap();
      toast.success('Account created successfully!');
      navigate('/admin/dashboard');
    } catch {
      toast.error('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonForm
      title="Create Account"
      fields={fields}
      onSubmit={handleSubmit}
      buttonText="Create Account"
      loading={loading}
      linkText="Back to"
      linkPath="/admin/dashboard"
      linkLabel="Dashboard"
    />
  );
};

export default CreateAccountPage;