
interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  callback?: Function;
}

export const ViewCtn = ({callback,
  children,
  className,
  ...props
}: WrapperProps) => {
  return (
    <div {...props} className="View_ctn">
      <View style={st.ctn}>{children}</View>
    </div>
  );
};

export const View = ({
  callback,
  children,
  className,
  ...props
}: WrapperProps) => {
  return (
    <div {...props} className={`View_rn ${className ?? ""}`}>
      {children}
    </div>
  );
};

export const Btn = ({
  callback,
  children,
  className,
  onPress,
  ...props
}: WrapperProps & { onPress: () => any }) => {
  return (
    <View {...props} className={`View_rn ${className ?? ""}`} onClick={onPress}>
      {children}
    </View>
  );
};

export const Title = ({ text, size }: { text: string; size?: number }) => (
  <p
    style={{
      fontSize: size ?? 42,
      marginTop: 6,
      marginBottom: 12,
      fontFamily: "Anton",
    }}
  >
    {text}
  </p>
);
export const Text = ({children,...props}:React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>) => (
  <p {...props} >{children}</p>
);

const st: { [key: string]: React.CSSProperties } = {
  ctn: {
    padding: "12px",
    display: "flex",
    gap: 12,
    // minHeight: "100vh",
    maxWidth: "100vw",
    width: "100%",
  },
};


export type ReactCSS = { [key: string]: React.CSSProperties }

export const v = {
  prime: "#F2FF49",
  second: "#7B00FE",
  third: "#FFFFFF",
  four: "#181818",
};