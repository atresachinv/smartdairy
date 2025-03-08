import React, { useState, useEffect } from "react";
import "../../../Styles/Home/Spinner/Spinner.css";
const messages = [
  "We are working on your task...",
  "Please wait, this process takes a few moments...",
  "Stay tuned! We are working hard for you...",
];

const TypingLoader = () => {
  // const [currentMessage, setCurrentMessage] = useState(messages[0]);
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const typeMessage = () => {
      if (charIndex < messages[index].length) {
        setDisplayedText((prev) => prev + messages[index][charIndex]);
        setCharIndex((prev) => prev + 1);
      } else {
        setTimeout(() => {
          setDisplayedText("");
          setCharIndex(0);
          setIndex((prev) => (prev + 1) % messages.length);
        }, 2000); // Pause for 2 seconds before changing the message
      }
    };

    const typingInterval = setTimeout(typeMessage, 100);

    return () => clearTimeout(typingInterval);
  }, [charIndex, index]);

  return (
    <div className="typing-container">
      <p className="typing-text">{displayedText}</p>
      <span className="cursor">|</span>
    </div>
  );
};

export default TypingLoader;
