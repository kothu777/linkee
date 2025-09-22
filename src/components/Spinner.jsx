import { Spinner } from "@heroui/react";

export default function SpinnerComponent({ label }) {
  return (
    <Spinner
      classNames={{ label: "text-foreground mt-4" }}
      label={label}
      variant="wave"
      size="lg"
      
    />
  );
}
