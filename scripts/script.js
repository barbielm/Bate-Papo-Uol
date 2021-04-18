

function getMessages(){
    promisse = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/messages")
    promisse.then(loadMessages)
}

function loadMessages(reply){
    let messages = reply.data
    for(let i = 0; i < messages.length ; i++){
        writeMessage(messages[i])
    }
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