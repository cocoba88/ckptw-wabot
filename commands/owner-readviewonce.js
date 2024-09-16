const {
    MessageType,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "readviewonce",
    aliases: ["owner"],
    category: "owner",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            owner: true
        });
        if (status) return ctx.reply(message);

        const quotedMessage = ctx.quoted;

        if (!(await quotedMessage.media.toBuffer())) return ctx.reply(quote(global.tools.msg.generateInstruction(["reply"], ["viewOnce"])));

        try {
            const quoted = quotedMessage?.viewOnceMessageV2?.message;
            const messageType = Object.keys(quoted)[0];
            const media = await ctx.downloadContentFromMessage(quoted[messageType], messageType.slice(0, -7));

            let buffer = Buffer.from([]);
            for await (const chunk of media) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            if (messageType === MessageType.imageMessage) {
                await ctx.reply({
                    image: buffer
                });
            } else if (messageType === MessageType.videoMessage) {
                await ctx.reply({
                    video: buffer
                });
            }
        } catch (error) {
            console.error("[ckptw-wabot] Kesalahan:", error);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};