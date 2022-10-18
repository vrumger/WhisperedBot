const base64Decode = string => Buffer.from(string, `base64`).toString();

module.exports = (bot, db) => {
    const showMessageHandler = async (data, ctx) => {
        const { inline_message_id: inlineMessageID } = ctx.callbackQuery;
        let [sender, receiver] = data;

        if (typeof receiver === `string`) {
            const user = await db.users.findOne({
                username: receiver.slice(1).toLowerCase(),
            });

            if (user) {
                receiver = user.id;

                await ctx.editMessageReplyMarkup({
                    inline_keyboard: [
                        [
                            {
                                text: `Show Message 🔐`,
                                callback_data: JSON.stringify([
                                    sender,
                                    receiver,
                                ]),
                            },
                        ],
                    ],
                });
            }
        }

        if (sender !== ctx.from.id && receiver !== ctx.from.id) {
            return await ctx.answerCallbackQuery({
                text: `You are not allowed to read this.`,
                show_alert: true,
            });
        }

        const whisper = await db.whispers.findOne({ inlineMessageID });

        if (!whisper) {
            return await ctx.answerCallbackQuery({
                text: `Unable to find whisper.`,
            });
        }

        await ctx.answerCallbackQuery({
            text: base64Decode(whisper.message),
            show_alert: true,
            url: `https://t.me/${bot.botInfo.username}?start=${whisper.id}`,
        });
    };

    bot.on(`callback_query`, (ctx, next) => {
        let data;

        try {
            const _data = JSON.parse(ctx.callbackQuery.data);

            if (!Array.isArray(_data)) {
                return next();
            }

            data = _data;
        } catch (_) {
            return next();
        }

        showMessageHandler(data, ctx);
    });
};
