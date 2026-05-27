import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StatusBadge } from "./StatusBadge";

const wrap = (ui: React.ReactNode) => render(<TooltipProvider>{ui}</TooltipProvider>);

describe("StatusBadge", () => {
  it("renders the Live label for shipped", () => {
    wrap(<StatusBadge status="shipped" />);
    expect(screen.getByText("Live")).toBeInTheDocument();
  });

  it("renders the Needs setup label for setup", () => {
    wrap(<StatusBadge status="setup" />);
    expect(screen.getByText("Needs setup")).toBeInTheDocument();
  });

  it("renders the Coming soon label for soon", () => {
    wrap(<StatusBadge status="soon" />);
    expect(screen.getByText("Coming soon")).toBeInTheDocument();
  });

  it("honors a custom label override", () => {
    wrap(<StatusBadge status="shipped" label="Ready" />);
    expect(screen.getByText("Ready")).toBeInTheDocument();
  });
});
