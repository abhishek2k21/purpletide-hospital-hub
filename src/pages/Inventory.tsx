
import ComingSoon from "@/components/shared/ComingSoon";
import { Package } from "lucide-react";

export default function Inventory() {
  return (
    <ComingSoon
      title="Inventory"
      description="Track and manage hospital inventory and equipment"
      icon={<Package className="w-20 h-20 text-violet-600 dark:text-violet-400" />}
    />
  );
}
