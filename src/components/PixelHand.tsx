export default function PixelHand() {
  return (
    <div className="relative filter drop-shadow-[0_8px_24px_rgba(0,0,255,0.2)]">
      <svg
        width="220"
        height="244"
        viewBox="0 0 433 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-48 h-52 md:w-64 md:h-72"
      >
        {/* Outline Putih Tebal 20px */}
        <path
          d="M140 20 H220 V120 H260 V160 H300 V200 H340 V240 H380 V360 H340 V400 H260 V440 H180 V460 H140 V420 H100 V200 H140 V20 Z"
          fill="white"
          stroke="white"
          strokeWidth="20"
          strokeLinejoin="miter"
        />
        {/* Pixel Cursor Blue #0000FF */}
        <path
          d="M150 30 H210 V130 H250 V170 H290 V210 H330 V250 H370 V350 H330 V390 H250 V430 H170 V450 H130 V410 H90 V190 H130 V130 H150 V30 Z"
          fill="var(--blue)"
        />
        {/* Detail Bayangan Jari */}
        <rect x="210" y="170" width="20" height="120" fill="#0000B8" />
        <rect x="250" y="210" width="20" height="100" fill="#0000B8" />
        <rect x="290" y="250" width="20" height="80" fill="#0000B8" />
      </svg>
    </div>
  );
}