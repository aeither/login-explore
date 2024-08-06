"use client";

import Header from "@/components/header";
import { useTheme } from "next-themes";
import { useEffect } from "react";

const superhackLanding = () => {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  return (
    <div className="flex flex-col items-center justify-center">
      <Header />
    </div>
  );
};

export default superhackLanding;
