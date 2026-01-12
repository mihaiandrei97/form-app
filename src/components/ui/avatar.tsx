import { cn } from "~/lib/utils";

interface UserAvatarProps {
  name?: string | null;
  email: string;
  className?: string;
}

/**
 * Get initials from name or email
 */
function getInitials(name?: string | null, email?: string): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  }
  if (email) {
    return email[0].toUpperCase();
  }
  return "?";
}

export function UserAvatar({ name, email, className }: UserAvatarProps) {
  const initials = getInitials(name, email);

  return (
    <div
      className={cn(
        "bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
        className,
      )}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}
