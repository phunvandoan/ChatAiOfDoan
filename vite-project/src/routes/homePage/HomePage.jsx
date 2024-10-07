import { Link } from "react-router-dom";
import "./homePage.css";
import { TypeAnimation } from "react-type-animation";

function HomePage() {
  return (
    <div className="homepage">
      <img src="/orbital.png" alt="" className="orbital" />
      <div className="left">
        <h1>Doan AI</h1>
        <h2>Supercharge your creativity and productivity</h2>
        <h3>Give me an idea of what you want to do</h3>
        <Link to="/sign-in">Get Started</Link>
      </div>
      <div className="right">
        <div className="imgContainer">
          <div className="bgContainer">
            <div className="bg"></div>
          </div>
          <img src="/bot.png" alt="" className="bot" />
          <div className="chat">
            <img src={"/bot.png"} alt="" />
            <TypeAnimation
              sequence={[
                "create a recipe",
                1000,
                " produce food for Hamsters",
                1000,
                "produce food for Guinea Pigs",
                1000,
                "produce food for Chinchillas",
                1000,
              ]}
              wrapper="span"
              repeat={Infinity}
              cursor={true}
            />
          </div>
        </div>
      </div>
      <div className="terms">
        <img src="/logo.png" alt="" />
        <div className="links">
          <Link to="/">Term of Service</Link>
          <span>|</span>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
