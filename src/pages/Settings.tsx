
import ComingSoon from "@/components/shared/ComingSoon";
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <ComingSoon
      title="Settings"
      description="Manage system and user preferences"
      icon={<SettingsIcon className="w-20 h-20 text-violet-600 dark:text-violet-400" />}
    />
  );
}
