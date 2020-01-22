const base64Decode = string => Buffer.from(string, `base64`).toString();

module.exports = (bot, db) => {
    const showMessageHandler = async (data, ctx) => {
        const { inline_message_id: inlineMessageID } = ctx.callbackQuery;
        const [sender, receiver] = data;

        if (
            sender !== ctx.from.id &&
            (typeof receiver === `number` && ctx.from.id !== receiver ||
                typeof receiver === `string` &&
                    ctx.from.username !== receiver)
        ) {
            return await ctx.answerCbQuery(`You are not allowed to read this.`);
        }

        const whisper = await db.whispers.findOne({ inlineMessageID });

        if (!whisper) {
            return await ctx.answerCbQuery(`Unable to find whisper.`);
        }

        await ctx.answerCbQuery(base64Decode(whisper.message), true, {
            url: `https://t.me/${ctx.botInfo.username}?start=${whisper.id}`,
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
