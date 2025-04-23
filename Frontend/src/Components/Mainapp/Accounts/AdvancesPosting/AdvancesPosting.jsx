const AdvancesPosting = () => {
  return (
    <div className="w100 h1 m5 p5">
      <div className="d-flex heading w100 j-center">
        अँडव्हान्स व्याज पोस्टिंग
      </div>
      <div className="d-flex w100   sb">
        <div className="d-flex-col w50 m10 sa">
          <div className="d-flex-col w95 bg  p10">
            <div className="info-text w100 d-flex j-center">
              कॅल्क्युलेट व्याज
            </div>
            <div className="d-flex w100 px15 a-center">
              <label htmlFor="" className="info-text">
                खतावणी
              </label>
              <input type="text" className="data w10 mx10" />
              <label htmlFor="" className="info-text ">
                खतावणी
              </label>
            </div>
            <div className="d-flex w100 px15 my5 a-center">
              <label htmlFor="" className="info-text">
                दिनांक
              </label>
              <input type="date" className="data w30  mx10" />
              <label htmlFor="" className="info-text ">
                ते
              </label>
              <input type="date" className="data w30  mx10" />
              <button className="w-btn">यादी </button>
            </div>
            <div className="d-flex w100 px15   a-center">
              <label htmlFor="" className="info-text">
                व्याज दर
              </label>
              <input type="text" className="data w30  mx10" />
            </div>
            <div className="d-flex w100 px15  my10 center">
              <button className="w-btn mx10">कॅल्क्युलेट</button>
            </div>
          </div>
          <div className="d-flex-col w95 bg my10  p10">
            <div className="info-text w100 d-flex j-center">व्याज पोस्टिंग</div>
            <div className="d-flex w100 px15 my10 a-center">
              <label htmlFor="" className="info-text">
                खतावणी
              </label>
              <input type="text" className="data w10 mx10 " />
              <label htmlFor="" className="info-text ">
                खतावणी
              </label>
            </div>
            <div className="d-flex w100 px15 my10 a-center">
              <label htmlFor="" className="info-text">
                दिनांक
              </label>
              <input type="date" className="data w30  mx10" />
            </div>

            <div className="d-flex w100 px15  my10 center">
              <button className="w-btn mx10">रिसेट</button>
              <button className="w-btn mx10">पोस्टिंग</button>
            </div>
          </div>
        </div>
        <div className="w50 bg">
          <div className="d-flex w100 px15 my10 j-end">
            <button className="w-btn mx10">प्रिंट</button>
          </div>
          <table className="w100">
            <thead>
              <tr>
                <th>कोड</th>
                <th>नाव</th>
                <th>रक्कम</th>
                <th>व्याज</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>2</td>
                <td>2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdvancesPosting;
