import { QRCodeSVG } from 'qrcode.react';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export function QRCode({ value, size = 200, className = '' }: QRCodeProps) {
  return (
    <div className={`bg-on-surface/90 p-4 rounded-lg ${className}`}>
      <QRCodeSVG
        value={value}
        size={size}
        bgColor="#e8e6f0"
        fgColor="#0a0a1a"
        level="M"
      />
    </div>
  );
}
