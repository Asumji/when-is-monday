try { 
     const discord = require("discord.js");
     const date = require("datejs")
     const moment = require("moment")
     const fs = require("fs")

     const db = JSON.parse(fs.readFileSync("./channels.json", "utf8"));

     const bot = new discord.Client();

     bot.on("ready", () => {
          let statuses = [
            ["people write m!help", "WATCHING"],
            ["Everyone always asks when is monday but no one ever asks how is monday.", "PLAYING"]
          ];
          setInterval(function() {
            let status = statuses[Math.floor(Math.random() * statuses.length)];
        
            bot.user.setPresence({
              activity: {
                name: status[0],
                type: status[1],
                url: "https://twitch.tv/RydonBotDiscord"
              },
        
              status: "online"
            });
            console.log("set status to " + status[1] + " " + status[0])
          }, 300000);
         console.log("Bot online omg.")
         setInterval(function() {
            moment.locale("de")
            var string = String(moment().format("LT"))
            string = string.split(":")
        
            var time = {hour:Number(string[0]), minute:Number(string[1])};
            var nextDate = String(Date.today().next().monday())
            nextDate = nextDate.split(" ")
        
            var today = String(Date.today().at(time))
            today = today.split(" ")
            console.log(nextDate[1]+"/"+nextDate[2]+"/"+nextDate[3]+" "+nextDate[4])
            console.log(today[1]+"/"+today[2]+"/"+today[3]+" "+today[4])
        
            var nextDay2 = nextDate[1]+"/"+nextDate[2]+"/"+nextDate[3]
            var today2 = today[1]+"/"+today[2]+"/"+today[3]
        
            var dateFirst = new Date(today2);
            var dateSecond = new Date(nextDay2);
        
            // time difference
            var timeDiff = Math.abs(dateSecond.getTime() - dateFirst.getTime());
        
            // days difference
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            diffDays = diffDays - 1
        
            // difference
            var todayHour = today[4].split(":")[0]
            var todayMinute = today[4].split(":")[1]
        
            var todayMin = 60 - todayMinute
            var todayH = 24 - todayHour - 1
        
            var diffTime =  todayH + ":" + todayMin
            console.log(diffDays + " " + diffTime);
            bot.guilds.cache.forEach(guild => {
              if (db[guild.id]) {
                const channel = guild.channels.cache.get(db[guild.id].channel)
                if (db[guild.id].ping == "true") {
                  channel.send("@everyone\nThe next Monday will be in " + diffDays + " days, " + todayH + " hours and " + todayMin + " minutes.")
                } else {
                  channel.send("The next Monday will be in " + diffDays + " days, " + todayH + " hours and " + todayMin + " minutes.")
                }
              }
            })
         }, 60000);
     });
   
     const PREFIX = "m!";
   
     bot.on("message", message => {
        let args = message.content.substring(PREFIX.length).split(" ");
        let command = message.content.split(" ")[0];

        if (command == PREFIX + "channel") {
            if (!args[1]) {
              message.channel.send("You did not provide a channel id.")
            } else {
              if (!message.guild.channels.cache.get(args[1])) {
                message.channel.send("You did not provide a valid channel id.")
              } else {
                if (!args[2]) {
                  message.channel.send("You did not provide a ping setting.")
                } else {
                  if (args[2].toLowerCase() == "true" || args[2].toLowerCase() == "false") {
                    message.channel.send("Succefully set <#" + args[1] + "> as the countdown channel.")
                    if (!db[message.guild.id]) {
                      db[message.guild.id] = {
                        channel: args[1],
                        ping: args[2]
                      }
                    } else {
                      db[message.guild.id].channel = args[1].toLocaleLowerCase()
                      db[message.guild.id].ping = args[2].toLocaleLowerCase()
                    }

                    fs.writeFileSync("channels.json", JSON.stringify(db, null, 4), err => {
                      console.log(err);
                    });
                  } else {
                    message.channel.send("The Ping Setting can only be set to True or False")
                  }
                }
              }
            }
        }

        if (command == PREFIX + "invite") {
          const embed = new discord.MessageEmbed()
          embed.setTitle("Invite!")
          embed.setURL("https://discord.com/oauth2/authorize?client_id=710152439524884591&scope=bot&permissions=8")
          message.channel.send(embed)
        }

        if (command == PREFIX + "help") {
          message.channel.send("Setup:\n\nm!channel {channel id} {ping setting}\nSet the countdown channel.\n\nm!invite\nInvite me to your server.")
        }
     });
     bot.login("NzEwMTUyNDM5NTI0ODg0NTkx.XrwS_w.kvrXIItGR7NJGXzI4h6U_IWts_k");
   } catch(e) {
     console.error("Something went wrong!\nError:\n"+ e)
   }