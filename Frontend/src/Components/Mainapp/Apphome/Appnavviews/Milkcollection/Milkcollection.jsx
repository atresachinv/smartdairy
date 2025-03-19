import CollectionSettingForm from "./CollectionSettingForm";
import Milkcollelist from "./Milkcollelist";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/Milkcollection.css";
const Milkcollection = ({ time }) => {
  return (
    <div className="milk-collection-container w100 h1 p10">
      <div className="milk-form-list-container w100 h1 d-flex sa">
        <div className="milk-collection-form w60 ">
          <CollectionSettingForm time={time} />
        </div>
        <div className="milk-coll-list-div w40 h1 mx10">
          <Milkcollelist />
        </div>
      </div>
    </div>
  );
};

export default Milkcollection;
