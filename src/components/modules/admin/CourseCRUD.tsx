import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Modal } from '../../ui/Modal';
import { motion } from 'framer-motion';
import { useData } from '../../../contexts/DataContext';
export function CourseCRUD() {
  const {
    courses,
    addCourse,
    updateCourse,
    deleteCourse
  } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    department: '',
    duration: '',
    units: 0,
    description: '',
    requirements: ''
  });
  const filteredCourses = courses.filter(course => course.name.toLowerCase().includes(searchTerm.toLowerCase()) || course.code.toLowerCase().includes(searchTerm.toLowerCase()));
  const handleAdd = () => {
    setEditingCourse(null);
    setFormData({
      code: '',
      name: '',
      department: '',
      duration: '',
      units: 0,
      description: '',
      requirements: ''
    });
    setIsModalOpen(true);
  };
  const handleEdit = (course: any) => {
    setEditingCourse(course);
    setFormData({
      ...course,
      requirements: course.requirements.join(', ')
    });
    setIsModalOpen(true);
  };
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this course?')) {
      deleteCourse(id);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const courseData = {
      ...formData,
      units: parseInt(formData.units.toString()),
      requirements: formData.requirements.split(',').map(r => r.trim()).filter(r => r)
    };
    if (editingCourse) {
      updateCourse(editingCourse.id, courseData);
    } else {
      addCourse(courseData);
    }
    setIsModalOpen(false);
  };
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Manage Courses
          </h2>
          <p className="text-sm text-muted-foreground">
            Add and modify academic programs and curriculums.
          </p>
        </div>
        <Button onClick={handleAdd} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" /> Add Course
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <GraduationCap className="h-5 w-5" /> Course Offerings (
              {courses.length})
            </CardTitle>
            <div className="w-full sm:w-72">
              <Input placeholder="Search courses..." icon={<Search className="h-4 w-4" />} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
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
                        Code
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Course Name
                      </th>
                      <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Department
                      </th>
                      <th className="hidden sm:table-cell px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Units
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-background divide-y divide-border">
                    {filteredCourses.map((course, index) => <motion.tr key={course.id} initial={{
                    opacity: 0
                  }} animate={{
                    opacity: 1
                  }} transition={{
                    delay: index * 0.05
                  }} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-4 font-bold text-primary text-sm">
                          {course.code}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <div className="font-medium text-sm">
                              {course.name}
                            </div>
                            <div className="text-xs text-muted-foreground lg:hidden">
                              {course.department}
                            </div>
                          </div>
                        </td>
                        <td className="hidden lg:table-cell px-4 py-4 text-sm text-muted-foreground">
                          {course.department}
                        </td>
                        <td className="hidden sm:table-cell px-4 py-4 text-center text-sm">
                          {course.units}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(course)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(course.id)}>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCourse ? 'Edit Course' : 'Add Course'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Course Code" value={formData.code} onChange={e => setFormData({
            ...formData,
            code: e.target.value
          })} placeholder="e.g., BSCS" required />
            <Input label="Duration" value={formData.duration} onChange={e => setFormData({
            ...formData,
            duration: e.target.value
          })} placeholder="e.g., 4 Years" required />
          </div>
          <Input label="Course Name" value={formData.name} onChange={e => setFormData({
          ...formData,
          name: e.target.value
        })} placeholder="e.g., Bachelor of Science in Computer Science" required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Department" value={formData.department} onChange={e => setFormData({
            ...formData,
            department: e.target.value
          })} placeholder="e.g., College of Computer Studies" required />
            <Input label="Total Units" type="number" value={formData.units.toString()} onChange={e => setFormData({
            ...formData,
            units: parseInt(e.target.value) || 0
          })} required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea value={formData.description} onChange={e => setFormData({
            ...formData,
            description: e.target.value
          })} placeholder="Brief description of the course..." className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" required />
          </div>
          <Input label="Requirements (comma-separated)" value={formData.requirements} onChange={e => setFormData({
          ...formData,
          requirements: e.target.value
        })} placeholder="Form 138, Birth Certificate, etc." required />
          <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {editingCourse ? 'Update Course' : 'Create Course'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>;
}