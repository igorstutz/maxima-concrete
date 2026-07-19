import NextImage, { type ImageProps } from "next/image";
import { asset } from "@/lib/base-path";

/** Drop-in de next/image que prefixa caminhos locais com o basePath. */
export default function Image(props: ImageProps) {
  const src = typeof props.src === "string" ? asset(props.src) : props.src;
  return <NextImage {...props} src={src} />;
}
