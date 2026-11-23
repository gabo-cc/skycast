import type { ReactNode, SVGProps } from "react";

type IconName =
  | "sun"
  | "cloud"
  | "rain"
  | "wind"
  | "drop"
  | "pin"
  | "arrow"
  | "search"
  | "heart"
  | "compare"
  | "spark"
  | "clock"
  | "moon"
  | "snow"
  | "storm";
const paths: Record<IconName, ReactNode> = {
  moon: <path d="M20 15.5A8 8 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" />,
  snow: <path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9 4l3 3 3-3M9 20l3-3 3 3" />,
  storm: (
    <>
      <path d="M7 15h10a4 4 0 0 0 .4-7.98A5.5 5.5 0 0 0 7 6a4.5 4.5 0 0 0 0 9Z" />
      <path d="m13 13-3 5h3l-2 4" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
    </>
  ),
  cloud: (
    <>
      <path d="M7 18h10a4 4 0 0 0 .4-7.98A5.5 5.5 0 0 0 7 9a4.5 4.5 0 0 0 0 9Z" />
      <path d="M5 6.5 3.5 5M12 3V1.5" />
    </>
  ),
  rain: (
    <path d="M7 15h10a4 4 0 0 0 .4-7.98A5.5 5.5 0 0 0 7 6a4.5 4.5 0 0 0 0 9Zm1 3-1 3m5-3-1 3m5-3-1 3" />
  ),
  wind: <path d="M3 8h12a3 3 0 1 0-3-3M2 12h17a2.5 2.5 0 1 1-2.5 2.5M4 16h8a3 3 0 1 1-3 3" />,
  drop: <path d="M12 2S5 9.1 5 14a7 7 0 0 0 14 0c0-4.9-7-12-7-12Z" />,
  pin: (
    <>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  heart: (
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
  ),
  compare: <path d="M4 7h15m-4-4 4 4-4 4M20 17H5m4-4-4 4 4 4" />,
  spark: (
    <path d="m12 2 1.7 5.3L19 9l-5.3 1.7L12 16l-1.7-5.3L5 9l5.3-1.7L12 2Zm7 13 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
};
export function Icon({
  name,
  width = 24,
  height = 24,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
