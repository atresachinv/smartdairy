import "../../Styles/Home/Aboutus.css";
const Aboutus = () => {
  return (
    <div className="about-us-container w100 h1 d-flex-col a-center j-center bg-light-green">
      <div className="aboutus-inner-container w50 h1 mh100 hidescrollbar d-flex-col j-center">
        <h1 className="title t-center my10">About Us</h1>
        <p className="info-text">
          <strong>Vikern Smart Invent Software Technology Pvt. Ltd.</strong> is
          a leading software development company based in Sangamner. We
          specialize in delivering innovative and customized software solutions
          that cater to the dynamic needs of businesses. Our expertise lies in
          software development, Android app development, and providing digital
          transformation solutions.
        </p>
        <h2 className="heading t-center my10">Our Products</h2>
        <hr />
        <div className="w100 d-flex-col">
          <h3 className="label-text my10">
            MET App - Marketing Employee Tracker
          </h3>
          <p className="info-text">
            MET App is a powerful tool designed for businesses to efficiently
            manage their field employees. It tracks real-time locations,
            monitors daily activities, and provides insightful reports to
            enhance productivity and transparency within the organization.
          </p>
        </div>
        <div className="w100 d-flex-col">
          <h3 className="label-text my10">Smart Dairy</h3>
          <p className="info-text">
            Smart Dairy is an advanced dairy management solution that simplifies
            the operations of dairy businesses. It helps in managing milk
            collection, tracking suppliers and customers, generating reports,
            and ensuring seamless record-keeping to enhance efficiency and
            profitability in the dairy industry.
          </p>
        </div>
        <h2 className="heading my10">Why Choose Us?</h2>
        <ul className="info-text">
          <li className="info-text">
            Expertise in custom software and mobile app development
          </li>
          <li className="info-text">
            Innovative solutions tailored to business needs
          </li>
          <li className="info-text">
            Commitment to quality and customer satisfaction
          </li>
          <li className="info-text">
            Reliable and scalable technology solutions
          </li>
        </ul>
        <h2 className="heading my10">Office Address :</h2>
        <p className="info-text my10">
          Vikern Smart Invent Software technology Pvt. Ltd. Nimon,
          Tal-Sangamner, Dist-Ahmednagar, pin-422605 <br /> Phone -(02425)
          223344, whatsapp No : +91 9822180270, +91 9403228344 <br /> email :
          help@vsitrade.com , vikern@vsitrade.com
        </p>
        <p className="label-text my10">
          We strive to empower businesses with cutting-edge technology. Let's
          build the future together!
        </p>
      </div>
    </div>
  );
};

export default Aboutus;
