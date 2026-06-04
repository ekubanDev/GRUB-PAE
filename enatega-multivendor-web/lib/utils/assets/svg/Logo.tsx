// GRUB-PAE Logo — Ghana Gold G icon + wordmark
import { useTheme } from "@/lib/providers/ThemeProvider";

const Logo = ({
  fillColor = "#1C1917",
  darkmode = "#FEF3C7",
  className = "",
}) => {
  const { theme } = useTheme();
  const textColor = theme === "dark" ? darkmode : fillColor;

  return (
    <svg
      width="180"
      height="44"
      viewBox="0 0 180 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-32 md:w-36 ${className}`}
    >
      {/* G icon — circular arc with horizontal bar, Ghana Gold */}
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>

      {/* Outer glow circle */}
      <circle cx="22" cy="22" r="21" fill="#F59E0B" fillOpacity="0.12" />

      {/* G arc — 270° from top, clockwise, stops at 3 o'clock */}
      <path
        d="M 22 4 A 18 18 0 1 1 40 22 L 28 22"
        stroke="url(#goldGrad)"
        strokeWidth="5.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* G crossbar — horizontal stroke */}
      <line
        x1="28" y1="22" x2="40" y2="22"
        stroke="url(#goldGrad)"
        strokeWidth="5.5"
        strokeLinecap="round"
      />

      {/* Wordmark: GRUB */}
      <text
        x="52"
        y="30"
        fontFamily="'SF Pro Display', -apple-system, 'Segoe UI', system-ui, sans-serif"
        fontSize="22"
        fontWeight="800"
        letterSpacing="-0.8"
        fill={textColor}
      >
        GRUB
      </text>

      {/* Wordmark: -PAE in Ghana Gold */}
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
  );
};

export default Logo;
