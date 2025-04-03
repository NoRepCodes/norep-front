import { ReactCSS, Text, View } from "./UI";

export const InfoLabel = ({
  label,
  fs = 16,
  color = "#18181880",
}: {
  label: string;
  fs?: number;
  color?: string;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        width: "100%",
        // backgroundColor: "red",
        marginTop: 24,
        alignItems: "center",
      }}
    >
      <Text style={{ fontFamily: "Anton", marginTop: -3, fontSize: fs }}>
        {label}
      </Text>
      <View
        style={{
          height: 2,
          backgroundColor: color,
          flex: 1,
          marginLeft: 24,
        }}
      />
    </View>
  );
};

export const InfoItem = ({
  label,
  value,
  Icon,
  icon_name,
  scale = 1,
  multiline
}: {
  label: string;
  value?: string|number;
  Icon: any;
  icon_name: string;
  scale?: number;
  multiline?:boolean,
}) => {
  if (!value) return null;
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 12,
        alignItems: multiline ? undefined:"center",
        // backgroundColor: "red",
      }}
    >
      <View style={{ minWidth: 24 }}>
        <Icon name={icon_name} size={20 * scale} color="black" />
      </View>
      <Text
        style={{ fontSize: 12 * scale, fontFamily: "RobotoMedium" }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: 12 * scale,
          fontFamily: "Roboto",
          color: "#181818D9",
          flex: 1,
          textAlign:'right',
            // backgroundColor: "red",
        }}
      >
        {value}
      </Text>
    </View>
  );
};

export const Title = ({ text, size }: { text: string; size?: number }) => (
  <Text style={{...st.title, fontSize: size ?? 42 }}>{text}</Text>
);

const st:ReactCSS ={
  title: {
    marginTop: 6,
    marginBottom: 12,
    fontSize: 42,
    fontFamily: "Anton",
  },
};
