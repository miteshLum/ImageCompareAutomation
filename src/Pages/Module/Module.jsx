import "./Module.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setBothCurrentAndAllModules } from "../../store/slices/ModuleSlice";

function CompareImageComponent(props) {
  const { index, item } = props;
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const { link, currentModule } = useSelector((state) => state.modules);

  function handleClick(item, i) {
    navigate(`/view/${index}`, { state: { item: item } });
  }

  function handleExpectedImage(e, index) {
    const { checked } = e.target;
    let updateProperty = JSON.parse(JSON.stringify(currentModule));
    updateProperty.allImageFailures[index].IsExpected = checked ? "True" : "False";
    dispatch(setBothCurrentAndAllModules(updateProperty));
  }

  return (
    <div style={{ display: "flex", width: "100%", marginTop: 50 }}>
      <div className="img-container" style={{ width: "33%" }}>
        {/* <a href="">{index}</a> */}
        <div className="filename-style">{item.source.baseFileName}</div>
        <div className="container-image-view">
          <div className="manage-image-style">
            <input type="checkbox" defaultChecked={item.IsExpected === "True" ? true : false} onChange={(e) => handleExpectedImage(e, index)} />
            <button onClick={() => handleClick(item, index)}>{index}</button>
          </div>
          <img style={{ height: 300, width: "90%" }} className="image1" src={`${link}data/attachments/${item.source.base}`} />
        </div>
        {/* <span>Tooltip text</span> */}
      </div>
      <div className="img-container1" style={{ width: "33%" }}>
        <div className="filename-style">{item.source.actualFileName}</div>
        <img style={{ height: 300, width: "90%" }} className="image2" src={`${link}data/attachments/${item.source.actual}`} />
        {/* <span>Tooltip text</span> */}
      </div>
      <div className="img-container2" style={{ width: "33%" }}>
        <div className="filename-style">{item.source.diffFileName}</div>
        <img style={{ height: 300, width: "90%" }} className="image2" src={`${link}data/attachments/${item.source.diff}`} />
        {/* <span>Tooltip text</span> */}
      </div>
    </div>
  );
}

function Module() {
  let location = useLocation();
  const { currentModule } = useSelector((state) => state.modules);
  const [compareList, setCompareList] = useState([]);
  useEffect(() => {
    console.log("Render Location => ", currentModule);
    setCompareList(currentModule.allImageFailures);
  }, []);

  return (
    <div>
      <div className="main-text">{location.state.item.name}</div>
      {compareList?.length > 0 && (
        <div>
          {compareList.map((item, index) => {
            return <CompareImageComponent item={item} index={index} />;
          })}
        </div>
      )}
    </div>
  );
}

export default Module;
