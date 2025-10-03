import React, { useState, useEffect } from 'react';
import CommonForm from '../components/CommonForm';
import { getAccountDetailsThunk, updateAccountThunk, fetchAccountTypesThunk } from '../redux/adminSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const UpdateAccountPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ owner: '', accountType: '', balance: 0 });
  const [loading, setLoading] = useState(false);
  const accountTypes = useSelector(state => state.admin.accountTypes);

  useEffect(() => {
    dispatch(fetchAccountTypesThunk());
  }, [dispatch]);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const account = await dispatch(getAccountDetailsThunk(id)).unwrap();
        setFormData({
          owner: account.owner._id || account.owner,
          accountType: account.accountType,
          balance: account.balance
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchAccount();
  }, [dispatch, id]);

  const fields = [
    {
      name: 'owner',
      placeholder: 'Owner ID',
      type: 'text',
      value: formData.owner,
      onChange: (e) => setFormData({ ...formData, owner: e.target.value })
    },
    {
      name: 'accountType',
      placeholder: 'Account Type',
      type: 'select',
      value: formData.accountType,
      onChange: (e) => setFormData({ ...formData, accountType: e.target.value }),
      options: [{ label: 'Select Account Type', value: '' }, ...accountTypes.map(t => ({ label: t, value: t }))]
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(updateAccountThunk({ id, data: formData })).unwrap();
      toast.success('Account updated successfully!');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonForm
      title="Update Account"
      fields={fields}
      onSubmit={handleSubmit}
      buttonText="Update Account"
      loading={loading}
      linkText="Back to"
      linkPath="/admin/dashboard"
      linkLabel="Dashboard"
    />
  );
};

export default UpdateAccountPage;