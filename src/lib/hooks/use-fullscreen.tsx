import { useState, useEffect, useCallback } from "react";

export const useFullscreen = (elementRef: React.RefObject<HTMLElement>) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const enterFullscreen = useCallback(() => {
    if (elementRef.current) {
      if (elementRef.current.requestFullscreen) {
        void elementRef.current.requestFullscreen();
      } else {
        // Fallback for iOS
        document.body.style.overflow = "hidden";
        elementRef.current.style.position = "fixed";
        elementRef.current.style.top = "0";
        elementRef.current.style.left = "0";
        elementRef.current.style.width = "100%";
        elementRef.current.style.height = "100%";
        elementRef.current.style.zIndex = "9999";
        setIsFullscreen(true);
      }
    }
  }, [elementRef]);

  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen) {
      void document.exitFullscreen();
    } else {
      // Fallback for iOS
      document.body.style.overflow = "";
      if (elementRef.current) {
        elementRef.current.style.position = "";
        elementRef.current.style.top = "";
        elementRef.current.style.left = "";
        elementRef.current.style.width = "";
        elementRef.current.style.height = "";
        elementRef.current.style.zIndex = "";
      }
      setIsFullscreen(false);
    }
  }, [elementRef]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return { isFullscreen, toggleFullscreen };
};
