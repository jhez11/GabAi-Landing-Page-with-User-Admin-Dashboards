import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Modal } from '../../ui/Modal';
import { motion } from 'framer-motion';
import { useData } from '../../../contexts/DataContext';
export function DepartmentCRUD() {
  const {
    departments,
    addDepartment,
    updateDepartment,
    deleteDepartment
  } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    dean: '',
    email: '',
    phone: '',
    description: '',
    programs: '',
    image: ''
  });
  const filteredDepartments = departments.filter(dept => dept.name.toLowerCase().includes(searchTerm.toLowerCase()) || dept.dean.toLowerCase().includes(searchTerm.toLowerCase()));
  const handleAdd = () => {
    setEditingDept(null);
    setFormData({
      name: '',
      dean: '',
      email: '',
      phone: '',
      description: '',
      programs: '',
      image: ''
    });
    setIsModalOpen(true);
  };
  const handleEdit = (dept: any) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      dean: dept.dean,
      email: dept.email,
      phone: dept.phone,
      description: dept.description,
      programs: dept.programs.join(', '),
      image: dept.image
    });
    setIsModalOpen(true);
  };
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this department?')) {
      deleteDepartment(id);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const deptData = {
      ...formData,
      programs: formData.programs.split(',').map(p => p.trim()).filter(p => p)
    };
    if (editingDept) {
      updateDepartment(editingDept.id, deptData);
    } else {
      addDepartment(deptData);
    }
    setIsModalOpen(false);
  };
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Manage Departments
          </h2>
          <p className="text-sm text-muted-foreground">
            Create, update, or remove academic departments.
          </p>
        </div>
        <Button onClick={handleAdd} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" /> Add Department
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5" /> Departments (
              {departments.length})
            </CardTitle>
            <div className="w-full sm:w-72">
              <Input placeholder="Search departments..." icon={<Search className="h-4 w-4" />} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
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
                        Department
                      </th>
                      <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Dean / Head
                      </th>
                      <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="hidden sm:table-cell px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Programs
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-background divide-y divide-border">
                    {filteredDepartments.map((dept, index) => <motion.tr key={dept.id} initial={{
                    opacity: 0
                  }} animate={{
                    opacity: 1
                  }} transition={{
                    delay: index * 0.05
                  }} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <div className="font-medium text-sm">
                              {dept.name}
                            </div>
                            <div className="text-xs text-muted-foreground md:hidden">
                              {dept.dean}
                            </div>
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-4 py-4 text-sm">
                          {dept.dean}
                        </td>
                        <td className="hidden lg:table-cell px-4 py-4 text-sm text-muted-foreground">
                          {dept.email}
                        </td>
                        <td className="hidden sm:table-cell px-4 py-4 text-center">
                          <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                            {dept.programs.length}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(dept)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(dept.id)}>
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
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingDept ? 'Edit Department' : 'Add Department'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Department Name" value={formData.name} onChange={e => setFormData({
          ...formData,
          name: e.target.value
        })} placeholder="e.g., College of Engineering" required />
          <Input label="Dean / Head" value={formData.dean} onChange={e => setFormData({
          ...formData,
          dean: e.target.value
        })} placeholder="e.g., Dr. John Doe, PhD" required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Contact Email" type="email" value={formData.email} onChange={e => setFormData({
            ...formData,
            email: e.target.value
          })} placeholder="dept@nemsu.edu.ph" required />
            <Input label="Phone Number" value={formData.phone} onChange={e => setFormData({
            ...formData,
            phone: e.target.value
          })} placeholder="(086) 123-4567" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea value={formData.description} onChange={e => setFormData({
            ...formData,
            description: e.target.value
          })} placeholder="Brief description of the department..." className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" required />
          </div>
          <Input label="Programs (comma-separated)" value={formData.programs} onChange={e => setFormData({
          ...formData,
          programs: e.target.value
        })} placeholder="BS Program 1, BS Program 2, BS Program 3" required />
          <Input label="Image URL" value={formData.image} onChange={e => setFormData({
          ...formData,
          image: e.target.value
        })} placeholder="https://example.com/image.jpg" required />
          <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {editingDept ? 'Update Department' : 'Create Department'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>;
}