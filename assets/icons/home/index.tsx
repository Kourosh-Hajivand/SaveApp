import Svg, {
  Circle,
  Line,
  Path,
  Polyline,
  type SvgProps,
} from 'react-native-svg';

export interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

const DEFAULT_COLOR = '#28262E';

/** Brand lightning bolt used in the header. */
export function LogoIcon({ size = 24, color = DEFAULT_COLOR, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path d="M13.5 2 4 13.5h6.5L9 22l10.5-12.5H13z" fill={color} />
    </Svg>
  );
}

export function SearchIcon({ size = 24, color = DEFAULT_COLOR, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Circle cx={11} cy={11} r={7.5} stroke={color} strokeWidth={1.6} />
      <Line
        x1={21}
        y1={21}
        x2={16.8}
        y2={16.8}
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function MenuIcon({ size = 24, color = DEFAULT_COLOR, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Line
        x1={4}
        y1={8.5}
        x2={20}
        y2={8.5}
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <Line
        x1={4}
        y1={15.5}
        x2={14}
        y2={15.5}
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function ChevronRightIcon({
  size = 20,
  color = DEFAULT_COLOR,
  ...props
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Polyline
        points="9 5 16 12 9 19"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export { default as StarIcon } from '../StarIcon';

/** Flame used in the "Hot Offers" promoted section header. */
export function FlameIcon({ size = 24, color = '#ED6E33', ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M12 2s5.5 4.2 5.5 9.5A5.5 5.5 0 0 1 6.5 12c0-1.6.7-2.9 1.6-3.9.2 1 .9 1.9 1.9 2.1-.3-2.3.7-5 2-8.2z"
        fill={color}
      />
      <Path
        d="M12 21a3.5 3.5 0 0 0 3.5-3.5c0-2-1.6-3.2-2.4-4.4-.8 1.1-1.6 1.7-2.3 2.6-.5.6-.8 1.3-.8 2.2A3.5 3.5 0 0 0 12 21z"
        fill="#FFB27D"
      />
    </Svg>
  );
}

/** Inflow arrow used on the "Cash back" chip. */
export function CashBackIcon({ size = 13, color = '#64748B', ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M17 7 7 17"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.5 17H7v-8.5"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Outflow arrow used on the "Cash out" chip. */
export function CashOutIcon({ size = 13, color = '#64748B', ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M7 17 17 7"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.5 7H17v8.5"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function InboxIcon({ size = 24, color = DEFAULT_COLOR, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M3 13.5h4l1.5 2.5h7L17 13.5h4"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.5 6.5h13L21 13.5v3A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-3L5.5 6.5z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ReceiptIcon({ size = 24, color = DEFAULT_COLOR, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M6 3h12v18l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3L6 21V3z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <Line
        x1={9}
        y1={8}
        x2={15}
        y2={8}
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <Line
        x1={9}
        y1={12}
        x2={15}
        y2={12}
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function ScanIcon({ size = 24, color = '#FFFFFF', ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M4 8V6a2 2 0 0 1 2-2h2"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
      <Path
        d="M16 4h2a2 2 0 0 1 2 2v2"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
      <Path
        d="M20 16v2a2 2 0 0 1-2 2h-2"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
      <Path
        d="M8 20H6a2 2 0 0 1-2-2v-2"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
      <Line
        x1={4}
        y1={12}
        x2={20}
        y2={12}
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function CoinsIcon({ size = 24, color = DEFAULT_COLOR, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Circle cx={9} cy={9} r={5.5} stroke={color} strokeWidth={1.6} />
      <Path
        d="M14 5.2a5.5 5.5 0 0 1 0 10.6"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <Path
        d="M9 6.8v4.4M7.4 8.2h2.4a1.2 1.2 0 0 1 0 2.4H8"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ProfileIcon({ size = 24, color = DEFAULT_COLOR, ...props }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Circle cx={12} cy={12} r={9.5} stroke={color} strokeWidth={1.6} />
      <Circle cx={12} cy={9.5} r={3} stroke={color} strokeWidth={1.6} />
      <Path
        d="M5.5 19.2a7 7 0 0 1 13 0"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}
