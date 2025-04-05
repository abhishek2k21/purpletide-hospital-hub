
import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
    </div>
  );
}
