import React, { useState } from "react";
import Image from "next/image";

const ImageWithFallback = ({
  src,
  fallbackSrc,
  alt,
  ...rest
}: {
  src: string;
  fallbackSrc: string;
  alt: string;
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc(fallbackSrc);
  };

  return (
    <Image src={imgSrc} alt={alt} fill={true} onError={handleError} {...rest} />
  );
};

export default ImageWithFallback;
