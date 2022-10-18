module.exports = bot => {
    const forwardHandler = async ctx => {
        if (ctx.message.forward_sender_name) {
            return await ctx.reply(
                `Sorry, this user has chosen to hide their ID when forwarding their messages.`,
            );
        } else if (!ctx.message.forward_from) {
            return await ctx.reply(`Unable to get user ID.`);
        }

        const { id } = ctx.message.forward_from;

        await ctx.reply(
            `Click the button below, select a chat and type your secret message. Sounds simple, right?`,
            {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: `Send Whisper`,
                                switch_inline_query: `${id} `,
                            },
                        ],
                    ],
                },
            },
        );
    };

    bot.on(`:forward_date`, ctx => forwardHandler(ctx));
};
