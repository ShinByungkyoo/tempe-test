import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "자기진단 테스트",
  description: "20문항 자기진단 테스트 — 주도형 / 섬세형 / 비범형 / 은둔형",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
