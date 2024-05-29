import logo from "./logo.svg";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { st, getAllModules } from "./service/imageCompare";

function App() {
  return <RouterProvider router={router} />;
}

// function CompareImageComponent(props) {
//   const { index, item, url } = props;
//   return (
//     <div style={{ display: "flex", width: "100%", marginTop: 50 }}>
//       <div className="img-container" style={{ width: "33%" }}>
//         <a href="">{index}</a>
//         <img style={{ height: 300, width: "90%" }} className="image1" src={`${url}data/attachments/${item.attachmentList[0].source}`} />
//         {/* <span>Tooltip text</span> */}
//       </div>
//       <div className="img-container1" style={{ width: "33%" }}>
//         <img style={{ height: 300, width: "90%" }} className="image2" src={`${url}data/attachments/${item.attachmentList[1].source}`} />
//         {/* <span>Tooltip text</span> */}
//       </div>
//       <div className="img-container2" style={{ width: "33%" }}>
//         <img style={{ height: 300, width: "90%" }} className="image2" src={`${url}data/attachments/${item.attachmentList[2].source}`} />
//         {/* <span>Tooltip text</span> */}
//       </div>
//     </div>
//   );
// }

// function App() {
//   const [link, setLink] = useState("");
//   const [compareList, setCompareList] = useState([]);
//   const [moduleList, setModuleList] = useState([]);

//   const onLink = (e) => {
//     console.log(e.target.value);
//     setLink(e.target.value);
//   };

//   const onClick = async () => {
//     // console.log("Button Click", link);
//     if (link !== "") {
//       const arr = await getAllModules(link);
//       console.log("Arr Test => ", arr);
//       // setCompareList(arr);
//       setModuleList(arr);
//     } else {
//       alert("Please enter allure link");
//     }
//   };

//   return (
//     <div className="App">
//       {/* <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
//           Learn React
//         </a>
//       </header> */}
//       <input defaultValue={link} onChange={onLink} placeholder="Enter Allure Link" />
//       <button onClick={onClick}>Get Modules</button>

//       <div className="modules-container">
//         {moduleList.length > 0 &&
//           moduleList?.map((item, index) => (
//             <div className="module">
//               <button> {item.name.substring(0, item.name.length - 1)} </button>
//             </div>
//           ))}
//       </div>

//       {/* {compareList.length > 0 && (
//         <div>
//           {compareList.map((item, index) => (
//             <CompareImageComponent item={item} url={link} index={index} />
//           ))}
//         </div>
//       )} */}
//     </div>
//   );
// }

export default App;
