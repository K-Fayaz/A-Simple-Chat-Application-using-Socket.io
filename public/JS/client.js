/*<div class="room" id="room-${currUser}">
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
</div>*/
  var user = " ";
  var firstUser = true;
  do{
    user = prompt("Enter Your name: ");
    // insert the name of the User in the dom
    document.getElementById("your-name").innerText = user;
  }while(!user);

  const socket = io({
    auth:{
      name: user,
    }
  });

  //
  const checkSpan = (event)=>{
    let id;
    console.log(event.target);
    if(event.target.localName === "a"){
       id = event.target.href.split("FAYAZ")[1];
       console.log(event.target.href.split("FAYAZ"));
       console.log(event.target.href.split("FAYAZ")[1]);
    }else{
      id = event.target.id.split("FAYAZ")[1];
    }

    console.log(id);

    let span = document.getElementById(`spanFAYAZ${id}`);
    span.innerText = '';
    span.style.padding = "0";
  }

  // Handle the submit of the form
  const handleSubmit = (event)=>{
    event.preventDefault();
    console.log(event.target.id);
    let id = event.target.id;
    console.log(id);
    let recieverId = id.split('FAYAZ')[1];
    console.log(recieverId);

    // get the content of input field
    const message = document.getElementById(`inputFAYAZ${recieverId}`).value;
    //
    // send the message to the user
    socket.emit("private-message",socket.id , recieverId , message);

    // Now add your message to the dom...
    let div = document.createElement("div");
    let p = document.createElement("p");
    p.classList.add("message");
    p.classList.add("me");
    p.innerText = message;

    div.appendChild(p);

    let messageContainer = document.getElementById(`privateFAYAZ${recieverId}`);

    messageContainer.appendChild(div);
    messageContainer.scrollTo(0,messageContainer.scrollHeight);

    document.getElementById(`inputFAYAZ${recieverId}`).value = "";

  }

  // adding Room to the DOM
  const addRoom = (data)=>{

    let id =  data.id;
    let name = data.name;

    // creating friend section
    let friendSection = document.createElement("section");
    let h2 = document.createElement("h2");
    h2.innerText = name;
    h2.classList.add("friend-info");
    friendSection.appendChild(h2);

    // create message section
    let messageSection = document.createElement("section");
    messageSection.classList.add("private-messages");
    messageSection.setAttribute("id",`privateFAYAZ${id}`);

    // create form section
    let form = document.createElement("form");
    form.classList.add("form");
    form.setAttribute('id',`formFAYAZ${id}`);

    let input = document.createElement("input");
    input.setAttribute("type","text");
    input.setAttribute("id",`inputFAYAZ${id}`);
    form.appendChild(input);

    let button = document.createElement("button");
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-square-fill" viewBox="0 0 16 16">
        <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.5 10a.5.5 0 0 0 .832.374l4.5-4a.5.5 0 0 0 0-.748l-4.5-4A.5.5 0 0 0 5.5 4v8z"/>
      </svg>
      `;
    form.appendChild(button);

    // create a container and append all created sections
    let div = document.createElement("div");
    div.classList.add("room");
    div.setAttribute("id",`roomFAYAZ${id}`);

    div.appendChild(friendSection);
    div.appendChild(messageSection);
    div.appendChild(form);

    document.getElementById("message-container").appendChild(div);
    document.getElementById(`formFAYAZ${id}`).addEventListener("submit",handleSubmit);
  }

  // all functions are here
  const addUser = (data)=>{
    let { name , id } = data;

    let div = document.createElement("div");
    div.setAttribute("id",`friendFAYAZ${id}`);
    div.classList.add("friend");

    let h3 = document.createElement("h3");
    h3.setAttribute("id",id);
    let a = document.createElement("a");
    a.setAttribute("href",`#roomFAYAZ${id}`);
    a.innerText = name;

    let span = document.createElement("span");
    span.classList.add("number-message");
    span.setAttribute('id', `spanFAYAZ${id}`);
    a.appendChild(span);
    h3.appendChild(a);

    div.appendChild(h3);
    h3.addEventListener("click",checkSpan);

    document.getElementById("all-friends").appendChild(div);

    if(firstUser){
      location.assign(`#roomFAYAZ${id}`);
      firstUser = false;
    }
  };

  // handling the incoming new User
  socket.on("new-user",(data)=>{
    addUser(data);
    addRoom(data)
  });

  socket.on("all-users",(data)=>{
    for(let user of data)
    {
        addUser(user);
        addRoom(user);
    }
  });

  socket.on('private-message',(sender,message)=>{
    console.log(sender,message);

    let div = document.createElement("div");
    let p = document.createElement("p");
    p.classList.add("message");
    p.classList.add("pal");
    p.innerText = message;

    div.appendChild(p);

    let messageContainer = document.getElementById(`privateFAYAZ${sender}`);

    messageContainer.appendChild(div);
    messageContainer.scrollTo(0,messageContainer.scrollHeight);

    let id = window.location.hash.split("FAYAZ")[1];
    if(sender !== id){
      let span = document.getElementById(`spanFAYAZ${sender}`);
      if(span.innerText){
        span.innerText = Number(span.innerText) + 1;
      }else{
        span.innerText = 1;
      }
      span.style = "padding: 5px 10px;";
    }


  });


  socket.on("user-disconnected",(id)=>{
    // remove the room and the friend div
    document.getElementById(`roomFAYAZ${id}`).style ="display: none";

    let friend = document.getElementById(`friendFAYAZ${id}`);

    let container = document.getElementById("all-friends");
    container.removeChild(friend);

    if(container.children[0]){
      let userId = container.children[0].id.split("FAYAZ")[1];
      location.assign(`/#roomFAYAZ${userId}`);
    }else{
      firstUser = true;
      location.assign("/#");
    }

  })
