"use client";

import { useCallback, useEffect, useState } from "react";

type DeviceType = "desktop" | "tablet" | "mobile";

interface ResizeReturn {
  width: number;
  height: number;
  deviceType: DeviceType;
  isMobile: boolean;
}

export const useResize = (): ResizeReturn => {
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [height, setHeight] = useState<number>(window.innerHeight);

  const getDeviceType = (windowWidth: number): DeviceType => {
    if (windowWidth >= 1024) return "desktop";
    if (windowWidth >= 768) return "tablet";
    return "mobile";
  };

  const handleResize = useCallback(() => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  const deviceType = getDeviceType(width);
  const isMobile = deviceType === "mobile";

  return {
    width,
    height,
    deviceType,
    isMobile,
  };
};
