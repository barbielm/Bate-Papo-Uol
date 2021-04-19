
let name, idConnection 
let idParticipants = null
let receiver = "Todos"
let visibility = "Público"


function getUserName(){
    name = document.querySelector(".login input").value
    document.querySelector(".login input").classList.add("hidden")
    document.querySelector(".login button").style.display = "none"
    document.querySelector(".login .gif").classList.remove("hidden")
    document.querySelector(".login span").classList.remove("hidden")
    const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants",{ name: name })
    promise.then(getMessages)
    promise.catch(getAnotherUserName)
}


function getAnotherUserName(){
    alert("Esse user já está logado")
    location.reload()
}


function keepConnection(name){
    axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status", { name: name })
}

function getMessages(){
    document.querySelector(".login").classList.add("hidden")
    idConnection = setInterval(keepConnection,5000,name)
    document.querySelector(".loading").classList.remove("hidden")
    const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages")
    promise.then(loadMessages)
}

function loadMessages(reply){
    document.querySelector(".loading").classList.add("hidden")
    let messages = reply.data
    for(let i = 0; i < messages.length ; i++){
        if(messages[i].type !== "private_message" || messages[i].to === name){
            writeMessage(messages[i])
        }
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
        type: "" 
    }
    if(visibility === "Público"){
        message.type = "message"
    } else{
        message.type = "private_message"
    }
    const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages", message) 
    clearInterval(idConnection)
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
    checkSelectedOptions()
}

function checkSelectedOptions(){
    const participants = document.querySelectorAll(".participant")
    const visibilities = document.querySelectorAll(".visibility") 
    let counter1 = 0
    let counter2 = 0
    for(let i = 0; i < participants.length; i++){
        if(participants[i].querySelector("span").innerText === receiver ){
            participants[i].querySelector(".selected").classList.remove("hidden")
            counter1++
        }
    }
    for(let i = 0; i < visibilities.length; i++){
        if(visibilities[i].querySelector("span").innerText === visibility ){
            visibilities[i].querySelector(".selected").classList.remove("hidden")
            counter2++
        }
    }
    if(counter1 === 0){
        receiver = "Todos"
        document.querySelector(".participant .selected").classList.remove("hidden")
    }
    if(counter2 === 0){
        visibility = "Público"
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
        }
    }
    checkIfPrivate()
}

function chooseVisibility(element){
    let checkmark = element.querySelector(".selected")
    let options = document.querySelectorAll(".visibility")
    if(!checkmark.classList.contains("hidden")){
        checkmark.classList.add("hidden")
    } else {
        for(let i = 0; i < options.length; i++){
            options[i].querySelector(".selected").classList.add("hidden")
        }
        element.querySelector(".selected").classList.remove("hidden")
    }
    for(let i = 0; i < options.length; i++){
        if(!options[i].querySelector(".selected").classList.contains("hidden")){
            visibility = options[i].querySelector("span").innerText; 
        }
    }   
    checkIfPrivate()
}

function checkIfPrivate(){
    const privateReceiver = document.querySelector(".footer .private-receiver")
    if(visibility === "Reservadamente"){
        privateReceiver.innerText = `Enviando para ${receiver} (reservadamente)`
        privateReceiver.classList.remove("hidden")
    } else{
        privateReceiver.innerText = ``
        privateReceiver.classList.add("hidden")
    }
}