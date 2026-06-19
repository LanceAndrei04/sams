export type TeacherItemStatus = "own_station" | "reassigned" | "borrowed" | "clustered";
export type TeacherStatus = "active" | "inactive";

export interface Teacher {
  id: string;
  tin?: string | null;
  last_name: string;
  first_name: string;
  middle_name?: string | null;
  gender?: string | null;
  civil_status?: string | null;
  birthday?: string | null;
  degree_finished?: string | null;
  prc_specialization?: string | null;
  minor_specialization?: string | null;
  post_graduate_degree?: string | null;
  prc_license_number?: string | null;
  philsys_number?: string | null;
  employee_number: string;
  designation?: string | null;
  item_status: TeacherItemStatus;
  original_appointment_date?: string | null;
  current_station_start_date?: string | null;
  cellphone_number?: string | null;
  personal_email?: string | null;
  deped_email?: string | null;
  o365_account?: string | null;
  r4a3_account?: string | null;
  province?: string | null;
  town?: string | null;
  barangay?: string | null;
  street?: string | null;
  photo_url?: string | null;
  status: TeacherStatus;
  created_at: string;
}

export type TeacherUpdate = Omit<Teacher, "id" | "created_at">;

const mockTeachers: Teacher[] = [
  {
    id: "1",
    tin: "123-456-789",
    last_name: "Santos",
    first_name: "Maria",
    middle_name: "C",
    gender: "Female",
    civil_status: "Married",
    birthday: "1985-05-12",
    degree_finished: "Bachelor of Elementary Education",
    prc_specialization: "General Education",
    minor_specialization: "Reading",
    post_graduate_degree: "MA Education",
    prc_license_number: "PRC-1001",
    philsys_number: "PSN-1001",
    employee_number: "T-2024-001",
    designation: "Master Teacher I",
    item_status: "own_station",
    original_appointment_date: "2010-06-01",
    current_station_start_date: "2018-06-04",
    cellphone_number: "09171234567",
    personal_email: "maria.santos@example.com",
    deped_email: "maria.santos@deped.gov.ph",
    o365_account: "maria.santos@deped.gov.ph",
    r4a3_account: "maria.santos@r4a3.deped.gov.ph",
    province: "Cavite",
    town: "Dasmarinas",
    barangay: "San Agustin",
    street: "Rizal Street",
    photo_url: null,
    status: "active",
    created_at: "2023-06-15T00:00:00Z",
  },
  {
    id: "2",
    last_name: "Cruz",
    first_name: "Juan",
    middle_name: "D",
    gender: "Male",
    civil_status: "Single",
    birthday: "1990-09-18",
    degree_finished: "Bachelor of Secondary Education",
    prc_specialization: "Mathematics",
    employee_number: "T-2024-002",
    designation: "Teacher III",
    item_status: "reassigned",
    original_appointment_date: "2015-06-01",
    current_station_start_date: "2021-08-16",
    cellphone_number: "09172345678",
    deped_email: "juan.cruz@deped.gov.ph",
    province: "Laguna",
    town: "Santa Rosa",
    barangay: "Balibago",
    street: "Mabini Avenue",
    photo_url: null,
    status: "active",
    created_at: "2023-06-15T00:00:00Z",
  },
  {
    id: "3",
    last_name: "Reyes",
    first_name: "Ana",
    middle_name: "M",
    gender: "Female",
    civil_status: "Widowed",
    degree_finished: "Bachelor of Science in Education",
    prc_specialization: "Science",
    employee_number: "T-2024-003",
    designation: "Head Teacher I",
    item_status: "borrowed",
    cellphone_number: "09173456789",
    province: "Batangas",
    town: "Lipa",
    barangay: "Sabang",
    photo_url: null,
    status: "active",
    created_at: "2023-06-15T00:00:00Z",
  },
  {
    id: "4",
    last_name: "Bautista",
    first_name: "Pedro",
    employee_number: "T-2024-004",
    designation: "Teacher I",
    item_status: "clustered",
    cellphone_number: "09174567890",
    photo_url: null,
    status: "active",
    created_at: "2023-07-10T00:00:00Z",
  },
  ...["Garcia:Sofia:005", "Aquino:Miguel:006", "Dela Cruz:Isabella:007", "Fernandez:Carlos:008", "Gonzales:Elena:009", "Lopez:Jose:010", "Tan:Michael:011", "Lim:Angela:012"].map((entry, index) => {
    const [last_name, first_name, suffix] = entry.split(":");
    const statuses: TeacherItemStatus[] = ["own_station", "reassigned", "borrowed", "clustered"];
    return {
      id: String(index + 5),
      last_name,
      first_name,
      middle_name: null,
      employee_number: `T-2024-${suffix}`,
      designation: index % 3 === 0 ? "Master Teacher II" : index % 3 === 1 ? "Teacher II" : "Teacher I",
      item_status: statuses[index % statuses.length],
      cellphone_number: `0917${String(index + 5678901).padStart(7, "0")}`,
      photo_url: null,
      status: index === 6 ? "inactive" : "active",
      created_at: "2023-09-01T00:00:00Z",
    } satisfies Teacher;
  }),
];

export async function getTeachers(): Promise<Teacher[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...mockTeachers].sort((a, b) => a.last_name.localeCompare(b.last_name));
}

export async function getTeacherById(id: string): Promise<Teacher | null> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return mockTeachers.find((teacher) => teacher.id === id) ?? null;
}

export async function updateTeacher(id: string, data: TeacherUpdate): Promise<Teacher | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const index = mockTeachers.findIndex((teacher) => teacher.id === id);
  if (index === -1) return null;
  mockTeachers[index] = { ...mockTeachers[index], ...data };
  return mockTeachers[index];
}

export async function checkEmployeeNumberUnique(employeeNumber: string, excludeId?: string) {
  const existing = mockTeachers.find(
    (teacher) => teacher.employee_number === employeeNumber && teacher.id !== excludeId
  );
  return !existing;
}

export function searchTeachers(teachers: Teacher[], query: string): Teacher[] {
  if (!query.trim()) return teachers;
  const searchLower = query.toLowerCase();
  return teachers.filter((teacher) => {
    const fullName = `${teacher.first_name} ${teacher.last_name}`.toLowerCase();
    return (
      teacher.last_name.toLowerCase().includes(searchLower) ||
      teacher.first_name.toLowerCase().includes(searchLower) ||
      teacher.employee_number.toLowerCase().includes(searchLower) ||
      fullName.includes(searchLower)
    );
  });
}
