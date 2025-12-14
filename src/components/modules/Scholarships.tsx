import React from 'react';
import { Award, Calendar, FileText, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
interface Scholarship {
  id: string;
  name: string;
  provider: string;
  deadline: string;
  type: 'Merit' | 'Need-based' | 'Government';
  description: string;
}
const scholarships: Scholarship[] = [{
  id: '1',
  name: 'Academic Excellence Scholarship',
  provider: 'NEMSU',
  deadline: 'August 30, 2024',
  type: 'Merit',
  description: 'Full tuition grant for students with a GPA of 1.5 or better with no grade lower than 2.0.'
}, {
  id: '2',
  name: 'CHED Tulong Dunong Program',
  provider: 'Commission on Higher Education',
  deadline: 'July 15, 2024',
  type: 'Government',
  description: 'Financial assistance for qualified tertiary students enrolled in recognized programs.'
}, {
  id: '3',
  name: 'Sports Scholarship',
  provider: 'NEMSU Sports Office',
  deadline: 'September 1, 2024',
  type: 'Merit',
  description: 'For varsity athletes who represent the university in regional and national competitions.'
}, {
  id: '4',
  name: 'UNIFAST Tertiary Education Subsidy',
  provider: 'UNIFAST',
  deadline: 'Open',
  type: 'Government',
  description: 'Subsidy for students in state universities and colleges from low-income households.'
}];
export function Scholarships() {
  return <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Scholarships</h2>
        <p className="text-muted-foreground">
          Financial aid opportunities and grants.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scholarships.map((item, index) => <motion.div key={item.id} initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: index * 0.1
      }}>
            <Card className="h-full flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${item.type === 'Merit' ? 'bg-purple-100 text-purple-700' : item.type === 'Government' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {item.type}
                    </span>
                    <CardTitle className="text-xl">{item.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.provider}
                    </p>
                  </div>
                  <div className="bg-primary/5 p-2 rounded-lg">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground mb-4">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-orange-600 bg-orange-50 p-2 rounded w-fit">
                  <Calendar className="h-4 w-4" />
                  Deadline: {item.deadline}
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button className="flex-1">Apply Now</Button>
                <Button variant="outline" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>)}
      </div>
    </div>;
}