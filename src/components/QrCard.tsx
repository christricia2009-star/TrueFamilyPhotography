import { useEffect, useState } from "react";
import QRCode from "qrcode";

type Props = {
  value: string;
  caption?: string;
};

export function QrCard({ value, caption }: Props) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(value, {
      margin: 1,
      width: 280,
      color: { dark: "#1f1814", light: "#fbf6ee" },
    }).then((url) => {
      if (alive) setSrc(url);
    });
    return () => {
      alive = false;
    };
  }, [value]);

  if (!src) return null;

  return (
    <div className="qr-wrap">
      <img src={src} alt="QR code for gallery access" />
      {caption && <p>{caption}</p>}
    </div>
  );
}
