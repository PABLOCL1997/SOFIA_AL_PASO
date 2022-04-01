import React, { useState, useEffect } from "react";

function debounce(func: () => void) {
  let timer: ReturnType<typeof setTimeout>;
  return function () {
    if (timer) clearTimeout(timer);
    timer = setTimeout(func, 100);
  };
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    const debounceResize = debounce(handleResize);

    window.addEventListener("resize", debounceResize);
    return () => window.removeEventListener("resize", debounceResize);
  }, []);

  return windowDimensions;
}
