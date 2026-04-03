import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { 
  FaUserShield, FaUsers, FaTasks, FaCheck, FaTimes, 
  FaPlus, FaWallet, FaChartLine, FaSignOutAlt, 
  FaSearch, FaTimesCircle, FaTools, FaImage, FaTrash, FaCloudUploadAlt
} from 'react-icons/fa';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const fileInputRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [banners, setBanners] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [showModal, setShowModal] = useState(null); // 'deposit' or 'limit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalValue, setModalValue] = useState('');
  
  // Banner Form states
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [bannerLink, setBannerLink] = useState('');
  const [bannerFile, setBannerFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const usersRes = await api.get('/wallet/admin/users');
      setUsers(usersRes.data);
      const withRes = await api.get('/wallet/admin/withdrawals');
      setWithdrawals(withRes.data);
      const bannerRes = await api.get('/banners');
      setBanners(bannerRes.data);
    } catch (err) {
      console.error('Error fetching admin data', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleActionSubmit = async () => {
    if (!selectedUser || !modalValue) return;
    try {
      if (showModal === 'deposit') {
        await api.post('/wallet/admin/deposit', { userId: selectedUser._id, amount: Number(modalValue) });
        setMessage(`Successfully added ₹${modalValue} to ${selectedUser.name}`);
      } else {
        await api.post('/wallet/admin/set-limit', { userId: selectedUser._id, limit: Number(modalValue) });
        setMessage(`Updated withdrawal limit for ${selectedUser.name} to ₹${modalValue}`);
      }
      setShowModal(null);
      setModalValue('');
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleWithdrawalAction = async (id, status) => {
    try {
      await api.post(`/wallet/admin/approve-withdrawal/${id}`, { status });
      setMessage(`Request ${status} successfully`);
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(`Action failed: ${err.response?.data?.message}`);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      setBannerUrl(''); // Clear manual URL if file is selected
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBanner = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', bannerTitle);
      formData.append('link', bannerLink);
      
      if (bannerFile) {
        formData.append('image', bannerFile);
      } else if (bannerUrl) {
        formData.append('imageUrl', bannerUrl);
      } else {
        setError('Please select a file or enter an image URL');
        setLoading(false);
        return;
      }

      await api.post('/banners/admin', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('Banner published successfully');
      setBannerTitle('');
      setBannerUrl('');
      setBannerLink('');
      setBannerFile(null);
      setFilePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add banner');
      setTimeout(() => setError(''), 3000);
    }
    setLoading(false);
  }

  const handleDeleteBanner = async (id) => {
    try {
      await api.delete(`/banners/admin/${id}`);
      setMessage('Banner removed successfully');
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete banner');
      setTimeout(() => setError(''), 3000);
    }
  }

  const totalSystemBalance = (users || []).reduce((acc, user) => acc + (user?.walletBalance || 0), 0);
  const filteredUsers = (users || []).filter(u => 
    (u?.name?.toLowerCase().includes((searchTerm || '').toLowerCase())) || 
    (u?.email?.toLowerCase().includes((searchTerm || '').toLowerCase()))
  );

  const StatCard = ({ icon: Icon, label, value }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4">
      <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center text-[#16a34a] text-xl border border-gray-100">
        <Icon />
      </div>
      <div>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-gray-900">₹{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Sidebar - Clean Corporate Slate */}
      <aside className="w-64 bg-[#1e293b] text-gray-300 flex flex-col fixed h-full z-20 border-r border-gray-800">
        <div className="p-6 flex items-center space-x-3 border-b border-gray-800 mb-4">
          <div className="w-8 h-8 bg-[#16a34a] rounded flex items-center justify-center text-white">
            <FaUserShield size={18} />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">MLX DIRECT <span className="text-[#16a34a]">PANEL</span></span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {[
            { id: 'overview', icon: FaChartLine, label: 'Dashboard' },
            { id: 'users', icon: FaUsers, label: 'User Management' },
            { id: 'withdrawals', icon: FaTasks, label: 'Withdrawals', badge: withdrawals.length },
            { id: 'banners', icon: FaImage, label: 'App Banners' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id ? 'bg-[#16a34a] text-white' : 'hover:bg-gray-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon size={16} />
                <span>{item.label}</span>
              </div>
              {item.badge > 0 && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${activeTab === item.id ? 'bg-white text-[#16a34a]' : 'bg-red-500 text-white'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
          >
            <FaSignOutAlt size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'withdrawals' && 'Withdrawal Requests'}
              {activeTab === 'banners' && 'Banner Management'}
            </h1>
            <p className="text-sm text-gray-500">Manage your MLX DIRECT platform</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {message && <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-100">{message}</div>}
            {error && <div className="px-4 py-2 bg-red-50 text-red-700 rounded-lg text-xs font-bold border border-red-100">{error}</div>}
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard icon={FaUsers} label="Total Users" value={users.length} />
              <StatCard icon={FaWallet} label="Total Balance" value={totalSystemBalance.toLocaleString()} />
              <StatCard icon={FaTasks} label="Pending Requests" value={withdrawals.length} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-900">Recently Registered Users</h3>
                <button onClick={() => setActiveTab('users')} className="text-[#16a34a] text-sm font-bold hover:underline">View All Users</button>
              </div>
              <div className="divide-y divide-gray-100">
                {(users || []).slice(0, 5).map(u => (
                  <div key={u._id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold uppercase text-xs border border-gray-200">
                        {(u?.name || 'U')[0]}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{u?.name || 'Unnamed User'}</p>
                        <p className="text-xs text-gray-400">{u?.email || 'No email'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#16a34a]">₹{(u?.walletBalance || 0).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                  type="text" 
                  placeholder="Search user accounts..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#16a34a] focus:border-[#16a34a] outline-none transition-all text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-wider border-b border-gray-100">
                    <th className="px-6 py-4">Name / Email</th>
                    <th className="px-6 py-4 text-center">Wallet Balance</th>
                    <th className="px-6 py-4 text-center">Withdraw Limit</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{u.name}</p>
                          <p className="text-[11px] text-gray-400 font-medium">{u.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="font-bold text-gray-900">₹{u.walletBalance.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="font-bold text-[#16a34a]">₹{u.withdrawLimit.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => { setSelectedUser(u); setShowModal('deposit'); }}
                            className="p-2 bg-gray-50 text-gray-600 rounded border border-gray-200 hover:bg-[#16a34a] hover:text-white hover:border-[#16a34a] transition-all"
                            title="Add Funds"
                          >
                            <FaPlus size={14} />
                          </button>
                          <button 
                            onClick={() => { setSelectedUser(u); setShowModal('limit'); }}
                            className="p-2 bg-gray-50 text-gray-600 rounded border border-gray-200 hover:bg-[#1e293b] hover:text-white transition-all"
                            title="Set Limit"
                          >
                            <FaTools size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'withdrawals' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-wider border-b border-gray-100">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Date Requested</th>
                    <th className="px-6 py-4 text-center">Requested Amount</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {withdrawals.length > 0 ? (
                    withdrawals.map((w) => (
                      <tr key={w._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-5">
                          <p className="font-bold text-gray-900 text-sm">{w.userId?.name}</p>
                          <p className="text-[11px] text-gray-400">{w.userId?.email}</p>
                        </td>
                        <td className="px-6 py-5 text-gray-400 text-xs">
                          {new Date(w.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="text-lg font-bold text-[#16a34a]">₹{w.amount.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleWithdrawalAction(w._id, 'approved')}
                              className="px-4 py-1.5 bg-[#16a34a] text-white rounded text-xs font-bold hover:bg-[#15803d] transition-all shadow-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleWithdrawalAction(w._id, 'rejected')}
                              className="px-4 py-1.5 bg-white text-gray-500 border border-gray-200 rounded text-xs font-bold hover:bg-gray-50 transition-all shadow-sm"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-20 text-center text-gray-400 text-sm">No pending withdrawal requests</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'banners' && (
          <div className="space-y-8">
            {/* Add Banner Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <FaCloudUploadAlt className="mr-3 text-[#16a34a]" /> Publish Promotion Banner
              </h3>
              <form onSubmit={handleAddBanner} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">Banner Title</label>
                    <input 
                      type="text" 
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] outline-none text-sm transition-all"
                      placeholder="e.g. Initial Deposit Bonus 20%"
                      value={bannerTitle}
                      onChange={(e) => setBannerTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">Click-through Link (Optional)</label>
                    <input 
                      type="text" 
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] outline-none text-sm transition-all"
                      placeholder="https://mlxdirect.com/promo"
                      value={bannerLink}
                      onChange={(e) => setBannerLink(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">Banner Media Source</label>
                    
                    {/* File Upload Section */}
                    <div 
                      onClick={() => fileInputRef.current.click()}
                      className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                        bannerFile ? 'border-[#16a34a] bg-green-50/30' : 'border-gray-200 hover:border-[#16a34a] bg-gray-50/50'
                      }`}
                    >
                      <input 
                        type="file" 
                        className="hidden" 
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <FaCloudUploadAlt size={32} className={bannerFile ? 'text-[#16a34a]' : 'text-gray-300'} />
                      <p className="mt-3 text-sm font-bold text-gray-600">{bannerFile ? bannerFile.name : 'Upload from Computer'}</p>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">JPG, PNG, WEBP (MAX 5MB)</p>
                    </div>

                    <div className="flex items-center space-x-4 py-2">
                       <div className="h-[1px] flex-1 bg-gray-100"></div>
                       <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">OR USE EXTERNAL URL</span>
                       <div className="h-[1px] flex-1 bg-gray-100"></div>
                    </div>

                    <input 
                      type="text" 
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] outline-none text-sm transition-all"
                      placeholder="Paste Image URL here..."
                      value={bannerUrl}
                      onChange={(e) => { 
                        setBannerUrl(e.target.value); 
                        if (e.target.value) { setBannerFile(null); setFilePreview(null); } 
                      }}
                    />
                  </div>

                  {/* Preview Section */}
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 h-full flex flex-col">
                    <label className="text-xs font-bold text-gray-400 mb-4 block uppercase tracking-wider italic">Resolution Preview</label>
                    <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center min-h-[160px]">
                      {filePreview || bannerUrl ? (
                         <img src={filePreview || bannerUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center text-gray-300">
                          <FaImage size={40} />
                          <p className="text-[10px] font-bold mt-2 uppercase">No Visual Assigned</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    disabled={loading}
                    type="submit" 
                    className={`px-12 py-4 bg-[#16a34a] text-white rounded-xl font-bold text-sm hover:bg-[#15803d] transition-all shadow-xl shadow-green-500/20 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Processing...' : 'Deploy Banner'}
                  </button>
                </div>
              </form>
            </div>

            {/* Banner List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-bold text-gray-900">Active Campaign Banners</h3>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {banners.length > 0 ? (
                  banners.map((b) => (
                    <div key={b._id} className="relative group rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 bg-white">
                      <div className="h-44 overflow-hidden relative">
                        <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        <div className="absolute top-3 right-3">
                           <button 
                            onClick={() => handleDeleteBanner(b._id)}
                            className="w-10 h-10 flex items-center justify-center text-white bg-red-600 rounded-full hover:bg-red-700 transition-all shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                            title="Remove Banner"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="p-5">
                        <p className="font-bold text-gray-900 text-sm mb-1">{b.title}</p>
                        <p className="text-[10px] text-gray-400 font-medium truncate uppercase tracking-tight">{b.link || 'Internal Propagation Only'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="md:col-span-3 py-20 text-center text-gray-300">
                    <FaImage size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="text-sm font-bold uppercase tracking-widest italic tracking-wider">Signals Clear: Zero Active Campaigns</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Clean Professional Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-6 transition-all">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {showModal === 'deposit' ? 'Add Wallet Funds' : 'Adjust Payout Limit'}
                </h3>
                <button onClick={() => setShowModal(null)} className="text-gray-300 hover:text-gray-900 transition-colors">
                  <FaTimesCircle size={20} />
                </button>
              </div>
              
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-[11px] font-bold text-gray-400 uppercase mb-1">Target Account</p>
                <p className="font-bold text-gray-900">{selectedUser?.name}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-2 block">
                    {showModal === 'deposit' ? 'Enter Amount to Credit' : 'Enter New Maximum Limit'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">₹</span>
                    <input 
                      type="number" 
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] outline-none transition-all text-xl font-bold"
                      placeholder="0.00"
                      value={modalValue}
                      onChange={(e) => setModalValue(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowModal(null)}
                    className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-lg font-bold text-sm hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleActionSubmit}
                    className="flex-[2] py-3 bg-[#16a34a] text-white rounded-lg font-bold text-sm hover:bg-[#15803d] transition-all shadow-md shadow-green-200"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
