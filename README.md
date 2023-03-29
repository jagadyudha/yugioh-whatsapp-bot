---
title: "How to Create a Whatsapp Bot With Node.js"
description: "Using a third-party library to make a WhatsApp bot for free and customable."
date: "2022-04-05"
tags:
  - nodejs
  - axios
---

## Table of Contents

1. [Introduction](#introduction)
2. [Required Libraries](#required-libraries)
3. [How to Run Program](#how-to-run-program)
4. [Replying Messages](#replying-messages)
5. [Create Authentication](#create-authentication)
6. [Replying Messages With Image](#replying-messages-with-image-from-url)
7. [Implementation with the Yu-Gi-oh API](#implementation-with-the-yu-gi-oh-api)
8. [Conclusion](#conclusion)

## Introduction

WhatsApp Messenger is a cross-platform messaging app that lets us send and receive messages in real time. WhatsApp Messenger is used by almost everyone on the planet. Unfortunately, unlike Telegram, Whatsapp's API usage is still restricted.

In this post, I'll show you how to make a free Whatsapp bot with the help of a third-party library.

<img
  alt='Lets Go'
  src='https://media.giphy.com/media/XBLOKUWPnzm6U8gQWS/giphy.gif'
/>

## Required Libraries

Installing the library from npm requires first installing `node.js 12` or higher, followed by installing library from the npm package.

Installing `whatsapp-web.js`:

```bash
$ npm install whatsapp-web.js

or

$ yarn add whatsapp-web.js
```

Installing `qrcode-terminal`:

```bash
$ npm install qrcode-terminal

or

$ yarn add qrcode-terminal
```

## How to Run Program

Create a file called `app.js` in the project and paste this code into it.

```javascript
const qrcode = require("qrcode-terminal");
const { Client } = require("whatsapp-web.js");

const client = new Client();

client.initialize();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});
```

Then, on the terminal or command prompt, type this command.

```bash
$ node app

or

$ node app.js
```

When the command is executed, a QR code appears, which we will scan with the Whatsapp account we used to create the bot.

<img
  alt='QR code'
  src='https://res.cloudinary.com/dlpb6j88q/image/upload/v1649589295/jagad.dev/posts/how-to-create-a-whatsapp-bot-with-node-js/Qr_code_mkrfyt.png'
/>

## Replying Messages

The goal of creating a bot is for it to be able to respond to messages. So, in the project that we created before, paste the following code.

```javascript
//Replying Messages
client.on("message", (message) => {
  if (message.body === "hello") {
    message.reply("Hiiiii");
  }
});
```

When someone else types a `hello` message to bot, we'll make the bot reply to it.

<img
  alt='Replying message'
  src='https://res.cloudinary.com/dlpb6j88q/image/upload/v1649589886/jagad.dev/posts/how-to-create-a-whatsapp-bot-with-node-js/Replying_Messages_cgicwe.png'
/>

## Create Authentication

The function of creating authentication is that we don't have to login (scan QR code) every time we run an `app.js`.

Here is the code to create authentication :

```javascript
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");

//store authentication data to a file
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

client.on("message", (message) => {
  if (message.body === "hello") {
    message.reply("Hiiiii");
  }
});
```

## Replying Messages With Image From Url

On the other hand, bots are less interactive if they only reply with text messages, so we can reply to messages using media such as images.

Here is the code to make bot replying with media:

```javascript
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
```

We'll make the bot respond with an image whenever someone else types a `meme` message.

<img
  alt='Replying Message with Media'
  src='https://res.cloudinary.com/dlpb6j88q/image/upload/v1649585406/jagad.dev/posts/how-to-create-a-whatsapp-bot-with-node-js/Replying_Messages_with_Image_k6lo5n.png'
/>

## Implementation with the Yu-Gi-oh API

to prove that the library can be adjusted to fit the needs of the case study. In this case, I'll use the [YGOPRODeck Yu-Gi-Oh! API](https://db.ygoprodeck.com/api-guide/).

The following is how the Yu-Gi-Oh! bot that we will make works:

1. Someone typed `Yugioh Card Name` via WhatsApp message.
2. The card's name will be checked against the database.
3. If the Yugioh Card Name is found in the database, the bot will respond with the card's image.

An extra library called `Axios` is required for the WhatsApp bot to be able to send requests to the Yu-Gi-Oh! API:

```bash
$ npm install axios

or

$ yarn add axios
```

Here is the complete code of the Yu-Gi-Oh! bot:

```javascript
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const axios = require("axios");

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.initialize();

client.on("qr", (qr) => {
  console.log("QR RECEIVED", qr);
});

client.on("authenticated", () => {
  console.log("AUTHENTICATED");
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (msg) => {
  if (msg.body) {
    axios
      .get(
        `https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${encodeURIComponent(
          msg.body
        )}`
      )
      .then(async (res) => {
        if (res.data.error) {
          msg.reply("No card matching your query was found in the database.");
        } else {
          const media = await MessageMedia.fromUrl(
            res.data.data[0].card_images[0].image_url
          );
          client.sendMessage(msg.from, media, {
            caption: `Name : ${res.data.data[0].name}\nType : ${res.data.data[0].type}\nDesc : ${res.data.data[0].desc}
            `,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
});
```

I'm attempting to type a message using the text from the Yu-Gi-Oh! card `Card Shuffle` and then the bot responds with a photo and description of the card we sent before.

<img
  alt='Yu-Gi-Oh API'
  src='https://res.cloudinary.com/dlpb6j88q/image/upload/v1649586408/jagad.dev/posts/how-to-create-a-whatsapp-bot-with-node-js/yugioh_api_1_quhpcm.png'
/>

I was trying to type a message using another name for Yugioh's card, called Burning Bamboo Sword.

<img
  alt='Yu-Gi-Oh API'
  src='https://res.cloudinary.com/dlpb6j88q/image/upload/v1649586408/jagad.dev/posts/how-to-create-a-whatsapp-bot-with-node-js/yugioh_api_2_jtcbld.png'
/>

## Conclusion

Because the WhatsApp API is still limited, third-party tools like `whatsapp-web.js` help a lot. However, since this library is not affiliated with WhatsApp, there are still many problems.
