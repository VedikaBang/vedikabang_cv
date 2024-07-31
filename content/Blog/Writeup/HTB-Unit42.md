---
title: "HTB: Unit42"
date: "2024-04-20"
url: /unit42.md/
aliases:
  - /3.html
description: "JSON is easier with jq!"
summary: "HackTheBox Sherlock : Unit42 and jq"
weight: 10
showToc: true
cover:
    image: "/unit42.png"
    relative: false
tags: ["DFIR-Sherlock"]
---
<div style="font-family: 'Times New Roman', serif; text-align: justify;">

## Unit42

### Write-up
> Summary: In this Sherlock, you will familiarize yourself with Sysmon logs and various useful EventIDs for identifying and analyzing malicious activities on a Windows system. Palo Alto's Unit42 recently conducted research on an UltraVNC campaign, wherein attackers utilized a backdoored version of UltraVNC to maintain access to systems. This lab is inspired by that campaign and guides participants through the initial access stage of the campaign. [Pawned Unit42](https://labs.hackthebox.com/achievement/sherlock/1713677/632)

#### Reconnaissance
- We've got sysmon logs.

###### Sysmon Logs
- Sysmon: Often described as 'event viewer on sTerOids', Sysmon allows for extensive customization through its configuration file. It's important to note that Sysmon does not provide analysis of the events it generates, nor does it attempt to hide itself from attackers. [Sysmon Documentation](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon) Sysmon is designed to run as a persistent service in the background, capturing and logging system events based on the configured rules. It logs detailed information about system activities, including process creations, network connections, file modifications, and more.
- Configuration Importance: The configuration file is crucial for effective use of Sysmon. During my initial use of Sysmon, I failed to see the needed information because my configuration was too permissive. With a well-defined configuration, you can specify which event IDs to log, ensuring that Sysmon captures the most relevant data.
- Sysmon itself does not analyze the events it logs. It functions purely as a data collection tool, requiring integration with other tools for event analysis and further interpretation.


##### Task 1
- Open `Microsoft-Windows-Sysmon-Operational.evtx` for a quick preview - and view - group events and determine the frequency of each Event ID.
![Task1](/unit42/task1.png)

###### Event ID Summary

| Event ID | Occurrences | Description                          |
|----------|-------------|--------------------------------------|
| 1        | 06          | Process creation                     |
| 2        | 16          | File creation time change/modify         |
| 3        | 01          | Network connection                   |
| 5        | 01          | Process terminated                   |
| 7        | 15          | Image loaded                         |
| 10       | 01          | ProcessAccess detected               |
| 11       | 56          | File created                         |
| 12       | 14          | RegistryEvent added or deleted       |
| 13       | 19          | RegistryValues of type DWORD/QWORD   |          
| 15       | 02          | FileCreateStreamHash                 |
| 17       | 07          | PipeEvent (Pipe Created) {malware fav}|
| 22       | 03          | DNSQuery executed (Win 8.1 > )       |
| 23       | 26          | File deleted (archived)              |
| 26       | 02          | FileDeleteDetected                   |

##### Task 2
Reading through .evtx files in `windows Evtx` is like trying to read a book with the pages out of order. but we got this! thought of using Log Parser 2.2? but this time, the output was so inconsistent I closed it faster than I opened it.

> update: I needed something more automated, sleek, and consistent.  By using `Evtx` to convert .evtx files to JSON and then jq to manipulate and format the JSON data, I finally got the readable, consistent, and tailored log output I was looking for. This box helped me understand `jq` better. [credit: 0xdf for putting out the content that he does, and I couldn't be more grateful.](https://0xdf.gitlab.io/2024/04/11/htb-sherlock-unit42.html)

*EventID 1*: whenever a process is created, EventID 1 is recorded. So, after grouping logs by sorting, we can see that EvenID 1 has appeared 6 times.

Ok, I absolutely love narrating a story; so  let's go step by step. Since these are only 6 logs, I can spend go through each one of them. Information about an EventID is categorized into two parts : System information and EventData. System information is nothing but the meta data about the event ID.  In the context of an event log, the term "payload" refers to the actual content or data that describes the event. For the XML data, the "payload" is found within the <EventData> element. It includes the detailed information about what happened during the event. Oh also - sysmon config files are  configured to map event IDs to known MITRE TTPs for better visibility and analysis. 

-  log 1, 2 : These logs indicate the initiation of an installation process by a system service. The use of `msiexec.exe` from the System32 directory with system-level privileges is normal. Since, we've grouped this as per eventID - I don't necessarily think invocation happened in any particular order. 

- log 3 : This event is mapped to MITRE ATT&CK technique T1204, which involves executing a user-initiated action, such as opening a file or clicking a link. This is it, maybe? well, let's see.

so the user `cyberjunkie` downloaded `Preventivo24.02.14.exe.exe`  and executed by double-clicking in file explorer, as indicated by the parent process `explorer.exe`. It also appears to be an installer for software 'Photo and vn' -  which is likely to be an editing software (?), also the fact it's got `exe.exe` is giving look into me. The user executed the file `Preventivo24.02.14.exe.exe` at 03:41:56.538, which then might've triggered the `msiexec.exe` processes seen in log 1,2 at 03:41:57.604 and 03:41:58.178


![Task2](/unit42/exefile.png)

- log 4 : 2024-02-14 03:41:45.304 this involves pingsender.exe, a firefox utility that sends data back to Firefox.This event is mapped to technique_id=T1027,technique_name=Obfuscated Files or Information probably because data is encoded? However, we can assume that `cyberjunkie` was browsing firefox and the file `Preventivo24.02.14.exe.exe` was downloaded via Firefox and saved to the Downloads folder.

- log 5 : confirms that `Preventivo24.02.14.exe.exe`involves invoking msiexec.exe to install or execute additional files, possibly using the MSI file located in the AppData directory.

![Task2](/unit42/exeinac.png)

To be sure, I uploaded hash to virustotal. 

![Task2](/unit42/task2ans.png)

> trailing /V switch in msiexec.exe is used to enable verbose logging for MSI installation processes.

##### Task 3
Now, we need to find which cloud drive was used to distribute the malware. If malware uses a cloud drive service for distribution, there will likely be DNS queries related to that service. There are 3 logs invoked under 

*Event ID 22* : shows  which domains were looked up by a process, helping identify if a malicious domain was contacted.

After going through them all, I came up with the following tentative timeline. Also, author has used `dropbox` to download the malware.

at 03:41:25, Firefox queried `uc2f030016253ec53f4953980a4e.dl.dropboxusercontent.com`, pointing to Dropbox IPs. This was followed at 03:41:43 by a query to `d.dropbox.com`, revealing more Dropbox IPs, possible interaction for retrievals of files.
at 03:41:56, the executable `Preventivo24.02.14.exe.exe` made a DNS request to `www.example.com`, possible c2c server.

![Task3](/unit42/dropbox.png)

##### Task 4
This question leads to the next clue - malware is messing with the file stamps. **Time Stomping** is an obfuscation technique to mislead defender. *Event ID 2* captures file creation and modification events. There are 16 of them, damn. Well, all of them are associated with `Preventivo24.02.14.exe.exe`. Only one of them  is related to pdf.  
![Task4](/unit42/task4.png)
##### Task 5
![Task5](/unit42/task5.png) 

##### Task 6
Oh so `example.com` wasn't exactly C2C. It was most likely to check the internet connection status.

##### Task 7

Outgoing network connections? *Event ID 3*  would lead to the answer. This is tagged as  `technique_id=T1036,technique_name=Masquerading`- explains much.
![Task7](/unit42/nw.png) 

##### Task 8
The malicious process terminated itself after infecting the PC with a backdoored variant of UltraVNC - Well, There's just one process under EventID 5. PID 10672, similar to Task2 proves that it's the malware process.
![Task8](/unit42/last.png) 

### I learned `jq`



























