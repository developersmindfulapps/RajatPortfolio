import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit Recommendation | Rajat Deep Singh",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function ReferenceTokenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
