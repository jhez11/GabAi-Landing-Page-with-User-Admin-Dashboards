import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Modal } from '../../ui/Modal';
import { motion } from 'framer-motion';
import { useData } from '../../../contexts/DataContext';
export function ScholarshipCRUD() {
  const {
    scholarships,
    addScholarship,
    updateScholarship,
    deleteScholarship
  } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    provider: '',
    deadline: '',
    type: 'Merit' as 'Merit' | 'Need-based' | 'Government',
    description: ''
  });
  const filteredScholarships = scholarships.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.provider.toLowerCase().includes(searchTerm.toLowerCase()));
  const handleAdd = () => {
    setEditingScholarship(null);
    setFormData({
      name: '',
      provider: '',
      deadline: '',
      type: 'Merit',
      description: ''
    });
    setIsModalOpen(true);
  };
  const handleEdit = (scholarship: any) => {
    setEditingScholarship(scholarship);
    setFormData(scholarship);
    setIsModalOpen(true);
  };
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this scholarship?')) {
      deleteScholarship(id);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingScholarship) {
      updateScholarship(editingScholarship.id, formData);
    } else {
      addScholarship(formData);
    }
    setIsModalOpen(false);
  };
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Manage Scholarships
          </h2>
          <p className="text-sm text-muted-foreground">
            Update financial aid programs and requirements.
          </p>
        </div>
        <Button onClick={handleAdd} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" /> Add Scholarship
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="h-5 w-5" /> Active Programs (
              {scholarships.length})
            </CardTitle>
            <div className="w-full sm:w-72">
              <Input placeholder="Search scholarships..." icon={<Search className="h-4 w-4" />} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
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
                        Scholarship Name
                      </th>
                      <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Provider
                      </th>
                      <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Type
                      </th>
                      <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Deadline
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-background divide-y divide-border">
                    {filteredScholarships.map((item, index) => <motion.tr key={item.id} initial={{
                    opacity: 0
                  }} animate={{
                    opacity: 1
                  }} transition={{
                    delay: index * 0.05
                  }} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <div className="font-medium text-sm">
                              {item.name}
                            </div>
                            <div className="text-xs text-muted-foreground md:hidden">
                              {item.provider}
                            </div>
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-4 py-4 text-sm">
                          {item.provider}
                        </td>
                        <td className="hidden sm:table-cell px-4 py-4">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${item.type === 'Merit' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : item.type === 'Government' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="hidden lg:table-cell px-4 py-4 text-sm text-orange-600 dark:text-orange-400 font-medium">
                          {item.deadline}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(item.id)}>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingScholarship ? 'Edit Scholarship' : 'Add Scholarship'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Scholarship Name" value={formData.name} onChange={e => setFormData({
          ...formData,
          name: e.target.value
        })} placeholder="e.g., Academic Excellence Scholarship" required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Provider" value={formData.provider} onChange={e => setFormData({
            ...formData,
            provider: e.target.value
          })} placeholder="e.g., NEMSU" required />
            <Input label="Deadline" value={formData.deadline} onChange={e => setFormData({
            ...formData,
            deadline: e.target.value
          })} placeholder="e.g., August 30, 2024" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <select value={formData.type} onChange={e => setFormData({
            ...formData,
            type: e.target.value as any
          })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" required>
              <option value="Merit">Merit</option>
              <option value="Need-based">Need-based</option>
              <option value="Government">Government</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea value={formData.description} onChange={e => setFormData({
            ...formData,
            description: e.target.value
          })} placeholder="Brief description of the scholarship..." className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" required />
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {editingScholarship ? 'Update Scholarship' : 'Create Scholarship'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>;
}