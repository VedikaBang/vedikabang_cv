---
title: "OverTheWire : Krypton"
date: "2024-03-24"
url: /krypton.md/
aliases: /33.html
tags: ["Wargame"]
description: "All the levels in Krypton are about cryptography, and Cryptopal Basics"
summary: "numbers, they don't lie chico!"
cover:
    image: "/k.png"
    relative: false
editPost:
    URL: "https://overthewire.org/wargames/krypton/"
    Text: "krypton"
showToc: true
weight: 30
---

<div style="font-family: 'Times New Roman', serif; text-align: justify;">

> These problems are basic building blocks of Cryptography. I intend to do more than what's asked.

### Level 1

> The following string encodes the password using Base64: S1JZUFRPTklTR1JFQVQ= 

I’m not entirely sure I understand encoding in its entirety— certainly not in a literal sense. The Wikipedia page for Base64 encoding is quite extensive & overwhelming. I first came across Base64 years ago in a computer networks class, where I got a brief introduction. Later, in CTFs, I dealt with encoded strings often enough to get a decent understanding of how they're structured. Online decompilers made this process easier, and knowing the basics helped identify Base64 when I saw it.

However, there have been times when I couldn’t recognize Base64 encoding, often due to the padding. Padding can be confusing, and I’ve noticed that modern implementations of Base64 sometimes skip it altogether, which adds to the confusion. Recently, I learned something interesting about the [space overhead of Base64 encoding](https://lemire.me/blog/2019/01/30/what-is-the-space-overhead-of-base64-encoding/), and found out PDFs and Git use Base85, which only has a 25% overhead as opposed to the 33% of Base64 [read it here first](https://github.com/python/cpython/issues/61818). Do I care? Maybe not on a personal level. But for companies handling vast amounts of data every day, those extra bytes can add up quickly. So, while it might not keep me up at night, it's definitely something worth considering for large-scale operations. ![understanding](/memebase64.png)

for decoding base64, there are multiple ways to do so. I wanted to do it without using built-in functions. 
```python

#Base64 character set
# - Uppercase letters (A-Z)
# - Lowercase letters (a-z)
# - Numbers (0-9)
# - Plus (+) and slash (/)
# Why these characters? They're safe for URLs and emails!
BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

# Convert binary data back to the original string
def from_binary(binary_data):
    chars = []
    # Loop through the binary data in chunks of 8 bits
    for i in range(0, len(binary_data), 8):
        byte = binary_data[i:i+8]  # Extract an 8-bit chunk
        chars.append(chr(int(byte, 2)))  # Convert the 8-bit binary chunk to a character
    return ''.join(chars)

def decode_base64(base64_string):
    # Remove any '=' padding characters
    padding_count = base64_string.count('=')  # Count how many '=' are there
    base64_string = base64_string.rstrip('=')  # Strip off the '=' characters

    # Convert Base64 characters to binary
    binary_data = []  
    for char in base64_string:
        # Get the index of the char in the Base64 character set
        index = BASE64_CHARS.index(char)
        # Convert the index to a 6-bit binary string
        binary_data.append(format(index, '06b'))

    #Join all 6-bit binary strings into one big binary string
    binary_data = ''.join(binary_data)

    # Remove the extra padding bits added during encoding
    if padding_count:
        binary_data = binary_data[:-(padding_count * 2)]

    # Convert binary data back to the original string
    decoded_string = from_binary(binary_data)
    return decoded_string

```
![level 0](/level0.png)
We got in!

### Level 2







































### Level 3
### Level 4
### Level 5
### Level 6
### Level 7      