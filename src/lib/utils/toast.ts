import { toast } from "sonner";

export const toastSuccess = (title: string, description: string) => {
     toast(title, {
          description,
          style: { background: "#d1fae5", color: "#065f46" },
          position: "bottom-center",
          descriptionClassName: "text-xs font-medium !text-green-800",
     });
};

export const toastError = (title: string, description: string) => {
     toast(title, {
          description,
          style: { background: "#fee2e2", color: "#82181a" },
          position: "bottom-center",
          descriptionClassName: "text-xs font-medium !text-red-800",
     });
};
