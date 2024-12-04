import React from 'react'

const TodaysMilkReport = () => {
  return (
    <>
      <div className="milk-collection-time-wise w100 h1 d-flex-col sb">
          <span className="heading">Milk Collection Details </span>
        <div className="time-wise-milk-collection w100 h90 d-flex sa p10">
          <div className="morning-milk-collection w45 h1 d-flex-col bg">
            <span className="heading p10">Morning Collection</span>
            <div className="details-info-div w100 h10 d-flex a-center sa bg6 p10">
              <span className="w15 label-text t-center">FAT</span>
              <span className="w15 label-text t-center">SNF</span>
              <span className="w15 label-text t-center">Litre</span>
              <span className="w15 label-text t-center">Rate</span>
              <span className="w15 label-text t-center">Amount</span>
            </div>
            <div className="amt-info-details-div w100 h1 mh90 hidescrollbar d-flex-col">
              <div className="amt-info-div w100 h10 d-flex a-center sa">
                <span className="w15 text t-center">00</span>
                <span className="w15 text t-center">00</span>
                <span className="w15 text t-center">00</span>
                <span className="w15 text t-center">00</span>
                <span className="w15 text t-center">00</span>
              </div>
            </div>
          </div>
          <div className="evening-milk-collection w45 h1 d-flex-col bg">
            <span className="heading p10">Evening Collection</span>
            <div className="details-info-div w100 h10 d-flex a-center sa bg6 p10">
              <span className="w15 label-text t-center">FAT</span>
              <span className="w15 label-text t-center">SNF</span>
              <span className="w15 label-text t-center">Litre</span>
              <span className="w15 label-text t-center">Rate</span>
              <span className="w15 label-text t-center">Amount</span>
            </div>
            <div className="amt-info-details-div w100 h1 mh90 hidescrollbar d-flex-col">
              <div className="amt-info-div w100 h10 d-flex a-center sa">
                <span className="w15 text t-center">00</span>
                <span className="w15 text t-center">00</span>
                <span className="w15 text t-center">00</span>
                <span className="w15 text t-center">00</span>
                <span className="w15 text t-center">00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TodaysMilkReport
