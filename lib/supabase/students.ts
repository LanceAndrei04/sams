// Mock data for student management (using dummy data instead of Supabase)

// Types based on the data model
export interface SchoolYear {
  id: string;
  label: string;
  is_active: boolean;
}

export interface Grade {
  id: string;
  school_year_id: string;
  name: string;
}

export interface Section {
  id: string;
  grade_id: string;
  name: string;
}

export interface Student {
  id: string;
  section_id: string;
  lrn: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  birthday: string; // ISO date string
  birthplace?: string;
  address?: string;
  father_name?: string;
  mother_name?: string;
  guardian_name?: string;
  contact_number?: string;
  remarks?: string;
  status: 'active' | 'inactive' | 'transferred';
  created_at: string;
  section?: Section;
  grade?: Grade;
}

export interface StudentWithRelations extends Student {
  section?: Section;
  grade?: Grade;
}

// Mock data
const mockGrades: Grade[] = [
  { id: '1', school_year_id: '1', name: 'Kinder' },
  { id: '2', school_year_id: '1', name: 'Grade 1' },
  { id: '3', school_year_id: '1', name: 'Grade 2' },
  { id: '4', school_year_id: '1', name: 'Grade 3' },
  { id: '5', school_year_id: '1', name: 'Grade 4' },
  { id: '6', school_year_id: '1', name: 'Grade 5' },
  { id: '7', school_year_id: '1', name: 'Grade 6' },
];

const mockSections: Section[] = [
  { id: '1', grade_id: '1', name: 'Morning Class' },
  { id: '2', grade_id: '1', name: 'Afternoon Class' },
  { id: '3', grade_id: '2', name: 'Section A' },
  { id: '4', grade_id: '2', name: 'Section B' },
  { id: '5', grade_id: '3', name: 'Section A' },
  { id: '6', grade_id: '3', name: 'Section B' },
  { id: '7', grade_id: '4', name: 'Section A' },
  { id: '8', grade_id: '4', name: 'Section B' },
  { id: '9', grade_id: '5', name: 'Section A' },
  { id: '10', grade_id: '5', name: 'Section B' },
  { id: '11', grade_id: '6', name: 'Section A' },
  { id: '12', grade_id: '6', name: 'Section B' },
  { id: '13', grade_id: '7', name: 'Section A' },
  { id: '14', grade_id: '7', name: 'Section B' },
];

// Generate mock students
function generateMockStudents(): StudentWithRelations[] {
  const firstNames = ['Maria', 'Juan', 'Ana', 'Pedro', 'Sofia', 'Miguel', 'Isabella', 'Carlos', 'Elena', 'Jose'];
  const lastNames = ['Santos', 'Cruz', 'Reyes', 'Bautista', 'Garcia', 'Aquino', 'Dela Cruz', 'Fernandez', 'Gonzales', 'Lopez'];
  const middleInitials = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  
  const students: StudentWithRelations[] = [];
  let studentId = 1;
  
  mockSections.forEach((section, index) => {
    const grade = mockGrades.find(g => g.id === section.grade_id);
    if (!grade) return;
    
    // Generate 5-10 students per section
    const numStudents = 5 + Math.floor(Math.random() * 6);
    
    for (let i = 0; i < numStudents; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const middleName = middleInitials[Math.floor(Math.random() * middleInitials.length)];
      const lrn = `2024${String(studentId).padStart(8, '0')}`;
      
      students.push({
        id: String(studentId),
        section_id: section.id,
        lrn,
        first_name: firstName,
        last_name: lastName,
        middle_name: middleName,
        birthday: `201${Math.floor(Math.random() * 3)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        birthplace: 'Manila',
        address: `${Math.floor(Math.random() * 100) + 1} Sample Street, Barangay ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
        father_name: `Mr. ${lastName}`,
        mother_name: `Mrs. ${lastName}`,
        guardian_name: `Mr./Mrs. ${lastName}`,
        contact_number: `09${Math.floor(Math.random() * 900000000) + 100000000}`,
        remarks: Math.random() > 0.7 ? 'Special needs assistance required' : '',
        status: Math.random() > 0.9 ? 'inactive' : 'active',
        created_at: '2024-01-15T00:00:00Z',
        section: section,
        grade: grade,
      });
      
      studentId++;
    }
  });
  
  return students;
}

const mockStudents = generateMockStudents();

// Get active school year
export async function getActiveSchoolYear(): Promise<SchoolYear | null> {
  return {
    id: '1',
    label: '2024-2025',
    is_active: true,
  };
}

// Get all grades for active school year
export async function getGradesForActiveYear(): Promise<Grade[]> {
  return mockGrades;
}

// Get sections for a specific grade
export async function getSectionsByGrade(gradeId: string): Promise<Section[]> {
  return mockSections.filter(section => section.grade_id === gradeId);
}

// Get student counts by grade for active school year
export async function getStudentCountsByGrade(): Promise<Record<string, number>> {
  console.log("[getStudentCountsByGrade] Calculating student counts...");
  const counts: Record<string, number> = {};
  
  mockGrades.forEach(grade => {
    const gradeStudents = mockStudents.filter(student => 
      student.section?.grade_id === grade.id && student.status === 'active'
    );
    counts[grade.name] = gradeStudents.length;
    console.log(`[getStudentCountsByGrade] Grade ${grade.name}: ${gradeStudents.length} students`);
  });
  
  console.log("[getStudentCountsByGrade] Final counts:", counts);
  return counts;
}

// Get students by grade ID
export async function getStudentsByGrade(gradeId: string): Promise<StudentWithRelations[]> {
  console.log(`[getStudentsByGrade] Fetching students for grade ID: ${gradeId}`);
  const students = mockStudents
    .filter(student => student.grade?.id === gradeId)
    .sort((a, b) => a.last_name.localeCompare(b.last_name));
  console.log(`[getStudentsByGrade] Found ${students.length} students for grade ${gradeId}`);
  return students;
}

// Search students across active school year
export async function searchStudents(query: string): Promise<StudentWithRelations[]> {
  if (!query.trim()) return [];
  
  const searchLower = query.toLowerCase();
  return mockStudents
    .filter(student => 
      student.status === 'active' && (
        student.lrn.toLowerCase().includes(searchLower) ||
        student.first_name.toLowerCase().includes(searchLower) ||
        student.last_name.toLowerCase().includes(searchLower) ||
        `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchLower)
      )
    )
    .slice(0, 10);
}

// Get student by ID
export async function getStudentById(id: string): Promise<StudentWithRelations | null> {
  return mockStudents.find(student => student.id === id) || null;
}

// Check if LRN is unique
export async function checkLRNUnique(lrn: string, excludeId?: string): Promise<boolean> {
  const existingStudent = mockStudents.find(student => 
    student.lrn === lrn && (!excludeId || student.id !== excludeId)
  );
  return !existingStudent;
}

// Create new student (mock - just logs to console)
export async function createStudent(studentData: Omit<Student, 'id' | 'created_at'>): Promise<Student | null> {
  console.log('Creating student:', studentData);
  
  // In a real app, this would return the created student
  // For mock purposes, return a mock response
  const newId = String(mockStudents.length + 1);
  const grade = mockGrades.find(g => {
    const section = mockSections.find(s => s.id === studentData.section_id);
    return section?.grade_id === g.id;
  });
  
  const section = mockSections.find(s => s.id === studentData.section_id);
  
  const newStudent: StudentWithRelations = {
    id: newId,
    ...studentData,
    created_at: new Date().toISOString(),
    section: section!,
    grade: grade!,
  };
  
  // Add to mock data (in memory only)
  mockStudents.push(newStudent);
  
  return newStudent;
}

// Update student (mock - just logs to console)
export async function updateStudent(id: string, studentData: Partial<Student>): Promise<Student | null> {
  console.log('Updating student:', id, studentData);
  
  const index = mockStudents.findIndex(student => student.id === id);
  if (index === -1) return null;
  
  // Update the student
  mockStudents[index] = {
    ...mockStudents[index],
    ...studentData,
  };
  
  return mockStudents[index];
}