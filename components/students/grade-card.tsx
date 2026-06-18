import Link from "next/link";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GradeCardProps {
  gradeName: string;
  studentCount: number;
  gradeId?: string;
}

export default function GradeCard({ gradeName, studentCount, gradeId }: GradeCardProps) {
  const gradeSlug = gradeName.toLowerCase().replace(" ", "-");
  const href = `/students/grade/${gradeSlug}`;
  
  // Determine color based on grade level
  const getGradeColor = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("kinder")) return "from-red-400 to-red-500";
    if (lower.includes("grade 1") || lower.includes("grade 2") || lower.includes("grade 3")) return "from-green-400 to-green-500";
    if (lower.includes("grade 4") || lower.includes("grade 5") || lower.includes("grade 6")) return "from-blue-400 to-blue-500";
    return "from-purple-400 to-purple-500";
  };
  
  const colorGradient = getGradeColor(gradeName);
  
  return (
    <Link href={href} className="block">
      <div className={cn(
        "rounded-[16px] p-6 min-h-[140px] cursor-pointer",
        "bg-gradient-to-br",
        colorGradient,
        "text-white shadow-[0_20px_50px_-35px_rgba(15,23,42,0.35)]",
        "hover:shadow-[0_25px_60px_-30px_rgba(15,23,42,0.45)] transition-all duration-200",
        "hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-white/30"
      )}>
        <div className="flex flex-col justify-between h-full">
          <h3 className="text-lg font-bold">
            {gradeName}
          </h3>
          
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold">
              {studentCount}
            </div>
            <p className="text-sm opacity-90">
              {studentCount === 1 ? "student" : "students"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}