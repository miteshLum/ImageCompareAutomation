import { useLocation } from "react-router-dom";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import { useSelector } from "react-redux";
function ViewImageCompare() {
  let location = useLocation();
  const { link } = useSelector((state) => state.modules);
  const item = location.state.item;
  return (
    <div style={{ display: "flex", marginTop: 50 }}>
      <ReactCompareSlider itemOne={<ReactCompareSliderImage src={`${link}data/attachments/${item.source.base}`} alt="Image one" />} itemTwo={<ReactCompareSliderImage src={`${link}data/attachments/${item.source.actual}`} alt="Image two" />} />
    </div>
  );
}

export default ViewImageCompare;
