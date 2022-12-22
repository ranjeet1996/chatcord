const chatForm=document.getElementById('chat-form');
const chatMessage=document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
//Get username and room from URL
const {username, room}=Qs.parse(location.search,{
    ignoreQueryPrefix: true,
});

// console.log(username,room);
const socket=io();


//join chatroom
socket.emit('joinRoom',{username,room});

//get room and user

socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
})

//message for server
socket.on('message',message =>{
    console.log(message);
    outputMessage(message);


    //scroll down
    chatMessage.scrollTop=chatMessage.scrollHeight;
});

//Message submit

chatForm.addEventListener('submit', (e) =>{
    e.preventDefault();

    //get message text
    let msg=e.target.elements.msg.value;

    msg = msg.trim();

    if (!msg) {
      return false;
    }

    //Emit messaage to server
    socket.emit('chatMessage',msg);



    //clear input

    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
});

//output message to DOM

function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
  }
  
// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user=>`<li>${user.username}</li>`).join('')}
    `;
   
  }

  