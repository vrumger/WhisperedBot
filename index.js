require(`dotenv`).config();

const path = require(`path`);
const NeDB = require(`nedb-promise`);
const Telegraf = require(`telegraf`);
const bot = new Telegraf(process.env.BOT_TOKEN);

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

bot.launch().then(() => {
    console.log(`@${bot.options.username} is running...`);
});
