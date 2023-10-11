import { usePathname, useRouter } from "next/navigation";

export const useGoBack = () => {
  const router = useRouter();
  const pathname = usePathname();

  const goBack = () => {
    if (router.back && pathname !== "/") {
      router.back();
    }
  };

  return goBack;
};
