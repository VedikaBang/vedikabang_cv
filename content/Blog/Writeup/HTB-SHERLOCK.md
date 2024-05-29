---
title: "HTB: Brutus"
date: "2024-03-24"
url: /sherlock.md/
aliases:
  - /2.html
description: "Baby now we got bad logs, but I can fix 'em all!"
summary: "HackTheBox Sherlock : Brutus and endless saga of logs !"
weight: 20
showToc: true
cover:
    image: "/sherlock.png"
    relative: false
tags: ["DFIR"]
ShowToc: True
---
<div style="font-family: 'Times New Roman', serif; text-align: justify;">

## Brutus

### Write-up
> Summary: we'll look into Unix auth.log and wtmp logs. A Confluence server got brute-forced through SSH, and we'll track what the attacker did using auth.log. We'll see how this log can show us brute-force attempts, privilege escalation, persistence, and even some command execution. [Pawned Brutus](https://labs.hackthebox.com/achievement/sherlock/1713677/631)





























### My Love-Hate Relationship with Unix Logs

As an aspiring Threat Hunter, a strong and positive relationship with Unix logs is essential. Legends say that Linux logs are the bread and butter of every seasoned Linux pro and a CTF player. I wholeheartedly agree with the latter, having experienced it firsthand.

There are different kinds of logs, and while I’m not sure if I have a favorite one, each has its unique challenges and lessons. Earlier this month, I found myself analysing vbox.logs and application-specific logs. After spending n hours and enduring one VirtualBox crash, [I discovered that the kernel version 6.8.0 wasn’t compatible with VirtualBox 7.0.14. Downgrading the kernel version on a fresh copy of Ubuntu wasn’t straightforward, with Unix logs prompting all sorts of unconventional tasks.](https://forums.virtualbox.org/viewtopic.php?t=110882) Honestly, logs didn't help much except error logging actually helped me find a solution. I could write chronicles about my experiences with VMs and various fiascos, but I’ve always viewed these challenges as valuable learning opportunities (I, truly, have.). In this case, reconnaissance proved to be extremely important and a significant time-saver.

Despite the frustrations, I love the open-source community. Knowing that I’m not alone in my struggles is oddly comforting, especially after an exhausting, sleepless eight-hour debugging session.

### Why don't you look into logs?

During my internship at Aon, I worked closely with logs—Windows logs, to be precise. This experience helped me understand Windows log analysis and showed me how much easier it is to deal with Windows logs compared to Unix logs. I once read someone say, "Linux is free if your time is worthless." While this statement might elicit a smirk of pained recognition, it underscores the complexity and depth of knowledge required for Unix logs, which is exactly why I want to learn more about them.

### See, I told ya - logs have it all, do they?

Log files are everything! You upload them when you create an issue, analyze them when solving someone else's issue, and deep dive into them when working as a consultant. Fortunately, there are amazing SIEM tools available to make this process seemingly easier.

Linux log names are often more intuitive than the information they contain. After sifting through countless logs, I've realized that in Linux, there is no uniform logging format for programs. Each program logs in its own way, to its own file. There's no "all-in-one" kind of log. You might find yourself  'cat'-ing through files that aren't pertinent to what you're looking for.

Initially, I was intimidated by text-based logs. It seemed daunting to know what every entry meant unless I spent all day looking at logs. However, I soon learned that you don't need to know everything. It's crucial to know what you're looking for. This makes it easier to grep the relevant information. Logs provide context and metadata, but, as people say, "ask the right questions." A little understanding of what you're looking for goes a long way; otherwise, it's just another frustrating day at the office.


