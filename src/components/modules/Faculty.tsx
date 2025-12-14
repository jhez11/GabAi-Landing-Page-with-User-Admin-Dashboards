import React, { useState } from 'react';
import { Search, Mail, Phone, MapPin, Clock, X } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { motion } from 'framer-motion';
import { useData, Faculty as FacultyType } from '../../contexts/DataContext';
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
export function Faculty() {
  const {
    faculty,
    departments
  } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'hierarchy' | 'name'>('hierarchy');
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyType | null>(null);
  const positions = ['Dean', 'Associate Dean', 'Professor', 'Associate Professor', 'Assistant Professor', 'Instructor'];
  const filteredFaculty = faculty.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.position.toLowerCase().includes(searchTerm.toLowerCase()) || f.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || f.department === selectedDept;
    const matchesPosition = selectedPositions.length === 0 || selectedPositions.includes(f.position);
    return matchesSearch && matchesDept && matchesPosition;
  });
  const sortedFaculty = [...filteredFaculty].sort((a, b) => {
    if (sortBy === 'hierarchy') {
      return positionHierarchy[a.position] - positionHierarchy[b.position];
    } else {
      return a.name.localeCompare(b.name);
    }
  });
  const togglePosition = (position: string) => {
    setSelectedPositions(prev => prev.includes(position) ? prev.filter(p => p !== position) : [...prev, position]);
  };
  return <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Faculty Directory
        </h2>
        <p className="text-sm text-muted-foreground">
          Meet our distinguished faculty members.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input placeholder="Search faculty by name, position, or department..." icon={<Search className="h-4 w-4" />} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="All">All Departments</option>
              {departments.map(dept => <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>)}
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as 'hierarchy' | 'name')} className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="hierarchy">Sort by Position</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>

          {/* Position Filters */}
          <div className="flex flex-wrap gap-2">
            {positions.map(position => <button key={position} onClick={() => togglePosition(position)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedPositions.includes(position) ? positionColors[position as keyof typeof positionColors] : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                {position}
                {selectedPositions.includes(position) && <X className="inline-block ml-1 h-3 w-3" />}
              </button>)}
          </div>
        </CardContent>
      </Card>

      {/* Faculty Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {sortedFaculty.map((member, index) => <motion.div key={member.id} initial={{
        opacity: 0,
        scale: 0.95
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        delay: index * 0.05
      }}>
            <Card className="group overflow-hidden cursor-pointer transition-all hover:shadow-xl" onClick={() => setSelectedFaculty(member)}>
              <CardContent className="p-0">
                <div className="relative h-32 bg-gradient-to-br from-primary/10 to-secondary/10">
                  <img src={member.photo} alt={member.name} className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-24 h-24 rounded-full object-cover border-4 border-background shadow-lg group-hover:scale-110 transition-transform" />
                </div>
                <div className="pt-14 pb-4 px-4 space-y-2">
                  <div className="text-center">
                    <h3 className="font-semibold text-base">{member.name}</h3>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${positionColors[member.position]}`}>
                      {member.position}
                    </span>
                  </div>
                  <p className="text-xs text-center text-muted-foreground line-clamp-1">
                    {member.department}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>)}
      </div>

      {sortedFaculty.length === 0 && <div className="text-center py-12 text-muted-foreground">
          <p>No faculty members found matching your filters.</p>
        </div>}

      {/* Faculty Detail Modal */}
      <Modal isOpen={!!selectedFaculty} onClose={() => setSelectedFaculty(null)} title="Faculty Profile" size="lg">
        {selectedFaculty && <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <img src={selectedFaculty.photo} alt={selectedFaculty.name} className="w-32 h-32 rounded-full object-cover shadow-lg" />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-2xl font-bold">{selectedFaculty.name}</h3>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${positionColors[selectedFaculty.position]}`}>
                  {selectedFaculty.position}
                </span>
                <p className="text-muted-foreground mt-2">
                  {selectedFaculty.department}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedFaculty.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedFaculty.phone}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Office</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedFaculty.office}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Office Hours</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedFaculty.officeHours}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Biography</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedFaculty.bio}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Research Interests</h4>
              <div className="flex flex-wrap gap-2">
                {selectedFaculty.researchInterests.map((interest, i) => <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                    {interest}
                  </span>)}
              </div>
            </div>

            <div className="pt-4">
              <Button className="w-full sm:w-auto" onClick={() => window.location.href = `mailto:${selectedFaculty.email}`}>
                <Mail className="h-4 w-4 mr-2" /> Email Professor
              </Button>
            </div>
          </div>}
      </Modal>
    </div>;
}