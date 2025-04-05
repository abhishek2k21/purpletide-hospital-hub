
import ComingSoon from "@/components/shared/ComingSoon";
import { BarChart3 } from "lucide-react";

export default function Reports() {
  return (
    <ComingSoon
      title="Reports"
      description="Generate and view hospital performance reports"
      icon={<BarChart3 className="w-20 h-20 text-violet-600 dark:text-violet-400" />}
    />
  );
}
