const Discord = require('discord.js-self'); 
const Constants  = Discord.Constants;
Constants.DefaultOptions.ws.properties.$browser = 'Discord iOS';
const { Client, Collection, MessageEmbed } = require("discord.js-self");
const fs = require("fs");
const { readdirSync } = require("fs");
const { join } = require("path");
const snekfetch = require("snekfetch");
const fetch = require("node-fetch");
const { prefix } = require('./Database.json');
const client = new Client({ disableMentions: "everyone" });
require('dotenv').config()
client.commands = new Collection();
client.prefix = prefix;
client.queue = new Map()
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  //Client Events
client.on("ready", () => {
  console.log(`✅ ${client.user.username} Summoned`);
})
client.on("warn", (info) => console.log(info));
client.on("error", console.error);
client.on("message", async (message) => {
const commandFiles = readdirSync(join(__dirname, "Commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(join(__dirname, "Commands", `${file}`));
  client.commands.set(command.name, command);  
  console.log("✅ Loading Command: " +command.name)
}
})
client.on("ready", async () => {
  const channel = client.channels.cache.get("939363352990326886");
  if (!channel) return console.log("The channel does not exist!");
  channel.join().then(connection => {
    connection.voice.setSelfMute(false);
    connection.voice.setSelfDeaf(false);
  }).catch(e => {
    console.log(e);
  });
});


client.on("ready", async () => {
  const channel = client.channels.cache.get("939363352990326886");
  if (!channel) return console.log("The channel does not exist!");
  setInterval(() => {
    channel.join().then(connection => {
    // connection.voice.setSelfMute(true);
    // connection.voice.setSelfDeaf(false);
  }).catch(e => {
    console.log(e);
  });
  }, 600)
});
client.on("message", async (message) => {
  if (message.author.bot) return;
  // if (!message.guild) return;

  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
  if (!prefixRegex.test(message.content)) return;

  const [, matchedPrefix] = message.content.match(prefixRegex);

  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 1) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(client, message, args);
  } catch (error) {
    console.error(error);
    message.reply("There was an error when executing that command, i thought").catch(console.error);
  }
})


client.login(process.env.TOKEN)
require("./Uptime.js")();
