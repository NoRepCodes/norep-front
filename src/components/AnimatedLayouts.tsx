import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

export const ViewFadeStatic = ({
  children,
  className,
  onClick,
  style
}: PropsWithChildren & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      {...{className,onClick,style}}
    >
      {children}
    </motion.div>
  );
};
export const ViewSlide = ({
  children,
  className,
  onClick,
}: PropsWithChildren & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  return (
    <motion.div
    transition={{ease:'easeInOut',duration:.5}}
      initial={{ opacity: 0,x:"-100%" }}
      animate={{ opacity: 1,x:"0%" }}
      exit={{ opacity: 0,x:"-100%" }}
      {...{className,onClick}}
    >
      {children}
    </motion.div>
  );
};
export const ViewSlideRight = ({
  children,
  className,
  onClick,
}: PropsWithChildren & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  return (
    <motion.div
    transition={{ease:'easeInOut',duration:.5}}
      initial={{ opacity: 0,x:"100%" }}
      animate={{ opacity: 1,x:"0%" }}
      exit={{ opacity: 0,x:"100%" }}
      {...{className,onClick}}
    >
      {children}
    </motion.div>
  );
};
