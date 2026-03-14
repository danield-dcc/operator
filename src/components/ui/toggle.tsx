"use client";

import { Switch } from "@base-ui/react/switch";
import type { ComponentProps } from "react";

type ToggleProps = ComponentProps<typeof Switch.Root> & {
  label?: string;
};

function Toggle({ label, className, ...props }: ToggleProps) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer">
      <Switch.Root
        className="group relative inline-flex h-[22px] w-10 items-center rounded-full bg-border p-[3px] transition-colors data-checked:bg-accent-green"
        {...props}
      >
        <Switch.Thumb className="block h-4 w-4 rounded-full bg-secondary transition-all data-checked:translate-x-[18px] data-checked:bg-page" />
      </Switch.Root>
      {label && (
        <span className="font-mono text-xs text-secondary transition-colors group-has-data-checked:text-accent-green">
          {label}
        </span>
      )}
    </label>
  );
}

export { Toggle, type ToggleProps };
