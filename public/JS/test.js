let isFresh          = true;
let usernameTag = document.getElementById("your-name");
// let room1            = document.getElementById("q23y7");
let messageContainer = document.getElementById("message-container");
var currUser = '';
var userName = " ";

do{
  userName = prompt("Enter Your name!");
  usernameTag.innerText = userName;
}while(!userName);

var socket = io({
  auth:{
    user:userName,
  }
});

function removeRoom(event){

  messageContainer.innerHTML = "";
}

// function to add and remove the room
const maintainRoom = (event)=>{
  // 1. First remove the existing room from the dom and set 'currUser' to new SocketId
  // 2. Create a new room with all HTML components inside message-container

  // 1
  messageContainer.innerHTML=  '';
  console.log(event.target.id);
  currUser = event.target.id;

  // 2
  let name = event.target.innerText;

  // creating a new room and appending it to the message-container
  let room = `
    <div class="room" id="room-${currUser}">
      <section class="friend-info">
        <h2>${name}</h2>

        <!--  this symbol is for removing a room from the dom -->

        <svg id="cross-${currUser}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-square" viewBox="0 0 16 16">
          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
      </section>
      <section id="private-${currUser}" class="private-messages">

      </section>
      <form class="form" id="form-${currUser}">
        <input id="input-${currUser}" type="text">
        <button>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-square-fill" viewBox="0 0 16 16">
            <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.5 10a.5.5 0 0 0 .832.374l4.5-4a.5.5 0 0 0 0-.748l-4.5-4A.5.5 0 0 0 5.5 4v8z"/>
          </svg>
        </button>
      </form>
    </div> `;

  messageContainer.innerHTML = room;

  // add event listener
  // 1 to remove the room from the dom when Cross-icon is clicked
  document.getElementById(`cross-${currUser}`).addEventListener('click',removeRoom);
  document.getElementById(`form-${currUser}`).addEventListener("submit",handleSubmit);
}

function addUsersToDOM(sockets)
{
  for(let sock of sockets)
  {
    let div = document.createElement("div");
    div.classList.add('friend');

    let h3 = document.createElement("h3");
    h3.innerText = sock.name;
    h3.setAttribute("id",sock.id);

    div.appendChild(h3);

    // add the fried to DOM now
    document.getElementById("all-friends").appendChild(div);
    document.getElementById(`${sock.id}`).addEventListener('click',maintainRoom);
  }
}

function addNewUser(sock)
{

  document.getElementById("all-friends").appendChild(div);
  document.getElementById(`${sock.id}`).addEventListener('click',maintainRoom);
}

const handleSubmit = (event)=>{

  // stop the form from submitting
  event.preventDefault();
  console.log(currUser);

  // get the data from the input field
  let text = document.getElementById(`input-${currUser}`).value;
  console.log(text);

  // re-set the value of the input field
  document.getElementById(`input-${currUser}`).value = " ";

  // add the message of sender to the dom
  const div = document.createElement("div");
  const para = document.createElement("p");
  para.innerText = text;
  para.classList.add("message");
  para.classList.add("me");
  div.appendChild(para);

  console.log(currUser);

  document.getElementById(`private-${currUser}`).appendChild(div);

  let sendingData = `${socket.id}-${currUser}-${text}`;

  // send private message
  // parameters: 1- socketId of sender  2-socketId of the reciever  3- Text message
  socket.emit("send-private-message",sendingData);

}


// socket code goes here
// handle the event when you are connected and have to keep track of all other users
socket.on('all-users',(sockets)=>{
  addUsersToDOM(sockets);
});

socket.on("new-user",(sock)=>{
  addNewUser(sock);
});
