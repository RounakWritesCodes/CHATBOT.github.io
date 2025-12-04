function ChatInput({ chatMessages, setChatMessages }) {
  // Use React state to store the input field's text
  const [inputText, setInputText] = React.useState("");




  // Variable to store timeout
  const defaultRobotTimeout = 1000;

  // The function that handles creating a new message
  function getChatbotResponse() {
    return new Promise((resolve) => {
      const response = Chatbot.getResponse(inputText);
      setTimeout(() => resolve(response), defaultRobotTimeout);
    });
  }

  // The function for handling the send button click
  async function handleSendMessage() {
    setInputText("");

    const chatMessagesBeforeResponse = [
      ...chatMessages,
      {
        message: inputText,
        sender: "user",
        id: crypto.randomUUID(),
      },
      {
        message: "Generating response...",
        sender: "robot",
        id: crypto.randomUUID(),
      },
    ];
    setChatMessages(chatMessagesBeforeResponse);

    const chatbotResponse = await getChatbotResponse();

    const chatMessagesAfterResponse = chatMessagesBeforeResponse.map(
      (msg, index) =>
        index === chatMessagesBeforeResponse.length - 1
          ? { ...msg, message: chatbotResponse }
          : msg
    );

    setChatMessages(chatMessagesAfterResponse);
  }

  // Handle the event when the input field's text changes and update the state accordingly
  function handleInputChange(event) {
    setInputText(event.target.value);
  }

  // Return the React code for the input field
  return (
    <form
      className="chat-input-container"
      onSubmit={(e) => {
        e.preventDefault();
        handleSendMessage();
      }}
    >
      <input
        placeholder="Send a message to Chatbot"
        size="30"
        onChange={handleInputChange}
        value={inputText}
        className="chat-input"
      />
      <button type="submit" className="send-button">
        Send
      </button>
    </form>
  );
}

// Reusable component to render a message sent by either the robot or the user
function ChatMessage({ message, sender }) {
  return (
    <div
      className={sender === "user" ? "chat-message-user" : "chat-message-robot"}
    >
      {sender === "robot" && (
        <img src="robot.png" className="chat-message-profile" />
      )}
      <div className="chat-message-text">{message}</div>
      {sender === "user" && (
        <img src="user.png" className="chat-message-profile" />
      )}
    </div>
  );
}

// Robot and user messages container
function ChatMessages({ chatMessages }) {
 const chatMessagesRef = React.useRef(null); 
    
    React.useEffect(() => {
    const containerElement = chatMessagesRef.current;
    if(containerElement){
        containerElement.scrollTop = containerElement.scrollHeight
    }
    }, [chatMessages]);
  return (
    <div className="chat-messages-container" ref={chatMessagesRef}>
      {chatMessages.map((chatMessage) => {
        return (
          <ChatMessage
            message={chatMessage.message}
            sender={chatMessage.sender}
            key={chatMessage.id}
          />
        );
      })}
    </div>
  );
}

// The default React entrypoint component containing both the messages container and the input field
function App() {
  // Use state to store messages and have a default Robot message
  const [chatMessages, setChatMessages] = React.useState([
    {
      message: "Send a message to get started!",
      sender: "robot",
      id: "0",
    },
  ]);

  // Return a div containing the messages container and input field
  return (
    <div className="app-container">
      <ChatMessages chatMessages={chatMessages} />
      <ChatInput
        chatMessages={chatMessages}
        setChatMessages={setChatMessages}
      />
    </div>
  );
}

// Render the entire React app onto the DOM
const container = document.querySelector(".js-container");
ReactDOM.createRoot(container).render(<App />);