import { Spinner } from "@heroui/react";

export default function SpinnerComponent({ label }) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Spinner
        classNames={{ label: "text-foreground mt-4" }}
        label={label}
        variant="wave"
        size="lg"
      />
    </div>
  );
}
