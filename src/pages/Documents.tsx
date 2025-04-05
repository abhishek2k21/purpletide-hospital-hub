
import ComingSoon from "@/components/shared/ComingSoon";
import { FileText } from "lucide-react";

export default function Documents() {
  return (
    <ComingSoon
      title="Documents"
      description="Manage and store patient and hospital documents"
      icon={<FileText className="w-20 h-20 text-violet-600 dark:text-violet-400" />}
    />
  );
}
