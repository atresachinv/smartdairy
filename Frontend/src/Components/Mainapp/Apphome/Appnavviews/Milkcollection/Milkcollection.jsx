import CollectionSettingForm from "./CollectionSettingForm";
import Milkcollelist from "./Milkcollelist";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/Milkcollection.css";

const Milkcollection = () => {

  return (
    <div className="milk-collection-container w100 h1">
      {/* <div className="title-container w100 h10 d-flex a-center p10">
        <h2 className="subtitle">
          Milk collection
        </h2>
      </div> */}
      <div className="milk-form-list-container w100 h1 d-flex">
        <div className="milk-collection-form w60 p10">
          <CollectionSettingForm />
        </div>
        <div className="milk-coll-list-div w40 h1 p10">
          <Milkcollelist />
        </div>
      </div>
    </div>
  );
};

export default Milkcollection;
