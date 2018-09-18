// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values.
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`Created by croyke`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});


client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.

  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;

  // Also good practice to ignore any message that does not start with our prefix,
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Let's go with a few common example commands! Feel free to delete or change those.

  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

  if(command === "test") {
    return message.reply("https://cdn.discordapp.com/attachments/475214896192159755/491611659131944962/nfprgg_th.png");

  }

  if(command === "help") {
    return message.reply("De help commands van de GameDome bot zijn:\n1: /partners om de partners van ozne discord tezien\n2: /ban om een speler teverbannen (Staff only)\n3: /kick om spelers tekicken(Staff only)\n4: /help geeft alle commands van de bot weer\n5:/ping geeft de snelheid van de bot weer\n6: /clearchat verwijderd de chat'\n7: /info geeft informatie over de bot")
  }

  if(command === "partners") {
    return message.reply("Onze partners zijn\nMartyCraft\nDeRareMan")
  }

  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit:
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
      return message.reply("sorry je hebt geen toestemming om mensen tekicken");

    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("speler niet gevonden!!");
    if(!member.kickable)
      return message.reply("ik kan deze speler niet kicken! is hij een role hoger? heb ik wel kick permissie?");

    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "Geen reden opgegeven";

    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} ik kom hem niet kicken doordat: ${error}`));
    message.reply(`${member.user.tag} is gekicked door ${message.author.tag} doordat hij of zij: ${reason}`);

  }

  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
      return message.reply("sorry maar je heb geen toestemming om mensen te bannen");

    let member = message.mentions.members.first();
    if(!member)
      return message.reply("dit is geen geldige persoon!");
    if(!member.bannable)
      return message.reply("Ik kan de speler niet bannen! heeft hij een hogere role? heb ik wel ban permissie om mensen tebannen?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "Geen reden opgegeven";

    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} ik kan dit niet doen doordat : ${error}`));
    message.reply(`${member.user.tag} is verbannen door ${message.author.tag} omdat hij of zij: ${reason}`);
  }


if(command === "say") {
  // makes the bot say something and delete the message. As an example, it's open to anyone to use.
  // To get the "message" itself we join the `args` back into a string with spaces:
  const sayMessage = args.join(" ");
  // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
  message.delete().catch(O_o=>{});
  // And we get the bot to say the thing:
  message.channel.send(sayMessage);
}
if(command === "report") {
  let member = message.mentions.members.first();
  let reason = args.slice(1).join(' ');
  if(!reason) reason = "Geen reden opgegeven";
  message.delete().catch(O_o=>{});
  message.reply(`${member.user.tag} id ${member.user.id} is Gereport door ${message.author.tag} reden: ${reason}`);
}


  if(command === "clearchat" `${User}`) {
    // This command removes all messages from all users in the channel, up to 100.

    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);

    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("gebruik een nummer tussen de 2 en de 100");

    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`kon de berichten niet verwijderen doordat: ${error}`));
  }
});

client.login(config.token);
