import Link from "next/link";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GraduationCap } from "lucide-react";

interface GradeCardProps {
  gradeName: string;
  studentCount: number;
  gradeId?: string; // In a real implementation, this would be the database ID
}

export default function GradeCard({ gradeName, studentCount, gradeId }: GradeCardProps) {
  // Convert grade name to URL-friendly format
  // "Grade 3" -> "grade-3", "Kinder" -> "kinder"
  const gradeSlug = gradeName.toLowerCase().replace(" ", "-");
  const href = `/students/grade/${gradeSlug}`;
  
  return (
    <Link href={href} className="block">
      <Card className={cn(
        "p-6 hover:border-primary transition-all duration-200",
        "hover:shadow-lg cursor-pointer",
        "focus:outline-none focus:ring-4 focus:ring-primary/20"
      )}>
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {gradeName}
          </h3>
          
          <div className="text-3xl font-bold text-primary mb-1">
            {studentCount}
          </div>
          
          <p className="text-sm text-muted-foreground">
            {studentCount === 1 ? "student" : "students"}
          </p>
          
          <div className="mt-4 text-xs text-muted-foreground">
            Click to view roster
          </div>
        </div>
      </Card>
    </Link>
  );
}