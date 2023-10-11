"use client";

import gsap from "gsap";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./PageTransition.module.scss";

export const PageWithTransition = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const overlayPath = useRef(null);
  const maskPath = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const path = overlayPath.current;
    const mask = maskPath.current;
    if (isAnimating) return;

    setIsAnimating(true);

    const timeline = gsap.timeline({ onComplete: () => setIsAnimating(false) });

    timeline
      .set(path, {
        attr: { d: "M 0 100 V 100 Q 50 100 100 100 V 100 z" },
      })
      // .set(mask, {
      // 	opacity: 1,
      // 	duration: 0.8,
      // 	ease: "power4.in",
      // })
      .to(
        path,
        {
          duration: 0.8,
          ease: "power4.in",
          attr: { d: "M 0 100 V 50 Q 50 0 100 50 V 100 z" },
        },
        0,
      )
      .to(path, {
        duration: 0.2,
        ease: "power1",
        attr: { d: "M 0 100 V 0 Q 50 0 100 0 V 100 z" },
      })

      .set(path, {
        attr: { d: "M 0 0 V 100 Q 50 100 100 100 V 0 z" },
      })
      .to(path, {
        duration: 0.2,
        ease: "sine.in",
        attr: { d: "M 0 0 V 50 Q 50 0 100 50 V 0 z" },
      })
      // .set(mask, {
      // 	opacity: 0,
      // 	duration: 0.8,
      // 	ease: "power4.in",
      // })
      .to(path, {
        duration: 1,
        ease: "power4",
        attr: { d: "M 0 0 V 0 Q 50 0 100 0 V 0 z" },
      });
  }, [pathname, searchParams]);

  return (
    <>
      {children}
      <svg
        className={styles.overlay}
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* <path
					ref={maskPath}
					vectorEffect="non-scaling-stroke"
					d="M 0 0 V 100 Q 50 100 100 100 V 0 z"
					fill="currentColor"
				/> */}
        <path
          ref={overlayPath}
          vectorEffect="non-scaling-stroke"
          d="M 0 100 V 100 Q 50 100 100 100 V 100 z"
          fill="currentColor"
        />
      </svg>
    </>
  );
};
