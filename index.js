require(`dotenv`).config();

const path = require(`path`);
const NeDB = require(`nedb-promise`);
const { Bot } = require(`grammy`);
const bot = new Bot(process.env.BOT_TOKEN);

const db = {
    whispers: new NeDB({
        filename: path.join(__dirname, `stores/whispers.db`),
        timestampData: true,
        autoload: true,
    }),
    users: new NeDB({
        filename: path.join(__dirname, `stores/users.db`),
        timestampData: true,
        autoload: true,
    }),
};

db.whispers.ensureIndex({ fieldName: `id`, unique: true }, err => {
    if (err) {
        throw err;
    }
});

db.users.ensureIndex({ fieldName: `id`, unique: true }, err => {
    if (err) {
        throw err;
    }
});

db.users.ensureIndex({ fieldName: `username`, unique: true }, err => {
    if (err) {
        throw err;
    }
});

bot.catch(console.error);

require(`./handlers`)(bot, db);

bot.start().then(() => {
    console.log(`@${bot.botInfo.username} is running...`);
});
