import { AxiosError } from "axios";
import { toast } from "sonner";

const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.message || error.message || "An error occurred"
    );
  }
  return "An unexpected error occurred";
};

export const useNotify = () => {
  const showSuccess = (message: string) => {
    toast.success("Success", {
      description: message,
      style: {
        backgroundColor: "var(--primary)",
        color: "var(--destructive-foreground)",
        border: "1px solid var(--border)",
      },
    });
  };

  const showError = (message: Error) => {
    toast.error("Error", {
      description: getErrorMessage(message),
      style: {
        backgroundColor: "var(--destructive)",
        color: "var(--destructive-foreground)",
        border: "1px solid var(--border)",
      },
    });
  };

  return { showSuccess, showError };
};
