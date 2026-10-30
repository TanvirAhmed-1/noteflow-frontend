import React from "react";

export const WalkingIllustration = () => (
  <svg
    viewBox="0 0 400 420"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full max-w-[320px] h-auto select-none"
  >
    {/* Decorative sparkles */}
    <g stroke="#d6d1c7" strokeWidth="1.5" strokeLinecap="round">
      <line x1="88" y1="88" x2="98" y2="92" />
      <line x1="95" y1="85" x2="91" y2="95" />
    </g>
    <g stroke="#d6d1c7" strokeWidth="1.5" strokeLinecap="round">
      <line x1="255" y1="365" x2="265" y2="369" />
      <line x1="262" y1="362" x2="258" y2="372" />
    </g>
    {/* Decorative flower/clover outline */}
    <path
      d="M285 95 C288 89, 296 89, 295 96 C302 95, 302 103, 296 105 C297 112, 289 112, 287 106 C280 107, 280 99, 285 95 Z"
      stroke="#e2ddd5"
      strokeWidth="1.3"
      fill="none"
    />

    {/* Background Plant Leaves */}
    <g>
      {/* Left stem & leaves */}
      <path
        d="M84 328 Q75 265 55 215"
        stroke="#9bb5b8"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M55 215 C45 205, 42 225, 58 232 C50 218, 55 215, 55 215 Z"
        fill="#c8d9db"
      />
      <path d="M66 245 C42 235, 38 255, 68 265 Z" fill="#c8d9db" />
      <path d="M73 275 C48 268, 45 288, 76 294 Z" fill="#c8d9db" />
      <path d="M64 235 C78 218, 92 228, 68 250 Z" fill="#d7e4e6" />

      {/* Right stem & leaves */}
      <path
        d="M86 328 Q96 250 118 180"
        stroke="#9bb5b8"
        strokeWidth="1.5"
        fill="none"
      />
      <path d="M118 180 C110 162, 128 160, 122 184 Z" fill="#c8d9db" />
      <path d="M108 210 C92 192, 106 182, 112 208 Z" fill="#d7e4e6" />
      <path d="M112 220 C132 206, 140 222, 110 232 Z" fill="#c8d9db" />
      <path d="M100 245 C82 230, 94 218, 103 242 Z" fill="#c8d9db" />
      <path d="M102 258 C124 246, 130 262, 99 270 Z" fill="#d7e4e6" />
      <path d="M93 285 C115 275, 120 292, 91 298 Z" fill="#c8d9db" />

      {/* Plant Pot */}
      <path d="M73 325 L97 325 L93 344 L77 344 Z" fill="#d7e4e6" />
    </g>

    {/* Character Walking */}
    <g>
      {/* Back Arm (Right arm swinging forward) */}
      <path d="M210 155 L268 205 L260 214 L202 168 Z" fill="#ff7a00" />
      {/* Forward Hand */}
      <path
        d="M266 206 C276 208, 282 214, 276 217 C270 219, 264 214, 261 212 Z"
        fill="#f5cba7"
      />

      {/* Back Leg (Left leg stepping back) */}
      <path d="M192 225 L125 300 L152 318 L215 235 Z" fill="#70757a" />
      {/* Back Ankle & Shoe */}
      <path d="M128 302 L117 314 L125 320 L136 308 Z" fill="#f5cba7" />
      <path
        d="M115 311 L138 338 C140 340, 136 343, 131 340 L107 318 C105 315, 110 310, 115 311 Z"
        fill="#22252a"
      />

      {/* Front Leg (Right leg stepping forward) */}
      <path d="M188 220 L212 325 L252 323 L222 215 Z" fill="#7d8287" />
      {/* Leg Crease Line */}
      <line
        x1="202"
        y1="230"
        x2="225"
        y2="324"
        stroke="#5f6368"
        strokeWidth="1.2"
      />
      {/* Front Ankle & Shoe */}
      <path d="M232 323 L235 335 L246 335 L244 323 Z" fill="#f5cba7" />
      <path
        d="M231 333 L270 340 C274 341, 273 344, 267 344 L230 344 Z"
        fill="#22252a"
      />

      {/* Inner Black Top */}
      <path d="M192 132 L212 135 L226 205 L190 205 Z" fill="#111315" />

      {/* Orange Coat Body */}
      <path d="M184 130 L204 132 L212 245 L146 245 Z" fill="#ff7a00" />
      {/* Coat Front Edge */}
      <path d="M204 132 L215 135 L228 202 L210 202 Z" fill="#111315" />

      {/* Front Arm (Left arm swinging back) */}
      <path d="M186 136 L132 215 L146 223 L196 152 Z" fill="#ff7a00" />
      {/* Sleeve Cuff Line */}
      <line
        x1="132"
        y1="215"
        x2="146"
        y2="223"
        stroke="#cc6200"
        strokeWidth="1.5"
      />
      {/* Arm Shadow Line */}
      <line
        x1="184"
        y1="168"
        x2="146"
        y2="223"
        stroke="#3c4043"
        strokeWidth="1.2"
      />
      {/* Back Hand */}
      <path
        d="M134 216 L122 232 C120 236, 126 239, 131 234 L142 221 Z"
        fill="#f5cba7"
      />

      {/* Neck & Head */}
      <path d="M196 112 L192 133 L206 135 L206 115 Z" fill="#f5cba7" />
      {/* Neck shadow */}
      <path d="M196 115 L205 122 L195 128 Z" fill="#d9a77d" />
      {/* Face profile */}
      <path
        d="M194 92 C206 90, 215 98, 215 110 C215 120, 208 124, 200 122 L194 114 Z"
        fill="#f5cba7"
      />
      {/* Hair & Bun */}
      <circle cx="185" cy="83" r="10" fill="#16192b" />
      <path
        d="M188 92 C188 84, 202 82, 211 90 C215 93, 214 98, 208 97 C202 97, 198 103, 195 110 C191 106, 188 99, 188 92 Z"
        fill="#16192b"
      />
    </g>

    {/* Ground Line */}
    <line
      x1="48"
      y1="344"
      x2="300"
      y2="344"
      stroke="#3c4043"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

