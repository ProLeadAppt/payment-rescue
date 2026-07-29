import { privateRouteMetadata } from "@/lib/seo";

export const metadata = privateRouteMetadata;

export default function LoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
