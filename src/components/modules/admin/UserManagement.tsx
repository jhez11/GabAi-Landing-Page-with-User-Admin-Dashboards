import React, { useEffect, useState, Component } from 'react';
import { Search, UserPlus, Trash2, Edit, Shield, User as UserIcon, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Avatar } from '../../ui/Avatar';
import { Modal } from '../../ui/Modal';
import { motion } from 'framer-motion';
interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  department?: string;
  avatar?: string;
  createdAt: string;
}
export function UserManagement() {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<RegisteredUser | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user' as 'user' | 'admin',
    department: ''
  });
  useEffect(() => {
    loadUsers();
  }, []);
  const loadUsers = () => {
    const registeredUsers = JSON.parse(localStorage.getItem('gabai_registered_users') || '[]');
    const formattedUsers: RegisteredUser[] = registeredUsers.map((u: any) => ({
      id: u.user.id,
      name: u.user.name,
      email: u.user.email,
      role: u.user.role,
      department: u.user.department || '',
      avatar: u.user.avatar,
      createdAt: new Date().toISOString()
    }));
    setUsers(formattedUsers);
  };
  const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()) || user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()));
  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'user',
      department: ''
    });
    setIsModalOpen(true);
  };
  const handleEdit = (user: RegisteredUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || ''
    });
    setIsModalOpen(true);
  };
  const handleDelete = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const registeredUsers = JSON.parse(localStorage.getItem('gabai_registered_users') || '[]');
      const updated = registeredUsers.filter((u: any) => u.user.id !== userId);
      localStorage.setItem('gabai_registered_users', JSON.stringify(updated));
      loadUsers();
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const registeredUsers = JSON.parse(localStorage.getItem('gabai_registered_users') || '[]');
    if (editingUser) {
      // Update existing user
      const updated = registeredUsers.map((u: any) => u.user.id === editingUser.id ? {
        ...u,
        user: {
          ...u.user,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          department: formData.department
        }
      } : u);
      localStorage.setItem('gabai_registered_users', JSON.stringify(updated));
    } else {
      // Add new user
      const newUser = {
        email: formData.email,
        password: 'password123',
        user: {
          id: `user-${Date.now()}`,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          department: formData.department,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`
        }
      };
      registeredUsers.push(newUser);
      localStorage.setItem('gabai_registered_users', JSON.stringify(registeredUsers));
    }
    loadUsers();
    setIsModalOpen(false);
  };
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            User Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Monitor and manage registered users.
          </p>
        </div>
        <Button onClick={handleAdd} className="w-full sm:w-auto">
          <UserPlus className="h-4 w-4 mr-2" /> Add User
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-lg">
              All Users ({users.length})
            </CardTitle>
            <div className="w-full sm:w-72">
              <Input placeholder="Search users..." icon={<Search className="h-4 w-4" />} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden border-y sm:border sm:rounded-lg border-border">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        User
                      </th>
                      <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Role
                      </th>
                      <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Department
                      </th>
                      <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-background divide-y divide-border">
                    {filteredUsers.map((user, index) => <motion.tr key={user.id} initial={{
                    opacity: 0
                  }} animate={{
                    opacity: 1
                  }} transition={{
                    delay: index * 0.05
                  }} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar fallback={user.name} src={user.avatar} size="sm" />
                            <div className="flex flex-col">
                              <div className="font-medium text-sm">
                                {user.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {user.email}
                              </div>
                              <div className="text-xs text-muted-foreground sm:hidden capitalize">
                                {user.role}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell px-4 py-4">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                            {user.role === 'admin' ? <Shield className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="hidden md:table-cell px-4 py-4 text-sm text-muted-foreground">
                          {user.department || '-'}
                        </td>
                        <td className="hidden lg:table-cell px-4 py-4">
                          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Active
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(user.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {filteredUsers.length === 0 && <div className="text-center py-12 text-muted-foreground">
              <UserIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No users found</p>
            </div>}
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? 'Edit User' : 'Add User'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" value={formData.name} onChange={e => setFormData({
          ...formData,
          name: e.target.value
        })} placeholder="Juan Dela Cruz" required />
          <Input label="Email Address" type="email" value={formData.email} onChange={e => setFormData({
          ...formData,
          email: e.target.value
        })} placeholder="user@nemsu.edu.ph" required />
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <select value={formData.role} onChange={e => setFormData({
            ...formData,
            role: e.target.value as 'user' | 'admin'
          })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" required>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <Input label="Department" value={formData.department} onChange={e => setFormData({
          ...formData,
          department: e.target.value
        })} placeholder="College of Computer Studies" icon={<Building2 className="h-4 w-4" />} />

          {!editingUser && <p className="text-xs text-muted-foreground">
              Default password will be set to:{' '}
              <code className="bg-muted px-1 py-0.5 rounded">password123</code>
            </p>}
          <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>;
}