import { HeroUIProvider as Provider } from "@heroui/react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function HeroUIProvider({ children }: Props) {
  return <Provider>{children}</Provider>;
}
