import React, { useState } from 'react';
import { Search, BookOpen, Clock, Award, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { motion } from 'framer-motion';
interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  duration: string;
  units: number;
  description: string;
  requirements: string[];
}
const courses: Course[] = [{
  id: '1',
  code: 'BSCS',
  name: 'Bachelor of Science in Computer Science',
  department: 'College of Computer Studies',
  duration: '4 Years',
  units: 148,
  description: 'The BSCS program focuses on the concepts and theories, algorithmic foundations, implementation and application of information and computing solutions.',
  requirements: ['High School Report Card (Form 138)', 'Certificate of Good Moral Character', 'PSA Birth Certificate', 'NCAE Result', '2x2 ID Picture']
}, {
  id: '2',
  code: 'BSCE',
  name: 'Bachelor of Science in Civil Engineering',
  department: 'College of Engineering',
  duration: '4 Years',
  units: 160,
  description: 'A profession that applies basic scientific principles to the design, construction, and maintenance of the physical and naturally built environment.',
  requirements: ['High School Report Card (Form 138)', 'Certificate of Good Moral Character', 'PSA Birth Certificate', 'NCAE Result', 'Math Proficiency Exam']
}, {
  id: '3',
  code: 'BSED-Eng',
  name: 'Bachelor of Secondary Education Major in English',
  department: 'College of Education',
  duration: '4 Years',
  units: 152,
  description: 'Designed to equip future teachers with the necessary knowledge and skills to teach English in the secondary level.',
  requirements: ['High School Report Card (Form 138)', 'Certificate of Good Moral Character', 'PSA Birth Certificate', 'Interview']
}, {
  id: '4',
  code: 'BSBA-FM',
  name: 'BS Business Administration Major in Financial Management',
  department: 'College of Business & Management',
  duration: '4 Years',
  units: 145,
  description: 'Prepares students for careers in financial management in various organizations, including banks, investment firms, and corporations.',
  requirements: ['High School Report Card (Form 138)', 'Certificate of Good Moral Character', 'PSA Birth Certificate']
}];
export function Courses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const filteredCourses = courses.filter(course => course.name.toLowerCase().includes(searchTerm.toLowerCase()) || course.code.toLowerCase().includes(searchTerm.toLowerCase()) || course.department.toLowerCase().includes(searchTerm.toLowerCase()));
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Academic Programs
          </h2>
          <p className="text-muted-foreground">
            Browse available courses and requirements.
          </p>
        </div>
        <div className="w-full sm:w-72">
          <Input placeholder="Search courses..." icon={<Search className="h-4 w-4" />} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredCourses.map((course, index) => <motion.div key={course.id} initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: index * 0.05
      }}>
            <Card hover className="cursor-pointer" onClick={() => setSelectedCourse(course)}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {course.code}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {course.department}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{course.name}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                  <div className="flex flex-row md:flex-col gap-4 shrink-0 w-full md:w-auto border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{course.units} Units</span>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-auto">
                      View Requirements
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>)}
      </div>

      <Modal isOpen={!!selectedCourse} onClose={() => setSelectedCourse(null)} title={selectedCourse?.name || ''} size="lg">
        {selectedCourse && <div className="space-y-6">
            <div className="bg-muted/30 p-4 rounded-lg border border-border">
              <h4 className="font-semibold mb-2">Program Overview</h4>
              <p className="text-sm text-muted-foreground">
                {selectedCourse.description}
              </p>
              <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="h-4 w-4 text-primary" />{' '}
                  {selectedCourse.duration}
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <BookOpen className="h-4 w-4 text-primary" />{' '}
                  {selectedCourse.units} Units
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" /> Admission
                Requirements
              </h4>
              <ul className="grid gap-2">
                {selectedCourse.requirements.map((req, i) => <li key={i} className="flex items-start gap-3 p-3 rounded-md bg-background border border-border">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-sm">{req}</span>
                  </li>)}
              </ul>
            </div>
          </div>}
      </Modal>
    </div>;
}