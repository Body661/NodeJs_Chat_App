const socket = io()

// Elements
const msgForm = document.querySelector('.msg-form')
const userMsg = document.querySelector('.msg')
const msgSendBtn = document.querySelector('.msg-btn')
const locationBtn = document.querySelector('.location-btn')
const messages = document.querySelector('.messages')

// Templates
const messageTemplate = document.querySelector('.message-template').innerHTML
const locationMessageTemplate = document.querySelector('.location-message-template').innerHTML
const chatSidebarTemplate = document.querySelector('.sidebar-template').innerHTML

// Options
const { name, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoScroll = () => {
    const newMessage = messages.lastElementChild

    const newMessageStyles = getComputedStyle(newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin

    const visibleHeight = messages.offsetHeight

    const containerHeight = messages.scrollHeight

    const scrollOffset = messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset + 1) {
        messages.scrollTop = messages.scrollHeight
    }
}

// Recive Message
socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        name: message.name,
        message: message.text,
        time: moment(message.timeStamp).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

// Recive Location Message
socket.on('locationMessage', (location) => {
    const html = Mustache.render(locationMessageTemplate, {
        name: location.name,
        url: location.url,
        time: moment(location.timeStamp).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

// Send Message
msgForm.addEventListener('submit', (e) => {
    e.preventDefault()

    if (userMsg.value.trim().length === 0) {
        return console.log('Please enter a message')
    }

    msgSendBtn.setAttribute('disabled', 'disabled')

    socket.emit('sendMsg', userMsg.value, (error) => {
        userMsg.value = ''
        msgSendBtn.removeAttribute('disabled')
        userMsg.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered successfully')
    })
})

// Send Location Message
locationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    locationBtn.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            locationBtn.removeAttribute('disabled')
            console.log('Location shared')
        })
    })
})

// Join room
socket.emit('join', { name, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})

// Rendering users
socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(chatSidebarTemplate, {
        users,
        room
    })
    document.querySelector(".chat__sidebar").innerHTML = html
})
