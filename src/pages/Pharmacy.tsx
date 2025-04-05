
import ComingSoon from "@/components/shared/ComingSoon";
import { Pill } from "lucide-react";

export default function Pharmacy() {
  return (
    <ComingSoon
      title="Pharmacy"
      description="Manage medications and prescriptions"
      icon={<Pill className="w-20 h-20 text-violet-600 dark:text-violet-400" />}
    />
  );
}
