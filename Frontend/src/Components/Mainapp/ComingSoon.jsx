import TypingLoader from "../Home/Spinner/TypingLoader";

const ComingSoon = () => {
  return (
    <div className="h1 w100 d-flex-col center  ">
      <TypingLoader />
      <div className="w50 h30 d-flex center bg br6">
        <span className="title">Under Development...</span>
      </div>
    </div>
  );
};

export default ComingSoon;
