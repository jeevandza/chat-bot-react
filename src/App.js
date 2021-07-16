import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';



const SpeechRecognition = window.SpeechRecognition|| window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();


const App = () => {
  // console.log(recognition)
  const [isVoiceActive, setVoiceActive] = useState(false)
  const [chatData, setChatData] = useState([
   
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

      let _chatData = [...chatData];

      _chatData.push({
        'type': 'human',
          message: commnd
      })

      /**
       * orginal []
       * 
       * 
       * temp 1 = [...orginal]
       * temp 1 push ({'type': 'human',})
       * temp 1 = [{'type': 'human',}]
       * 
       * set orginal 
       * 
       * orginal replaced with temp 1
       * 
       * temp 2 = [... temp 1]
       * 
       * temp 2 =  [{'type': 'human',}]
       * 
       * temp 2 push ({'type': 'bot',})
       * 
       * temp 2 =  [{'type': 'human' }, {'type': 'bot'}]
       * 
       * orginal replaced with temp 2
       * 
       * 
       * again press red button
       * 
       * temp 1 = [...orginal]
       * temp 1 push ({'type': 'human',})
       * temp 1 = [{'type': 'human' }, {'type': 'bot'}, {'type': 'human',}]
       * 
       * orginal replaced with temp 1
       * 
       * temp 2 = [... temp 1]
       * 
       * temp 2 =  [{'type': 'human' }, {'type': 'bot'}, {'type': 'human',}]
       * 
       * temp 2 push ({'type': 'bot',})
       * 
       * temp 2 =  [{'type': 'human' }, {'type': 'bot'}, {'type': 'human',}, {'type': 'bot',}]
       * 
       * orginal replaced with temp 2
       * 
       */

      setChatData(_chatData)

      axios.post('https://jd-dev.in/api/', {
        "message": commnd,
      }).then((response)=>{
        let __chatData = [..._chatData];

        __chatData.push({
          'type': 'bot',
            message: response.data.reply
            
        })
        setChatData(__chatData)
        const music = new Audio('https://jd-dev.in/api/' + response.data.filename)
        music.play()
      })
     
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
            style={{ marginLeft: chatItem.type === 'human' ? 'auto' : '10px' }}
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