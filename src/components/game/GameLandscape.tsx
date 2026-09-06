type GameLandscapeProps = {
  chapter?: number;
  className?: string;
  compact?: boolean;
};

type TreeProps = {
  x: number;
  y: number;
  scale?: number;
  light?: boolean;
};

function Pine({ x, y, scale = 1, light = false }: TreeProps) {
  const leaves = light ? "#789585" : "#345a4a";
  const shade = light ? "#567966" : "#254d42";
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M-9 8C-5-26-8-48 2-80L7-112l5 2-2 36C3-45 5-20 8 8Z" fill="#6a7160" />
      <path d="m0-30-27-26m29-3 30-24M6-79l-23-25m23 10 24-22" fill="none" stroke="#6a7160" strokeWidth="5" strokeLinecap="round" />
      <path d="M-50-48q3-12 17-12-1-15 14-13 8-12 21-3 10-10 20-4 7 6 5 12 15-2 20 12-20 12-97 8Z" fill={leaves} />
      <path d="M-26-77q-5-11 8-17 2-11 16-11 10-12 18-2 17-5 23 7 18 4 17 16-31 9-82 7Z" fill={shade} />
      <path d="M-32-105q-1-9 9-13 2-12 14-12 3-10 16-5 10-7 15 5 14 0 19 12 15-1 18 8-27 9-91 5Z" fill={leaves} />
      <path d="M-39-53q36 4 74-5M-17-84q25 3 61-4m-65-23q34 3 62-5" fill="none" stroke="#aec0a5" strokeWidth="1.3" opacity=".36" />
      <path d="m-15-60 3 5m12-8 2 6m12-8 3 6m-29-29 3 4m17-7 3 5m-18-31 3 5m13-8 3 6" stroke="#c6ccb3" strokeWidth=".7" opacity=".48" />
    </g>
  );
}

function Scholar({ x, y, scale = 1, color = "#526659", master = false }: TreeProps & { color?: string; master?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cy="2" rx="10" ry="2.4" fill="#465d48" opacity=".13" />
      <path d="m-3-10-3 12h4l2-12m2 0 1 12h4l-2-12" fill="#4f5547" />
      <path d="m-4-32-7 9 3 4 4-5-6 19q10 4 19 0L4-26l5 5 3-3-8-8Z" fill={color} />
      <path d="m-4-30 4 8 4-8M0-22v17m-7-10 14 1" fill="none" stroke="#e0dac4" strokeWidth="1" opacity=".65" />
      <path d="M-3-33v-5q4-5 7 0v5l-3 3Z" fill="#bea17c" />
      <path d="M-4-37q0-8 7-5l3 5Z" fill="#444b41" />
      {master ? (
        <>
          <path d="M-4-41h10v-3H-4Z" fill="#444b41" />
          <path d="m2-33 1 9 3-9" fill="#6e7061" />
          <path d="m12-26-1 28" stroke="#6b644e" strokeWidth="1.6" />
        </>
      ) : (
        <path d="M0-43v-3h3v4" fill="#444b41" />
      )}
    </g>
  );
}

function Hall({ x, y, scale = 1, small = false }: { x: number; y: number; scale?: number; small?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="m-6 64 185 1 19 13-190 1-17-8Z" fill="#b7baa0" />
      <path d="M5 54h167v15H5Z" fill="#aeb097" />
      <path d="M9 15h158v43H9Z" fill="#d9d3b8" />
      <path d="M9 15h158v8H9Z" fill="#9c9275" />
      <path d="M20 24h31v33H20Zm52 0h32v33H72Zm53 0h31v33h-31Z" fill="#7b8268" />
      <path d="M23 26h25v15H23Zm52 0h26v15H75Zm53 0h25v15h-25Z" fill="#555f4f" />
      <path d="M27 26v15m6-15v15m7-15v15m5-15v15m34-15v15m7-15v15m7-15v15m6-15v15m33-15v15m7-15v15m7-15v15" fill="none" stroke="#c7c2a4" strokeWidth="1.2" />
      <path d="M16 14v46m39-46v46m14-46v46m39-46v46m13-46v46m39-46v46" stroke="#8d7758" strokeWidth="4" />
      <path d="m-10 16 28-13 31-24h77l32 23 30 14-19 5H4Z" fill="#526451" />
      <path d="M-10 16C18 14 33-2 48-23h77c16 20 35 36 63 39M48-23h77" fill="none" stroke="#334f42" strokeWidth="3" strokeLinecap="round" />
      <path d="m21 2 136 1M9 10h165M29-5h120M38-13h100" fill="none" stroke="#86927b" strokeWidth="1" />
      <path d="m52-19-9 33m21-33-5 33m18-33-2 33m16-33 2 33m10-33 8 33m4-33 14 33" fill="none" stroke="#394f41" strokeWidth=".7" opacity=".7" />
      <path d="M-11 14q-8 0-10-7m211 7q8 0 10-7M47-24l-6-5m85 5 6-5" fill="none" stroke="#435746" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M7 68h168M13 73h172" stroke="#e3dfc6" strokeWidth="1" />
      {!small && <path d="M84 40h9v18h-9Z" fill="#dad1b2" opacity=".5" />}
    </g>
  );
}

/** A self-contained landscape scroll; all story labels and controls live outside the artwork. */
export function GameLandscape({ chapter = 0, className, compact = false }: GameLandscapeProps) {
  const scene = Math.max(0, Math.min(5, chapter));
  const id = `journey-landscape-${scene}-${compact ? "small" : "wide"}`;
  const autumn = scene >= 4;
  const lateDay = scene === 3 || scene === 5;
  const sunX = 838 - scene * 32;

  return (
    <svg
      className={className}
      viewBox={compact ? "120 100 1000 480" : "0 0 1200 640"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="青绿山水之间，孔子与弟子沿着溪畔古道走向讲学庭院"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="600" y1="0" x2="600" y2="640" gradientUnits="userSpaceOnUse">
          <stop stopColor={lateDay ? "#e8e7d8" : "#eaf0e8"} />
          <stop offset=".55" stopColor="#e5eadd" />
          <stop offset="1" stopColor="#dfe5d8" />
        </linearGradient>
        <linearGradient id={`${id}-mountain`} x1="530" y1="140" x2="610" y2="411" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8aa58e" />
          <stop offset=".55" stopColor="#a2b39a" />
          <stop offset="1" stopColor="#d7dfcd" />
        </linearGradient>
        <linearGradient id={`${id}-ridge`} x1="860" y1="215" x2="893" y2="419" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6f927c" />
          <stop offset="1" stopColor="#c6d0b9" />
        </linearGradient>
        <linearGradient id={`${id}-land`} x1="594" y1="317" x2="605" y2="644" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c9d0ac" />
          <stop offset=".4" stopColor="#bac79f" />
          <stop offset="1" stopColor="#92ad88" />
        </linearGradient>
        <linearGradient id={`${id}-river`} x1="546" y1="364" x2="223" y2="636" gradientUnits="userSpaceOnUse">
          <stop stopColor="#dbe6d4" />
          <stop offset=".45" stopColor="#aac7b9" />
          <stop offset="1" stopColor="#80ac9f" />
        </linearGradient>
        <linearGradient id={`${id}-road`} x1="660" y1="379" x2="639" y2="640" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ded9b6" />
          <stop offset="1" stopColor="#e2d6ad" />
        </linearGradient>
        <linearGradient id={`${id}-mist`} x1="600" y1="228" x2="600" y2="411" gradientUnits="userSpaceOnUse">
          <stop stopColor="#eef1e7" stopOpacity="0" />
          <stop offset=".57" stopColor="#eef1e7" stopOpacity=".8" />
          <stop offset="1" stopColor="#eef1e7" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-sun`}>
          <stop stopColor="#eddeb0" stopOpacity=".65" />
          <stop offset="1" stopColor="#eddeb0" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-soft`} x="-20%" y="-100%" width="140%" height="300%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <pattern id={`${id}-paper`} patternUnits="userSpaceOnUse" width="7" height="7">
          <circle cx="1" cy="1" r=".5" fill="#345a43" opacity=".04" />
          <circle cx="5" cy="4" r=".4" fill="#fff" opacity=".22" />
        </pattern>
      </defs>

      <path fill={`url(#${id}-sky)`} d="M0 0h1200v640H0z" />
      <circle cx={sunX} cy={143 + scene * 8} r="112" fill={`url(#${id}-sun)`} />
      <circle cx={sunX} cy={143 + scene * 8} r="31" fill={lateDay ? "#d5b67c" : "#decba0"} opacity=".42" />

      {/* Mountains are built from individual mineral-green washes. */}
      <path d="M-40 296 24 252 49 261 110 183 135 208 189 162 225 205 270 221 316 184 358 215 405 170 446 184 489 126 509 137 541 89 565 138 590 125 626 178 667 155 703 205 739 175 777 202 811 157 845 186 871 155 914 204 955 197 1001 236 1063 184 1110 220 1158 197 1228 253v157H-40Z" fill="#c9d6c6" opacity=".8" />
      <path d="M-40 315 41 281 91 303 151 254 198 279 246 241 291 269 345 211 367 236 404 194 436 229 465 193 485 202 518 157 548 185 569 163 608 221 646 205 680 235 715 219 759 251 790 232 823 267 869 228 899 252 942 231 976 280 1029 247 1086 285 1128 248 1234 318v109H-40Z" fill={`url(#${id}-mountain)`} />
      <path d="m244 308 95-98 20 48 37-45 30 54 39-72 15 52 38-89-13 99 36-72-13 90 40-109-17 93 47-38 28 76 37-38 44 66Z" fill="#638670" opacity=".19" />
      <path d="m518 158-6 90-38 63m76-125-15 80-19 45m52-144 8 91 35 63M343 215l20 72-8 37m52-127 6 85 31 37" fill="none" stroke="#6e9179" strokeWidth="1" opacity=".38" />
      <path d="M720 363q29-60 70-86l44-74 29 45 32-32 35 57 42-19 44 55 48-3 57 32 44-39 48 20 68-29v139H699Z" fill={`url(#${id}-ridge)`} />
      <path d="m834 203-14 99 24 26m53-110-3 78 42 41m-7-66 23 69m-166-39 36 32" fill="none" stroke="#63876f" strokeWidth="1.1" opacity=".55" />
      <path d="m834 205 29 46-26 55 26 21-52 26-23-24 28-52Zm62 14 36 56-20 38 38 37-61-16 12-40Z" fill="#537b65" opacity=".16" />
      <path d="M-35 365 38 312 74 319 128 276 177 313 213 299 249 339 298 320 351 367 403 364 470 400H-35Z" fill="#a1b69a" />
      <path d="m128 278 22 62 52 38m-128-56 35 34m103-55 10 42 30 27" fill="none" stroke="#759b7d" strokeWidth="1" opacity=".5" />

      <path d="M-20 220h1240v207H-20Z" fill={`url(#${id}-mist)`} />
      <g fill="#f1f2e8" opacity=".48" filter={`url(#${id}-soft)`}>
        <ellipse cx="388" cy="305" rx="203" ry="14" />
        <ellipse cx="850" cy="337" rx="229" ry="16" />
        <ellipse cx="157" cy="362" rx="220" ry="11" />
      </g>
      <path d="M677 173q7-7 15 0m0 0q7-7 14 0m35 18q5-5 10 0m0 0q6-5 11 0M620 203q4-4 9 0m0 0q4-4 9 0" stroke="#748b77" strokeWidth="1.4" strokeLinecap="round" opacity=".55" />

      {/* The river and road meet at the bridge before the learning courtyard. */}
      <path d="M-30 442q152-74 313-65 67 3 160-10 124-25 205-22 178-17 283 33 126 22 298 30v247H-30Z" fill={`url(#${id}-land)`} />
      <path d="M-20 440q133-60 263-41t209-11q124-38 253-19 204 12 296 63 102 47 231 41" stroke="#e1e2c6" strokeWidth="2" opacity=".6" />
      <path d="M537 365c-69 26-114 45-147 58-57 23-90 46-105 73-26 43-107 50-140 82-34 30-73 45-163 47v41h346c-48-39-38-62 6-91 50-35 97-55 66-86-28-31 10-48 47-76l116-47Z" fill={`url(#${id}-river)`} />
      <path d="M531 368c-69 26-131 53-160 68-41 22-69 43-80 61-31 45-128 61-153 83-25 24-73 45-126 46m551-260c-64 40-84 59-126 87-29 23-53 38-28 59 30 26-18 46-59 76-32 22-49 38-40 56" stroke="#edf0d9" strokeWidth="2.5" opacity=".7" />
      <g stroke="#e2ece0" strokeWidth="1.3" strokeLinecap="round" opacity=".68">
        <path d="M371 450h26m-41 8h18m-60 43h28m9 7h21m-45 36h43m-76 13h34m-113 32h42m-19 12h25m-85 15h60m-110 17h66m91-18h19m111-147h16m-1 10h27" />
        <path d="m397 427 32-1m-1 5h17m-83 103h20M194 579h17m-92 40h31" />
      </g>
      <path d="M618 645c-103-61-129-109-111-142 18-35 79-46 95-70 13-19-4-36-8-44l26-7c10 22 25 48 0 75-23 27-70 35-66 66 2 29 56 77 145 122Z" fill={`url(#${id}-road)`} />
      <path d="M618 645c-99-61-125-107-107-141 20-39 76-45 95-69 15-19-1-39-8-44m19-5c11 24 21 47-4 72-23 25-72 35-63 66 9 36 61 78 143 121" fill="none" stroke="#aaab83" strokeWidth="1.2" opacity=".56" />
      <path d="M591 598h16m-32-18 10 2m-43-52 10-1m10-43 12-2m-1 63 15 5m-45-31 8 1m-6-20 6-3" stroke="#b7ad81" strokeWidth="1.5" strokeLinecap="round" opacity=".5" />

      {/* Low walls and timber halls suggest an early Chinese learning courtyard. */}
      <g transform="translate(583 311)">
        <path d="m-25 60 127-27 186 50-125 49Z" fill="#c0bea0" opacity=".52" />
        <path d="m-13 47 111-25 159 42-111 46Z" fill="#e0d9b9" />
        <path d="m-13 47 1 23 150 46v-22Z" fill="#bcb99b" />
        <path d="m138 94 118-35v21l-118 36Z" fill="#a8ab8d" />
        <path d="m-17 45 153 47 124-35 1 7-125 36L-17 51Z" fill="#747e60" />
        <path d="m129 89 20 6v24l-20-7Z" fill="#e0d4ae" />
        <path d="m133 94 11 4v18l-11-4Z" fill="#667154" />
        <Hall x={31} y={-22} scale={0.93} />
        <Hall x={-37} y={13} scale={0.43} small />
        <path d="m-7 37 58 17v18L-7 54Z" fill="#d7cfab" />
        <path d="m-14 34 62 19 13-5-60-22Z" fill="#66785d" />
        <path d="m-11 34 58 18 13-5" stroke="#3e5c47" strokeWidth="1.8" />
        <path d="m7 43 1 15m15-10v15m14-11v16" stroke="#9b8661" strokeWidth="2.4" />
        <path d="m62 85 32-10 40 11-32 11Z" fill="#c1b88f" opacity=".75" />
        <path d="m72 85 23-7 28 8-23 8Z" fill="#a0a482" />
        <path d="M173 67h9v11h-9Z" fill="#b6a27b" />
        <path d="M170 66h15l-3-5h-8Z" fill="#85906d" />
        <path d="m99 97 14 4m-50-23 9 3m94-8 8-2" stroke="#f0e8cf" strokeWidth="1" />
      </g>

      <g opacity=".67">
        <Pine x={906} y={374} scale={0.63} light />
        <Pine x={876} y={373} scale={0.4} light />
        <Pine x={944} y={389} scale={0.5} light />
        <Pine x={536} y={352} scale={0.38} light />
        <Pine x={505} y={363} scale={0.28} light />
        <Pine x={556} y={348} scale={0.24} light />
      </g>
      <g transform="translate(199 368) scale(.45)" opacity=".8">
        <Hall x={0} y={0} small />
        <Hall x={-106} y={26} scale={0.64} small />
        <path d="M-64 79v21m25-21v21M-75 84h48m-48 9h48" stroke="#948e6b" strokeWidth="2" />
      </g>
      <path d="m40 453 137-29 77 6-128 38Zm116 28 103-35 49 7-97 40Z" fill="#adb98f" />
      <path d="m57 453 126-25m-108 30 126-28m-88 33 122-29m-60 44 85-29m-66 34 86-30" stroke="#91a27b" strokeWidth="1" opacity=".58" />

      {/* Stone bridge: a small human passage within a larger landscape. */}
      <g transform="translate(338 477) rotate(-12)">
        <path d="M-44 8C-22-29 24-27 52 9l-2 10C20-13-15-15-42 20Z" fill="#9ba78d" />
        <path d="M-43 7C-17-23 22-24 52 8" stroke="#e5e1c4" strokeWidth="5" />
        <path d="M-42 6C-16-24 23-25 52 7" stroke="#adb297" strokeWidth="1.4" />
        <path d="M-39-1v-15m18 2v-15m21 8v-15m21 18v-15m23 22v-15" stroke="#89967f" strokeWidth="3.5" />
        <path d="M-42-14C-16-39 24-39 46-13" stroke="#b9bea3" strokeWidth="3" />
        <path d="m-33 9 3 7m9-20 4 8m9-13 2 8m12-8-1 8m14-3-3 7m14 0-4 7" stroke="#d6d9bb" strokeWidth="1.1" />
      </g>
      <path d="m302 507 19 3m51-2 21 2" stroke="#6b978b" strokeWidth="1.7" opacity=".6" />

      {/* Study under a spreading gingko / spring tree. */}
      <g transform="translate(768 458)">
        <ellipse cx="-3" cy="3" rx="70" ry="15" fill="#5a7753" opacity=".13" />
        <path d="M-7 1c7-31 5-56-3-91l9-3C9-49 1-20 7 2Z" fill="#7d7960" />
        <path d="m-1-33 28-30m-30 9-31-24m31 13 5-38m-9 18-29-28" stroke="#7d7960" strokeWidth="4" strokeLinecap="round" />
        <path d="M-65-74q-15-23 8-33 0-26 27-26 18-22 39-8 19-9 31 6 26-2 29 22 27 9 13 33-4 20-24 19-17 14-33 4-25 10-43-1-24 12-47-16Z" fill={autumn ? "#c5b775" : "#a6b985"} />
        <path d="M-54-104q14-23 37-16 16-18 36-7m-61 46q20 8 36-2m25-23q15 14 36 5m-47 31q21 8 35-6" stroke={autumn ? "#ded299" : "#c7d2a4"} strokeWidth="9" strokeLinecap="round" opacity=".48" />
        <g fill={autumn ? "#dfd092" : "#cbd5aa"} opacity=".75">
          <ellipse cx="-37" cy="-104" rx="4" ry="2" transform="rotate(-21 -37 -104)" />
          <ellipse cx="-15" cy="-128" rx="4" ry="2" transform="rotate(22 -15 -128)" />
          <ellipse cx="17" cy="-119" rx="4" ry="2" transform="rotate(-26 17 -119)" />
          <ellipse cx="-49" cy="-83" rx="4" ry="2" />
          <ellipse cx="37" cy="-88" rx="4" ry="2" transform="rotate(21 37 -88)" />
          <ellipse cx="12" cy="-70" rx="4" ry="2" />
        </g>
        <path d="m-9-62 4 24-3 28m7-58 15-15" stroke="#a89c79" strokeWidth="1" />
        <g transform="translate(-44 2)">
          <path d="m-22-2 34-6 18 9-34 7Z" fill="#9b8b61" />
          <path d="M-17 1v8m32-10v8" stroke="#7e7956" strokeWidth="3" />
          <path d="m-8-3 13-2 7 3-13 2Z" fill="#dcd0a7" />
          <path d="m-6-3 6 3m-2-4 6 3m-2-4 6 3" stroke="#aa9b72" strokeWidth=".55" />
        </g>
        <Scholar x={-13} y={7} scale={0.79} master color="#dedbc4" />
        <Scholar x={-62} y={13} scale={0.65} color="#71876a" />
        <Scholar x={-37} y={22} scale={0.62} color="#a49369" />
      </g>

      <g transform="translate(484 473)">
        <Scholar x={0} y={0} scale={0.93} master color="#e5dec5" />
        <Scholar x={-25} y={19} scale={0.75} color="#647860" />
        <Scholar x={-41} y={37} scale={0.71} color="#a89469" />
        <Scholar x={-5} y={40} scale={0.76} color="#7b8972" />
      </g>

      {/* River reeds, path stones, and sparse dry-brush ground marks. */}
      <g fill="#869877" opacity=".84">
        <path d="M261 546q4-13 14-13 9-15 19-6 9-3 14 10 7 4 3 12Z" />
        <path d="M369 571q-1-10 7-13 6-10 16-3 8-4 11 7 12 4 7 11Z" />
        <path d="M407 429q-1-8 7-10 4-8 11-4 8-3 12 7 8 1 8 8Z" />
        <path d="M960 462q3-18 18-20 10-15 23-5 17-2 20 15 17 7 14 15Z" />
      </g>
      <g stroke="#648164" strokeWidth="1.3" strokeLinecap="round" opacity=".72">
        <path d="m264 543-2-16m2 10-6-8m6 11 6-9m106 34 1-22m0 14-6-9m6 5 6-9M293 520l-1-19m0 9-6-7m7 11 7-9m-87 85-3-24m2 12-7-8m8 15 7-11" />
        <path d="m678 521 3-12m-3 12-5-8m179-25 1-15m0 10-6-7m6 11 6-9m-668-27 3-14m-3 12-6-7" />
      </g>
      <g fill="#9b9e7c">
        <path d="m578 546 5-5 9 2 3 5-17 1Zm33 55 8-6 11 6-1 6-19-2ZM418 510l7-6 8 2 4 5-19 2Zm271-29 4-5 10 1 4 5Z" />
        <path d="m309 515 6-7 13 3 3 5-18 3Zm87 38 6-5 11 5-1 5-15-1Z" fill="#779080" />
      </g>
      <g stroke="#849d78" strokeWidth="1" strokeLinecap="round" opacity=".6">
        <path d="m653 470 8-2m12 14 14-2m-63 35 11 2m65 28 22-3m13 25 9-1m38-30 17 2m-122 54 12 3m-20-79 9 1m-301 29 11-2m-21 44 12-3m-113 9 11-4m790-31 15 3m-33 19 20 3m-54-39 13 3" />
      </g>

      {/* Foreground vegetation frames the open space, as on a handscroll. */}
      <path d="M832 646q37-54 95-75 63-28 116-18 67-34 166-39v132Z" fill="#7e9b75" />
      <path d="M917 642q36-41 85-39 66-21 126-38 49 1 78 11v69Z" fill="#638460" opacity=".64" />
      <Pine x={1070} y={580} scale={1.81} />
      <Pine x={1175} y={553} scale={1.12} light />
      <Pine x={971} y={566} scale={0.78} />
      <path d="m1048 580-15 5 6 8 28 3 22-8-14-14Zm68-19 12-9 18 6 5 14-28 5Z" fill="#79866a" />
      <path d="m1049 581 11-3 17 7m-53 20 12-3m75 8 13-4" stroke="#b6bea0" strokeWidth="1.2" opacity=".65" />

      <g transform="translate(95 572)">
        <path d="M-95 5q60-43 117-29 51 15 92 43l-49 58H-95Z" fill="#7f9d76" />
        <path d="M-4 6C4-19-6-70-17-102l10-4C2-78 1-52 11-29L14 5Z" fill="#6c735a" />
        <path d="m1-45 27-31m-36 3-32-27m35 10 6-33m-8 18-25-30" stroke="#6c735a" strokeWidth="4" strokeLinecap="round" />
        <path d="M-67-92q-15-18-3-30 0-14 17-18 1-19 19-15 15-17 33-4 23-8 32 12 23-1 30 20 17 14 5 30-15 19-37 8-16 13-38 2-17 13-31-1-17 7-27-4Z" fill={autumn ? "#b5a572" : "#b7bba0"} />
        <g fill={autumn ? "#d0bd87" : "#d6c9b5"}>
          <path d="M-57-122q9-17 25-13 3-10 17-7 8-10 18 0 17-4 25 9-26 14-57 12-21 13-28-1Z" />
          <path d="M-40-104q9-11 22-4 13-11 25-2 18-7 29 5-16 11-34 6-18 10-42-5Z" opacity=".72" />
        </g>
        <g fill="#e7dcc7" opacity=".75">
          <circle cx="-39" cy="-130" r="2.5" />
          <circle cx="-12" cy="-146" r="2" />
          <circle cx="16" cy="-126" r="2.6" />
          <circle cx="-25" cy="-105" r="2.4" />
          <circle cx="-55" cy="-112" r="2" />
          <circle cx="25" cy="-105" r="2" />
        </g>
        <path d="M-11-84q9 39 17 76" stroke="#a09b79" strokeWidth="1.1" />
        <path d="m29 11 13-3 16 6 2 9-33 1-7-5Z" fill="#8b9876" />
        <path d="m32 11 8 5 15 1" stroke="#bec3a0" strokeWidth="1" />
      </g>
      <g fill="#587a59" opacity=".88">
        <path d="M0 595q26-35 60-13 15-13 35 3 26-9 34 20 30 1 38 38H0Z" />
        <path d="M1034 645q15-28 40-17 9-31 36-19 27-21 48 4 28-6 43 18v14Z" />
      </g>
      <g stroke="#97af83" strokeWidth="1.2" strokeLinecap="round" opacity=".65">
        <path d="m30 620-5-20m4 14-12-7m13 7 8-13m61 35-1-19m0 10-8-7m8 10 9-7m1012 10 6-26m-4 17-8-10m8 6 12-8m32 20 2-17m0 10 8-7" />
      </g>
      <path d="M0 0h1200v640H0z" fill={`url(#${id}-paper)`} pointerEvents="none" />
    </svg>
  );
}
