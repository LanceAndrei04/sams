// Mock data for teacher management (using dummy data)

// Types based on the data model
export interface Teacher {
  id: string;
  last_name: string;
  first_name: string;
  middle_name?: string;
  employee_number: string;
  designation: string;
  item_status: 'Active' | 'Inactive' | 'On-Leave' | 'Transferred';
  cellphone_number?: string;
  photo_url?: string;
  status: 'active' | 'inactive';
  created_at: string;
}

// Mock data - realistic Filipino teacher names
const mockTeachers: Teacher[] = [
  {
    id: '1',
    last_name: 'Santos',
    first_name: 'Maria',
    middle_name: 'C',
    employee_number: 'T-2024-001',
    designation: 'Master Teacher I',
    item_status: 'Active',
    cellphone_number: '09171234567',
    photo_url: null,
    status: 'active',
    created_at: '2023-06-15T00:00:00Z'
  },
  {
    id: '2',
    last_name: 'Cruz',
    first_name: 'Juan',
    middle_name: 'D',
    employee_number: 'T-2024-002',
    designation: 'Teacher III',
    item_status: 'Active',
    cellphone_number: '09172345678',
    photo_url: null,
    status: 'active',
    created_at: '2023-06-15T00:00:00Z'
  },
  {
    id: '3',
    last_name: 'Reyes',
    first_name: 'Ana',
    middle_name: 'M',
    employee_number: 'T-2024-003',
    designation: 'Head Teacher I',
    item_status: 'Active',
    cellphone_number: '09173456789',
    photo_url: null,
    status: 'active',
    created_at: '2023-06-15T00:00:00Z'
  },
  {
    id: '4',
    last_name: 'Bautista',
    first_name: 'Pedro',
    middle_name: 'S',
    employee_number: 'T-2024-004',
    designation: 'Teacher I',
    item_status: 'Active',
    cellphone_number: '09174567890',
    photo_url: null,
    status: 'active',
    created_at: '2023-07-10T00:00:00Z'
  },
  {
    id: '5',
    last_name: 'Garcia',
    first_name: 'Sofia',
    middle_name: 'L',
    employee_number: 'T-2024-005',
    designation: 'Master Teacher II',
    item_status: 'Active',
    cellphone_number: '09175678901',
    photo_url: null,
    status: 'active',
    created_at: '2023-07-10T00:00:00Z'
  },
  {
    id: '6',
    last_name: 'Aquino',
    first_name: 'Miguel',
    middle_name: 'R',
    employee_number: 'T-2024-006',
    designation: 'Teacher II',
    item_status: 'On-Leave',
    cellphone_number: '09176789012',
    photo_url: null,
    status: 'active',
    created_at: '2023-08-05T00:00:00Z'
  },
  {
    id: '7',
    last_name: 'Dela Cruz',
    first_name: 'Isabella',
    middle_name: 'G',
    employee_number: 'T-2024-007',
    designation: 'Teacher I',
    item_status: 'Active',
    cellphone_number: '09177890123',
    photo_url: null,
    status: 'active',
    created_at: '2023-08-05T00:00:00Z'
  },
  {
    id: '8',
    last_name: 'Fernandez',
    first_name: 'Carlos',
    middle_name: 'T',
    employee_number: 'T-2024-008',
    designation: 'Teacher III',
    item_status: 'Inactive',
    cellphone_number: '09178901234',
    photo_url: null,
    status: 'inactive',
    created_at: '2023-09-01T00:00:00Z'
  },
  {
    id: '9',
    last_name: 'Gonzales',
    first_name: 'Elena',
    middle_name: 'V',
    employee_number: 'T-2024-009',
    designation: 'Master Teacher I',
    item_status: 'Active',
    cellphone_number: '09179012345',
    photo_url: null,
    status: 'active',
    created_at: '2023-09-01T00:00:00Z'
  },
  {
    id: '10',
    last_name: 'Lopez',
    first_name: 'Jose',
    middle_name: 'P',
    employee_number: 'T-2024-010',
    designation: 'Head Teacher II',
    item_status: 'Active',
    cellphone_number: '09170123456',
    photo_url: null,
    status: 'active',
    created_at: '2023-09-15T00:00:00Z'
  },
  {
    id: '11',
    last_name: 'Tan',
    first_name: 'Michael',
    middle_name: 'A',
    employee_number: 'T-2024-011',
    designation: 'Teacher I',
    item_status: 'Transferred',
    cellphone_number: '09171234567',
    photo_url: null,
    status: 'inactive',
    created_at: '2023-10-01T00:00:00Z'
  },
  {
    id: '12',
    last_name: 'Lim',
    first_name: 'Angela',
    middle_name: 'C',
    employee_number: 'T-2024-012',
    designation: 'Teacher II',
    item_status: 'Active',
    cellphone_number: '09172345678',
    photo_url: null,
    status: 'active',
    created_at: '2023-10-01T00:00:00Z'
  }
];

// Get all teachers
export async function getTeachers(): Promise<Teacher[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return sorted by last name
  return [...mockTeachers].sort((a, b) => a.last_name.localeCompare(b.last_name));
}

// Search teachers (client-side filtering)
export function searchTeachers(teachers: Teacher[], query: string): Teacher[] {
  if (!query.trim()) return teachers;
  
  const searchLower = query.toLowerCase();
  return teachers.filter(teacher => 
    teacher.last_name.toLowerCase().includes(searchLower) ||
    teacher.first_name.toLowerCase().includes(searchLower) ||
    teacher.employee_number.toLowerCase().includes(searchLower) ||
    `${teacher.first_name} ${teacher.last_name}`.toLowerCase().includes(searchLower)
  );
}