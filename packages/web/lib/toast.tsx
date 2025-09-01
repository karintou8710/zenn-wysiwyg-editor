import { CircleAlert, Info } from "lucide-react";
import { toast } from "sonner";

export function showToast(message: string, type: "info" | "error" = "info") {
  if (type === "info") {
    toast(message, { icon: <Info size={16} />, position: "bottom-center" });
  } else if (type === "error") {
    toast.error(message, {
      icon: <CircleAlert size={16} className="text-destructive" />,
      position: "bottom-center",
    });
  }
}
