import { Card, CardContent } from "@/components/ui/card";
import { Teacher } from "@/lib/supabase/teachers";
import { formatTeacherAddress, formatTeacherValue } from "../teacher-display";

const fields = [
  ["Last Name", "last_name"],
  ["First Name", "first_name"],
  ["Middle Name", "middle_name"],
  ["Gender", "gender"],
  ["Civil Status", "civil_status"],
  ["Birthday", "birthday"],
  ["Cellphone Number", "cellphone_number"],
  ["Personal Email", "personal_email"],
  ["DepEd Email", "deped_email"],
] as const;

export default function PersonalInfoTab({ teacher }: { teacher: Teacher }) {
  return (
    <Card>
      <CardContent className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
        {fields.map(([label, key]) => (
          <div key={key} className="flex flex-col gap-1">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd>{formatTeacherValue(teacher[key])}</dd>
          </div>
        ))}
        <div className="flex flex-col gap-1 md:col-span-2">
          <dt className="text-sm text-muted-foreground">Address</dt>
          <dd>{formatTeacherAddress(teacher)}</dd>
        </div>
      </CardContent>
    </Card>
  );
}
