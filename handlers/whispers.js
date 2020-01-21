const uuid = require(`uuid/v4`);

const base64Encode = string => Buffer.from(string).toString(`base64`);
const inlineOptions = {
    cache_time: 0,
    is_personal: true,
};

module.exports = (bot, db) => {
    const whisperHandler = async ctx => {
        let [, user, message] = ctx.match;

        const _user = await db.users.findOne({
            $or: [
                { username: user.slice(1).toLowerCase() },
                { id: parseInt(user) },
            ],
        });

        user = _user || user;

        const id = uuid();
        const sender = ctx.from.id;
        const receiverID = [`string`, `number`].includes(typeof user)
            ? user
            : user.id;
        const receiverName = [`string`, `number`].includes(typeof user)
            ? user
            : user.name;

        await db.whispers.insert({
            id,
            sender,
            receiver: receiverID,
            message: base64Encode(message),
        });

        await ctx.answerInlineQuery(
            [
                {
                    type: `article`,
                    id,
                    title: `🔒 Send a whisper to ${receiverName}`,
                    description: `Whispers are secret messages that only the user you specify can read.`,
                    input_message_content: {
                        message_text: `🔒 A whisper message for ${receiverName}. Only they can open it.`,
                        disable_web_page_preview: true,
                    },
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: `Show Message 🔐`,
                                    callback_data: JSON.stringify([
                                        id,
                                        sender,
                                        receiverID,
                                    ]),
                                },
                            ],
                        ],
                    },
                },
            ],
            inlineOptions
        );
    };

    bot.inlineQuery(/^\s*(@\S+?|\d+)\s+(.+)$/s, ctx => whisperHandler(ctx));
};
