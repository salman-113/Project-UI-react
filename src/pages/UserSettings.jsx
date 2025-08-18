import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const UserSettings = () => {
  const { user, updateUserPassword } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const err = {};
    if (!formData.currentPassword) err.currentPassword = 'Current password required';
    if (!formData.newPassword) err.newPassword = 'New password required';
    else if (formData.newPassword.length < 6) err.newPassword = 'Minimum 6 characters';
    else if (formData.newPassword === formData.currentPassword) err.newPassword = 'New password must differ';
    if (formData.newPassword !== formData.confirmPassword) err.confirmPassword = 'Passwords must match';
    setErrors(err);
    return !Object.keys(err).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      await updateUserPassword(formData.currentPassword, formData.newPassword);
      toast.success('Password changed successfully!');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.message || 'Password update failed');
      if (err.response?.status === 401) {
        setErrors(prev => ({ ...prev, currentPassword: 'Incorrect password' }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <div className="max-w-md mx-auto p-6 text-center">Please login to continue</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4" noValidate> 
        {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field === 'currentPassword' ? 'Current Password' : 
               field === 'newPassword' ? 'New Password' : 'Confirm New Password'}
            </label>
            <input
              type="password"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors[field] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
          </div>
        ))}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default UserSettings;