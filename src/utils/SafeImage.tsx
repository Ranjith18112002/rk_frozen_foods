"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

const FALLBACK_SRC = "/images/placeholder.webp";

const SafeImage = ({ src, alt, ...props }: ImageProps) => {
  const [failed, setFailed] = useState(false);

  return (
    <Image
      {...props}
      src={failed ? FALLBACK_SRC : src}
      alt={alt}
      onError={() => setFailed(true)}
    />
  );
};

export default SafeImage;