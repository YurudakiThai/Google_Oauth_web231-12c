"use client";

import { useState } from "react";
import Image from "next/image";

const FALLBACK_IMAGE = "/no-image.svg";

// domain ที่ควรใช้ <img> แทน next/image
const EXTERNAL_GIF_HOSTS = ["tenor.com", "giphy.com", "gfycat.com"];

function shouldUseNativeImg(src: string) {
  try {
    const host = new URL(src).hostname;
    return EXTERNAL_GIF_HOSTS.some((h) => host.endsWith(h));
  } catch {
    return false;
  }
}

export default function ProductThumbnail({
  src,
  alt,
  size = 60,
}: {
  src: string;
  alt: string;
  size?: number;
}) {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    if (imgSrc !== FALLBACK_IMAGE) setImgSrc(FALLBACK_IMAGE);
  };

  const style = {
    objectFit: "cover" as const,
    borderRadius: 6,
    width: size,
    height: size,
  };

  // GIF จาก Tenor/Giphy → ใช้ <img> ตรงๆ
  if (shouldUseNativeImg(imgSrc)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={imgSrc} alt={alt} style={style} onError={handleError} />;
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={size}
      height={size}
      unoptimized
      style={style}
      onError={handleError}
    />
  );
}
