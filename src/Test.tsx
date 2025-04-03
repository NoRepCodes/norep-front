// import { PropsWithChildren, useContext, useState } from "react";
// import { InputBase, Line } from "./components/Input";
// import { IconLoad, Ionicons } from "./components/Icons";
// import { ViewFadeStatic } from "./components/AnimatedLayouts";
// import Context from "./helpers/UserContext";
// import { getUserSearch } from "./api/api_admin";

// const Test = () => {
    
//   const { setMsg } = useContext(Context);
//   const [searchBar, setSearchBar] = useState("");
//   const oc = (t: any) => setSearchBar(t);
//   const [loading, setLoading] = useState(false);

//   const [users, setUsers] = useState<any[]>([])

//   // useEffect(() => {
//   //   const st = setTimeout(() => {

//   //   }, 500);
//   // }, [searchBar])

//   const startSearch = async () => {
//     if(searchBar.length <= 0) return setUsers([])
//     setLoading(true);
//     const { status, data } = await getUserSearch(searchBar);
//     setLoading(false);
//     if (status === 200) {
//       setUsers(data)
//     } else setMsg({ type: "error", text: data.msg });
//   };

//   return (
//     <ViewCtn>
//       <View style={{ marginTop: 32 }}>
//         <Title text="BUSCAR USUARIO" size={32} />
//         <View
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//             gap: 12,
//             width:'100%'
//           }}
//         >
//           <View style={{ width: "90%" }}>
//             <InputBase
//               onChange={oc}
//               ph="Nombre o cédula de usuario"
//             //   style={{ width: "90%" }}
//             />
//           </View>
//           <Btn onPress={startSearch}>
//             {loading ? (
//               <IconLoad />
//             ) : (
//               <Ionicons name="arrow-forward-circle" size={24} />
//             )}
//           </Btn>
//         </View>
//       </View>
//       <Line />
//       {users.map((user)=>(
//         <UserCard {...{navigate:()=>{},user}} key={user._id}  />
//       ))}
//     </ViewCtn>
//   );
// };

// export default Test;



// type UserT = {
//     _id: string;
//     card_id: string;
//     name: string;
//     phone: string;
//   };
//   export const UserCard = ({
//     user,
//     navigate,
//   }: {
//     user: UserT;
//     navigate: any;
//   }) => {
//     return (
//       <ViewFadeStatic>
//         <Btn
//           onPress={() => {}}
//           style={st2.teamCard_btn}
//         >
//           <View style={st2.teamCard_ctn}>
//             <p style={st2.teamCard_name}>{user.name}</p>
//             <Ionicons
//               name="open-outline"
//               size={24}
//               color="black"
//             />
//           </View>
//         </Btn>
//       </ViewFadeStatic>
//     );
//   };

  
//   const st2: { [key: string]: React.CSSProperties } = {
//     teamCard_btn: {
//       margin: '-1px -12px 0px',
//     },
//     teamCard_ctn: {
//       minHeight: 52,
//       border:'1px solid black',
//       padding:"12px 24px",
//       flexDirection: "row",
//       justifyContent: "space-between",
//     },
//     teamCard_name: {
//       fontFamily: "RobotoMono",
//       fontSize: 14,
//       marginTop: -3,
//       flex: 1,
//       alignSelf: "center",
//     },
//     btn_remove: {
//       justifyContent: "flex-end",
//       padding: '0px 0px 8px 0px',
//     },
//   };
  
  