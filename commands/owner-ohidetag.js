const {
    bold
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "ohidetag",
    aliases: ["oht"],
    category: "owner",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            group: true,
            owner: true
        });
        if (status) return ctx.reply(message);

        const input = ctx._args.join(" ") || null;

        try {
            const data = await ctx.group().members();
            const len = data.length;
            const mentions = [];
            for (let i = 0; i < len; i++) {
                const serialized = data[i].id.split("@")[0];
                mentions.push({
                    mention: `${serialized}@s.whatsapp.net`
                });
            }

            return ctx.reply({
                text: `${input || "@everyone"}`,
                mentions: mentions.map((mention) => mention.mention)
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};