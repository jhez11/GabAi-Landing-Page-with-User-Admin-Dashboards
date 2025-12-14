import React, { useEffect, useState, createContext, useContext } from 'react';
// Data Types
export interface Department {
  id: number;
  name: string;
  dean: string;
  email: string;
  phone: string;
  description: string;
  programs: string[];
  image: string;
}
export interface Course {
  id: number;
  code: string;
  name: string;
  department: string;
  duration: string;
  units: number;
  description: string;
  requirements: string[];
}
export interface Scholarship {
  id: number;
  name: string;
  provider: string;
  deadline: string;
  type: 'Merit' | 'Need-based' | 'Government';
  description: string;
}
export interface MapLocation {
  id: number;
  name: string;
  type: string;
  coords: [number, number];
  description?: string;
}
export interface ChatMessage {
  id: string;
  userId: string;
  messages: Array<{
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
  }>;
  lastUpdated: Date;
}
interface DataContextType {
  departments: Department[];
  courses: Course[];
  scholarships: Scholarship[];
  mapLocations: MapLocation[];
  chatHistory: ChatMessage[];
  // Department methods
  addDepartment: (dept: Omit<Department, 'id'>) => void;
  updateDepartment: (id: number, dept: Partial<Department>) => void;
  deleteDepartment: (id: number) => void;
  // Course methods
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: number, course: Partial<Course>) => void;
  deleteCourse: (id: number) => void;
  // Scholarship methods
  addScholarship: (scholarship: Omit<Scholarship, 'id'>) => void;
  updateScholarship: (id: number, scholarship: Partial<Scholarship>) => void;
  deleteScholarship: (id: number) => void;
  // Map methods
  addMapLocation: (location: Omit<MapLocation, 'id'>) => void;
  updateMapLocation: (id: number, location: Partial<MapLocation>) => void;
  deleteMapLocation: (id: number) => void;
  // Chat methods
  saveChatMessage: (userId: string, message: any) => void;
  getChatHistory: (userId: string) => ChatMessage | undefined;
}
const DataContext = createContext<DataContextType | undefined>(undefined);
// Initial seed data
const initialDepartments: Department[] = [{
  id: 1,
  name: 'College of Engineering',
  dean: 'Engr. Maria Santos, PhD',
  email: 'engineering@nemsu.edu.ph',
  phone: '(086) 123-4567',
  description: 'The College of Engineering is committed to producing globally competitive engineers through quality instruction, research, and extension services.',
  programs: ['BS Civil Engineering', 'BS Mechanical Engineering', 'BS Electrical Engineering', 'BS Electronics Engineering'],
  image: 'https://images.unsplash.com/photo-1581094794329-cdac82a6cc88?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
}, {
  id: 2,
  name: 'College of Computer Studies',
  dean: 'Dr. James Reid',
  email: 'ccs@nemsu.edu.ph',
  phone: '(086) 123-4568',
  description: 'Fostering innovation and technological excellence in information technology and computer science.',
  programs: ['BS Computer Science', 'BS Information Technology', 'BS Information Systems'],
  image: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
}, {
  id: 3,
  name: 'College of Education',
  dean: 'Dr. Sarah Geronimo',
  email: 'education@nemsu.edu.ph',
  phone: '(086) 123-4569',
  description: 'Developing competent and compassionate educators for nation-building.',
  programs: ['Bachelor of Elementary Education', 'Bachelor of Secondary Education', 'Bachelor of Physical Education'],
  image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
}, {
  id: 4,
  name: 'College of Business & Management',
  dean: 'Dr. Coco Martin',
  email: 'business@nemsu.edu.ph',
  phone: '(086) 123-4570',
  description: 'Preparing future business leaders with ethical values and professional competence.',
  programs: ['BS Business Administration', 'BS Hospitality Management', 'BS Tourism Management'],
  image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
}];
const initialCourses: Course[] = [{
  id: 1,
  code: 'BSCS',
  name: 'Bachelor of Science in Computer Science',
  department: 'College of Computer Studies',
  duration: '4 Years',
  units: 148,
  description: 'The BSCS program focuses on the concepts and theories, algorithmic foundations, implementation and application of information and computing solutions.',
  requirements: ['High School Report Card (Form 138)', 'Certificate of Good Moral Character', 'PSA Birth Certificate', 'NCAE Result', '2x2 ID Picture']
}, {
  id: 2,
  code: 'BSCE',
  name: 'Bachelor of Science in Civil Engineering',
  department: 'College of Engineering',
  duration: '4 Years',
  units: 160,
  description: 'A profession that applies basic scientific principles to the design, construction, and maintenance of the physical and naturally built environment.',
  requirements: ['High School Report Card (Form 138)', 'Certificate of Good Moral Character', 'PSA Birth Certificate', 'NCAE Result', 'Math Proficiency Exam']
}, {
  id: 3,
  code: 'BSED-Eng',
  name: 'Bachelor of Secondary Education Major in English',
  department: 'College of Education',
  duration: '4 Years',
  units: 152,
  description: 'Designed to equip future teachers with the necessary knowledge and skills to teach English in the secondary level.',
  requirements: ['High School Report Card (Form 138)', 'Certificate of Good Moral Character', 'PSA Birth Certificate', 'Interview']
}, {
  id: 4,
  code: 'BSBA-FM',
  name: 'BS Business Administration Major in Financial Management',
  department: 'College of Business & Management',
  duration: '4 Years',
  units: 145,
  description: 'Prepares students for careers in financial management in various organizations, including banks, investment firms, and corporations.',
  requirements: ['High School Report Card (Form 138)', 'Certificate of Good Moral Character', 'PSA Birth Certificate']
}];
const initialScholarships: Scholarship[] = [{
  id: 1,
  name: 'Academic Excellence Scholarship',
  provider: 'NEMSU',
  deadline: 'August 30, 2024',
  type: 'Merit',
  description: 'Full tuition grant for students with a GPA of 1.5 or better with no grade lower than 2.0.'
}, {
  id: 2,
  name: 'CHED Tulong Dunong Program',
  provider: 'Commission on Higher Education',
  deadline: 'July 15, 2024',
  type: 'Government',
  description: 'Financial assistance for qualified tertiary students enrolled in recognized programs.'
}, {
  id: 3,
  name: 'Sports Scholarship',
  provider: 'NEMSU Sports Office',
  deadline: 'September 1, 2024',
  type: 'Merit',
  description: 'For varsity athletes who represent the university in regional and national competitions.'
}, {
  id: 4,
  name: 'UNIFAST Tertiary Education Subsidy',
  provider: 'UNIFAST',
  deadline: 'Open',
  type: 'Government',
  description: 'Subsidy for students in state universities and colleges from low-income households.'
}];
const initialMapLocations: MapLocation[] = [{
  id: 1,
  name: 'Main Administration Building',
  type: 'Admin',
  coords: [9.0394, 126.2161],
  description: 'Central administrative offices'
}, {
  id: 2,
  name: 'University Library',
  type: 'Academic',
  coords: [9.0398, 126.2165],
  description: 'Main library with study areas'
}, {
  id: 3,
  name: 'College of Engineering',
  type: 'Academic',
  coords: [9.039, 126.2158],
  description: 'Engineering department building'
}, {
  id: 4,
  name: 'Student Center',
  type: 'Student Services',
  coords: [9.0392, 126.2168],
  description: 'Student activities and services'
}, {
  id: 5,
  name: 'Science Laboratory',
  type: 'Academic',
  coords: [9.04, 126.2155],
  description: 'Science and research labs'
}];
export function DataProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [departments, setDepartments] = useState<Department[]>(() => {
    const stored = localStorage.getItem('gabai_departments');
    return stored ? JSON.parse(stored) : initialDepartments;
  });
  const [courses, setCourses] = useState<Course[]>(() => {
    const stored = localStorage.getItem('gabai_courses');
    return stored ? JSON.parse(stored) : initialCourses;
  });
  const [scholarships, setScholarships] = useState<Scholarship[]>(() => {
    const stored = localStorage.getItem('gabai_scholarships');
    return stored ? JSON.parse(stored) : initialScholarships;
  });
  const [mapLocations, setMapLocations] = useState<MapLocation[]>(() => {
    const stored = localStorage.getItem('gabai_map_locations');
    return stored ? JSON.parse(stored) : initialMapLocations;
  });
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const stored = localStorage.getItem('gabai_chat_history');
    return stored ? JSON.parse(stored) : [];
  });
  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('gabai_departments', JSON.stringify(departments));
  }, [departments]);
  useEffect(() => {
    localStorage.setItem('gabai_courses', JSON.stringify(courses));
  }, [courses]);
  useEffect(() => {
    localStorage.setItem('gabai_scholarships', JSON.stringify(scholarships));
  }, [scholarships]);
  useEffect(() => {
    localStorage.setItem('gabai_map_locations', JSON.stringify(mapLocations));
  }, [mapLocations]);
  useEffect(() => {
    localStorage.setItem('gabai_chat_history', JSON.stringify(chatHistory));
  }, [chatHistory]);
  // Department methods
  const addDepartment = (dept: Omit<Department, 'id'>) => {
    const newDept = {
      ...dept,
      id: Math.max(0, ...departments.map(d => d.id)) + 1
    };
    setDepartments([...departments, newDept]);
  };
  const updateDepartment = (id: number, updates: Partial<Department>) => {
    setDepartments(departments.map(d => d.id === id ? {
      ...d,
      ...updates
    } : d));
  };
  const deleteDepartment = (id: number) => {
    setDepartments(departments.filter(d => d.id !== id));
  };
  // Course methods
  const addCourse = (course: Omit<Course, 'id'>) => {
    const newCourse = {
      ...course,
      id: Math.max(0, ...courses.map(c => c.id)) + 1
    };
    setCourses([...courses, newCourse]);
  };
  const updateCourse = (id: number, updates: Partial<Course>) => {
    setCourses(courses.map(c => c.id === id ? {
      ...c,
      ...updates
    } : c));
  };
  const deleteCourse = (id: number) => {
    setCourses(courses.filter(c => c.id !== id));
  };
  // Scholarship methods
  const addScholarship = (scholarship: Omit<Scholarship, 'id'>) => {
    const newScholarship = {
      ...scholarship,
      id: Math.max(0, ...scholarships.map(s => s.id)) + 1
    };
    setScholarships([...scholarships, newScholarship]);
  };
  const updateScholarship = (id: number, updates: Partial<Scholarship>) => {
    setScholarships(scholarships.map(s => s.id === id ? {
      ...s,
      ...updates
    } : s));
  };
  const deleteScholarship = (id: number) => {
    setScholarships(scholarships.filter(s => s.id !== id));
  };
  // Map methods
  const addMapLocation = (location: Omit<MapLocation, 'id'>) => {
    const newLocation = {
      ...location,
      id: Math.max(0, ...mapLocations.map(l => l.id)) + 1
    };
    setMapLocations([...mapLocations, newLocation]);
  };
  const updateMapLocation = (id: number, updates: Partial<MapLocation>) => {
    setMapLocations(mapLocations.map(l => l.id === id ? {
      ...l,
      ...updates
    } : l));
  };
  const deleteMapLocation = (id: number) => {
    setMapLocations(mapLocations.filter(l => l.id !== id));
  };
  // Chat methods
  const saveChatMessage = (userId: string, message: any) => {
    setChatHistory(prev => {
      const existing = prev.find(ch => ch.userId === userId);
      if (existing) {
        return prev.map(ch => ch.userId === userId ? {
          ...ch,
          messages: [...ch.messages, message],
          lastUpdated: new Date()
        } : ch);
      } else {
        return [...prev, {
          id: Date.now().toString(),
          userId,
          messages: [message],
          lastUpdated: new Date()
        }];
      }
    });
  };
  const getChatHistory = (userId: string) => {
    return chatHistory.find(ch => ch.userId === userId);
  };
  return <DataContext.Provider value={{
    departments,
    courses,
    scholarships,
    mapLocations,
    chatHistory,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    addCourse,
    updateCourse,
    deleteCourse,
    addScholarship,
    updateScholarship,
    deleteScholarship,
    addMapLocation,
    updateMapLocation,
    deleteMapLocation,
    saveChatMessage,
    getChatHistory
  }}>
      {children}
    </DataContext.Provider>;
}
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};