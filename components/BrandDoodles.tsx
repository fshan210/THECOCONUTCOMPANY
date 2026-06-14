type BrandDoodleProps = {
  className?: string;
};

export function CoconutSliceDoodle({ className }: BrandDoodleProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 132 92" fill="none" className={className}>
      <path
        d="M19 52c19 14 53 22 86-12 2 18-7 33-24 39-22 8-51 0-67-15-6-6-5-17 5-12Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M28 55c18 10 41 14 66-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M43 68c-1 4-1 7 1 10M58 72c-1 4-1 7 1 10M73 70c1 4 0 7-2 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M93 22c11-15 26-11 22-1-2 6-10 6-17 10-5 3-8 8-10 13-1-8 0-16 5-22Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="19" cy="26" r="5" stroke="currentColor" strokeWidth="3" />
      <circle cx="39" cy="30" r="3" stroke="currentColor" strokeWidth="3" />
      <circle cx="111" cy="56" r="4" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

export function TenderCoconutDoodle({ className }: BrandDoodleProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 128 128" fill="none" className={className}>
      <path d="M43 42 61 17l24 26" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M31 53c4-11 23-16 39-13 15 2 28 11 30 21 3 20-9 43-32 48-24 5-43-8-48-28-3-11 3-21 11-28Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M39 61c15 8 35 10 54-1M48 53c6 19 5 35-1 48M69 51c6 23 5 41-1 58M87 59c0 16-3 29-9 43" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M89 18 106 4M104 4l12 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="32" r="3" stroke="currentColor" strokeWidth="3" />
      <circle cx="105" cy="43" r="4" stroke="currentColor" strokeWidth="3" />
      <circle cx="18" cy="85" r="4" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

export function PalmLeafDoodle({ className }: BrandDoodleProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 168 108" fill="none" className={className}>
      <path d="M14 91C54 45 101 18 154 14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M37 69c1-20 5-34 16-49M52 58c8-19 16-32 31-45M68 48c13-18 26-29 44-38M85 39c18-15 33-23 56-28M101 31c18-9 33-13 52-14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M32 73c21 0 37 5 52 16M49 61c20 3 34 10 47 23M66 50c19 3 33 9 49 20M86 39c20 2 35 6 51 15M105 30c17 1 31 4 45 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
