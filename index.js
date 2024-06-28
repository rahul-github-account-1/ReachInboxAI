const fs = require('fs');
const path = require('path');
// const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
const express= require('express');
const {getAuthInstance}= require('./gmail_authenticate.js')
const {emailQueue}=require('./message_queue.js');
const { threadId } = require('worker_threads');
const app=express();
app.use(express.json());
const port=4000;

/**
 * Send an email using the Gmail API.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {number} index The index to add as a unique identifier.
 */
  
async function clearQueue() {
    try {
        await emailQueue.obliterate({ force: true });
        console.log('Queue cleared!');
    } catch (error) {
        console.error('Error clearing the queue:', error);
    }
}



async function listInboxMessages() {
    try {
      const auth=await getAuthInstance();
      console.log("api called");
        const gmail = google.gmail({ version: 'v1', auth });
        const res = await gmail.users.messages.list({
            userId: 'me',
            labelIds: ['INBOX'], // Specify INBOX label to fetch only inbox messages
        });
        let i=0;
        const messages = res.data.messages || [];
        for (const message of messages) {
            if(i==2) break;
            i++;  
            emailQueue.add('processEmail', {messageId:message.id, threadId:message.threadId});           
        }
    } catch (error) {
        console.error('Error listing inbox messages:', error.message);
        throw error;
    }
}


app.get('/', async (req,res)=>{
    
      await  listInboxMessages();

      // console.log("auth in index")
      return res.status(200).json({1:1});
        
})


clearQueue().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
        
    });
});
  




