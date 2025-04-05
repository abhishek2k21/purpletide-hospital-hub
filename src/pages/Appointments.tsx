
import ComingSoon from "@/components/shared/ComingSoon";
import { Calendar } from "lucide-react";

export default function Appointments() {
  return (
    <ComingSoon
      title="Appointments"
      description="Schedule and manage patient appointments"
      icon={<Calendar className="w-20 h-20 text-violet-600 dark:text-violet-400" />}
    />
  );
}
