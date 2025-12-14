import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Mail, Phone, MapPin, Clock, Users } from 'lucide-react';
import { Card, CardContent } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Modal } from '../../ui/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import { useData, Faculty } from '../../../contexts/DataContext';
const positionColors = {
  Dean: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Associate Dean': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Professor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Associate Professor': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Assistant Professor': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Instructor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
};
const positionHierarchy = {
  Dean: 1,
  'Associate Dean': 2,
  Professor: 3,
  'Associate Professor': 4,
  'Assistant Professor': 5,
  Instructor: 6
};
export function FacultyCRUD() {
  const {
    faculty,
    departments,
    addFaculty,
    updateFaculty,
    deleteFaculty
  } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    position: 'Instructor' as Faculty['position'],
    department: '',
    email: '',
    phone: '',
    office: '',
    officeHours: '',
    bio: '',
    researchInterests: '',
    photo: ''
  });
  const deptNames = ['All Departments', ...departments.map(d => d.name)];
  const filteredFaculty = faculty.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All Departments' || f.department === selectedDept;
    return matchesSearch && matchesDept;
  });
  const facultyByDept = deptNames.slice(1).map(dept => ({
    dept,
    members: filteredFaculty.filter(f => f.department === dept)
  }));
  const handleAdd = () => {
    setEditingFaculty(null);
    setFormData({
      name: '',
      position: 'Instructor',
      department: departments[0]?.name || '',
      email: '',
      phone: '',
      office: '',
      officeHours: '',
      bio: '',
      researchInterests: '',
      photo: ''
    });
    setIsModalOpen(true);
  };
  const handleEdit = (facultyMember: Faculty) => {
    setEditingFaculty(facultyMember);
    setFormData({
      name: facultyMember.name,
      position: facultyMember.position,
      department: facultyMember.department,
      email: facultyMember.email,
      phone: facultyMember.phone,
      office: facultyMember.office,
      officeHours: facultyMember.officeHours,
      bio: facultyMember.bio,
      researchInterests: facultyMember.researchInterests.join(', '),
      photo: facultyMember.photo
    });
    setIsModalOpen(true);
  };
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this faculty member?')) {
      deleteFaculty(id);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const facultyData = {
      ...formData,
      researchInterests: formData.researchInterests.split(',').map(r => r.trim()).filter(r => r)
    };
    if (editingFaculty) {
      updateFaculty(editingFaculty.id, facultyData);
    } else {
      addFaculty(facultyData);
    }
    setIsModalOpen(false);
  };
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Faculty Directory
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage faculty members and their information.
          </p>
        </div>
        <Button onClick={handleAdd} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" /> Add Faculty
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input placeholder="Search faculty..." icon={<Search className="h-4 w-4" />} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              {deptNames.map(dept => <option key={dept} value={dept}>
                  {dept}
                </option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Faculty by Department */}
      {selectedDept === 'All Departments' ? facultyByDept.map((group, groupIndex) => group.members.length > 0 && <div key={group.dept} className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">{group.dept}</h3>
                  <span className="text-sm text-muted-foreground">
                    ({group.members.length})
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.members.sort((a, b) => positionHierarchy[a.position] - positionHierarchy[b.position]).map((member, index) => <FacultyCard key={member.id} member={member} index={index} onEdit={handleEdit} onDelete={handleDelete} />)}
                </div>
              </div>) : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFaculty.sort((a, b) => positionHierarchy[a.position] - positionHierarchy[b.position]).map((member, index) => <FacultyCard key={member.id} member={member} index={index} onEdit={handleEdit} onDelete={handleDelete} />)}
        </div>}

      {filteredFaculty.length === 0 && <div className="text-center py-12 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p>No faculty members found</p>
        </div>}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingFaculty ? 'Edit Faculty Member' : 'Add Faculty Member'} size="xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" value={formData.name} onChange={e => setFormData({
            ...formData,
            name: e.target.value
          })} placeholder="Dr. Juan Dela Cruz" required />
            <div className="space-y-2">
              <label className="text-sm font-medium">Position</label>
              <select value={formData.position} onChange={e => setFormData({
              ...formData,
              position: e.target.value as Faculty['position']
            })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" required>
                <option value="Dean">Dean</option>
                <option value="Associate Dean">Associate Dean</option>
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Instructor">Instructor</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Department</label>
            <select value={formData.department} onChange={e => setFormData({
            ...formData,
            department: e.target.value
          })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" required>
              {departments.map(dept => <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Email" type="email" value={formData.email} onChange={e => setFormData({
            ...formData,
            email: e.target.value
          })} placeholder="email@nemsu.edu.ph" required />
            <Input label="Phone" value={formData.phone} onChange={e => setFormData({
            ...formData,
            phone: e.target.value
          })} placeholder="(086) 123-4567" required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Office Location" value={formData.office} onChange={e => setFormData({
            ...formData,
            office: e.target.value
          })} placeholder="Building, Room 101" required />
            <Input label="Office Hours" value={formData.officeHours} onChange={e => setFormData({
            ...formData,
            officeHours: e.target.value
          })} placeholder="Mon-Fri, 2:00 PM - 4:00 PM" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <textarea value={formData.bio} onChange={e => setFormData({
            ...formData,
            bio: e.target.value
          })} placeholder="Brief biography and qualifications..." className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" required />
          </div>

          <Input label="Research Interests (comma-separated)" value={formData.researchInterests} onChange={e => setFormData({
          ...formData,
          researchInterests: e.target.value
        })} placeholder="AI, Machine Learning, Data Science" required />

          <Input label="Photo URL" value={formData.photo} onChange={e => setFormData({
          ...formData,
          photo: e.target.value
        })} placeholder="https://example.com/photo.jpg" required />

          <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {editingFaculty ? 'Update Faculty' : 'Add Faculty'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>;
}
function FacultyCard({
  member,
  index,
  onEdit,
  onDelete
}: {
  member: Faculty;
  index: number;
  onEdit: (member: Faculty) => void;
  onDelete: (id: number) => void;
}) {
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    delay: index * 0.05
  }}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
        <CardContent className="p-0">
          <div className="relative h-32 bg-gradient-to-br from-primary/10 to-secondary/10">
            <img src={member.photo} alt={member.name} className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-24 h-24 rounded-full object-cover border-4 border-background shadow-lg" />
          </div>
          <div className="pt-14 pb-4 px-4 space-y-3">
            <div className="text-center">
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${positionColors[member.position]}`}>
                {member.position}
              </span>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 shrink-0" />
                <span className="truncate">{member.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="truncate">{member.office}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(member)}>
                <Edit className="h-3 w-3 mr-1" /> Edit
              </Button>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => onDelete(member.id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>;
}