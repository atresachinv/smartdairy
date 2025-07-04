import cow_man_img from "../../assets/man-cow-milk.png";

const CowImage = () => {
  return (
    <div className="img-container w100 h1 d-flex-col center">
      <img
        src={cow_man_img}
        style={{ width: "100%", height: "100%" }}
        alt="cow-man-img"
      />
    </div>
  );
};

export default CowImage;
