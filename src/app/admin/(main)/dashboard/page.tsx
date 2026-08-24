'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AdminDashboard({ activeTabProp }: { activeTabProp?: 'leads' | 'contacts' | 'updates' | 'blogs' | 'solutions' | 'industries' | 'comments' | 'users' | 'admins' | 'roles' | 'pages' }) {
  const searchParams = useSearchParams();
  const tabParam = activeTabProp || searchParams?.get('tab') || 'leads';
  const activeTab = ['leads', 'contacts', 'updates', 'blogs', 'solutions', 'industries', 'comments', 'users', 'admins', 'roles', 'pages'].includes(tabParam)
    ? (tabParam as 'leads' | 'contacts' | 'updates' | 'blogs' | 'solutions' | 'industries' | 'comments' | 'users' | 'admins' | 'roles' | 'pages')
    : 'leads';

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [roles, setRoles] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', roleId: '' });
  const [creatingUser, setCreatingUser] = useState(false);

  // Edit User states
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editUserForm, setEditUserForm] = useState({ name: '', email: '', roleId: '', password: '' });
  const [savingUser, setSavingUser] = useState(false);
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  // Roles management states
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState<any | null>(null);
  const [roleForm, setRoleForm] = useState({ name: '', permissions: [] as string[] });
  const [savingRole, setSavingRole] = useState(false);

  // Pages management states
  const [showPageModal, setShowPageModal] = useState(false);
  const [editingPage, setEditingPage] = useState<any | null>(null);
  const [pageForm, setPageForm] = useState({ title: '', slug: '', status: 'Published', content: '' });
  const [savingPage, setSavingPage] = useState(false);

  // Updates management states
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<any | null>(null);
  const [updateForm, setUpdateForm] = useState({
    title: '',
    category: 'PRODUCT UPDATE',
    excerpt: '',
    content: '',
    featuredImage: '',
    publishedAt: ''
  });
  const [savingUpdate, setSavingUpdate] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  // Solutions Grid settings state
  const [gridTitle, setGridTitle] = useState('');
  const [gridDesc, setGridDesc] = useState('');
  const [savingGridSettings, setSavingGridSettings] = useState(false);

  // Comment filter state
  const [commentSearchName, setCommentSearchName] = useState('');
  const [commentSubTab, setCommentSubTab] = useState<'all' | 'reported'>('all');

  // Leads & Contacts state
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState('');
  const [leadStartDate, setLeadStartDate] = useState('');
  const [leadEndDate, setLeadEndDate] = useState('');
  const [editingLead, setEditingLead] = useState<any>(null);
  const [leadForm, setLeadForm] = useState({ status: '', lastContactedDate: '', callNotes: '' });
  const [savingLead, setSavingLead] = useState(false);

  // Custom Toast and Confirm Modal states
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show instant local preview while uploading to Cloudinary
    const localUrl = URL.createObjectURL(file);
    setImagePreviewUrl(localUrl);
    setUploadingImage(true);

    try {
      const token = localStorage.getItem('admin_token') || '';
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/media`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const json = await res.json();
      const cloudUrl: string = json.data?.url || json.url;
      // Replace local blob URL with Cloudinary URL
      setImagePreviewUrl(cloudUrl);
      setUpdateForm(prev => ({ ...prev, featuredImage: cloudUrl }));
    } catch (err: any) {
      console.error(err);
      setImagePreviewUrl(null);
      setUpdateForm(prev => ({ ...prev, featuredImage: '' }));
      alert(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
      URL.revokeObjectURL(localUrl);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      api.get('/auth/me', token)
        .then((res) => {
          const user = res.data?.user || res.data || res;
          setCurrentUser(user);
        })
        .catch(console.error);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'users' || activeTab === 'admins' || activeTab === 'roles') {
      const token = localStorage.getItem('admin_token');
      if (token) {
        api.get('/roles', token).then((res) => {
          setRoles(res.data || []);
          if (res.data && res.data.length > 0 && !newUser.roleId) {
            setNewUser((prev) => ({ ...prev, roleId: res.data[0]._id }));
          }
        }).catch(console.error);
      }
    }
    
    if (activeTab === 'solutions') {
      const token = localStorage.getItem('admin_token');
      api.get('/settings', token || '').then((res) => {
        const s = res.data;
        if (s) {
          setGridTitle(s.solutionsGridTitle || 'Twelve powerful features to help your restaurant run better');
          setGridDesc(s.solutionsGridDesc || 'Click on any feature card below to open its full specifications and details on a new page.');
        }
      }).catch(console.error);
    }
  }, [activeTab]);

  const handleSaveGridSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingGridSettings(true);
    try {
      const token = localStorage.getItem('admin_token');
      await api.put('/settings', {
        solutionsGridTitle: gridTitle,
        solutionsGridDesc: gridDesc
      }, token || '');
      showToast('Solutions grid headers saved successfully!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to save grid headers', 'error');
    } finally {
      setSavingGridSettings(false);
    }
  };

  useEffect(() => {
    setData([]); // Clear old tab data to prevent rendering mismatch crashes
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }

    // Verify tab permissions
    const cachedPerms = localStorage.getItem('admin_permissions');
    const cachedRoleName = localStorage.getItem('admin_role_name');
    const isAdmin = cachedRoleName === 'Admin';
    if (cachedPerms && !isAdmin) {
      try {
        const perms: string[] = JSON.parse(cachedPerms);
        if (!perms.includes('*')) {
          const tabPermissions: Record<string, string> = {
            leads: 'manage_leads',
            contacts: 'manage_contacts',
            updates: 'manage_blogs',
            blogs: 'manage_blogs',
            solutions: 'manage_solutions',
            industries: 'manage_industries',
            comments: 'manage_comments',
            users: 'manage_users',
            admins: 'manage_users',
            roles: 'manage_users'
          };
          const required = tabPermissions[activeTab];
          if (required && !perms.includes(required)) {
            // Redirect to first available tab they have permission for
            const allowedTab = Object.keys(tabPermissions).find(tab => perms.includes(tabPermissions[tab]));
            if (allowedTab) {
              const directSlug = allowedTab === 'leads' ? 'leads' : allowedTab === 'contacts' ? 'contacts' : allowedTab;
              window.location.href = `/admin/${directSlug}`;
              return;
            }
          }
        }
      } catch (_) {}
    }

    fetchData(token);
  }, [activeTab, commentSearchName]);

  const handleSearchLeads = (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    if (token) fetchData(token);
  };

  const handleOpenEditLead = (item: any) => {
    setEditingLead(item);
    setLeadForm({
      status: item.status || 'New',
      lastContactedDate: item.lastContactedDate ? new Date(item.lastContactedDate).toISOString().slice(0, 16) : '',
      callNotes: item.callNotes || ''
    });
  };

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;
    setSavingLead(true);
    try {
      const token = localStorage.getItem('admin_token') || '';
      const endpoint = activeTab === 'leads' ? 'demo-requests' : 'contact-messages';
      
      const res = await api.put(`/${endpoint}/${editingLead._id}`, {
        status: leadForm.status,
        lastContactedDate: leadForm.lastContactedDate ? new Date(leadForm.lastContactedDate) : null,
        callNotes: leadForm.callNotes
      }, token);
      
      const updatedDoc = res.data?.doc || res.data || res;
      setData((prev: any) => prev.map((item: any) => (item._id === editingLead._id ? updatedDoc : item)));
      setEditingLead(null);
      showToast('Record saved successfully!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast('Failed to update record', 'error');
    } finally {
      setSavingLead(false);
    }
  };

  const handleUpdateStatus = async (endpoint: 'demo-requests' | 'contact-messages', id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('admin_token') || '';
      await api.put(`/${endpoint}/${id}`, { status: newStatus }, token);
      setData((prev: any) =>
        prev.map((item: any) => (item._id === id ? { ...item, status: newStatus } : item))
      );
      showToast('Status updated successfully!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const fetchData = async (token: string, clearFilters = false) => {
    setLoading(true);
    try {
      let endpoint = '';
      if (activeTab === 'leads') {
        endpoint = '/demo-requests';
        const params = new URLSearchParams();
        if (!clearFilters && leadSearch) params.append('search', leadSearch);
        if (!clearFilters && leadStatusFilter) params.append('status', leadStatusFilter);
        if (!clearFilters && leadStartDate) params.append('startDate', leadStartDate);
        if (!clearFilters && leadEndDate) params.append('endDate', leadEndDate);
        const queryStr = params.toString();
        if (queryStr) endpoint += `?${queryStr}`;
      } else if (activeTab === 'contacts') {
        endpoint = '/contact-messages';
        const params = new URLSearchParams();
        if (!clearFilters && leadSearch) params.append('search', leadSearch);
        if (!clearFilters && leadStatusFilter) params.append('status', leadStatusFilter);
        if (!clearFilters && leadStartDate) params.append('startDate', leadStartDate);
        if (!clearFilters && leadEndDate) params.append('endDate', leadEndDate);
        const queryStr = params.toString();
        if (queryStr) endpoint += `?${queryStr}`;
      } else if (activeTab === 'updates') {
        endpoint = '/updates';
      } else if (activeTab === 'blogs') {
        endpoint = '/posts?limit=50';
      } else if (activeTab === 'solutions') {
        endpoint = '/solutions?limit=20';
      } else if (activeTab === 'industries') {
        endpoint = '/industries?limit=20';
      } else if (activeTab === 'pages') {
        endpoint = '/pages?limit=50';
      } else if (activeTab === 'comments') {
        endpoint = commentSearchName ? `/comments?name=${encodeURIComponent(commentSearchName)}` : '/comments';
      } else if (activeTab === 'users') {
        endpoint = '/users?role=User';
      } else if (activeTab === 'admins') {
        endpoint = '/users?role=Admin,Editor';
      } else if (activeTab === 'roles') {
        endpoint = '/roles';
      }

      const res = await api.get(endpoint, token);
      const docs = res.data?.docs || res.data?.results || res.data || [];
      setData(Array.isArray(docs) ? docs : []);
    } catch (err: any) {
      console.error(err);
      if (err.message && (err.message.includes('jwt expired') || err.message.includes('Invalid token'))) {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePage = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Page',
      message: 'Are you sure you want to delete this page? This action cannot be undone.',
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('admin_token');
          await api.delete(`/pages/${id}`, token || '');
          setData((prev) => prev.filter((item: any) => item._id !== id));
          showToast('Page deleted successfully!', 'success');
        } catch (err) {
          console.error(err);
          showToast('Failed to delete page', 'error');
        }
      }
    });
  };

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPage(true);
    try {
      const token = localStorage.getItem('admin_token') || '';
      if (editingPage) {
        const res = await api.put(`/pages/${editingPage._id}`, pageForm, token);
        const updatedDoc = res.data?.doc || res.data || res;
        setData((prev) => prev.map((item: any) => (item._id === editingPage._id ? updatedDoc : item)));
        showToast('Page updated successfully!', 'success');
      } else {
        const res = await api.post('/pages', pageForm, token);
        const newDoc = res.data?.doc || res.data || res;
        setData((prev) => [newDoc, ...prev]);
        showToast('Page created successfully!', 'success');
      }
      setShowPageModal(false);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to save page', 'error');
    } finally {
      setSavingPage(false);
    }
  };

  const handleOpenEditPage = (page: any) => {
    setEditingPage(page);
    setPageForm({ title: page.title, slug: page.slug, status: page.status || 'Published', content: page.content || '' });
    setShowPageModal(true);
  };

  const handleOpenCreatePage = () => {
    setEditingPage(null);
    setPageForm({ title: '', slug: '', status: 'Published', content: '' });
    setShowPageModal(true);
  };

  const handleDeleteComment = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Comment',
      message: 'Are you sure you want to delete this comment? This action cannot be undone.',
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('admin_token');
          await api.delete(`/comments/${id}`, token || '');
          setData((prev) => prev.filter((item: any) => item._id !== id));
          showToast('Comment deleted successfully!', 'success');
        } catch (err) {
          console.error(err);
          showToast('Failed to delete comment', 'error');
        }
      }
    });
  };

  const handleToggleHideComment = async (id: string) => {
    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await api.patch(`/comments/${id}/toggle-hide`, {}, token);
      const updated = res.data?.doc || res.data || res;
      setData((prev) => prev.map((item: any) => item._id === id ? { ...item, isHidden: updated.isHidden } : item));
      showToast(`Comment visibility updated successfully`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to update comment visibility', 'error');
    }
  };

  const handleOpenEditUser = (user: any) => {
    setEditingUser(user);
    setEditUserForm({
      name: user.name || '',
      email: user.email || '',
      roleId: user.roleId?._id || user.roleId || '',
      password: ''
    });
    setShowEditUserModal(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setSavingUser(true);
    try {
      const token = localStorage.getItem('admin_token') || '';
      const payload: any = {
        name: editUserForm.name,
        email: editUserForm.email,
        roleId: editUserForm.roleId
      };
      if (editUserForm.password) {
        payload.password = editUserForm.password;
      }
      const res = await api.put(`/users/${editingUser._id}`, payload, token);
      const updated = res.data?.doc || res.data || res;
      setData((prev) => prev.map((item: any) => item._id === editingUser._id ? updated : item));
      setShowEditUserModal(false);
      showToast('User profile updated successfully', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to update user profile', 'error');
    } finally {
      setSavingUser(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete User',
      message: 'Are you sure you want to delete this user/staff account? This action cannot be undone.',
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('admin_token');
          await api.delete(`/users/${id}`, token || '');
          setData((prev) => prev.filter((item: any) => item._id !== id));
          showToast('User deleted successfully!', 'success');
        } catch (err: any) {
          console.error(err);
          showToast(err.message || 'Failed to delete user', 'error');
        }
      }
    });
  };

  const handleOpenCreateRole = () => {
    setEditingRole(null);
    setRoleForm({ name: '', permissions: [] });
    setShowRoleModal(true);
  };

  const handleOpenEditRole = (role: any) => {
    setEditingRole(role);
    setRoleForm({ name: role.name, permissions: role.permissions || [] });
    setShowRoleModal(true);
  };

  const handleDeleteRole = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Role',
      message: 'Are you sure you want to delete this role? Any user assigned to this role will lose permissions.',
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('admin_token') || '';
          await api.delete(`/roles/${id}`, token);
          setData((prev) => prev.filter((item: any) => item._id !== id));
          showToast('Role deleted successfully', 'success');
        } catch (err: any) {
          console.error(err);
          showToast(err.message || 'Failed to delete role', 'error');
        }
      }
    });
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingRole(true);
    try {
      const token = localStorage.getItem('admin_token') || '';
      if (editingRole) {
        const res = await api.put(`/roles/${editingRole._id}`, roleForm, token);
        const updated = res.data?.doc || res.data || res;
        setData((prev) => prev.map((item: any) => item._id === editingRole._id ? updated : item));
        showToast('Role updated successfully', 'success');
      } else {
        const res = await api.post('/roles', roleForm, token);
        const created = res.data?.doc || res.data || res;
        setData((prev) => [created, ...prev]);
        showToast('Role created successfully', 'success');
      }
      setShowRoleModal(false);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to save role', 'error');
    } finally {
      setSavingRole(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingUser(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await api.post('/users', newUser, token || '');
      const createdUser = res.data?.doc || res.data || res;
      setData((prev) => [createdUser, ...prev]);
      setShowCreateModal(false);
      setNewUser({ name: '', email: '', password: '', roleId: roles[0]?._id || '' });
      showToast('User created successfully', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to create user', 'error');
    } finally {
      setCreatingUser(false);
    }
  };

  const handleDeleteUpdate = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Announcement',
      message: 'Are you sure you want to delete this announcement/update?',
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('admin_token');
          await api.delete(`/updates/${id}`, token || '');
          setData((prev) => prev.filter((item: any) => item._id !== id));
          showToast('Announcement deleted successfully', 'success');
        } catch (err: any) {
          console.error(err);
          showToast(err.message || 'Failed to delete announcement', 'error');
        }
      }
    });
  };

  const handleOpenCreateUpdate = () => {
    setEditingUpdate(null);
    setUpdateForm({
      title: '',
      category: 'PRODUCT UPDATE',
      excerpt: '',
      content: '',
      featuredImage: '',
      publishedAt: new Date().toISOString().split('T')[0]
    });
    setImagePreviewUrl(null);
    setShowUpdateModal(true);
  };

  const handleOpenEditUpdate = (item: any) => {
    setEditingUpdate(item);
    setUpdateForm({
      title: item.title || '',
      category: item.category || 'PRODUCT UPDATE',
      excerpt: item.excerpt || '',
      content: item.content || '',
      featuredImage: item.featuredImage || '',
      publishedAt: item.publishedAt ? new Date(item.publishedAt).toISOString().split('T')[0] : ''
    });
    setImagePreviewUrl(item.featuredImage || null);
    setShowUpdateModal(true);
  };

  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingUpdate(true);
    try {
      const token = localStorage.getItem('admin_token') || '';
      
      let res;
      if (editingUpdate) {
        res = await api.put(`/updates/${editingUpdate._id}`, updateForm, token);
        const updated = res.data?.doc || res.data || res;
        setData((prev) => prev.map((item: any) => item._id === editingUpdate._id ? updated : item));
        showToast('Announcement updated successfully', 'success');
      } else {
        res = await api.post('/updates', updateForm, token);
        const created = res.data?.doc || res.data || res;
        setData((prev) => [created, ...prev]);
        showToast('Announcement created successfully', 'success');
      }
      setShowUpdateModal(false);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to save announcement', 'error');
    } finally {
      setSavingUpdate(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Monitor your leads, content, and engagement metrics.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-32 text-zinc-400 font-semibold animate-pulse flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-zinc-200 dark:border-zinc-800 border-t-[#FF4F18] rounded-full animate-spin mb-4"></div>
          Loading data...
        </div>
      ) : (
        <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800/80 rounded-3xl shadow-sm overflow-hidden">
          {(activeTab === 'leads' || activeTab === 'contacts') && (
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-black/20">
              <form onSubmit={handleSearchLeads} className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="w-full sm:w-auto flex-1">
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 mb-1">Search</label>
                  <input
                    type="text"
                    placeholder="Name, Email, or Phone"
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:border-[#FF4F18] focus:ring-1 focus:ring-[#FF4F18]"
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 mb-1">Status</label>
                  <select
                    value={leadStatusFilter}
                    onChange={(e) => setLeadStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:border-[#FF4F18] focus:ring-1 focus:ring-[#FF4F18]"
                  >
                    <option value="">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Closed">Closed</option>
                    <option value="Lost">Lost</option>
                    <option value="Not Interested">Not Interested</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
                <div className="w-full sm:w-auto">
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 mb-1">From Date</label>
                  <input
                    type="date"
                    value={leadStartDate}
                    onChange={(e) => setLeadStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:border-[#FF4F18] focus:ring-1 focus:ring-[#FF4F18]"
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 mb-1">To Date</label>
                  <input
                    type="date"
                    value={leadEndDate}
                    onChange={(e) => setLeadEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:border-[#FF4F18] focus:ring-1 focus:ring-[#FF4F18]"
                  />
                </div>
                <div className="w-full sm:w-auto flex gap-2">
                  <button type="submit" className="bg-[#FF4F18] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#E03F0D] transition-colors cursor-pointer">
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        const headers = activeTab === 'leads'
                          ? ['Name', 'Phone', 'Email', 'Business Name', 'Category', 'Purpose', 'Status', 'Created At', 'Last Contacted', 'Call Notes']
                          : ['Name', 'Phone', 'Email', 'Business Name', 'Category', 'Purpose', 'Status', 'Message', 'Created At', 'Last Contacted', 'Call Notes'];
                        
                        const rows = data.map((item: any) => {
                          const base = [
                            `"${(item.name || '').replace(/"/g, '""')}"`,
                            `"${(item.phone || '').replace(/"/g, '""')}"`,
                            `"${(item.email || '').replace(/"/g, '""')}"`,
                            `"${(item.businessName || '').replace(/"/g, '""')}"`,
                            `"${(item.category || '').replace(/"/g, '""')}"`,
                            `"${(item.purpose || '').replace(/"/g, '""')}"`,
                            `"${(item.status || '').replace(/"/g, '""')}"`
                          ];
                          if (activeTab === 'contacts') {
                            base.push(`"${(item.message || '').replace(/"/g, '""')}"`);
                          }
                          base.push(
                            `"${item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}"`,
                            `"${item.lastContactedDate ? new Date(item.lastContactedDate).toLocaleString() : ''}"`,
                            `"${(item.callNotes || '').replace(/"/g, '""')}"`
                          );
                          return base.join(',');
                        });

                        const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' 
                          + [headers.join(','), ...rows].join('\n');
                        
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement('a');
                        link.setAttribute('href', encodedUri);
                        link.setAttribute('download', `${activeTab}_export_${new Date().toISOString().slice(0, 10)}.csv`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        showToast('Exported successfully!', 'success');
                      } catch (err) {
                        console.error(err);
                        showToast('Export failed', 'error');
                      }
                    }}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Export Excel
                  </button>
                  {(leadSearch || leadStatusFilter || leadStartDate || leadEndDate) && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setLeadSearch('');
                        setLeadStatusFilter('');
                        setLeadStartDate('');
                        setLeadEndDate('');
                        fetchData(localStorage.getItem('admin_token') || '', true);
                      }}
                      className="bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 px-4 py-2 rounded-xl text-xs font-bold hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
          {activeTab === 'updates' && (
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800/80 flex justify-end bg-zinc-50/50 dark:bg-black/20">
              <button 
                onClick={handleOpenCreateUpdate}
                className="bg-[#FF4F18] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#E03F0D] transition-colors shadow-[0_4px_14px_rgba(255,79,24,0.35)] hover:shadow-[0_6px_20px_rgba(255,79,24,0.4)] transform hover:-translate-y-0.5 duration-200"
              >
                + Create Announcement
              </button>
            </div>
          )}
          {activeTab === 'blogs' && (
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800/80 flex justify-end bg-zinc-50/50 dark:bg-black/20">
              <Link href="/admin/blogs/add" className="bg-[#FF4F18] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#E03F0D] transition-colors shadow-[0_4px_14px_rgba(255,79,24,0.35)] hover:shadow-[0_6px_20px_rgba(255,79,24,0.4)] transform hover:-translate-y-0.5 duration-200">
                + Create New Post
              </Link>
            </div>
          )}
          {activeTab === 'solutions' && (
            <div className="p-6 bg-zinc-50/50 dark:bg-black/10 border-b border-zinc-200 dark:border-zinc-800/80">
              <form onSubmit={handleSaveGridSettings} className="space-y-4 max-w-4xl">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-zinc-500 mb-2">Solutions Grid Header Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-zinc-650 dark:text-zinc-400">Section Title</label>
                    <input 
                      type="text" 
                      value={gridTitle}
                      onChange={e => setGridTitle(e.target.value)}
                      placeholder="Twelve powerful features to help your restaurant run better"
                      className="w-full px-3 py-2 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-[#FF4F18]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-zinc-650 dark:text-zinc-400">Section Subtitle / Description</label>
                    <input 
                      type="text" 
                      value={gridDesc}
                      onChange={e => setGridDesc(e.target.value)}
                      placeholder="Click on any feature card below to open its full specifications..."
                      className="w-full px-3 py-2 rounded-xl text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-[#FF4F18]"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <button 
                    type="submit"
                    disabled={savingGridSettings}
                    className="bg-[#FF4F18] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-[#E03F0D] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {savingGridSettings ? 'Saving...' : 'Save Header Settings'}
                  </button>
                  
                  <Link href="/admin/solutions/new" className="bg-[#FF4F18]/10 text-[#FF4F18] border border-[#FF4F18]/20 px-4 py-2 rounded-full text-xs font-bold hover:bg-[#FF4F18]/20 transition-all cursor-pointer">
                    + Create New Solution Card
                  </Link>
                </div>
              </form>
            </div>
          )}
          {activeTab === 'industries' && (
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800/80 flex justify-end bg-zinc-50/50 dark:bg-black/20">
              <Link href="/admin/industries/new" className="bg-[#FF4F18] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#E03F0D] transition-colors shadow-[0_4px_14px_rgba(255,79,24,0.35)] hover:shadow-[0_6px_20px_rgba(255,79,24,0.4)] transform hover:-translate-y-0.5 duration-200">
                + Create New Industry
              </Link>
            </div>
          )}
          {activeTab === 'admins' && (
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between bg-zinc-50/50 dark:bg-black/20">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Admin & staff accounts with panel access</p>
              <button 
                onClick={() => setShowCreateModal(true)} 
                className="bg-[#FF4F18] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#E03F0D] transition-colors shadow-[0_4px_14px_rgba(255,79,24,0.35)] hover:shadow-[0_6px_20px_rgba(255,79,24,0.4)] transform hover:-translate-y-0.5 duration-200"
              >
                + Create New Admin
              </button>
            </div>
          )}
          {activeTab === 'users' && (
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-black/20">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Public users who signed up via the blog comments section</p>
            </div>
          )}
          {activeTab === 'roles' && (
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800/80 flex justify-end bg-zinc-50/50 dark:bg-black/20">
              <button 
                onClick={handleOpenCreateRole} 
                className="bg-[#FF4F18] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#E03F0D] transition-colors shadow-[0_4px_14px_rgba(255,79,24,0.35)] hover:shadow-[0_6px_20px_rgba(255,79,24,0.4)] transform hover:-translate-y-0.5 duration-200"
              >
                + Create New Role
              </button>
            </div>
          )}
          {activeTab === 'pages' && (
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800/80 flex justify-end bg-zinc-50/50 dark:bg-black/20">
              <button 
                onClick={handleOpenCreatePage} 
                className="bg-[#FF4F18] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#E03F0D] transition-colors shadow-[0_4px_14px_rgba(255,79,24,0.35)] hover:shadow-[0_6px_20px_rgba(255,79,24,0.4)] transform hover:-translate-y-0.5 duration-200"
              >
                + Create New Page
              </button>
            </div>
          )}
          {activeTab === 'comments' && (
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-black/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Filter Comments</span>
                <div className="flex bg-zinc-150 dark:bg-zinc-800 p-0.5 rounded-lg text-[11px] font-bold shrink-0">
                  <button
                    onClick={() => setCommentSubTab('all')}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      commentSubTab === 'all'
                        ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
                    }`}
                  >
                    All Comments
                  </button>
                  <button
                    onClick={() => setCommentSubTab('reported')}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      commentSubTab === 'reported'
                        ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
                    }`}
                  >
                    Reported Comments
                  </button>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search by person's name..."
                  value={commentSearchName}
                  onChange={(e) => setCommentSearchName(e.target.value)}
                  className="px-4 py-2 text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:border-[#FF4F18] focus:ring-1 focus:ring-[#FF4F18] w-full sm:w-64"
                />
                {commentSearchName && (
                  <button
                    onClick={() => setCommentSearchName('')}
                    className="px-3 py-2 bg-zinc-250 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-xl text-xs font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800/80 uppercase text-[11px] tracking-wider font-extrabold">
                <tr>
                  {activeTab === 'leads' && (
                    <>
                      <th className="px-6 py-4 font-semibold">Name</th>
                      <th className="px-6 py-4 font-semibold">Email</th>
                      <th className="px-6 py-4 font-semibold">Phone</th>
                      <th className="px-6 py-4 font-semibold">Business Name</th>
                      <th className="px-6 py-4 font-semibold">Category</th>
                      <th className="px-6 py-4 font-semibold">Purpose</th>
                      <th className="px-6 py-4 font-semibold">Message</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Submitted</th>
                      <th className="px-6 py-4 font-semibold">Last Contacted</th>
                      <th className="px-6 py-4 font-semibold">Actions</th>
                    </>
                  )}
                  {activeTab === 'contacts' && (
                    <>
                      <th className="px-6 py-4 font-semibold">Name</th>
                      <th className="px-6 py-4 font-semibold">Email</th>
                      <th className="px-6 py-4 font-semibold">Phone</th>
                      <th className="px-6 py-4 font-semibold">Business Name</th>
                      <th className="px-6 py-4 font-semibold">Category</th>
                      <th className="px-6 py-4 font-semibold">Purpose</th>
                      <th className="px-6 py-4 font-semibold">Message</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Submitted</th>
                      <th className="px-6 py-4 font-semibold">Last Contacted</th>
                      <th className="px-6 py-4 font-semibold">Actions</th>
                    </>
                  )}
                  {activeTab === 'updates' && (
                    <>
                      <th className="px-6 py-4 font-semibold">Title</th>
                      <th className="px-6 py-4 font-semibold">Category</th>
                      <th className="px-6 py-4 font-semibold">Date Published</th>
                      <th className="px-6 py-4 font-semibold">Actions</th>
                    </>
                  )}
                  {activeTab === 'blogs' && (
                    <>
                      <th className="px-6 py-4 font-semibold">Title</th>
                      <th className="px-6 py-4 font-semibold">Slug</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Actions</th>
                    </>
                  )}
                  {activeTab === 'solutions' && (
                    <>
                      <th className="px-6 py-4 font-semibold">Title</th>
                      <th className="px-6 py-4 font-semibold">Slug</th>
                      <th className="px-6 py-4 font-semibold">Actions</th>
                    </>
                  )}
                  {activeTab === 'industries' && (
                    <>
                      <th className="px-6 py-4 font-semibold">Title</th>
                      <th className="px-6 py-4 font-semibold">Slug</th>
                      <th className="px-6 py-4 font-semibold">Actions</th>
                    </>
                  )}
                  {activeTab === 'comments' && (
                    <>
                      <th className="px-6 py-4 font-semibold">Name</th>
                      <th className="px-6 py-4 font-semibold">Comment</th>
                      <th className="px-6 py-4 font-semibold">Post</th>
                      <th className="px-6 py-4 font-semibold">Likes</th>
                      <th className="px-6 py-4 font-semibold">Date</th>
                      <th className="px-6 py-4 font-semibold">Actions</th>
                    </>
                  )}
                  {(activeTab === 'users' || activeTab === 'admins') && (
                    <>
                      <th className="px-6 py-4 font-semibold">Name</th>
                      <th className="px-6 py-4 font-semibold">Email</th>
                      <th className="px-6 py-4 font-semibold">Role</th>
                      <th className="px-6 py-4 font-semibold">Date Created</th>
                      <th className="px-6 py-4 font-semibold">Actions</th>
                    </>
                  )}
                  {activeTab === 'roles' && (
                    <>
                      <th className="px-6 py-4 font-semibold">Role Name</th>
                      <th className="px-6 py-4 font-semibold">Permissions</th>
                      <th className="px-6 py-4 font-semibold">Actions</th>
                    </>
                  )}
                  {activeTab === 'pages' && (
                    <>
                      <th className="px-6 py-4 font-semibold">Title</th>
                      <th className="px-6 py-4 font-semibold">Slug</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
                {(() => {
                  let list = data;
                  if (activeTab === 'comments' && commentSubTab === 'reported') {
                    list = data.filter((c: any) => c.isReported || (c.reports && c.reports.length > 0));
                  }
                  return list.map((item: any, i: number) => (
                    <tr key={item._id || i} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors group">
                    {activeTab === 'leads' && (
                       <>
                         <td className="px-6 py-4 font-medium">{item.name}</td>
                         <td className="px-6 py-4">{item.email}</td>
                         <td className="px-6 py-4">{item.phone}</td>
                         <td className="px-6 py-4">{item.businessName || 'N/A'}</td>
                         <td className="px-6 py-4">{item.category || 'N/A'}</td>
                         <td className="px-6 py-4">{item.purpose || 'N/A'}</td>
                         <td className="px-6 py-4 max-w-[150px] truncate">{item.message || 'N/A'}</td>
                         <td className="px-6 py-4">
                           <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                             {item.status}
                           </span>
                         </td>
                         <td className="px-6 py-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                         <td className="px-6 py-4">{item.lastContactedDate ? new Date(item.lastContactedDate).toLocaleString() : 'Never'}</td>
                         <td className="px-6 py-4">
                           <button onClick={() => handleOpenEditLead(item)} className="text-[#FF4F18] font-bold hover:underline transition-opacity">
                             View/Edit
                           </button>
                         </td>
                       </>
                     )}
                     {activeTab === 'contacts' && (
                       <>
                         <td className="px-6 py-4 font-medium">{item.name}</td>
                         <td className="px-6 py-4">{item.email}</td>
                         <td className="px-6 py-4">{item.phone}</td>
                         <td className="px-6 py-4">{item.businessName || 'N/A'}</td>
                         <td className="px-6 py-4">{item.category || 'N/A'}</td>
                         <td className="px-6 py-4">{item.purpose || 'N/A'}</td>
                         <td className="px-6 py-4 max-w-[150px] truncate">{item.message || 'N/A'}</td>
                         <td className="px-6 py-4">
                           <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                             {item.status}
                           </span>
                         </td>
                         <td className="px-6 py-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                         <td className="px-6 py-4">{item.lastContactedDate ? new Date(item.lastContactedDate).toLocaleString() : 'Never'}</td>
                         <td className="px-6 py-4">
                           <button onClick={() => handleOpenEditLead(item)} className="text-[#FF4F18] font-bold hover:underline transition-opacity">
                             View/Edit
                           </button>
                         </td>
                       </>
                     )}
                    {activeTab === 'updates' && (
                      <>
                        <td className="px-6 py-4 font-medium max-w-[250px] truncate">{item.title}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                            {typeof item.category === 'object' && item.category ? item.category.name : (item.category || 'PRODUCT UPDATE')}
                          </span>
                        </td>
                        <td className="px-6 py-4">{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : 'N/A'}</td>
                        <td className="px-6 py-4 space-x-2">
                          <button 
                            onClick={() => handleOpenEditUpdate(item)} 
                            className="text-[#FF4F18] font-bold hover:underline transition-opacity"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteUpdate(item._id)} 
                            className="text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                    {activeTab === 'blogs' && (
                      <>
                        <td className="px-6 py-4 font-medium max-w-[250px] truncate">{item.title}</td>
                        <td className="px-6 py-4">{item.slug}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide uppercase ${item.status === 'Published' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'}`}>
                             {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`/admin/blogs/${item._id}`} className="text-[#FF4F18] font-bold hover:underline transition-opacity">
                            Edit Post
                          </Link>
                        </td>
                      </>
                    )}
                    {activeTab === 'solutions' && (
                      <>
                        <td className="px-6 py-4 font-medium max-w-[250px] truncate">{item.title}</td>
                        <td className="px-6 py-4">{item.slug}</td>
                        <td className="px-6 py-4">
                          <Link href={`/admin/solutions/${item._id}`} className="text-[#FF4F18] font-bold hover:underline transition-opacity">
                            Edit Solution
                          </Link>
                        </td>
                      </>
                    )}
                    {activeTab === 'industries' && (
                      <>
                        <td className="px-6 py-4 font-medium max-w-[250px] truncate">{item.title}</td>
                        <td className="px-6 py-4">{item.slug}</td>
                        <td className="px-6 py-4">
                          <Link href={`/admin/industries/${item._id}`} className="text-[#FF4F18] font-bold hover:underline transition-opacity">
                            Edit Industry
                          </Link>
                        </td>
                      </>
                    )}
                    {activeTab === 'comments' && (
                       <>
                         <td className="px-6 py-4">
                           <button 
                             onClick={() => setCommentSearchName(item.name)}
                             className="text-left font-bold text-[#FF4F18] hover:underline"
                             title="Click to view all comments from this person"
                           >
                             {item.name}
                           </button>
                         </td>
                          <td className="px-6 py-4 max-w-[300px]">
                            <div className="font-medium text-zinc-900 dark:text-zinc-150 whitespace-pre-wrap break-words">{item.text}</div>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {item.parentId && (
                                <span className="inline-block px-2 py-0.5 text-[9px] font-extrabold uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded">Reply</span>
                              )}
                              {item.isHidden && (
                                <span className="inline-block px-2 py-0.5 text-[9px] font-extrabold uppercase bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-500 rounded">Hidden</span>
                              )}
                            </div>
                            {item.isReported && (
                              <div className="mt-2 space-y-1">
                                <span className="inline-block px-2 py-0.5 text-[9px] font-extrabold uppercase bg-red-50 dark:bg-red-950/20 text-red-500 rounded">⚠️ {item.reportsCount} Reports</span>
                                {item.reports && item.reports.length > 0 && (
                                  <ul className="mt-1 pl-2 border-l border-red-200 dark:border-red-800/60 text-[10px] text-zinc-500 dark:text-zinc-405 space-y-0.5">
                                    {item.reports.map((r: any, rIdx: number) => (
                                      <li key={rIdx}>
                                        <span className="font-bold">{r.user?.name || 'User'}:</span> {r.reason}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            )}
                          </td>
                         <td className="px-6 py-4 max-w-[200px] truncate">{item.post?.title || 'Unknown Post'}</td>
                         <td className="px-6 py-4 font-semibold text-zinc-650 dark:text-zinc-400">
                           ❤️ {item.likesCount || item.likes?.length || 0}
                         </td>
                         <td className="px-6 py-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                         <td className="px-6 py-4 space-x-2">
                           <button 
                             onClick={() => handleToggleHideComment(item._id)} 
                             className={`font-bold px-3 py-1.5 rounded-lg transition-colors ${
                               item.isHidden 
                                 ? 'text-green-600 bg-green-50 dark:bg-green-500/10 hover:bg-green-100 dark:hover:bg-green-500/20' 
                                 : 'text-zinc-650 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700/50'
                             }`}
                           >
                             {item.isHidden ? 'Unhide' : 'Hide'}
                           </button>
                           <button onClick={() => handleDeleteComment(item._id)} className="text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors">
                             Delete
                           </button>
                         </td>
                       </>
                     )}
                    {(activeTab === 'users' || activeTab === 'admins') && (
                      <>
                        <td className="px-6 py-4 font-medium">{item.name}</td>
                        <td className="px-6 py-4">{item.email}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFF3EF] text-[#FF4F18]">
                            {item.roleId?.name || 'User'}
                          </span>
                        </td>
                        <td className="px-6 py-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 space-x-2">
                          <button 
                            onClick={() => handleOpenEditUser(item)} 
                            className="text-[#FF4F18] font-bold hover:underline transition-opacity"
                          >
                            Edit / Password
                          </button>
                          {(!currentUser || currentUser._id !== item._id) && (
                            <button onClick={() => handleDeleteUser(item._id)} className="text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors">
                              Delete
                            </button>
                          )}
                        </td>
                      </>
                    )}
                    {activeTab === 'roles' && (
                      <>
                        <td className="px-6 py-4 font-medium">{item.name}</td>
                        <td className="px-6 py-4 max-w-[400px] truncate">{item.permissions?.join(', ') || 'None'}</td>
                        <td className="px-6 py-4 space-x-2">
                          <button 
                            onClick={() => handleOpenEditRole(item)} 
                            className="text-[#FF4F18] font-bold hover:underline transition-opacity"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteRole(item._id)} 
                            className="text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                    {activeTab === 'pages' && (
                      <>
                        <td className="px-6 py-4 font-medium max-w-[250px] truncate">{item.title}</td>
                        <td className="px-6 py-4">{item.slug}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide uppercase ${item.status === 'Published' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'}`}>
                             {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 space-x-2">
                          <button 
                            onClick={() => handleOpenEditPage(item)} 
                            className="text-[#FF4F18] font-bold hover:underline transition-opacity"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeletePage(item._id)} 
                            className="text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ));
              })()}
              {(() => {
                let list = data;
                if (activeTab === 'comments' && commentSubTab === 'reported') {
                  list = data.filter((c: any) => c.isReported || (c.reports && c.reports.length > 0));
                }
                if (list.length === 0) {
                  return (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-zinc-500">
                        No records found.
                      </td>
                    </tr>
                  );
                }
                return null;
              })()}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs animate-fade-in" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl z-10">
            <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white mb-2">Create New Admin</h2>
            <p className="text-xs text-zinc-500 mb-6">Create a staff account with access to the admin panel.</p>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Name</label>
                <input 
                  type="text" 
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Full Name"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F18] text-sm text-zinc-900 dark:text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F18] text-sm text-zinc-900 dark:text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Password</label>
                <input 
                  type="password" 
                  required
                  minLength={8}
                  value={newUser.password}
                  onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Min 8 characters"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F18] text-sm text-zinc-900 dark:text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Role</label>
                <select 
                  required
                  value={newUser.roleId}
                  onChange={(e) => setNewUser(prev => ({ ...prev, roleId: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F18] text-sm text-zinc-900 dark:text-white cursor-pointer"
                >
                  <option value="" disabled>Select Role</option>
                  {roles.filter((role) => role.name !== 'User').map((role) => (
                    <option key={role._id} value={role._id}>{role.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2.5 font-bold text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={creatingUser}
                  className="flex-1 bg-[#FF4F18] hover:bg-[#E03F0D] text-white py-2.5 rounded-full text-sm font-bold transition-all duration-200 shadow-md flex items-center justify-center gap-2"
                >
                  {creatingUser ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs animate-fade-in" onClick={() => setShowUpdateModal(false)} />
          <div className="relative bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl z-10">
            <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white mb-6">
              {editingUpdate ? 'Edit Announcement' : 'Create Announcement'}
            </h2>
            <form onSubmit={handleSaveUpdate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Title</label>
                <input 
                  type="text" 
                  required
                  value={updateForm.title}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Announcement title"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F18] text-sm text-zinc-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Category</label>
                  <select 
                    required
                    value={updateForm.category}
                    onChange={(e) => setUpdateForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F18] text-sm text-zinc-900 dark:text-white cursor-pointer"
                  >
                    <option value="PRODUCT UPDATE">Product Update</option>
                    <option value="INTEGRATION">Integration</option>
                    <option value="NEW FEATURE">New Feature</option>
                    <option value="GUIDE">Guide</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Publish Date</label>
                  <input 
                    type="date" 
                    required
                    value={updateForm.publishedAt}
                    onChange={(e) => setUpdateForm(prev => ({ ...prev, publishedAt: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F18] text-sm text-zinc-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Excerpt / Brief Description</label>
                <textarea 
                  required
                  rows={2}
                  value={updateForm.excerpt}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Short summary displayed on list card..."
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F18] text-sm text-zinc-900 dark:text-white resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Detail Content (Optional)</label>
                <textarea 
                  rows={4}
                  value={updateForm.content}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Full announcement content..."
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F18] text-sm text-zinc-900 dark:text-white resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Featured Image</label>
                <div className="flex flex-col gap-3">
                  {/* Live preview (local blob → Cloudinary URL after upload) */}
                  {imagePreviewUrl && (
                    <div className="relative w-full h-36 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 group">
                      <img
                        src={imagePreviewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      {uploadingImage && (
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span className="text-white text-xs font-semibold">Uploading to Cloudinary...</span>
                        </div>
                      )}
                      {!uploadingImage && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                          <button
                            type="button"
                            onClick={() => imageInputRef.current?.click()}
                            className="bg-white/90 text-zinc-800 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white transition-colors"
                          >
                            Change Image
                          </button>
                          <button
                            type="button"
                            onClick={() => { setImagePreviewUrl(null); setUpdateForm(prev => ({ ...prev, featuredImage: '' })); }}
                            className="bg-red-600/90 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {!imagePreviewUrl && (
                    <div
                      className="relative flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-6 bg-zinc-50/50 dark:bg-zinc-950/20 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors cursor-pointer group"
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <svg className="w-8 h-8 text-zinc-400 mb-2 group-hover:text-[#FF4F18] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 group-hover:text-[#FF4F18] transition-colors">
                        Click to upload image
                      </span>
                      <span className="text-[10px] text-zinc-400 mt-1">PNG, JPG, WEBP up to 10MB</span>
                    </div>
                  )}

                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </div>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowUpdateModal(false)}
                  className="flex-1 px-4 py-2.5 font-bold text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={savingUpdate}
                  className="flex-1 bg-[#FF4F18] hover:bg-[#E03F0D] text-white py-2.5 rounded-full text-sm font-bold transition-all duration-200 shadow-md flex items-center justify-center gap-2"
                >
                  {savingUpdate ? 'Saving...' : (editingUpdate ? 'Save Changes' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Create/Edit Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-scale-up">
            <h3 className="text-xl font-bold mb-4 text-[#111111] dark:text-white">
              {editingRole ? 'Edit Role' : 'Create New Role'}
            </h3>
            <form onSubmit={handleSaveRole} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Role Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Content Writer"
                  value={roleForm.name} 
                  onChange={e => setRoleForm({ ...roleForm, name: e.target.value })} 
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Permissions</label>
                <div className="space-y-2 max-h-60 overflow-y-auto border border-zinc-150 dark:border-zinc-800 rounded-xl p-3 bg-zinc-50 dark:bg-zinc-950/20">
                  {[
                    { val: 'manage_solutions', label: 'Manage Solutions' },
                    { val: 'manage_industries', label: 'Manage Industries' },
                    { val: 'manage_blogs', label: 'Manage Announcements & Blogs' },
                    { val: 'manage_comments', label: 'Manage Comments' },
                    { val: 'manage_leads', label: 'Manage Leads & Demos' },
                    { val: 'manage_contacts', label: 'Manage Contacts' },
                    { val: 'manage_users', label: 'Manage Users & Roles' },
                    { val: '*', label: 'Super Admin (All Access)' }
                  ].map(perm => (
                    <label key={perm.val} className="flex items-center gap-2.5 text-sm font-semibold cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={roleForm.permissions.includes(perm.val)}
                        onChange={e => {
                          const checked = e.target.checked;
                          let nextPerms = [...roleForm.permissions];
                          if (checked) {
                            nextPerms.push(perm.val);
                          } else {
                            nextPerms = nextPerms.filter(p => p !== perm.val);
                          }
                          setRoleForm({ ...roleForm, permissions: nextPerms });
                        }}
                        className="rounded text-[#FF4F18] focus:ring-[#FF4F18]"
                      />
                      <span>{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowRoleModal(false)}
                  className="flex-1 px-4 py-2.5 font-bold text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={savingRole}
                  className="flex-1 bg-[#FF4F18] hover:bg-[#E03F0D] text-white py-2.5 rounded-full text-sm font-bold transition-all duration-200 shadow-md flex items-center justify-center gap-2"
                >
                  {savingRole ? 'Saving...' : (editingRole ? 'Save Changes' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page Create/Edit Modal */}
      {showPageModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-2xl shadow-2xl animate-scale-up">
            <h3 className="text-xl font-bold mb-4 text-[#111111] dark:text-white">
              {editingPage ? 'Edit Page Content' : 'Create New Page'}
            </h3>
            <form onSubmit={handleSavePage} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">Page Title</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Privacy Policy"
                    value={pageForm.title} 
                    onChange={e => setPageForm({ ...pageForm, title: e.target.value })} 
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">Slug (URL Path)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. privacy"
                    value={pageForm.slug} 
                    onChange={e => setPageForm({ ...pageForm, slug: e.target.value })} 
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">Status</label>
                <select
                  value={pageForm.status}
                  onChange={e => setPageForm({ ...pageForm, status: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">Page Content</label>
                <textarea 
                  required
                  rows={10}
                  value={pageForm.content}
                  onChange={e => setPageForm({ ...pageForm, content: e.target.value })}
                  placeholder="Write the page content here..."
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white font-normal resize-y"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowPageModal(false)}
                  className="flex-1 px-4 py-2.5 font-bold text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={savingPage}
                  className="flex-1 bg-[#FF4F18] hover:bg-[#E03F0D] text-white py-2.5 rounded-full text-sm font-bold transition-all duration-200 shadow-md flex items-center justify-center gap-2"
                >
                  {savingPage ? 'Saving...' : (editingPage ? 'Save Changes' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lead Edit Modal */}
      {editingLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-xl shadow-2xl animate-scale-up">
            <h3 className="text-xl font-bold mb-4 text-[#111111] dark:text-white">
              Lead / Contact Details
            </h3>
            
            {/* Readonly Info Section */}
            <div className="mb-6 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800/80">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-zinc-500 font-bold uppercase text-[10px] tracking-wider block">Name</span><span className="font-medium text-zinc-900 dark:text-white">{editingLead.name}</span></div>
                <div><span className="text-zinc-500 font-bold uppercase text-[10px] tracking-wider block">Email</span><span className="font-medium text-zinc-900 dark:text-white">{editingLead.email}</span></div>
                <div><span className="text-zinc-500 font-bold uppercase text-[10px] tracking-wider block">Phone</span><span className="font-medium text-zinc-900 dark:text-white">{editingLead.phone}</span></div>
                <div><span className="text-zinc-500 font-bold uppercase text-[10px] tracking-wider block">Submitted</span><span className="font-medium text-zinc-900 dark:text-white">{new Date(editingLead.createdAt).toLocaleString()}</span></div>
                {editingLead.businessName && <div><span className="text-zinc-500 font-bold uppercase text-[10px] tracking-wider block">Business Name</span><span className="font-medium text-zinc-900 dark:text-white">{editingLead.businessName}</span></div>}
                {editingLead.category && <div><span className="text-zinc-500 font-bold uppercase text-[10px] tracking-wider block">Category</span><span className="font-medium text-zinc-900 dark:text-white">{editingLead.category}</span></div>}
                {editingLead.purpose && <div><span className="text-zinc-500 font-bold uppercase text-[10px] tracking-wider block">Purpose</span><span className="font-medium text-zinc-900 dark:text-white">{editingLead.purpose}</span></div>}
                {editingLead.message && <div className="col-span-2"><span className="text-zinc-500 font-bold uppercase text-[10px] tracking-wider block">Message</span><span className="font-medium text-zinc-900 dark:text-white">{editingLead.message}</span></div>}
              </div>
            </div>

            {/* Editable Form Section */}
            <form onSubmit={handleSaveLead} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">Status</label>
                  <select
                    value={leadForm.status}
                    onChange={e => setLeadForm({ ...leadForm, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Closed">Closed</option>
                    <option value="Lost">Lost</option>
                    <option value="Not Interested">Not Interested</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">Last Contacted</label>
                  <input 
                    type="datetime-local" 
                    value={leadForm.lastContactedDate} 
                    onChange={e => setLeadForm({ ...leadForm, lastContactedDate: e.target.value })} 
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">Call Notes / Updates</label>
                <textarea 
                  rows={4}
                  value={leadForm.callNotes}
                  onChange={e => setLeadForm({ ...leadForm, callNotes: e.target.value })}
                  placeholder="Enter details from the call..."
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white font-normal resize-y"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setEditingLead(null)}
                  className="flex-1 px-4 py-2.5 font-bold text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors"
                >
                  Close
                </button>
                <button 
                  type="submit"
                  disabled={savingLead}
                  className="flex-1 bg-[#FF4F18] hover:bg-[#E03F0D] text-white py-2.5 rounded-full text-sm font-bold transition-all duration-200 shadow-md flex items-center justify-center gap-2"
                >
                  {savingLead ? 'Saving...' : 'Save Updates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditUserModal && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs animate-fade-in" onClick={() => setShowEditUserModal(false)} />
          <div className="relative bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl z-10 animate-scale-in">
            <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white mb-2">Edit Account & Reset Password</h2>
            <p className="text-xs text-zinc-500 mb-6">Modify user profile info or input a new password to reset it.</p>
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Name</label>
                <input 
                  type="text" 
                  required
                  value={editUserForm.name}
                  onChange={(e) => setEditUserForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F18] text-sm text-zinc-900 dark:text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={editUserForm.email}
                  onChange={(e) => setEditUserForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F18] text-sm text-zinc-900 dark:text-white"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Reset Password</label>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500">Optional</span>
                </div>
                <input 
                  type="password" 
                  minLength={8}
                  value={editUserForm.password}
                  onChange={(e) => setEditUserForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Leave blank to keep current"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F18] text-sm text-zinc-900 dark:text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Role</label>
                <select 
                  required
                  value={editUserForm.roleId}
                  onChange={(e) => setEditUserForm(prev => ({ ...prev, roleId: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#F8F9FA] dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F18] text-sm text-zinc-900 dark:text-white cursor-pointer"
                >
                  {roles.map((role) => (
                    <option key={role._id} value={role._id}>{role.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowEditUserModal(false)}
                  className="flex-1 px-4 py-2.5 font-bold text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={savingUser}
                  className="flex-1 bg-[#FF4F18] hover:bg-[#E03F0D] text-white py-2.5 rounded-full text-xs font-bold transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {savingUser ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed top-5 right-5 z-[100] max-w-sm w-full animate-slide-in">
          <div className={`p-4 rounded-2xl shadow-xl border flex items-center justify-between gap-4 ${
            toastMessage.type === 'error' 
              ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400' 
              : toastMessage.type === 'success' 
              ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400' 
              : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
          }`}>
            <span className="text-xs font-bold">{toastMessage.text}</span>
            <button 
              onClick={() => setToastMessage(null)}
              className="text-xs font-bold hover:opacity-70 cursor-pointer shrink-0"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs animate-fade-in" onClick={() => setConfirmModal(null)} />
          <div className="relative bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl z-10 animate-scale-in">
            <h2 className="text-base font-extrabold text-zinc-955 dark:text-white mb-2">{confirmModal.title}</h2>
            <p className="text-xs text-zinc-555 dark:text-zinc-450 mb-6 leading-relaxed">{confirmModal.message}</p>
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={() => setConfirmModal(null)}
                className="flex-1 px-4 py-2.5 font-bold text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal(null);
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-full text-xs font-bold transition-all duration-200 shadow-md flex items-center justify-center cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


