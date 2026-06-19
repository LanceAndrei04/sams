import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TeacherYearlyRecord } from "@/lib/supabase/teacher-yearly-records";

export default function TrainingHistoryTab({ records }: { records: TeacherYearlyRecord[] }) {
  if (records.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-muted-foreground">No training records yet.</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>School Year</TableHead>
              <TableHead>Training Attended</TableHead>
              <TableHead>IPCRF Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.school_year.label}</TableCell>
                <TableCell>{record.training_attended || "-"}</TableCell>
                <TableCell>{record.ipcrf_rating || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
