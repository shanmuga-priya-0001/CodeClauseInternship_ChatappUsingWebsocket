const socket = io();

const totmem = document.getElementById('total-member');
const messageContent = document.getElementById('messege-container');
const nameInput = document.getElementById('input-text');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

const messageTone = new Audio('/I Love You - Message Tone.mp3');

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
})

socket.on('clients-total', (data) => {
    console.log(data);
    totmem.innerText = `Total Members: ${data}`;
})

function sendMessage() {
    if (messageInput.value === '') return
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date()
    };

    socket.emit('message', data);
    addMessageToUI(true, data);
    messageInput.value = '';

}

socket.on('chat-message', (data) => {
    messageTone.play();
    //console.log(data);
    addMessageToUI(false, data)
})

function addMessageToUI(isOwnMessage, data) {
    clearFeedback();
    const element = `<li class="${isOwnMessage ? 'messege-right' : 'messege-left'}">
    <p class="messege">
        ${data.message}
        <span>${data.name} 🌀 ${moment(data.dateTime).fromNow()} </span>
    </p>`;

    messageContent.innerHTML += element;
    scrollToBottom();
}


function scrollToBottom() {
    messageContent.scrollTo(0, messageContent.scrollHeight);
}

messageInput.addEventListener('focus', (e) => {
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing a message...`
    });
})

messageInput.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing a message ...`,
    });
})

messageInput.addEventListener('blur', (e) => {
    socket.emit('feedback', {
        feedback: ``,
    });
})

socket.on('feedback', (data) => {
    clearFeedback();
    const element = `
    <li class="messege-feedback">
    <p class="feedback" id="feedback">
        ${data.feedback} 
    </p>
</li>`;
    messageContent.innerHTML += element;
    
})

function clearFeedback() {
    document.querySelectorAll('li.messege-feedback').forEach(element => {
        element.parentNode.removeChild(element);
    })
}