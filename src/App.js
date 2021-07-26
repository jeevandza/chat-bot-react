import React, { useEffect, useState, useCallback, useRef } from 'react';
import { FaMicrophone } from 'react-icons/fa'
import './App.css';
import axios from 'axios';
import Header from './components/Header'



const SpeechRecognition = window.SpeechRecognition|| window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

var audioCtx
var analyser

let source, dataArray,bufferLength, drawVisual;




const App = () => {
  // console.log(recognition)
  const canvasElRef = useRef(null)
  const [isVoiceActive, setVoiceActive] = useState(false)
  const [chatData, setChatData] = useState([]);
 

const voiceHandler = ()=>{
  if(isVoiceActive){
    setVoiceActive(false)
    recognition.stop();

    
  }else{
  
  recognition.start();
    
  }
  
}

useEffect(()=>{

  if  (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // console.log('getUserMedia supported.');
    navigator.mediaDevices.getUserMedia (
       // constraints - only audio needed for this app
       {
          audio: true
       })
 
       // Success callback
       .then(function(stream) {
          console.log('this is audio',stream);
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          analyser = audioCtx.createAnalyser();
          source = audioCtx.createMediaStreamSource(stream);

          source.connect(analyser);
          analyser.fftSize = 128;
          bufferLength = analyser.frequencyBinCount;
          dataArray = new Uint8Array(bufferLength);
          analyser.getByteTimeDomainData(dataArray);
          console.log('checking if voice is enabled ', isVoiceActive)

          

          visualize();
       })
 
       // Error callback
       .catch(function(err) {
          console.log('The following getUserMedia error occurred: ' + err);
       }
    );
 } else {
    console.log('getUserMedia not supported on your browser!');
 }
},[isVoiceActive]); 

function visualize() {
  let WIDTH = canvasElRef.current.width;
  let HEIGHT = canvasElRef.current.height;


  analyser.fftSize = 2048;
    var bufferLength = analyser.fftSize;
    // console.log(bufferLength);
    var dataArray = new Uint8Array(bufferLength);

    // console.log(analyser, dataArray);


    const canvasCtx = canvasElRef.current.getContext('2d');

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    var draw = function() {
      

      drawVisual = requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray); 
       

     

      canvasCtx.fillStyle = 'rgb(255, 255, 255)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

      canvasCtx.beginPath();

     

      // console.log(dataArray)

      let shortenedDataArry = [];
      let total = 0;

      for( var i= 0; i < dataArray.length; i++){
       if(i % 128 == 0){
        shortenedDataArry.push(
          total/128
        )
         total = 0 
         
       }
       total = total + dataArray[i] 
      }
      // console.log(shortenedDataArry)

      var sliceWidth = WIDTH * 10.00 / dataArray.length;
      var x = 0;

      for(var i = 0; i <dataArray.length; i++) {

        var v = dataArray[i] / 128.0;
        var y = v * HEIGHT/2;

        if(i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvasElRef.current.width, canvasElRef.current.height/2);
      canvasCtx.stroke();
      // console.log(draw)
    };

    draw();

}


  const voiceCommands = () => {
    recognition.onstart = () => {
      console.log('voice is active');
      setVoiceActive(true)
  
    };
    recognition.onresult = (event)  =>{
      cancelAnimationFrame(drawVisual);
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

  const canvasRefCallback = useCallback(
    (canvasEl) => {
      canvasElRef.current = canvasEl
    },
    [isVoiceActive],
  );
 

  return (
    <>
    <div className=" chat-boxes-container">
      <Header/>
      {chatData.map(chatItem => {
        return (
          <div
            className =  "chat-bar"
            style={{ marginLeft: chatItem.type === 'human' ? 'auto' : '10px', backgroundColor : chatItem.type === 'human' ? 'blue' : '#f84473 ' }}
          >
            <form className="form-group chat-text">
              <p className = "text-message" >{chatItem.message}
              </p>
            </form>
          </div>
        );
      })}
      
      { 
      isVoiceActive ? 

       <canvas className = "canvas" ref = {canvasRefCallback} width="90" height="30" ></canvas> 
       :
        <button onClick ={voiceHandler} className ='home-button' style = {{background:  isVoiceActive ? 'blue': 'red'}}><FaMicrophone/></button>
      }
     
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