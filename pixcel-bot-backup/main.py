import discord
from discord.ext import commands
from keep_process import keep_process

import os
import sys

import firebase_admin
from firebase_admin import credentials, firestore
cred = credentials.Certificate("serviceAccountConfig.json")
firebase_admin.initialize_app(cred)

firestore_db = firestore.client()


with open('profanity_list.txt') as f:
   lines = f.read().split('\n')

bot = commands.Bot(
  command_prefix=["pl "],
)

bot_owners = [793726950115901480, 737422322431950962]

@bot.event
async def on_ready():
    print("Running Pixcel Bot")
    snapshots = list(firestore_db.collection(u'profiles').get())
    for snapshot in snapshots:
      print(snapshot.to_dict())

@bot.event 
async def on_message(message):
  await bot.process_commands(message)
  print(f'{message.author}: {"".join(message.content.split())}')
  if not message.author.bot:
    content = message.content
    for _ in lines:
      if _ in ''.join(content.split()):
        await message.channel.send(f"Please avoid using profane and offensive words.")

@bot.event
async def on_command_error(ctx, error):
  if isinstance(error, commands.MissingRequiredArgument):
      await ctx.send("Error, missing parameter, please try again.")

@bot.command()
async def userCount(ctx):
  snapshots = list(firestore_db.collection(u'profiles').get())
  message = discord.Embed(
    title = "User count",
    description = f"There is currently {len(snapshots)} users"
  )
  await ctx.send(embed=message)

@bot.command() 
async def setConfig(ctx, serverConfigLocation : str, rateLimitTime : int): 
  embed = discord.Embed(
    title = "Setting global server configuration",
    description = f"Rate limit: {rateLimitTime}\n Volatile data: false"
  )
  await ctx.send(embed=embed)

@bot.command(aliases=["getId", "getPfId"])
async def getProfileId(ctx, *, username : str):
  l = 0;
  snapshots = list(firestore_db.collection(u'profiles').get())
  print("Retriving data from database by profile id. " + username)
  for snapshot in snapshots:
    l += 1
    if snapshot.to_dict().get("name") == username: 
      embed = discord.Embed(
          title = username + "'s profile ID",
          description = f"ID: {snapshot.id}\n Profile link: https://blueprogrammer212.github.io/profile?id={snapshot.id}",
          color = discord.Color.blue()
      )
      l -= 1
      embed.set_thumbnail(url=snapshot.to_dict().get("image_url"))
      await ctx.send(embed=embed)
    elif snapshot.to_dict().get("name") != username and l == len(snapshots):
      embed = discord.Embed(
        title = f"The user, {username} cannot be found.",
        description = f"Please use a valid Pixcel username. Thank you. \n Don't use their/your Discord username",
        color = discord.Color.red()
      )
      await ctx.send(embed=embed)

@bot.command()
async def ban(ctx, member:discord.Member, *, reason=None):
  if ctx.author.id in bot_owners:
    await ctx.guild.ban(user=member, reason=reason)
  else:
    embed = discord.Embed(
      title = "Dog's not yours?",
      description = "You do not own this bot or have the rights to execute admin commands."
    )
    await ctx.send(embed=embed)

@bot.command()
async def unban(ctx, member:discord.User, *, reason=None):
  if ctx.author.id in bot_owners:
    await ctx.guild.unban(user=member, reason=reason)
  else:
    embed = discord.Embed(
      title = "Dog's not yours?",
      description = "You do not own this bot or have the rights to execute admin commands."
    )
    await ctx.send(embed=embed)
  
@bot.command(aliases=['rb', 'restartbot'])
async def restart(ctx):
  if ctx.author.id in bot_owners:
    os.execl(sys.executable, sys.executable, *sys.argv)
  else:
    embed = discord.Embed(
      title = "Dog's not yours?",
      description = "You do not own this bot or have the rights to execute admin commands."
    )
    await ctx.send(embed=embed)

keep_process()
token = os.environ.get("TOKEN")
bot.run(token)

