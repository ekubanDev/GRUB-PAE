// GRUB-PAE Admin Logo — Ghana Gold G icon + wordmark
export function AppLogo() {
  return (
    <div className="flex items-center justify-center relative p-2">
      <svg
        width="160"
        height="44"
        viewBox="0 0 180 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="adminGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

        {/* Outer glow circle */}
        <circle cx="22" cy="22" r="21" fill="#F59E0B" fillOpacity="0.15" />

        {/* G arc */}
        <path
          d="M 22 4 A 18 18 0 1 1 40 22 L 28 22"
          stroke="url(#adminGoldGrad)"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* G crossbar */}
        <line
          x1="28" y1="22" x2="40" y2="22"
          stroke="url(#adminGoldGrad)"
          strokeWidth="5.5"
          strokeLinecap="round"
        />

        {/* GRUB in dark/light adaptive color */}
        <text
          x="52"
          y="30"
          fontFamily="'SF Pro Display', -apple-system, 'Segoe UI', system-ui, sans-serif"
          fontSize="22"
          fontWeight="800"
          letterSpacing="-0.8"
          className="fill-black dark:fill-white"
        >
          GRUB
        </text>

        {/* -PAE in Ghana Gold */}
        <text
          x="108"
          y="30"
          fontFamily="'SF Pro Display', -apple-system, 'Segoe UI', system-ui, sans-serif"
          fontSize="22"
          fontWeight="800"
          letterSpacing="-0.8"
          fill="#F59E0B"
        >
          -PAE
        </text>
      </svg>
    </div>
  );
}
