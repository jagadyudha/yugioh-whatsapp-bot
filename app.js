const qrcode = require("qrcode-terminal");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.initialize();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", () => {
  console.log("AUTHENTICATED");
});

client.on("ready", () => {
  console.log("Client is ready!");
});

//Replying Messages with image from url
client.on("message", async (message) => {
  if (message.body === "meme") {
    //get media from url
    const media = await MessageMedia.fromUrl(
      "https://user-images.githubusercontent.com/41937681/162612030-11575069-33c2-4df2-ab1b-3fb3cb06f4cf.png"
    );

    //replying with media
    client.sendMessage(message.from, media, {
      caption: "meme",
    });
  }
});
