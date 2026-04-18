import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  FaUsers, FaWallet, FaHistory, FaCheckCircle, FaTimesCircle, FaPlus, 
  FaTools, FaSearch, FaImage, FaTrash, FaCloudUploadAlt, FaSignOutAlt, 
  FaExclamationTriangle, FaUniversity, FaUserShield, FaCopy, FaChartLine, 
  FaEnvelope, FaBars, FaPaperPlane, FaInbox, FaReply, FaMinus
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [banners, setBanners] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showModal, setShowModal] = useState(null); 
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [withdrawActionType, setWithdrawActionType] = useState(null); 
  const [modalValue, setModalValue] = useState('');
  const [walletSubAction, setWalletSubAction] = useState('deposit'); // 'deposit' or 'deduct'
  
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerLink, setBannerLink] = useState('');
  const [bannerFile, setBannerFile] = useState(null);
  const [emailData, setEmailData] = useState({ to: '', subject: '', message: '' });
  const [emailFile, setEmailFile] = useState(null);
  const [sentEmails, setSentEmails] = useState([]);
  const [mailFolder, setMailFolder] = useState('sent');
  const [isComposing, setIsComposing] = useState(false);
  const fileInputRef = useRef(null);
  const mailInputRef = useRef(null);

  const BRAND_BLUE = '#003B91';
  const BRAND_RED = '#CE2029';

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://mlx-direct-api.onrender.com/api' : 'http://localhost:5000/api');
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const res = await axios.get(`${API_BASE_URL}/wallet/admin/stats`, { headers });
        setStats(res.data);
      } else if (activeTab === 'users' || activeTab === 'kyc_requests') {
        const res = await axios.get(`${API_BASE_URL}/wallet/admin/users`, { headers });
        setUsers(res.data);
      } else if (activeTab === 'withdrawals') {
        const res = await axios.get(`${API_BASE_URL}/wallet/admin/withdrawals`, { headers });
        setWithdrawals(res.data);
      } else if (activeTab === 'banners') {
        const res = await axios.get(`${API_BASE_URL}/banners`, { headers });
        setBanners(res.data);
      } else if (activeTab === 'enquiry') {
        const res = await axios.get(`${API_BASE_URL}/contact/messages`, { headers });
        setMessages(res.data);
      } else if (activeTab === 'mail') {
        const res = await axios.get(`${API_BASE_URL}/admin/sent-emails`, { headers });
        setSentEmails(res.data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleActionSubmit = async () => {
    if (!selectedUser || !modalValue) return;
    setLoading(true);
    try {
      const endpoint = showModal === 'deposit' ? walletSubAction : 'set-limit';
      const payload = showModal === 'deposit' 
        ? { userId: selectedUser._id, amount: Number(modalValue) }
        : { userId: selectedUser._id, limit: Number(modalValue) };

      await axios.post(`${API_BASE_URL}/wallet/admin/${endpoint}`, payload, { headers });
      setShowModal(null);
      setModalValue('');
      setWalletSubAction('deposit'); // Reset to default
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
    setLoading(false);
  };

  const handleUpdatePassword = async () => {
    if (!selectedUser || !modalValue || modalValue.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/wallet/admin/update-user-password`, {
        userId: selectedUser._id,
        newPassword: modalValue
      }, { headers });
      alert('Password updated successfully');
      setShowModal(null);
      setModalValue('');
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
    setLoading(false);
  };

  const initiateWithdrawalAction = (withdrawal, action) => {
    setSelectedWithdrawal(withdrawal);
    setWithdrawActionType(action);
    setShowModal('confirmWithdraw');
  };

  const processWithdrawal = async () => {
    if (!selectedWithdrawal) return;
    setLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/wallet/admin/approve-withdrawal/${selectedWithdrawal._id}`, 
        { status: withdrawActionType }, 
        { headers }
      );
      setShowModal(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Update failed');
    }
    setLoading(false);
  };

  const handleKycAction = async (userId, status, type = 'kyc') => {
    const actionLabel = status === 'approved' ? 'approve' : 'reject';
    const typeLabel = type === 'kyc' ? 'Identity Documents' : 'Bank Details';
    
    if (!window.confirm(`Are you sure you want to ${actionLabel} these ${typeLabel}?`)) return;
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/wallet/admin/update-verification-status`, {
        userId,
        status,
        type
      }, { headers });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
    setLoading(false);
  };

  const handleAddBanner = async (e) => {
    e.preventDefault();
    if (!bannerFile) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('title', bannerTitle);
    formData.append('link', bannerLink);
    formData.append('image', bannerFile);

    try {
      await axios.post(`${API_BASE_URL}/banners/admin`, formData, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' }
      });
      setBannerTitle('');
      setBannerLink('');
      setBannerFile(null);
      fetchData();
    } catch (err) {
      alert('Upload failed');
    }
    setLoading(false);
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/banners/admin/${id}`, { headers });
      fetchData();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleDeleteUser = async (user) => {
    const confirmDelete = window.confirm(`DANGER: Are you sure you want to permanently delete user "${user.name}"? This will erase all their transactions and data. This cannot be undone.`);
    if (!confirmDelete) return;

    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/wallet/admin/user/${user._id}`, { headers });
      alert('User deleted successfully');
      setShowModal(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Deletion failed');
    }
    setLoading(false);
  };

  const handleFileChange = (e) => setBannerFile(e.target.files[0]);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/contact/messages/${id}/read`, {}, { headers });
      fetchData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/contact/messages/${id}`, { headers });
      fetchData();
      if (selectedMessage && selectedMessage._id === id) setSelectedMessage(null);
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleViewMessage = (msg) => {
    setSelectedMessage(msg);
    if (msg.status === 'unread') {
      handleMarkAsRead(msg._id);
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!emailData.to || !emailData.subject || !emailData.message) {
      alert('Please fill all fields');
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('to', emailData.to);
    formData.append('subject', emailData.subject);
    formData.append('message', emailData.message);
    if (emailFile) {
      formData.append('attachment', emailFile);
    }

    try {
      await axios.post(`${API_BASE_URL}/admin/send-email`, formData, { 
        headers: { ...headers, 'Content-Type': 'multipart/form-data' } 
      });
      alert('Email sent successfully');
      setEmailData({ to: '', subject: '', message: '' });
      setEmailFile(null);
      setIsComposing(false);
      fetchData(); // Refresh history
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to send email';
      const detail = err.response?.data?.error?.message || err.response?.data?.error || '';
      alert(`${errMsg}${detail ? ': ' + detail : ''}`);
    }
    setLoading(false);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
  };

  const isModalActive = !!showModal;

  return (
    <div className="flex h-screen bg-[#fcfdfe] text-[#1e293b] font-sans overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[55] lg:hidden animate-in fade-in duration-300" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`fixed lg:relative lg:flex w-64 bg-[#003B91] border-r border-white/10 flex flex-col z-[60] transition-transform duration-300 h-full ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="px-6 py-8 border-b border-white/5">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center shrink-0">
                <img src="/app_logo.png" alt="Logo" className="w-12 h-12 object-contain" />
              </div>
              <div className="overflow-hidden">
                <h1 className="text-[11px] font-bold tracking-widest text-white/90 leading-tight uppercase">BOA PAY ADMIN</h1>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white"><FaPlus className="rotate-45" size={20} /></button>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'dashboard', icon: <FaChartLine />, label: 'Dashboard' },
              { id: 'users', icon: <FaUsers />, label: 'User List' },
              { section: 'REQUESTS' },
              { 
                id: 'kyc_requests', 
                icon: <FaUserShield />, 
                label: `Verification Req ${users.filter(u => (u.kyc?.status === 'pending') || (u.bankDetails?.status === 'pending')).length > 0 ? '(' + users.filter(u => (u.kyc?.status === 'pending') || (u.bankDetails?.status === 'pending')).length + ')' : ''}` 
              },
              { id: 'withdrawals', icon: <FaHistory />, label: `Withdraw Requests ${stats?.pendingWithdrawals > 0 ? '(' + stats.pendingWithdrawals + ')' : ''}` },
              { section: 'MANAGEMENT' },
              { id: 'enquiry', icon: <FaEnvelope />, label: `Enquiries ${messages.filter(m => m.status === 'unread').length > 0 ? '(' + messages.filter(m => m.status === 'unread').length + ')' : ''}` },
              { id: 'mail', icon: <FaPaperPlane />, label: 'Mail Hub' },
              { id: 'banners', icon: <FaImage />, label: 'Banners' }
            ].map((item, idx) => (
              item.section ? (
                <div key={`sec-${idx}`} className="px-4 pt-6 pb-2">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">{item.section}</p>
                </div>
              ) : (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === item.id 
                      ? 'bg-white text-[#003B91] shadow-xl ml-2 w-[calc(100%-8px)]' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              )
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/5">
          <button 
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-3.5 rounded-xl text-sm font-bold border border-white/10 text-white hover:bg-[#CE2029] transition-all duration-300`}
          >
            <FaSignOutAlt />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-5 flex justify-between items-center z-40 shadow-sm">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2.5 bg-slate-50 text-slate-600 rounded-xl border border-slate-200"
            >
              <FaBars size={18} />
            </button>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {activeTab === 'dashboard' ? 'Dashboard' : 
                 activeTab === 'enquiry' ? 'Website Enquiries' :
                 activeTab === 'mail' ? 'Mail Hub (Strictly Email)' :
                 activeTab === 'users' ? 'User List' : 
                 activeTab === 'withdrawals' ? 'Payouts' : 
                 activeTab === 'kyc_requests' ? 'Verification Requests' : 
                 'Banners'}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">System Online</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-6">
             <div className="text-right hidden sm:block">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.2">Total App Balance</p>
                <p style={{ color: BRAND_BLUE }} className="text-sm sm:text-base font-bold">₹ {stats?.globalLiquidity?.toLocaleString() || '0.00'}</p>
             </div>
             <div className="h-8 sm:h-10 w-px bg-slate-200 mx-1"></div>
             <div style={{ borderColor: BRAND_BLUE }} className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-50 border-2 flex items-center justify-center text-slate-500 shadow-inner">
                <FaUserShield className="text-[#003B91]" size={16} />
             </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#fcfdfe]">
          {activeTab === 'dashboard' && stats && (
            <div className="space-y-8 animate-in fade-in duration-500">
               {/* Stats Summary Row */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Users', val: stats.totalUsers, icon: <FaUsers />, color: BRAND_BLUE },
                    { label: 'Total Balance', val: `₹${stats.globalLiquidity?.toLocaleString()}`, icon: <FaWallet />, color: BRAND_BLUE },
                    { label: 'System Status', val: 'Active', icon: <FaUserShield />, color: BRAND_BLUE },
                    { label: 'Pending Payouts', val: stats.pendingWithdrawals, icon: <FaHistory />, color: BRAND_RED }
                  ].map((m, i) => (
                    <div key={i} className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow focus-within:ring-2 ring-blue-100">
                       <div className="flex justify-between items-center mb-5">
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">{m.label}</p>
                          <div style={{ color: m.color }} className="text-xl opacity-80">{m.icon}</div>
                       </div>
                       <p style={{ color: m.color }} className="text-3xl font-bold tracking-tight">{m.val}</p>
                    </div>
                  ))}
               </div>

               {/* Operations Grid */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Quadrant 1: Recent Activity */}
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[480px]">
                     <div className="flex justify-between items-center mb-10">
                        <div>
                           <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Recent Activity</h3>
                           <p className="text-[10px] text-slate-400 font-bold mt-1">Latest transaction flow</p>
                        </div>
                        <button onClick={() => fetchData()} style={{ color: BRAND_BLUE }} className="text-[10px] font-bold py-2 px-5 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-all outline-none">Refresh Feed</button>
                     </div>
                     <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                       {stats.recentActivity?.length > 0 ? stats.recentActivity.map((a, i) => (
                         <div key={i} className="flex items-center justify-between p-5 rounded-2xl border border-slate-50 hover:border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-sm transition-all group">
                            <div className="flex items-center space-x-5">
                               <div style={{ backgroundColor: a.type === 'deposit' ? '#10B98115' : (a.type === 'deduction' ? '#CE202915' : '#003B9115'), color: a.type === 'deposit' ? '#10B981' : (a.type === 'deduction' ? '#CE2029' : BRAND_BLUE) }} className="w-12 h-12 rounded-xl flex items-center justify-center text-base transition-transform group-hover:scale-110">
                                  {a.type === 'deposit' ? <FaPlus /> : (a.type === 'deduction' ? <FaMinus /> : <FaHistory />)}
                               </div>
                               <div>
                                  <p className="text-[13px] font-bold text-slate-900 leading-none mb-1.5">{a.userId?.name || 'User'}</p>
                                  <p className={`text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center ${a.type === 'deduction' ? 'text-red-400' : ''}`}>
                                     <span className={`w-1 h-1 rounded-full mr-1.5 ${a.type === 'deposit' ? 'bg-emerald-500' : (a.type === 'deduction' ? 'bg-red-500' : 'bg-blue-500')}`}></span>
                                     {a.type === 'deposit' ? 'Wallet Deposit' : (a.type === 'deduction' ? 'Manual Deduction' : 'Wallet Payout')}
                                  </p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className={`text-sm font-bold ${a.type === 'deposit' ? 'text-emerald-600' : (a.type === 'deduction' ? 'text-[#CE2029]' : 'text-slate-900')}`}>
                                  {a.type === 'deposit' ? '+' : '-'}₹{a.amount.toLocaleString()}
                               </p>
                               <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase opacity-60">{new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                         </div>
                       )) : (
                         <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-2 opacity-50">
                            <FaChartLine size={32} />
                            <p className="text-[10px] font-bold uppercase tracking-widest italic text-center">No Activity Recorded</p>
                         </div>
                       )}
                     </div>
                  </div>

                  {/* Quadrant 2: Quick Payouts */}
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[480px]">
                     <div className="flex justify-between items-center mb-10">
                        <div>
                           <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Action Required</h3>
                           <p className="text-[10px] text-slate-400 font-bold mt-1">Pending payout requests</p>
                        </div>
                        <button onClick={() => setActiveTab('withdrawals')} style={{ color: BRAND_BLUE }} className="text-[10px] font-bold py-2 px-5 bg-blue-50/50 border border-blue-100 rounded-xl hover:bg-blue-100/50 transition-all">View All</button>
                     </div>
                     <div className="flex-1 space-y-4">
                        {withdrawals.slice(0, 4).length > 0 ? withdrawals.slice(0, 4).map((w) => (
                          <div key={w._id} className="flex items-center justify-between p-5 rounded-2xl border border-slate-50 bg-white shadow-sm hover:shadow-md transition-all border-l-4" style={{ borderLeftColor: BRAND_BLUE }}>
                             <div className="overflow-hidden">
                                <p className="text-[13px] font-bold text-slate-900 truncate">{w.userId?.name}</p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Requested Payout</p>
                             </div>
                             <div className="text-right flex items-center space-x-4">
                                <p className="text-base font-bold text-slate-900">₹{w.amount.toLocaleString()}</p>
                                <button onClick={() => { setActiveTab('withdrawals'); initiateWithdrawalAction(w, 'approved'); }} className="w-9 h-9 flex items-center justify-center bg-slate-900 text-white rounded-xl hover:bg-[#003B91] transition-all shadow-lg"><FaCheckCircle size={14} /></button>
                             </div>
                          </div>
                        )) : (
                          <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-2 opacity-50">
                             <FaCheckCircle size={32} />
                             <p className="text-[10px] font-bold uppercase tracking-widest italic text-center">Queue Clear</p>
                          </div>
                        )}
                        <div className="mt-auto p-6 bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed text-center">
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">System Insight</p>
                           <p className="text-[10px] font-medium text-slate-400 mt-2 leading-relaxed italic">Direct approval from here will launch the payout verification dossier.</p>
                        </div>
                     </div>
                  </div>

                  {/* Quadrant 3: Recent Users */}
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[400px]">
                     <div className="flex justify-between items-center mb-8">
                        <div>
                           <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest text-[#008037]">Recent Users</h3>
                           <p className="text-[10px] text-slate-400 font-bold mt-1">Latest account activations</p>
                        </div>
                        <button onClick={() => setActiveTab('users')} className="text-[10px] font-bold py-2 px-5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-all">Directory</button>
                     </div>
                     <div className="space-y-4">
                        {users.slice(-4).reverse().map((u) => (
                           <div key={u._id} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-all group">
                              <div className="flex items-center space-x-4">
                                 <div style={{ backgroundColor: BRAND_BLUE }} className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-md group-hover:scale-105 transition-transform">{u.name[0]}</div>
                                 <div className="overflow-hidden max-w-[120px]">
                                    <p className="text-[12px] font-bold text-slate-800 leading-none mb-1 truncate">{u.name}</p>
                                    <p className="text-[9px] text-slate-400 font-medium truncate">{u.email}</p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-xs font-bold text-slate-900">₹{u.walletBalance?.toLocaleString()}</p>
                                 <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-500 opacity-80">{u.kyc?.status === 'approved' ? 'Verified' : 'Pending'}</span>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Quadrant 4: Active Banners */}
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[400px]">
                     <div className="flex justify-between items-center mb-8">
                        <div>
                           <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest text-[#CE2029]">Active Banners</h3>
                           <p className="text-[10px] text-slate-400 font-bold mt-1">Promotional visuals</p>
                        </div>
                        <button onClick={() => setActiveTab('banners')} className="text-[10px] font-bold py-2 px-5 bg-red-50 text-[#CE2029] border border-red-100 rounded-xl hover:bg-red-100 transition-all">Manage</button>
                     </div>
                     <div className="grid grid-cols-2 gap-4 flex-1">
                        {banners.slice(0, 4).length > 0 ? banners.slice(0, 4).map((b) => (
                           <div key={b._id} className="relative rounded-xl overflow-hidden group shadow-sm bg-slate-100">
                              {b.imageUrl && <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />}
                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-6">
                                 <p className="text-[9px] font-bold text-white truncate">{b.title}</p>
                              </div>
                           </div>
                        )) : (
                           <div className="col-span-2 h-full flex flex-col items-center justify-center text-slate-300 space-y-2 opacity-50 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50">
                              <FaImage size={24} />
                              <p className="text-[9px] font-bold uppercase tracking-widest italic text-center">No Campaigns Active</p>
                           </div>
                        )}
                     </div>
                  </div>

               </div>
            </div>
          )}

          {activeTab === 'kyc_requests' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="bg-white p-4 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-8">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center">
                      <FaUserShield className="mr-3 text-[#003B91]" /> Customer Verification Queue
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Review pending Identity and Bank details</p>
                  </div>
                  <span className="bg-blue-50 text-[#003B91] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100 italic">
                    {users.filter(u => (u.kyc?.status === 'pending') || (u.bankDetails?.status === 'pending')).length} Active Requests
                  </span>
                </div>

                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                        <th className="px-8 py-5">User Profile</th>
                        <th className="px-8 py-5 text-center">Identity Status</th>
                        <th className="px-8 py-5 text-center">Bank Status</th>
                        <th className="px-8 py-5 text-right">Review</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {users.filter(u => (u.kyc?.status === 'pending') || (u.bankDetails?.status === 'pending')).length > 0 ? (
                        users.filter(u => (u.kyc?.status === 'pending') || (u.bankDetails?.status === 'pending')).map((u) => (
                          <tr key={u._id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center space-x-4">
                                <div style={{ backgroundColor: BRAND_BLUE }} className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white uppercase shadow-md shrink-0">{u.name[0]}</div>
                                <div className="overflow-hidden">
                                  <p className="text-sm font-bold text-slate-900 truncate">{u.name}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter truncate">{u.email}</p>
                                </div>
                              </div>
                            </td>
                            
                            <td className="px-8 py-6 text-center">
                              <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${u.kyc?.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : (u.kyc?.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-slate-50 text-slate-400 border-slate-200')}`}>
                                {u.kyc?.status || 'NONE'}
                              </span>
                            </td>

                            <td className="px-8 py-6 text-center">
                              <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${u.bankDetails?.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : (u.bankDetails?.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-slate-50 text-slate-400 border-slate-200')}`}>
                                {u.bankDetails?.status || 'NONE'}
                              </span>
                            </td>

                            <td className="px-8 py-6 text-right">
                               <button 
                                 onClick={() => { setSelectedUser(u); setShowModal('verifyDocs'); }}
                                 className="px-6 py-2 bg-[#003B91] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-blue-500/10 italic"
                               >
                                 Review Documents
                               </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="py-24 text-center">
                             <div className="flex flex-col items-center justify-center space-y-3 opacity-20">
                                <FaCheckCircle size={40} className="text-emerald-500" />
                                <p className="italic font-bold text-slate-900 uppercase tracking-widest text-xs">All verifications completed</p>
                             </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View Card List - Hidden on desktop */}
                <div className="lg:hidden divide-y divide-slate-100 mt-4">
                  {users.filter(u => (u.kyc?.status === 'pending') || (u.bankDetails?.status === 'pending')).length > 0 ? (
                    users.filter(u => (u.kyc?.status === 'pending') || (u.bankDetails?.status === 'pending')).map((u) => (
                      <div key={u._id} className="py-5 space-y-4">
                        <div className="flex items-center space-x-4 mb-2">
                          <div style={{ backgroundColor: BRAND_BLUE }} className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white uppercase shadow-md shrink-0">{u.name[0]}</div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-900 truncate">{u.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter truncate">{u.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-500">Identity:</span>
                          <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${u.kyc?.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : (u.kyc?.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-slate-50 text-slate-400 border-slate-200')}`}>
                            {u.kyc?.status || 'NONE'}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-500">Bank:</span>
                          <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${u.bankDetails?.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : (u.bankDetails?.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-slate-50 text-slate-400 border-slate-200')}`}>
                            {u.bankDetails?.status || 'NONE'}
                          </span>
                        </div>
                        
                        <button 
                          onClick={() => { setSelectedUser(u); setShowModal('verifyDocs'); }}
                          className="w-full py-3 bg-[#003B91] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-blue-500/10 italic"
                        >
                          Review Documents
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3 opacity-20">
                        <FaCheckCircle size={32} className="text-emerald-500" />
                        <p className="italic font-bold text-slate-900 uppercase tracking-widest text-xs">All verifications completed</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="relative group">
                <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#003B91] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search by name or email..." 
                  className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none text-sm font-bold tracking-tight shadow-sm focus:border-[#003B91] transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Desktop View Table - Hidden on small screens */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                        <th className="px-8 py-5">User Info</th>
                        <th className="px-8 py-5 text-center">Status</th>
                        <th className="px-8 py-5 text-center">Mobile</th>
                        <th className="px-8 py-5 text-center">Balance</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredUsers.map((u) => (
                        <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-5">
                            <div className="flex items-center space-x-4">
                              <div style={{ backgroundColor: BRAND_BLUE }} className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white uppercase shadow-md">{u.name[0]}</div>
                              <div className="flex flex-col">
                                <p className="font-bold text-slate-900 text-sm tracking-tight">{u.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex justify-center space-x-2">
                               <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase border ${u.kyc?.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>KYC: {u.kyc?.status || 'No Info'}</span>
                               <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase border ${u.bankDetails?.verified ? 'bg-blue-50 text-[#003B91] border-blue-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>BANK: {u.bankDetails?.verified ? 'Verified' : 'Pending'}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-center">
                            <span className="text-slate-600 text-sm font-medium">{u.phone || 'N/A'}</span>
                          </td>
                          <td className="px-8 py-5 text-center">
                            <span className="font-bold text-slate-900 text-sm tracking-tight">₹{u.walletBalance.toLocaleString()}</span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex justify-end space-x-2">
                              <button onClick={() => { setSelectedUser(u); setShowModal('details'); }} title="View Details" className="p-3 bg-white text-slate-400 hover:text-[#003B91] rounded-xl border border-slate-100 hover:border-slate-300 transition-all shadow-sm"><FaSearch size={14} /></button>
                              <button onClick={() => { setSelectedUser(u); setShowModal('deposit'); }} title="Add Money" className="p-3 bg-white text-slate-400 hover:text-emerald-600 rounded-xl border border-slate-100 hover:border-slate-300 transition-all shadow-sm"><FaPlus size={14} /></button>
                              <button onClick={() => { setSelectedUser(u); setShowModal('updatePassword'); }} title="Change Password" style={{ color: BRAND_BLUE }} className="p-3 bg-white rounded-xl border border-slate-100 hover:border-slate-300 transition-all shadow-sm"><FaUserShield size={14} /></button>
                              <button onClick={() => { setSelectedUser(u); setShowModal('limit'); }} title="Set Limit" className="p-3 bg-white text-slate-400 hover:text-slate-900 rounded-xl border border-slate-100 hover:border-slate-300 transition-all shadow-sm"><FaTools size={14} /></button>
                              <button onClick={() => handleDeleteUser(u)} title="Delete User" className="p-3 bg-white text-slate-300 hover:text-[#CE2029] rounded-xl border border-slate-100 hover:border-red-100 transition-all shadow-sm"><FaTrash size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View Card List - Hidden on desktop */}
                <div className="lg:hidden divide-y divide-slate-100 bg-slate-50/30">
                  {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                    <div key={u._id} className="p-5 bg-white space-y-5">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <div style={{ backgroundColor: BRAND_BLUE }} className="w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold text-white uppercase shadow-lg ring-4 ring-slate-50">{u.name[0]}</div>
                          <div>
                            <p className="font-extrabold text-slate-900 text-[15px] tracking-tight">{u.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{u.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Vault Balance</p>
                          <p style={{ color: BRAND_BLUE }} className="text-lg font-black tracking-tighter">₹{u.walletBalance?.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${u.kyc?.status === 'approved' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                          KYC: {u.kyc?.status || 'No Info'}
                        </span>
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${u.bankDetails?.verified ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                          BANK: {u.bankDetails?.verified ? 'Verified' : 'Pending'}
                        </span>
                        {u.phone && (
                          <span className="bg-blue-50 text-[#003B91] text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest border border-blue-100">{u.phone}</span>
                        )}
                        <span className="bg-slate-50 text-slate-500 text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest border border-slate-100">Status: Active</span>
                      </div>

                      <div className="grid grid-cols-5 gap-3 pt-2">
                        {[
                          { icon: <FaSearch />, label: 'View', color: 'text-slate-400', hover: 'hover:text-[#003B91]', action: () => { setSelectedUser(u); setShowModal('details'); } },
                          { icon: <FaPlus />, label: 'Fund', color: 'text-slate-400', hover: 'hover:text-green-600', action: () => { setSelectedUser(u); setShowModal('deposit'); } },
                          { icon: <FaUserShield />, label: 'Auth', color: 'text-slate-400', hover: 'hover:text-[#003B91]', action: () => { setSelectedUser(u); setShowModal('updatePassword'); } },
                          { icon: <FaTools />, label: 'Limit', color: 'text-slate-400', hover: 'hover:text-[#003B91]', action: () => { setSelectedUser(u); setShowModal('limit'); } },
                          { icon: <FaTrash />, label: 'Delete', color: 'text-slate-300', hover: 'hover:text-[#CE2029]', action: () => handleDeleteUser(u) }
                        ].map((btn, idx) => (
                          <button 
                            key={idx}
                            onClick={btn.action}
                            className={`flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 transition-all active:scale-95 active:bg-white shadow-sm`}
                          >
                            <span className={`${btn.color} ${btn.hover} mb-1.5 text-[15px]`}>{btn.icon}</span>
                            <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">{btn.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )) : (
                    <div className="py-20 text-center space-y-3">
                      <FaUsers className="mx-auto text-slate-100" size={48} />
                      <p className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] italic">No active users discovered</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'withdrawals' && (
            <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
               <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="hidden lg:block overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                       <th className="px-10 py-5">User</th>
                       <th className="px-10 py-5">Time</th>
                       <th className="px-10 py-5 text-center">Amount</th>
                       <th className="px-10 py-5 text-right">Action</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                     {withdrawals.length > 0 ? withdrawals.map((w) => (
                       <tr key={w._id} className="hover:bg-slate-50/30 transition-colors">
                         <td className="px-10 py-6">
                           <p className="font-bold text-slate-900 text-sm tracking-tight">{w.userId?.name}</p>
                           <p className="text-[10px] text-slate-400 font-bold">{w.userId?.email}</p>
                         </td>
                         <td className="px-10 py-6 text-slate-500 text-[11px] font-bold uppercase tracking-tighter">{new Date(w.createdAt).toLocaleString()}</td>
                         <td className="px-10 py-6 text-center text-lg font-bold text-slate-900 tracking-tighter">₹{w.amount.toLocaleString()}</td>
                         <td className="px-10 py-6 text-right">
                           <div className="flex justify-end space-x-3">
                             <button onClick={() => initiateWithdrawalAction(w, 'approved')} style={{ backgroundColor: BRAND_BLUE }} className="px-6 py-2.5 text-white rounded-xl text-[10px] font-bold hover:opacity-90 transition-all uppercase tracking-widest italic shadow-lg shadow-blue-500/20">Approve</button>
                             <button onClick={() => initiateWithdrawalAction(w, 'rejected')} className="px-6 py-2.5 bg-white text-[#CE2029] border border-[#CE2029]/20 rounded-xl text-[10px] font-bold hover:bg-[#CE2029] hover:text-white transition-all uppercase tracking-widest italic">Reject</button>
                           </div>
                         </td>
                       </tr>
                     )) : (
                       <tr><td colSpan="4" className="px-10 py-24 text-center text-slate-300 text-[10px] font-bold uppercase tracking-widest italic">No pending payouts</td></tr>
                     )}
                   </tbody>
                 </table>
                </div>

                {/* Mobile View Card List - Hidden on desktop */}
                <div className="lg:hidden divide-y divide-slate-100 bg-slate-50/30">
                  {withdrawals.length > 0 ? withdrawals.map((w) => (
                    <div key={w._id} className="p-5 bg-white space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="overflow-hidden pr-4">
                          <p className="font-extrabold text-slate-900 text-[15px] tracking-tight">{w.userId?.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold tracking-wider mt-0.5">{w.userId?.email}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Amount</p>
                          <p className="text-lg font-black tracking-tighter text-slate-900">₹{w.amount?.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                        <FaHistory />
                        <span>{new Date(w.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="flex space-x-3 pt-2">
                        <button onClick={() => initiateWithdrawalAction(w, 'approved')} style={{ backgroundColor: BRAND_BLUE }} className="flex-1 py-3 text-white rounded-xl text-[10px] font-bold hover:opacity-90 transition-all uppercase tracking-widest italic shadow-lg shadow-blue-500/20">Approve</button>
                        <button onClick={() => initiateWithdrawalAction(w, 'rejected')} className="flex-1 py-3 bg-white text-[#CE2029] border border-[#CE2029]/20 rounded-xl text-[10px] font-bold hover:bg-[#CE2029] hover:text-white transition-all uppercase tracking-widest italic">Reject</button>
                      </div>
                    </div>
                  )) : (
                    <div className="py-20 text-center space-y-3">
                      <FaHistory className="mx-auto text-slate-100" size={48} />
                      <p className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] italic">No pending payouts</p>
                    </div>
                  )}
                </div>
               </div>
            </div>
          )}

          {activeTab === 'banners' && (
            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-300">
              <div className="bg-white rounded-[32px] border border-slate-200 p-10 shadow-sm">
                <h3 style={{ color: BRAND_BLUE }} className="text-sm font-bold mb-8 uppercase tracking-[0.2em] flex items-center"><FaCloudUploadAlt className="mr-3" /> Add New Banner</h3>
                <form onSubmit={handleAddBanner} className="space-y-8">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1">Banner Title</label>
                       <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-[#003B91] transition-all" placeholder="Enter title..." value={bannerTitle} onChange={(e) => setBannerTitle(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1">Banner Link</label>
                       <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-[#003B91] transition-all" placeholder="https://..." value={bannerLink} onChange={(e) => setBannerLink(e.target.value)} />
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[24px] p-12 cursor-pointer bg-slate-50/50 transition-all hover:bg-slate-50 hover:border-[#003B91]" onClick={() => fileInputRef.current.click()}>
                    <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={handleFileChange} />
                    <div style={{ backgroundColor: BRAND_BLUE + '10' }} className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"><FaCloudUploadAlt style={{ color: BRAND_BLUE }} size={24} /></div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">{bannerFile ? bannerFile.name : 'Click to upload image'}</p>
                  </div>
                  <div className="flex justify-end"><button type="submit" disabled={loading} style={{ backgroundColor: BRAND_BLUE }} className="px-10 py-4 text-white rounded-2xl font-bold text-[10px] hover:opacity-90 shadow-2xl shadow-blue-500/10 uppercase tracking-widest italic">Post Banner</button></div>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {banners.map((b) => (
                  <div key={b._id} className="group relative bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <div className="h-44 overflow-hidden relative">
                      <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button onClick={() => handleDeleteBanner(b._id)} style={{ backgroundColor: BRAND_RED }} className="p-3 text-white rounded-xl shadow-xl"><FaTrash size={14} /></button>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="font-bold text-slate-900 text-xs truncate tracking-tight">{b.title}</p>
                      <p style={{ color: BRAND_BLUE }} className="text-[9px] font-bold uppercase tracking-widest mt-1 opacity-60">Status: Active</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'enquiry' && (
            <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
               <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center">
                    <FaEnvelope className="mr-3 text-[#003B91]" /> Website Inquiries
                  </h3>
                  <span className="bg-blue-50 text-[#003B91] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100 italic">
                    {messages.filter(m => m.status === 'unread').length} New Inquiries
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                        <th className="px-10 py-5">Sender</th>
                        <th className="px-10 py-5">Message Snippet</th>
                        <th className="px-10 py-5">Status</th>
                        <th className="px-10 py-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {messages.length > 0 ? messages.map((m) => (
                        <tr key={m._id} className={`hover:bg-slate-50/30 transition-colors ${m.status === 'unread' ? 'bg-blue-50/10' : ''}`}>
                          <td className="px-10 py-6">
                            <p className={`text-sm ${m.status === 'unread' ? 'font-black text-slate-900' : 'font-bold text-slate-600'}`}>{m.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{m.email}</p>
                          </td>
                          <td className="px-10 py-6">
                            <p className="text-xs text-slate-500 font-medium truncate max-w-xs">{m.message}</p>
                            <p className="text-[9px] text-slate-300 font-black uppercase mt-1">Received {new Date(m.createdAt).toLocaleDateString()}</p>
                          </td>
                          <td className="px-10 py-6">
                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${m.status === 'read' ? 'bg-slate-50 text-slate-400 border-slate-200' : 'bg-blue-50 text-[#003B91] border-blue-100'}`}>
                              {m.status}
                            </span>
                          </td>
                          <td className="px-10 py-6 text-right">
                            <div className="flex justify-end space-x-2">
                               <button 
                                 onClick={() => { 
                                   setEmailData({ to: m.email, subject: `RE: Website Inquiry - ${m.name}`, message: `Hello ${m.name},\n\n` });
                                   setActiveTab('mail');
                                   setIsComposing(true);
                                 }}
                                 title="Reply via Email"
                                 className="p-2.5 bg-white text-slate-400 hover:text-[#003B91] rounded-xl border border-slate-100 hover:border-slate-300 transition-all shadow-sm"
                               >
                                 <FaReply size={14} />
                               </button>
                               <button 
                                 onClick={() => handleDeleteMessage(m._id)}
                                 className="p-2.5 bg-white text-slate-300 hover:text-[#CE2029] rounded-xl border border-slate-100 hover:border-red-100 transition-all shadow-sm"
                               >
                                 <FaTrash size={14} />
                               </button>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="4" className="py-20 text-center opacity-30 italic font-bold text-slate-300 uppercase tracking-widest text-xs">No inquiries recorded</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mail' && (
            <div className="flex flex-col lg:flex-row h-full -m-4 sm:-m-8 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
              {/* Mail Sidebar */}
              <div className="w-full lg:w-72 bg-white border-r border-slate-200 flex flex-col p-4 sm:p-6 space-y-6">
                <button 
                  onClick={() => setIsComposing(true)}
                  style={{ backgroundColor: BRAND_BLUE }} 
                  className="w-full py-4 rounded-2xl text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-all flex items-center justify-center italic"
                >
                  <FaPlus className="mr-2" /> Compose
                </button>

                <nav className="space-y-2">
                  {[
                    { id: 'sent', label: 'Sent History', icon: <FaPaperPlane />, count: sentEmails.length }
                  ].map(folder => (
                    <button
                      key={folder.id}
                      onClick={() => { setMailFolder(folder.id); setSelectedMessage(null); setIsComposing(false); }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                        mailFolder === folder.id ? 'bg-blue-50 text-[#003B91]' : 'text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3 opacity-70">{folder.icon}</span>
                        <span className="uppercase tracking-widest">{folder.label}</span>
                      </div>
                      {folder.count > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-[9px] ${mailFolder === folder.id ? 'bg-[#003B91] text-white' : 'bg-slate-100 text-slate-500'}`}>
                          {folder.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Mail Content Area */}
              <div className="flex-1 bg-white relative flex flex-col overflow-hidden">
                {isComposing ? (
                  /* Mail Composer - High End */
                  <div className="flex-1 p-6 sm:p-10 overflow-y-auto bg-slate-50/10">
                    <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10">
                      <div className="flex justify-between items-center mb-10">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center">
                          <FaPaperPlane className="mr-3 text-[#003B91]" /> New Message
                        </h3>
                        <button onClick={() => setIsComposing(false)} className="text-slate-400 hover:text-slate-900 transition-colors"><FaTimesCircle size={20} /></button>
                      </div>

                      <form onSubmit={handleSendEmail} className="space-y-6">
                        <input 
                          type="email" 
                          placeholder="Recipient Email" 
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-[#003B91] focus:bg-white transition-all shadow-sm"
                          value={emailData.to}
                          onChange={(e) => setEmailData({...emailData, to: e.target.value})}
                          required
                        />
                        <input 
                          type="text" 
                          placeholder="Subject Line" 
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-[#003B91] focus:bg-white transition-all shadow-sm"
                          value={emailData.subject}
                          onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                          required
                        />
                        <textarea 
                          rows="10"
                          placeholder="Write your professional message..."
                          className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:border-[#003B91] focus:bg-white transition-all resize-none shadow-sm"
                          value={emailData.message}
                          onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                          required
                        ></textarea>

                        <div className="flex items-center justify-between pt-4">
                          <div className="flex items-center space-x-4">
                            <input type="file" className="hidden" ref={mailInputRef} onChange={(e) => setEmailFile(e.target.files[0])} />
                            <button type="button" onClick={() => mailInputRef.current.click()} className="flex items-center space-x-2 text-[10px] font-black uppercase text-slate-400 hover:text-[#003B91] transition-colors tracking-widest italic bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                               <FaCloudUploadAlt size={16} /> 
                               <span>{emailFile ? emailFile.name : 'Attach File'}</span>
                            </button>
                            {emailFile && (
                              <button type="button" onClick={() => setEmailFile(null)} className="text-red-400 hover:text-red-600"><FaTimesCircle size={14} /></button>
                            )}
                          </div>
                          <button 
                            type="submit"
                            disabled={loading}
                            style={{ backgroundColor: BRAND_BLUE }}
                            className="px-10 py-4 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest italic shadow-xl shadow-blue-500/10 active:scale-95 transition-all"
                          >
                            {loading ? 'Processing...' : 'Send Now'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                ) : selectedMessage ? (
                  /* Message Viewer */
                  <div className="flex-1 flex flex-col bg-slate-50/10">
                    <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">
                       <button onClick={() => setSelectedMessage(null)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors flex items-center">&larr; Back to {mailFolder}</button>
                       <div className="flex space-x-3">
                          <button 
                            onClick={() => {
                              setEmailData({ to: selectedMessage.email || selectedMessage.to, subject: `Re: ${selectedMessage.subject || 'Admin Support'}`, message: `Hello ${selectedMessage.name || ''},\n\n` });
                              setIsComposing(true);
                            }}
                            style={{ backgroundColor: BRAND_BLUE }}
                            className="px-6 py-2.5 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest italic flex items-center"
                          >
                            <FaReply className="mr-2" /> Reply
                          </button>
                          <button 
                            onClick={() => mailFolder === 'inbox' ? handleDeleteMessage(selectedMessage._id) : alert('Delete protected for sent history')} 
                            className="p-2.5 bg-slate-50 text-slate-300 hover:text-[#CE2029] rounded-xl border border-slate-200 transition-all shadow-sm"
                          >
                            <FaTrash size={14} />
                          </button>
                       </div>
                    </div>
                    <div className="flex-1 p-8 sm:p-12 overflow-y-auto">
                      <div className="max-w-4xl mx-auto space-y-8">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{selectedMessage.subject || 'Administrative Inquiry'}</h2>
                        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                           <div className="flex items-center space-x-4">
                              <div style={{ backgroundColor: BRAND_BLUE }} className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black">
                                {selectedMessage.direction === 'received' ? (selectedMessage.senderName ? selectedMessage.senderName[0] : (selectedMessage.from ? selectedMessage.from[0] : 'R')) : (selectedMessage.to ? selectedMessage.to[0] : 'S')}
                              </div>
                              <div>
                                 <p className="font-black text-slate-900 text-sm tracking-tight">
                                    {selectedMessage.direction === 'received' ? (selectedMessage.senderName || selectedMessage.from) : `To: ${selectedMessage.to}`}
                                 </p>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                    {selectedMessage.direction === 'received' ? `From: ${selectedMessage.from}` : `Recipient: ${selectedMessage.to}`}
                                    {selectedMessage.phone && ` • ${selectedMessage.phone}`}
                                 </p>
                              </div>
                           </div>
                           <div className="text-right flex flex-col items-end">
                              <span className={`mb-2 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${selectedMessage.direction === 'received' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                 {selectedMessage.direction}
                              </span>
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em]">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                           </div>
                        </div>
                        <div className="prose max-w-none text-slate-700 leading-relaxed font-medium text-sm bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                           {selectedMessage.html ? (
                              <div dangerouslySetInnerHTML={{ __html: selectedMessage.html }} />
                           ) : (
                              <div className="whitespace-pre-line">{selectedMessage.message}</div>
                           )}
                        </div>
                        {selectedMessage.attachmentName && (
                           <div className="mt-8 p-5 bg-blue-50/50 rounded-2xl border border-blue-100 border-dashed flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#003B91] border border-blue-100 shadow-sm"><FaCloudUploadAlt size={18} /></div>
                                 <p className="text-xs font-black text-[#003B91] uppercase tracking-widest">{selectedMessage.attachmentName}</p>
                              </div>
                           </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Mail Grid List */
                  <div className="flex-1 overflow-y-auto bg-slate-50/10">
                    <div className="divide-y divide-slate-50">
                      {sentEmails.length > 0 ? 
                       sentEmails.map((msg) => (
                        <div 
                          key={msg._id} 
                          onClick={() => { setSelectedMessage(msg); }}
                          className={`group flex items-center justify-between px-8 py-6 cursor-pointer hover:bg-slate-50 transition-all bg-white`}
                        >
                          <div className="flex items-center space-x-6 flex-1 overflow-hidden">
                             <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 text-xs font-black uppercase group-hover:bg-white group-hover:text-[#003B91] transition-all">
                                {msg.to ? msg.to[0] : 'S'}
                             </div>
                             <div className="flex-1 overflow-hidden pr-10">
                                <div className="flex items-center space-x-2">
                                   <p className={`text-sm truncate leading-none font-black text-slate-900`}>
                                      To: {msg.to}
                                   </p>
                                   {msg.attachmentName && <span className="text-[10px] text-[#003B91] opacity-40"><FaCloudUploadAlt size={12} /></span>}
                                </div>
                                <p className={`text-[12px] truncate mt-1.5 font-bold text-slate-400`}>
                                   <span className="font-extrabold text-slate-600">{msg.subject || 'No Subject'}</span>
                                   <span className="mx-2 opacity-30">•</span>
                                   <span>{msg.message.substring(0, 80)}...</span>
                                </p>
                             </div>
                          </div>
                          <div className="text-right shrink-0">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(msg.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                          </div>
                        </div>
                      )) : (
                        <div className="h-[500px] flex flex-col items-center justify-center text-slate-300 space-y-3 opacity-50">
                           <FaEnvelope size={48} />
                           <p className="text-[11px] font-black uppercase tracking-[0.2em] italic tracking-widest">No sent mail records found</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}






        </section>
      </main>

      {isModalActive && (
        <div className="fixed inset-0 bg-[#003B91]/30 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-[0_32px_128px_rgba(0,59,145,0.2)] overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-400">
             <div className="p-8 max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-10 shrink-0">
                   <div className="flex items-center space-x-3">
                      <div style={{ backgroundColor: showModal === 'deposit' && walletSubAction === 'deduct' ? BRAND_RED : BRAND_BLUE }} className="w-1.5 h-8 rounded-full transition-colors"></div>
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                        {showModal === 'deposit' ? 'Adjust Wallet Balance' : showModal === 'limit' ? 'Update User Limit' : showModal === 'details' ? 'User Info' : showModal === 'verifyDocs' ? 'Document Verification' : 'Confirm Action'}
                      </h3>
                   </div>
                   <button onClick={() => setShowModal(null)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 hover:text-[#CE2029] hover:bg-red-50 transition-all"><FaTimesCircle size={22} /></button>
                </div>

                <div className="overflow-y-auto custom-scrollbar flex-1 pr-2">
                  {showModal === 'details' && (
                    <div className="space-y-6">
                       <div className="space-y-4">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1">Verification Documents</p>
                          <div className="bg-slate-50 p-6 rounded-2xl flex flex-col sm:flex-row justify-between border border-slate-100 gap-y-6">
                             <div className="text-left">
                                <p style={{ color: BRAND_BLUE }} className="text-[8px] font-bold uppercase mb-1.5 tracking-widest">PAN Card</p>
                                <p className="text-base font-bold text-slate-900 uppercase tracking-widest">{selectedUser?.kyc?.pan || 'Not Provided'}</p>
                             </div>
                             <div className="text-left sm:text-right">
                                <p style={{ color: BRAND_BLUE }} className="text-[8px] font-bold uppercase mb-1.5 tracking-widest">Aadhar Number</p>
                                <p className="text-base font-bold text-slate-900 tracking-widest">{selectedUser?.kyc?.aadhar || 'Not Provided'}</p>
                             </div>
                          </div>
                       </div>

                       <div className="space-y-4 pt-10 border-t border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1">Bank Account Info</p>
                          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 gap-y-6 gap-x-4 grid grid-cols-1 sm:grid-cols-2">
                              <div className="text-left">
                                  <p style={{ color: BRAND_BLUE }} className="text-[8px] font-bold uppercase mb-1.5 tracking-widest">Account Holder</p>
                                  <p className="text-sm font-bold text-slate-900 uppercase tracking-tight truncate">{selectedUser?.bankDetails?.accountHolderName || 'Not Provided'}</p>
                              </div>
                              <div className="text-left sm:text-right">
                                  <p style={{ color: BRAND_BLUE }} className="text-[8px] font-bold uppercase mb-1.5 tracking-widest">Bank Name</p>
                                  <p className="text-sm font-bold text-slate-900 tracking-tight truncate">{selectedUser?.bankDetails?.bankName || 'Not Added'}</p>
                              </div>
                              <div className="text-left">
                                  <p style={{ color: BRAND_BLUE }} className="text-[8px] font-bold uppercase mb-1.5 tracking-widest">Account Number</p>
                                  <div className="flex items-center space-x-2">
                                    <p className="text-sm font-bold text-slate-900 tracking-tight">{selectedUser?.bankDetails?.accountNumber || '--'}</p>
                                    {selectedUser?.bankDetails?.accountNumber && <button onClick={() => copyToClipboard(selectedUser?.bankDetails?.accountNumber)} className="text-slate-400 hover:text-[#003B91]"><FaCopy size={12} /></button>}
                                  </div>
                              </div>
                              <div className="text-left sm:text-right">
                                  <p style={{ color: BRAND_BLUE }} className="text-[8px] font-bold uppercase mb-1.5 tracking-widest">IFSC Code</p>
                                  <p className="text-sm font-bold text-slate-900 tracking-tight">{selectedUser?.bankDetails?.ifscCode || '--'}</p>
                              </div>
                          </div>
                       </div>

                       <div className="space-y-4 pt-10 border-t border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1">Physical Identity Document</p>
                          {selectedUser?.kyc?.documentUrl ? (
                            <div className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                              {selectedUser?.kyc?.documentUrl.toLowerCase().endsWith('.pdf') ? (
                                <div className="p-8 flex flex-col items-center justify-center space-y-4">
                                  <FaUserShield size={32} className="text-slate-300" />
                                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">PDF Identity Proof</p>
                                  <a 
                                    href={selectedUser.kyc.documentUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#003B91] transition-all"
                                  >
                                    Open Document
                                  </a>
                                </div>
                              ) : (
                                <div className="relative">
                                  <img 
                                    src={selectedUser.kyc.documentUrl} 
                                    alt="KYC Document" 
                                    className="w-full h-auto max-h-[300px] object-contain mx-auto"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                     <a 
                                      href={selectedUser.kyc.documentUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="px-6 py-2.5 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all font-mono"
                                    >
                                      Full Resolution
                                    </a>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="p-10 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center text-slate-300 italic text-[10px] font-bold uppercase tracking-widest">
                               No physical copy uploaded
                            </div>
                          )}
                       </div>

                       <div className="pt-6 mt-4">
                          <button 
                            onClick={() => handleDeleteUser(selectedUser)}
                            className="w-full py-4 bg-white text-[#CE2029] border border-red-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 transition-all duration-300 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
                          >
                            <FaTrash />
                            <span>Delete User Permanently</span>
                          </button>
                       </div>
                    </div>
                  )}

                  {showModal === 'verifyDocs' && (
                  <div className="space-y-10">
                    <div className="flex items-center space-x-5 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                      <div style={{ backgroundColor: BRAND_BLUE }} className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-lg uppercase">{selectedUser?.name[0]}</div>
                      <div>
                        <p className="text-lg font-bold text-slate-900 tracking-tight">{selectedUser?.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{selectedUser?.email}</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1">1. Identity Documents (KYC)</p>
                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${selectedUser?.kyc?.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : (selectedUser?.kyc?.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-slate-50 text-slate-400 border-slate-200')}`}>
                          {selectedUser?.kyc?.status || 'NONE'}
                        </span>
                      </div>
                      
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                        <div className="text-left">
                          <p style={{ color: BRAND_BLUE }} className="text-[8px] font-bold uppercase mb-1.5 tracking-widest">PAN Card Number</p>
                          <p className="text-sm font-bold text-slate-900 uppercase tracking-widest italic">{selectedUser?.kyc?.pan || 'Not Provided'}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p style={{ color: BRAND_BLUE }} className="text-[8px] font-bold uppercase mb-1.5 tracking-widest">Aadhar Number</p>
                          <p className="text-sm font-bold text-slate-900 tracking-widest italic">{selectedUser?.kyc?.aadhar || 'Not Provided'}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p style={{ color: BRAND_BLUE }} className="text-[8px] font-bold uppercase mb-1.5 tracking-widest">Physical Document Copy</p>
                        {selectedUser?.kyc?.documentUrl ? (
                          <div className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                            {selectedUser?.kyc?.documentUrl.toLowerCase().endsWith('.pdf') ? (
                              <div className="p-10 flex flex-col items-center justify-center space-y-4">
                                <FaUserShield size={40} className="text-slate-300" />
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">PDF Document</p>
                                <a 
                                  href={selectedUser.kyc.documentUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#003B91] transition-all"
                                >
                                  Open PDF in New Tab
                                </a>
                              </div>
                            ) : (
                              <div className="relative">
                                <img 
                                  src={selectedUser.kyc.documentUrl} 
                                  alt="KYC Document" 
                                  className="w-full h-auto max-h-[400px] object-contain mx-auto"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                   <a 
                                    href={selectedUser.kyc.documentUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="px-6 py-2.5 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                                  >
                                    View Full Resolution
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="p-8 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-300 italic text-[10px] font-bold uppercase tracking-widest">
                             No Document Uploaded
                          </div>
                        )}
                      </div>

                      {selectedUser?.kyc?.status === 'pending' && (
                        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                          <button onClick={() => { handleKycAction(selectedUser._id, 'approved', 'kyc'); setShowModal(null); }} className="w-full sm:flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/10">Approve Identity</button>
                          <button onClick={() => { handleKycAction(selectedUser._id, 'rejected', 'kyc'); setShowModal(null); }} className="w-full sm:w-auto px-8 py-4 bg-white text-[#CE2029] border border-red-100 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all">Reject</button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-6 pt-8 border-t border-slate-100">
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1">2. Financial Institution (BANK)</p>
                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${selectedUser?.bankDetails?.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : (selectedUser?.bankDetails?.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-slate-50 text-slate-400 border-slate-200')}`}>
                          {selectedUser?.bankDetails?.status || 'NONE'}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                        <div className="text-left">
                          <p style={{ color: BRAND_BLUE }} className="text-[8px] font-bold uppercase mb-1.5 tracking-widest">Account Holder</p>
                          <p className="text-sm font-bold text-slate-900 uppercase tracking-tight truncate">{selectedUser?.bankDetails?.accountHolderName || 'Not Provided'}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p style={{ color: BRAND_BLUE }} className="text-[8px] font-bold uppercase mb-1.5 tracking-widest">Financial Institution</p>
                          <p className="text-sm font-bold text-slate-900 tracking-tight truncate">{selectedUser?.bankDetails?.bankName || 'Not Added'}</p>
                        </div>
                        <div className="text-left">
                          <p style={{ color: BRAND_BLUE }} className="text-[8px] font-bold uppercase mb-1.5 tracking-widest">Account Number</p>
                          <p className="text-sm font-bold text-slate-900 tracking-tight font-mono">{selectedUser?.bankDetails?.accountNumber || '--'}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p style={{ color: BRAND_BLUE }} className="text-[8px] font-bold uppercase mb-1.5 tracking-widest">IFSC Routing Code</p>
                          <p className="text-sm font-bold text-slate-900 tracking-tight font-mono">{selectedUser?.bankDetails?.ifscCode || '--'}</p>
                        </div>
                      </div>

                      {selectedUser?.bankDetails?.status === 'pending' && (
                        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                          <button onClick={() => { handleKycAction(selectedUser._id, 'approved', 'bank'); setShowModal(null); }} style={{ backgroundColor: BRAND_BLUE }} className="w-full sm:flex-1 py-4 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-blue-500/10">Verify Bank Route</button>
                          <button onClick={() => { handleKycAction(selectedUser._id, 'rejected', 'bank'); setShowModal(null); }} className="w-full sm:w-auto px-8 py-4 bg-white text-[#CE2029] border border-red-100 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all">Reject</button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {showModal === 'confirmWithdraw' && (
                  <div className="space-y-5">
                    {/* Integrated User Profile Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 flex items-center space-x-4">
                        <div style={{ backgroundColor: BRAND_BLUE }} className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0">
                          <FaUsers size={18} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Account Holder</p>
                          <p className="font-bold text-slate-900 text-base tracking-tight truncate">{selectedWithdrawal?.userId?.name}</p>
                        </div>
                      </div>
                      <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
                        <div className="overflow-hidden">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Wallet Balance</p>
                          <p className="font-bold text-[#008037] text-lg tracking-tight">₹{selectedWithdrawal?.userId?.walletBalance?.toLocaleString()}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                          <FaWallet size={18} />
                        </div>
                      </div>
                    </div>

                    {/* Verified Bank Dossier */}
                    <div className="bg-white p-6 rounded-2xl border-2 border-slate-50 shadow-sm space-y-5">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <div className="flex items-center space-x-2">
                          <FaUniversity style={{ color: BRAND_BLUE }} size={14} />
                          <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Bank Account Details</p>
                        </div>
                        <div className="flex items-center space-x-2">
                           {selectedWithdrawal?.userId?.kyc?.status === 'approved' && (
                             <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-tight">KYC Approved</span>
                           )}
                           {selectedWithdrawal?.userId?.bankDetails?.verified && (
                             <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-tight">Verified Bank</span>
                           )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Bank Name</p>
                          <p className="text-sm font-bold text-slate-900">{selectedWithdrawal?.userId?.bankDetails?.bankName || 'Not Provided'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Account Number</p>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-bold text-slate-900 tracking-tight">{selectedWithdrawal?.userId?.bankDetails?.accountNumber || '--'}</p>
                            {selectedWithdrawal?.userId?.bankDetails?.accountNumber && (
                              <button onClick={() => copyToClipboard(selectedWithdrawal?.userId?.bankDetails?.accountNumber)} className="text-slate-300 hover:text-[#003B91] transition-colors"><FaCopy size={12} /></button>
                            )}
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">IFSC Code</p>
                          <p className="text-sm font-bold text-slate-900 font-mono tracking-wider">{selectedWithdrawal?.userId?.bankDetails?.ifscCode || '--'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Integrated Action Header */}
                     <div className="flex items-center justify-between p-7 bg-slate-900 rounded-2xl shadow-xl overflow-hidden relative">
                        <div className="relative z-10">
                          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Approved Transfer Amount</p>
                          <p className="text-3xl font-bold text-white tracking-tight">₹{selectedWithdrawal?.amount.toLocaleString()}</p>
                        </div>
                        <div className="text-right relative z-10">
                          <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
                            <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Transaction Mode</p>
                            <p className="text-white font-bold text-xs">High-Speed IMPS</p>
                          </div>
                        </div>
                        <div style={{ backgroundColor: BRAND_BLUE }} className="absolute -right-20 -top-20 w-40 h-40 rounded-full blur-3xl opacity-30"></div>
                     </div>

                     <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100 flex items-start space-x-3 text-left">
                        <FaExclamationTriangle className="text-[#CE2029] mt-0.5 shrink-0" size={14} />
                        <div>
                           <p className="text-[11px] font-bold text-[#CE2029] uppercase tracking-wider">Final Authorization Required</p>
                           <p className="text-[10px] font-medium text-red-600/70 mt-0.5 leading-relaxed">By clicking Approve, you authorize the immediate release of funds to the bank account displayed above. This action is recorded and irreversible.</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <button onClick={() => setShowModal(null)} className="py-4 bg-white text-slate-500 hover:text-slate-700 rounded-2xl font-bold text-[11px] uppercase tracking-widest border border-slate-200 transition-all hover:bg-slate-50">Cancel Request</button>
                        <button onClick={processWithdrawal} style={{ backgroundColor: withdrawActionType === 'approved' ? BRAND_BLUE : BRAND_RED }} className="py-4 text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center space-x-2">
                           {loading ? (
                             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                           ) : (
                             <>
                               {withdrawActionType === 'approved' ? <FaCheckCircle /> : <FaTimesCircle />}
                               <span>{withdrawActionType === 'approved' ? 'Confirm & Process Bank Transfer' : 'Reject & Reverse Funds'}</span>
                             </>
                           )}
                        </button>
                     </div>
                  </div>
                )}

                {(showModal === 'deposit' || showModal === 'limit') && (
                  <div className="space-y-8">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                      <div>
                        <p style={{ color: BRAND_BLUE }} className="text-[8px] font-bold uppercase tracking-widest mb-1.5">User</p>
                        <p className="font-bold text-slate-900 text-sm tracking-tight truncate max-w-[150px]">{selectedUser?.name}</p>
                      </div>
                      <div className="text-right">
                        <p style={{ color: BRAND_BLUE }} className="text-[8px] font-bold uppercase tracking-widest mb-1.5">Current Balance</p>
                        <p className="font-bold text-slate-900 text-sm tracking-tight">₹{selectedUser?.walletBalance?.toLocaleString()}</p>
                      </div>
                    </div>

                    {showModal === 'deposit' && (
                      <div className="space-y-3">
                        <label style={{ color: BRAND_BLUE }} className="text-[8px] font-bold uppercase tracking-widest px-1">Select Operation Type</label>
                        <div className="grid grid-cols-2 gap-3">
                           <button 
                             onClick={() => setWalletSubAction('deposit')}
                             className={`py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${walletSubAction === 'deposit' ? 'bg-[#10B98110] border-emerald-500 text-emerald-600 shadow-sm' : 'bg-white border-slate-100 text-slate-400 opacity-60'}`}
                           >
                             Credit (+)
                           </button>
                           <button 
                             onClick={() => setWalletSubAction('deduct')}
                             className={`py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${walletSubAction === 'deduct' ? 'bg-[#CE202910] border-red-500 text-[#CE2029] shadow-sm' : 'bg-white border-slate-100 text-slate-400 opacity-60'}`}
                           >
                             Debit (-)
                           </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label style={{ color: BRAND_BLUE }} className="text-[8px] font-bold uppercase tracking-widest px-1">
                        {showModal === 'deposit' ? (walletSubAction === 'deposit' ? 'Amount to Credit' : 'Amount to Debit') : 'New Withdrawal Limit'}
                      </label>
                      <input type="number" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:border-[#003B91] transition-all" value={modalValue} onChange={(e) => setModalValue(e.target.value)} placeholder="0.00" autoFocus />
                    </div>
                    <div className="flex space-x-4 pt-4">
                      <button onClick={() => setShowModal(null)} className="flex-1 py-4 bg-white text-slate-500 hover:text-slate-700 rounded-2xl font-bold text-[10px] uppercase tracking-widest border border-slate-200 transition-all">Cancel</button>
                      <button 
                        onClick={handleActionSubmit} 
                        style={{ backgroundColor: showModal === 'deposit' && walletSubAction === 'deduct' ? BRAND_RED : BRAND_BLUE }} 
                        className="flex-[2] py-4 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-sm hover:opacity-90 transition-all"
                      >
                        {loading ? 'Processing...' : (showModal === 'deposit' ? (walletSubAction === 'deposit' ? 'Apply Credit Now' : 'Apply Debit Now') : 'Update Limit')}
                      </button>
                    </div>
                  </div>
                )}

                {showModal === 'updatePassword' && (
                  <div className="space-y-8">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div style={{ backgroundColor: BRAND_BLUE }} className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0">
                          <FaUserShield size={18} />
                        </div>
                        <div>
                          <p style={{ color: BRAND_BLUE }} className="text-[8px] font-bold uppercase tracking-widest mb-1.5">Reset Password For</p>
                          <p className="font-bold text-slate-900 text-sm tracking-tight truncate max-w-[150px]">{selectedUser?.name}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start space-x-3 text-left">
                        <FaExclamationTriangle className="text-[#003B91] mt-0.5 shrink-0" size={14} />
                        <div>
                           <p className="text-[11px] font-bold text-[#003B91] uppercase tracking-wider">Security Notice</p>
                           <p className="text-[10px] font-medium text-blue-600/70 mt-0.5 leading-relaxed">Changing the user's password will immediately update their credentials. They will receive a security alert notification in their app.</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                      <label style={{ color: BRAND_BLUE }} className="text-[8px] font-bold uppercase tracking-widest px-1">New Login Password</label>
                      <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:border-[#003B91] transition-all" value={modalValue} onChange={(e) => setModalValue(e.target.value)} placeholder="Minimum 6 characters" autoFocus />
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <button onClick={() => setShowModal(null)} className="flex-1 py-4 bg-white text-slate-500 hover:text-slate-700 rounded-2xl font-bold text-[10px] uppercase tracking-widest border border-slate-200 transition-all">Cancel</button>
                      <button onClick={handleUpdatePassword} style={{ backgroundColor: BRAND_BLUE }} className="flex-[2] py-4 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-sm hover:opacity-90 transition-all">
                        {loading ? 'Processing...' : 'Overwrite User Password'}
                      </button>
                    </div>
                  </div>
                )}

               </div>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 };

export default AdminDashboard;
