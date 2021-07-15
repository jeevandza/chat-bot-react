import React, { useEffect, useState } from 'react';
import './App.css';

const SpeechRecognition = window.SpeechRecognition|| window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();



const App = () => {
  console.log(recognition)
  const [isVoiceActive, setVoiceActive] = useState(false)
  const [chatData, setChatData] = useState([
    {
      type: 'human',
      message: 'Hello'
    },
    {
      type: 'bot',
      message: 'How are you'
    },
    {
      type: 'human',
      message: 'How can i Help today'
    },
    {
      type: 'bot',
      message: 'I am doing good'
    }
  ]);

const voiceHandler = ()=>{
  if(isVoiceActive){
    setVoiceActive(false)
    recognition.stop();
  }else{
    recognition.start();
  }
  
}


  const voiceCommands = () => {
    recognition.onstart = () => {
      console.log('voice is active');
      setVoiceActive(true)
  
    };
    recognition.onresult = (event)  =>{
      var commnd = event.results[0][0].transcript;
      console.log(commnd)
      setVoiceActive(false)
    };
  }

  useEffect(()=>{
    voiceCommands();
  });

 

  return (
    <>
    <div className=" chat-boxes-container">
      {chatData.map(chatItem => {
        return (
          <div
            className="robotalks"
            style={{ marginLeft: chatItem.type === 'human' ? 'auto' : '0' }}
          >
            <form className="form-group">
              <p>{chatItem.message}</p>
            </form>
          </div>
        );
      })}
      <button onClick ={voiceHandler} className ='home-button'
      style = {{background:  isVoiceActive ? 'blue': 'red'}}></button>
    </div>
    </>
  );
}


export default App;






/**
 * UI
 * RECORD VOICE
 * VOICE TO TEXT
 * CONFIGURE DIALOUGE FLOW
 * SEND TEXT TO DIALOGUE FLOW
 * GET REPLY FROM DIALOGUE FLOW
 * CONVERT TEXT REPLY  FROM DIALOGUE FLOW TO VOICE
 * PLAY VOICE  
 */