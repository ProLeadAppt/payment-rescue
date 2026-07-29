import { privateRouteMetadata } from "@/lib/seo";

export const metadata = privateRouteMetadata;

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
