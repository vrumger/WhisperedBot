const escapeHtml = require(`@youtwitface/escape-html`);

const base64Decode = string => Buffer.from(string, `base64`).toString();

const startMessage = `Hello, I'm a bot to send secret messages in groups, called whispers. I work in inline mode, meaning you can use me in any group even if I'm not in there.

It is very easy to use me, simply forward a message from the user who you want to send a whisper to and I'll help you out.`;

module.exports = (bot, db) => {
    const startHandler = async ctx => {
        const id = ctx.message.text
            .slice(ctx.message.entities[0].length)
            .trim();

        if (!id) {
            return await ctx.reply(startMessage);
        }

        const whisper = await db.whispers.findOne({ id });

        if (!whisper) {
            return await ctx.reply(`Whisper not found.`);
        }

        if (typeof whisper.receiver === `string`) {
            const user = await db.users.findOne({
                username: whisper.receiver.slice(1).toLowerCase(),
            });

            if (user) {
                whisper.receiver = user.id;
            }
        }

        if (
            whisper.sender !== ctx.from.id &&
            whisper.receiver !== ctx.from.id
        ) {
            return await ctx.reply(`You are not allowed to read this.`);
        }

        const sender = await db.users.findOne({ id: whisper.sender });
        const senderName = escapeHtml(sender.name);
        const message = escapeHtml(base64Decode(whisper.message));

        await ctx.reply(
            `Whisper from ${senderName}:\n\n<code>${message}</code>`,
            { parse_mode: `html` },
        );
    };

    bot.command(`start`, ctx => startHandler(ctx));
};
