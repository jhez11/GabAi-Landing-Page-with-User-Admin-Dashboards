import React, { useState } from 'react';
import { Building2, Users, Phone, Mail, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { motion } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
export function Departments() {
  const {
    departments
  } = useData();
  const [selectedDept, setSelectedDept] = useState<any>(null);
  return <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Departments
        </h2>
        <p className="text-sm text-muted-foreground">
          Explore the academic colleges and offices at NEMSU.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {departments.map((dept, index) => <motion.div key={dept.id} initial={{
        opacity: 0,
        scale: 0.95
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        delay: index * 0.1
      }}>
            <Card className="h-full flex flex-col overflow-hidden transition-shadow hover:shadow-lg cursor-pointer">
              <div className="h-40 sm:h-48 overflow-hidden relative">
                <img src={dept.image} alt={dept.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <h3 className="text-white font-bold text-base sm:text-lg">
                    {dept.name}
                  </h3>
                </div>
              </div>
              <CardContent className="flex-1 p-4 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {dept.description}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2 text-primary shrink-0" />
                    <span className="truncate">{dept.dean}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 mr-2 text-primary shrink-0" />
                    <span className="truncate">{dept.email}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button variant="outline" className="w-full" onClick={() => setSelectedDept(dept)}>
                  View Details
                </Button>
              </CardFooter>
            </Card>
          </motion.div>)}
      </div>

      <Modal isOpen={!!selectedDept} onClose={() => setSelectedDept(null)} title={selectedDept?.name || ''}>
        {selectedDept && <div className="space-y-6">
            <div className="relative h-48 sm:h-56 rounded-lg overflow-hidden">
              <img src={selectedDept.image} alt={selectedDept.name} className="w-full h-full object-cover" />
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-2">About the College</h4>
              <p className="text-muted-foreground">
                {selectedDept.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" /> Administration
                </h4>
                <p className="text-sm text-muted-foreground">
                  Dean: {selectedDept.dean}
                </p>
                <p className="text-sm text-muted-foreground">
                  Contact: {selectedDept.phone}
                </p>
                <p className="text-sm text-muted-foreground">
                  Email: {selectedDept.email}
                </p>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Building2 className="h-4 w-4" /> Programs Offered
                </h4>
                <ul className="space-y-1">
                  {selectedDept.programs.map((program: string, i: number) => <li key={i} className="text-sm text-muted-foreground flex items-start">
                      <ChevronRight className="h-3 w-3 mt-1 mr-1 text-primary shrink-0" />
                      <span>{program}</span>
                    </li>)}
                </ul>
              </div>
            </div>
          </div>}
      </Modal>
    </div>;
}