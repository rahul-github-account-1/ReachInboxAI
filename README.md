# ReachInBox 

## Server
The project is to build a tool that will parse and check the emails in a Google email ID, and
respond to the e-mails based on the context using AI. Using BullMQ as the tasks scheduler
This is a server-based application built with Node.js and Express. It uses various packages such as  `openai` for AI functionalities, `googleapis` for Google APIs, and `express` for creating apis and `bullMQ` to process queues.

# technologies used:
- Node.js
- Express.js
- OpenAI
- Google APIs
# npm packages used
- dotenv
- bullMQ
- google-auth-library
- ioredis
<br>

## Installation setup
1. Clone the repository to your local machine
```bash
git clone https://github.com/rahul-github-account-1/ReachInboxAI.git
```
2. Run `npm install` to install all the dependencies.
3. Create a `.env` file and insert your OPENAI_API_KEY (which you can purchase from ```https://platform.openai.com```).
4. Download your Gmail OAuth2.0 client credentials and rename it to credentials.json and paste in project repository.
5. Install redis server using the link ``` https://sourceforge.net/projects/redis-for-windows.mirror/files/latest/download ``` and run it.

## Running the server
1. To start the server, run the following command in your terminal
```bash
node index.js
```
*This will start the server at localhost:4000 (or whatever port you have specified).*
or we can use backend deployed link also.

2. In your browser/postman hit  `GET http://localhost:4000/`
