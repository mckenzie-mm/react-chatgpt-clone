import { useState, useEffect } from "react";

function App() {

  const [value, setValue] = useState(null);
  const [message, setMessage] = useState(null);
  const [prevChats, setPrevChats] = useState([]);
  const [curTitle, setCurTitle] = useState(null);

  const handleNewChat = () => {
    setMessage(null);
    setValue("");
    setCurTitle(null);
  }

  const handleTitleChange = (uniqueTitle) => {
    setMessage(null);
    setValue("");
    setCurTitle(uniqueTitle);
  }

  const handleSendQuery = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }
    try {
      const response = await fetch("http://localhost:8000/completions", options);
      const data = await response.json();
      setMessage(data.choices[0].message);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    console.log(curTitle, value, message);
    if (!curTitle && value && message) {
      setCurTitle(value);
    }
    if (curTitle && value && message) {
      setPrevChats(prevChats => (
        [...prevChats,
          {
            title: curTitle,
            role: "user",
            content: value
          },
          {
            title: curTitle,
            role: message.role,
            content: message.content
          }
        ]
      ))
    }
  }, [message, curTitle])

  const curChat = prevChats.filter(prevChat => prevChat.title === curTitle);
  const uniqueTitles = Array.from(new Set(prevChats.map(prevChat => prevChat.title)));

  return (
    <div className="App">
      <section className="side-bar">
        <button onClick={handleNewChat}>+ New Chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => 
            <li key={index} onClick={() => handleTitleChange(uniqueTitle)}>
              {uniqueTitle}
            </li>
          )}
        </ul>
        <nav>
          <p>Made by Ania</p>
        </nav>
      </section>
      <section className="main">
        {!curTitle && <h1>AniaGPT</h1>}
        <ul className="feed">
          {
            curChat?.map((chatMessage, index) => <li key={index}>
              <p className="role">{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
            </li>)
          }
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)}/>
            <div id="submit" onClick={handleSendQuery}>{'>'}</div>
          </div>
          <p className="info">
            Chat GPT Mar 14 Version. Free Research Preview.
            Our goal is to make AI systems more natural and safe to interact with.
            Your feedback will help.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
