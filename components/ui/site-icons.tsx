type IconProps = {
  className?: string;
};

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function UserIcon({ className }: IconProps) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 20c1.4-4 4-6 7-6s5.6 2 7 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function UsersIcon({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 19c1-3.3 3-5 5.5-5s4.5 1.7 5.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15 11a3 3 0 1 0-.6-5.94M16 14c2 .35 3.45 2 4.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function StarIcon({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m12 3 2.7 5.6 6.2.9-4.5 4.35 1.05 6.15L12 17.1 6.55 20l1.05-6.15L3.1 9.5l6.2-.9L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function HeartIcon({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20.4 5.6a5 5 0 0 0-7.1 0L12 6.9l-1.3-1.3a5 5 0 1 0-7.1 7.1L12 21l8.4-8.3a5 5 0 0 0 0-7.1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function PinIcon({ className }: IconProps) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s6-5.3 6-11a6 6 0 1 0-12 0c0 5.7 6 11 6 11Z" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function SpecialtyIcon({ className }: IconProps) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4a6 6 0 0 0-4 10.45V17h8v-2.55A6 6 0 0 0 12 4Z" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
      <path d="M9 20h6M10 17v3M14 17v3M9.5 10.5h5M12 8v5" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
    </svg>
  );
}
