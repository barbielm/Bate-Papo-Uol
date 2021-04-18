
let name, id
setTimeout(getUserName,100)

function getUserName(){
    name = prompt("Qual o seu lindo nome?")
    const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants",{ name: name })
    promise.then(getMessages)
    promise.catch(getAnotherUserName)
}


function getAnotherUserName(){
    name = prompt("Digite outro nome pois, o outro já está em uso: ")
    const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants",{ name: name })
    promise.then(getMessages)
    promise.catch(getAnotherUserName)
}


function keepConnection(name){
    axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/status", { name: name })
}

function getMessages(){
    id = setInterval(keepConnection,5000,name)
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
        to: "Todos",
        text: text,
        type: "message" 
    }
    const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages", message) 
    clearInterval(id)
    promise.then(getMessages)
    promise.catch(location.reload)
}