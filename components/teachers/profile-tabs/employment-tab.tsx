import { Card, CardContent } from "@/components/ui/card";
import { Teacher } from "@/lib/supabase/teachers";
import { formatTeacherValue, TeacherItemStatusBadge } from "../teacher-display";

const fields = [
  ["TIN", "tin"],
  ["Employee Number", "employee_number"],
  ["Designation", "designation"],
  ["Degree Finished/Baccalaureate", "degree_finished"],
  ["PRC Specialization", "prc_specialization"],
  ["Minor Specialization", "minor_specialization"],
  ["Post Graduate Degree", "post_graduate_degree"],
  ["PRC License Number", "prc_license_number"],
  ["PhilSys Number", "philsys_number"],
  ["Original Date of Appointment at DepEd", "original_appointment_date"],
  ["Date of First Day of Service (New Station)", "current_station_start_date"],
  ["0365 Account", "o365_account"],
  ["R4A-3 Account", "r4a3_account"],
] as const;

export default function EmploymentTab({ teacher }: { teacher: Teacher }) {
  return (
    <Card>
      <CardContent className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
        {fields.slice(0, 3).map(([label, key]) => (
          <Field key={key} label={label} value={formatTeacherValue(teacher[key])} />
        ))}
        <div className="flex flex-col gap-1">
          <dt className="text-sm text-muted-foreground">Item Status</dt>
          <dd><TeacherItemStatusBadge status={teacher.item_status} /></dd>
        </div>
        {fields.slice(3).map(([label, key]) => (
          <Field key={key} label={label} value={formatTeacherValue(teacher[key])} />
        ))}
      </CardContent>
    </Card>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
