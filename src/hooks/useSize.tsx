import { useEffect, useState } from "react";

const useScreen = () => {
  const [ws, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  useEffect(() => {
    const windowSizeHandler = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener("resize", windowSizeHandler);

    return () => {
      window.removeEventListener("resize", windowSizeHandler);
    };
  }, []);

  return {ww:ws[0],wh:ws[1]};
};

export default useScreen;