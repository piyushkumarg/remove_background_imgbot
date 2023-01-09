const axios = require("axios").default;
const { Telegraf } = require("telegraf");
const config = require("./config.json");
const FormData = require("form-data");

const bot = new Telegraf(config.bot_token);

const removeBg = async function (url) {
  const formData = new FormData();
  formData.append("image_url", url);

  const res = await axios.post(
    "https://api.remove.bg/v1.0/removebg",
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        "X-Api-Key": config.remove_bg_token,
      },
      responseType: "arraybuffer",
    }
  );

  return res.data;
};

bot.command("start", (ctx) => {
  ctx.reply("hello to Remove Background channel\n Send me a Photo.");
});

bot.on("photo", async (ctx) => {
  const file_id =
    ctx.update.message.photo[ctx.update.message.photo.length - 1].file_id;
  const file_path = (await ctx.telegram.getFile(file_id)).file_path;
  const url = `https://api.telegram.org/file/bot${config.bot_token}/${file_path}`;

  const photo = await removeBg(url);
  ctx.replyWithDocument({ source: photo, filename: "test.jpg" });
});

bot.launch();
