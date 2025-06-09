import { cn } from "@/lib/utils";

export const List = ({ className, ...props }) => (
  <div className={cn("grid gap-2", className)} {...props} />
);

export const ListItem = ({ className, ...props }) => (
  <div
    className={cn(
      "flex items-center p-4 border rounded-lg transition-colors",
      "hover:bg-accent hover:text-accent-foreground cursor-pointer",
      className
    )}
    {...props}
  />
);

export const ListItemHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1", className)} {...props} />
);

export const ListItemTitle = ({ className, ...props }) => (
  <h3 className={cn("text-sm font-medium leading-none", className)} {...props} />
);

export const ListItemDescription = ({ className, ...props }) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);