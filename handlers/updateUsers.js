module.exports = (bot, db) => {
    const updateUser = async user => {
        let fullName = `Deleted Account`;

        if (user.first_name && user.last_name) {
            fullName = `${user.first_name} ${user.last_name}`;
        } else if (user.first_name) {
            fullName = user.first_name;
        } else if (user.last_name) {
            fullName = user.last_name;
        }

        try {
            await db.users.update(
                { id: user.id },
                {
                    id: user.id,
                    name: fullName,
                    username: user.username
                        ? user.username.toLowerCase()
                        : null,
                },
                { upsert: true }
            );
        } catch (_) {
            // Ignore errors
        }
    };

    bot.use((ctx, next) => {
        [
            ctx.message && ctx.message.forwarded_from,
            ctx.message && ctx.message.from,
            ctx.editedMessage && ctx.editedMessage.from,
            ctx.callbackQuery && ctx.callbackQuery.from,
            ctx.inlineQuery && ctx.inlineQuery.from,
            ctx.channelPost && ctx.channelPost.from,
            ctx.editedChannelPost && ctx.editedChannelPost.from,
            ctx.shippingQuery && ctx.shippingQuery.from,
            ctx.preCheckoutQuery && ctx.preCheckoutQuery.from,
            ctx.chosenInlineResult && ctx.chosenInlineResult.from,
        ]
            .filter(Boolean)
            .forEach(updateUser);

        next();
    });
};
