const users = []

const addUser = ({ id, name, room }) => {
    name = name.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!name || !room) {
        return {
            error: 'Username and room are required'
        }
    }

    // Check for exiting user
    const unique = users.find(user => {
        return user.room === room && user.name === name
    })

    // Validate username
    if (unique) {
        return {
            error: 'Username is already in use'
        }
    }

    // Store user
    const user = { id, name, room }
    users.push(user)

    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find(user => user.id === id)
}

const getUsersInRoom = (room) => {
    return users.filter(user => user.room === room)
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom }