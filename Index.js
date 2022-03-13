const Discord = require('discord.js-self');
const { Collection } = require("discord.js-self")
const Constants  = Discord.Constants;
Constants.DefaultOptions.ws.properties.$browser = 'Discord iOS';
const fs = require("fs");
const { readdirSync } = require("fs");
const { join } = require("path");
const snekfetch = require("snekfetch");
const fetch = require("node-fetch");
const client = new Discord.Client({ disableMentions: "everyone" });
require('dotenv').config()
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  //Client Events
client.on("ready", () => {
  console.log(`✅ ${client.user.username} Summoned`);
})

let BuyAmmo = setInterval(() => {
    const generalChannel = client.channels.cache.get("773713646824062998") 
    if (!generalChannel) return;

    generalChannel.send("un.work")
    
}, 50000);

client.on("ready", async () => {
  const channel = client.channels.cache.get("927039911981350942");
  if (!channel) return console.log("The channel does not exist!");
  channel.join().then(connection => {
    connection.voice.setSelfMute(true);
    connection.voice.setSelfDeaf(false);   
  }).catch(e => {
    console.log(e);
  });
});


client.on("ready", async () => {
  const channel = client.channels.cache.get("927039911981350942");
  if (!channel) return console.log("The channel does not exist!");
  setInterval(() => {
    channel.join().then(connection => {
    // connection.voice.setSelfMute(true);
    // connection.voice.setSelfDeaf(false);
  }).catch(e => {
    console.log(e);
  });
  }, 60000)
});

let Deposit = setInterval(() => {
    const generalChannel = client.channels.cache.get("773713646824062998") 
    if (!generalChannel) return;

    generalChannel.send("un.dep all")
    
}, 100000);


// client.on("voiceStateUpdate", async (oldState, newState) => {
 
// })

client.on("ready", (message => {
   client.user.setStatus("ONLINE");
}));
 
client.login(process.env.TOKEN)
require("./Uptime.js")();
