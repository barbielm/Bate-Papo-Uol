
let name, idMessages 
let idParticipants = null
let receiver = "Todos"
setTimeout(getUserName,200)

function getUserName(){
    name = prompt("Qual o seu lindo nome?")
    const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants",{ name: name })
    promise.then(getMessages)
    promise.catch(getAnotherUserName)
}


function getAnotherUserName(){
    name = prompt("Digite outro nome, o outro já está em uso: ")
    const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants",{ name: name })
    promise.then(getMessages)
    promise.catch(getAnotherUserName)
}


function keepConnection(name){
    axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status", { name: name })
}

function getMessages(){
    idMessages = setInterval(keepConnection,5000,name)
    document.querySelector(".loading").classList.remove("hidden")
    const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages")
    promise.then(loadMessages)
}

function loadMessages(reply){
    document.querySelector(".loading").classList.add("hidden")
    let messages = reply.data
    for(let i = 0; i < messages.length ; i++){
        writeMessage(messages[i])
    }
    const lastMessage = document.querySelector('.message-box:last-child');
    lastMessage.scrollIntoView();

}

function writeMessage(message){
    const messages = document.querySelector(".messages")
    let type = ""
    let ifNotStatus
    if(message.type === "private_message"){
        type = "reservadamente "
    }
    ifNotStatus = ` <span class="message-type">${type}para</span>
                    <span class="receiver">${message.to}:</span>`
    
    if(message.type === "status"){
        ifNotStatus = ""
    }
    
    messages.innerHTML += `<div class="message-box ${message.type}">
                            <span class="time">(${message.time})</span>
                            <span class="sender">${message.from}</span>
                            ${ifNotStatus}
                            <span class="text">${message.text}</span>
                        </div>`
    
}


function sendMessage(element){
    const text = element.parentElement.querySelector("input").value
    const message = {
        from: name,
        to: receiver,
        text: text,
        type: "message" 
    }
    const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages", message) 
    clearInterval(idMessages)
    promise.then(getMessages)
    promise.catch(window.location.reload)
    receiver = "Todos"
}


function showParticipants(){
    document.querySelector(".blurry").classList.remove("hidden")
    getParticipants()
    if (!idParticipants){
        idParticipants = setInterval(getParticipants,10000)
    }
}

function showChat(){
    document.querySelector(".blurry").classList.add("hidden")
}

function getParticipants(){
    const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants")
    promise.then(writeParticipants)
}

function writeParticipants(reply){
    let participants = reply.data
    document.querySelector(".participants").innerHTML = `   <div class="participant" onclick="chooseReceiver(this)">
                                                                <div class="profile">
                                                                    <ion-icon name="people"></ion-icon>
                                                                    <span>Todos</span>
                                                                </div>
                                                                <ion-icon name="checkmark-outline"  class="selected hidden"></ion-icon>
                                                            </div>`
    for(let i = 0; i < participants.length; i++){
        document.querySelector(".participants").innerHTML += `  <div class="participant" onclick="chooseReceiver(this)">
                                                                    <div class="profile">
                                                                        <ion-icon name="person-circle"></ion-icon>
                                                                        <span>${participants[i].name}</span>
                                                                    </div>
                                                                    <ion-icon name="checkmark-outline"  class="selected hidden"></ion-icon>
                                                                </div>`
    }
}

function chooseReceiver(element){
    let checkmark = element.querySelector(".selected")
    let participants = document.querySelectorAll(".participant")
    if(!checkmark.classList.contains("hidden")){
        checkmark.classList.add("hidden")
    } else{
        for(let i = 0; i < participants.length; i++){
            participants[i].querySelector(".selected").classList.add("hidden")
        }
        element.querySelector(".selected").classList.remove("hidden")
    }
    for(let i = 0; i < participants.length; i++){
        if(!participants[i].querySelector(".selected").classList.contains("hidden")){
            receiver = participants[i].querySelector("span").innerText;
            return 
        }
    }
    receiver = "Todos"
}