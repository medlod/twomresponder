/*
 * DoorDash Discord Bot
 * Auto-responds to new tickets
 */

const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

var regex = RegExp(config.regex);

function acceptTicket(channel) {
	var re = /\*\*[\r?\n]([a-zA-Z\s]+)/
	
	channel.fetchMessages({ limit: 1 })
	.then(messages => {
		messages.first().embeds.forEach((e) => {
			var msg = e.description;
			
			try {
				var key = msg.match(re)[1].toLowerCase().trim();
				console.log(`Ticket for service: ${key}`);
				for (i = 0; i < config.keywords.length; i++) {
					if (key == config.keywords[i]) {
						console.log("Sending reply...");
						channel.send(config.reply);
						break;
					}
				}
			} catch (err) {
				console.error(err);
			}
		});
	})
	.catch(console.error);
}

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	var channel = client.channels.get(config.channelId);
	console.log(`Listening for messages on server: ${channel.guild.name}, channel: ${channel.name}`);
});

client.on('message', msg => {
	if (msg.channel.id != config.channelId)
		return;
	
	var txt;
	msg.embeds.forEach((embed) => {
		txt = embed.description;
	});
	
	if (config.debug)
		console.log(`DEBUG: ${txt}`);
	
	if (!config.enabled)
		return;
	
	if (regex.test(txt)) {
		console.log(`Message Received: ${txt}`);
		var id = regex.exec(txt)[1];
		var channel = client.channels.get(id);
		console.log(`Joining channel: ${channel.name}`);
		
		setTimeout(function() {
			acceptTicket(channel);
		}, config.delay);
	}
});

client.login(config.token);