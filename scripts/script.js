
//setTimeout(getUserName,100)


function getUserName(){
    const name = prompt("Qual o seu lindo nome?")
    const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants",{ name:name })
    promise.then(getMessages)
    promise.catch(getAnotherUserName)
}
function printerror(error){
    console.log(error.response.status)
    console.log(error.response.data)
}

function getAnotherUserName(){
    const name = prompt("Digite outro nome pois, o outro já está em uso: ")
    const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants",{ name:name })
    promise.then(getMessages)
    promise.catch(getAnotherUserName)
}

function getMessages(){
    const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages")
    promise.then(loadMessages)
}

function loadMessages(reply){
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


function sendMessage(){
    console.log("mensagem enviada")
}