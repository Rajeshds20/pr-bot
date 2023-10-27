---

# PR Bot App

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Installation Steps](#installation-steps)
4. [Web Hooks](#web-hooks)
5. [Tech Stack](#tech-stack)
6. [Video Demp](#video-demo)
7. [Challenges Faced](#challenges-faced)
8. [Improvement](#improvement)

## Overview
This is a PR Code Runner App, that will run your code block that is sent in the PR Comment, and if it has '/execute' command in it, it will extract the code from the comment. Then the bot will itself run the code through PISTON API, later it will put the output/result as comment as a reply in the same PR.

### Features
- It will run your code automantically after every PR
- It will comment the output if the code is correct and errors if the code is wrong, which helps us to find the mistakes easily
- Uses latest version of runtime for code execution
- If the code exexutes correctly then the bot itself will approve the PR, and we can simply review and merge the PR.
- Presently it is working for only Python, and can be modified to support multiple languages.

## Installation Steps
- To install this Github Application in your server, then you have to go to https://github.com/apps/pr-coderun-bot
- Then Click on Congigure in right side of window
- Select your repository to which you want to add the application
- Then click on install, Its Done.

### Env Setup
- Clone the repository by using ```git clone https://github.com/Rajeshds20/pr-bot```
- Then go to directory ```cd pr-bot```
- Then Do ```npm install``` to install all the dependencies
- Go to ```http://localhost:3000``` for setting up your application with github.
- Then follow the steps shown by Github,
- You are done, you can run the application with ```npm run start```

### Web Hooks
-- (From Github)
- pull_request(edited, opened)
- issues(opened)
- pull_request_review_comment(created, edited)

### Tech Stack
- NodeJS
- Probot
- Piston
- GitHub

### Video Demo
Here is a video showing the working demo of the application 

https://github.com/Rajeshds20/pr-bot/assets/104376917/34650882-9fad-4a4d-908b-6e53819a8f93



### Challenges Faced
- Working with Webhooks initially was a challenge
- Verification of each hook working
- In the initial phase I don't know about permissions and hooks, so testing is one of the challenge

### Improvement
- We can add support for multiple languages
- Adding clear instructions to the user in detail for the usage
- Giving option to select the code that the user want to run directly from the PR

### Screenshots of server working
![image](https://github.com/Rajeshds20/pr-bot/assets/104376917/3cbd98f4-62d7-47a1-a4f1-480d25169e7f)

![image](https://github.com/Rajeshds20/pr-bot/assets/104376917/62325fa4-2aaf-46fb-b5a3-9aa71f39c0ac)



---
