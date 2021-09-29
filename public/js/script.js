const btn = document.querySelector("button");
const outputme = document.querySelector(".output-you");
const outputbot = document.querySelector(".output-bot");
const socket = io();


const synth = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance();

// Connecting to ROS
// -----------------

var ros = new ROSLIB.Ros({
url : 'ws://192.168.0.103:9090'
});

ros.on('connection', function() {
console.log('Connected to websocket server.');
});

ros.on('error', function(error) {
console.log('Error connecting to websocket server: ', error);
});

ros.on('close', function() {
console.log('Connection to websocket server closed.');
});

var cmdVel = new ROSLIB.Topic({
ros : ros,
name : '/cmd_vel',
messageType : 'geometry_msgs/Twist'
});

neutral=true;

  cmdVel.subscribe(function(message) {
    linear_vel= message.linear.x;
    angular_vel=message.angular.z;
    console.log(angular_vel);

    if (linear_vel == 0 && angular_vel==0){
      neutral=true;
    }

    if (linear_vel > 0 && neutral==true ) {
      eyes.express({type: 'happy'});
      console.log('happy');
      neutral=false;
      utterance.text = 'ha ha ha';
      utterance.pitch = 1;
      utterance.volume = 1;
      synth.speak(utterance);

    }

    if (angular_vel > 0 && neutral==true ) {
      eyes.express({type: 'confused'})
      console.log('confused');
      neutral=false;
      utterance.text = 'surprised';
      utterance.pitch = 1;
      utterance.volume = 1;
      synth.speak(utterance);
    }

    if (angular_vel < 0 && neutral==true ) {
      eyes.express({type: 'angry'})
      neutral=false;
      utterance.text = 'angry';
      utterance.pitch = 1;
      utterance.volume = 1;
      synth.speak(utterance);
    }




  });


function runAnimation(){
document.querySelector(".bar:nth-child(1)").style.animationPlayState = 'running';
document.querySelector(".bar:nth-child(2)").style.animationPlayState = 'running';
document.querySelector(".bar:nth-child(3)").style.animationPlayState = 'running';
document.querySelector(".bar:nth-child(4)").style.animationPlayState = 'running';
document.querySelector(".bar:nth-child(5)").style.animationPlayState = 'running';
document.querySelector(".bar:nth-child(6)").style.animationPlayState = 'running';
document.querySelector(".bar:nth-child(7)").style.animationPlayState = 'running';
document.querySelector(".bar:nth-child(8)").style.animationPlayState = 'running';
document.querySelector(".bar:nth-child(9)").style.animationPlayState = 'running';
document.querySelector(".bar:nth-child(10)").style.animationPlayState = 'running';
}

function pauseAnimation(){
document.querySelector(".bar:nth-child(1)").style.animationPlayState = 'paused';
document.querySelector(".bar:nth-child(2)").style.animationPlayState = 'paused';
document.querySelector(".bar:nth-child(3)").style.animationPlayState = 'paused';
document.querySelector(".bar:nth-child(4)").style.animationPlayState = 'paused';
document.querySelector(".bar:nth-child(5)").style.animationPlayState = 'paused';
document.querySelector(".bar:nth-child(6)").style.animationPlayState = 'paused';
document.querySelector(".bar:nth-child(7)").style.animationPlayState = 'paused';
document.querySelector(".bar:nth-child(8)").style.animationPlayState = 'paused';
document.querySelector(".bar:nth-child(9)").style.animationPlayState = 'paused';
document.querySelector(".bar:nth-child(10)").style.animationPlayState = 'paused';
}

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.lang = "en-US";
recognition.interimResults = false;

btn.addEventListener("click", () => {
  recognition.start();
});

recognition.onresult = function (event) {
  const last = event.results.length - 1;
  const text = event.results[last][0].transcript;
  console.log(text);



  socket.emit("chat message", text);
};


const botReply = (text) => {

  utterance.text = text;
  utterance.pitch = 1;
  utterance.volume = 1;
  synth.speak(utterance);
  if (synth.speaking==true){
    runAnimation();
    eyes.express({type: 'focused'})
    eyes.express({type: 'focused'})
  }
  utterance.onend = function(event) {
    pauseAnimation();
    console.log('Utterance has finished being spoken after ' + event.elapsedTime + ' seconds.');
  }

};

socket.on("bot reply", (text) => {

  botReply(text);
});
