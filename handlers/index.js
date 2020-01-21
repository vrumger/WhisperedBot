const handlers = [`updateUsers`, `forward`, `start`, `whispers`, `showMessage`];

module.exports = (bot, db) =>
    handlers.forEach(handler => require(`./${handler}`)(bot, db));
