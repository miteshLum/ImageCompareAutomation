import "./Home.css";
import { useEffect, useState } from "react";
import { getAllModules, readAllScenario } from "../../service/imageCompare";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCurrentModule, addModules, setAllureLink } from "../../store/slices/ModuleSlice";
import { CSVLink } from "react-csv";
import ClipLoader from "react-spinners/ClipLoader";

const headers = [
  { label: "FileType", key: "FileType" },
  { label: "FeatureName", key: "FeatureName" },
  { label: "ScenarioName", key: "ScenarioName" },
  { label: "FileName", key: "FileName" },
  { label: "IsExpected", key: "IsExpected" },
];

function Home() {
  const [linkAdd, setLinkAdd] = useState("");
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [moduleList, setModuleList] = useState([]);
  const [showDownload, setShowDownload] = useState(false);
  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#36d7b7");
  const { link, allModules } = useSelector((state) => state.modules);

  useEffect(() => {
    if (link !== "" && allModules.length > 0) {
      setLinkAdd(link);
      setModuleList(allModules);
      setShowDownload(true);
    } else {
      setLinkAdd("");
      setModuleList([]);
      setShowDownload(false);
    }
  }, []);

  const onLink = (e) => {
    console.log("Link =>", e.target.value, e.target.value.split(".netlify.app"));
    let netlifyLink = e.target.value.split(".netlify.app");
    let fullLink = netlifyLink[0] + ".netlify.app/";
    console.log("Full Link => ", fullLink);
    setLinkAdd(e.target.value);
    dispatch(setAllureLink(fullLink));
  };

  const onClick = async () => {
    // console.log("Button Click", link);
    setLoading(true);
    if (link !== "") {
      const arr = await getAllModules(link);
      console.log("All Arr => ", arr);
      const allModuleImageFailures = [];
      for (let i = 0; i < arr.length; i++) {
        const allCases = arr[i].children;
        const failedCases = allCases.filter((val) => val.status === "failed");
        const failedCasesUID = failedCases.map((item) => item.uid);
        const result = await readAllScenario(failedCasesUID, link);

        // allModuleImageFailures.push({ ...arr[i], allImageFailures: result });
      }
      // dispatch(addModules(allModuleImageFailures));
      // setModuleList(allModuleImageFailures);
      // setShowDownload(true);
      // setLoading(false);
    } else {
      alert("Please enter allure link");
      setLoading(false);
    }
  };

  const onDownloadClick = () => {
    let csvWriterValueArray = [];
    // console.log("All Modules => ", allModules);
    for (let i = 0; i < allModules.length; i++) {
      for (let j = 0; j < allModules[i].allImageFailures.length; j++) {
        const { FileType, FeatureName, ScenarioName, FileName, IsExpected } = allModules[i].allImageFailures[j];
        let expectedVal = IsExpected === "True" ? "TRUE" : "FALSE";
        const imageObj = {};
        imageObj.FileType = FileType;
        imageObj.FeatureName = FeatureName;
        imageObj.ScenarioName = ScenarioName;
        imageObj.FileName = FileName;
        imageObj.IsExpected = expectedVal;
        csvWriterValueArray.push(imageObj);
      }
    }

    return csvWriterValueArray;
  };

  function handleClick(item) {
    console.log("ITEM ===> ", item);
    dispatch(addCurrentModule(item));
    navigate(`/module/${item.uid}`, { state: { item: item } });
  }
  return (
    <div>
      <div className="">
        <input defaultValue={link} value={linkAdd} onChange={onLink} placeholder="Enter Allure Link" />
        <button onClick={onClick}>Get Modules</button>
      </div>

      <div className="loader-style">
        <ClipLoader color={color} loading={loading} size={50} aria-label="Loading Spinner" data-testid="loader" />
      </div>
      <div className="modules-container">
        {moduleList.length > 0 &&
          moduleList?.map((item, index) => (
            <div className="module">
              <button onClick={() => handleClick(item)}>{item.name.substring(0, item.name.length - 1)}</button>
            </div>
          ))}
        {showDownload && (
          <CSVLink data={onDownloadClick()} filename={"allureMapCSV.csv"} headers={headers}>
            Download CSV File
          </CSVLink>
        )}
        {/* <button onClick={onDownloadClick}>Download Allurecsv</button> */}
      </div>
    </div>
  );
}

export default Home;
