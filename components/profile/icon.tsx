"use client";

export default function IconWithImage({
  url,
  width,
  height,
  color
}: {
  url: string;
  width?: number;
  height?: number;
  color?: string;
}) {
  return (
    <div
      style={{
        height,
        width,
        maskImage: `url(${url})`,
        maskSize: `${width}px ${height}px`,
        backgroundColor: color ?? "#fff"
      }}
    ></div>
  );
}
