
import ComingSoon from "@/components/shared/ComingSoon";
import { CreditCard } from "lucide-react";

export default function Billing() {
  return (
    <ComingSoon
      title="Billing"
      description="Manage patient invoices and payments"
      icon={<CreditCard className="w-20 h-20 text-violet-600 dark:text-violet-400" />}
    />
  );
}
