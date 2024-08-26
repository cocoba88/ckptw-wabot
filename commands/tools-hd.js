const {
    createAPIUrl
} = require("../tools/api.js");
const {
    getMediaQuotedMessage
} = require("../tools/general.js");
const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const {
    MessageType
} = require("@mengkodingan/ckptw/lib/Constant");
const axios = require("axios");
const FormData = require("form-data");
const Jimp = require("jimp");
const mime = require("mime-types");

module.exports = {
    name: "hd",
    aliases: ["enhance", "enhancer", "hd", "hdr", "remini"],
    category: "tools",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const msgType = ctx.getMessageType();
        const quotedMessage = ctx.quoted;

        if (msgType !== MessageType.imageMessage && !quotedMessage) return ctx.reply(quote(`📌 Berikan atau balas media berupa gambar!`));

        try {
            const type = quotedMessage ? ctx.getContentType(quotedMessage) : null;
            const object = type ? quotedMessage[type] : null;
            const buffer = type === "imageMessage" ?
                await getMediaQuotedMessage(object, type.slice(0, -7)) :
                await ctx.getMediaMessage(ctx.msg, "buffer");
            const result = await upscale(buffer, ctx.args[0], ctx.args[1] === "anime");

            return await ctx.reply({
                image: {
                    url: result.image
                },
                mimetype: mime.contentType("png")
            });
        } catch (error) {
            console.error("Error", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};

// Created by https://github.com/ZTRdiamond
async function upscale(buffer, size = 2, anime = false) {
    if (!buffer) throw new Error("undefined buffer input!");
    if (!Buffer.isBuffer(buffer)) throw new Error("invalid buffer input");
    if (!/(2|4|6|8|16)/.test(size.toString())) throw new Error("invalid upscale size!");

    const image = await Jimp.read(buffer);
    const {
        width,
        height
    } = image.bitmap;
    const newWidth = width * size;
    const newHeight = height * size;

    const form = new FormData();
    form.append("name", "upscale-" + Date.now());
    form.append("imageName", "upscale-" + Date.now());
    form.append("desiredHeight", newHeight.toString());
    form.append("desiredWidth", newWidth.toString());
    form.append("outputFormat", "png");
    form.append("compressionLevel", "none");
    form.append("anime", anime.toString());
    form.append("image_file", buffer, {
        filename: "upscale-" + Date.now() + ".png",
        contentType: 'image/png',
    });

    const response = await axios.post("https://api.upscalepics.com/upscale-to-size", form, {
        headers: {
            ...form.getHeaders(),
            origin: "https://upscalepics.com",
            referer: "https://upscalepics.com"
        }
    });

    const data = response.data;
    if (data.error) throw new Error("Error from upscaler API!");

    return {
        status: true,
        image: data.bgRemoved
    };
}