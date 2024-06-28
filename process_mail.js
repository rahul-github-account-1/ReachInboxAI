const { emailQueue } = require('./queue');
const { google } = require('googleapis');
const { getLabel, generateReply } = require('./open.js');
const {getAuthInstance}=require("./gmail_authenticate.js")
// const {getAuthInstance}=require("./gmail_authenticate.js")


async function processEmail(messageId,threadId) {
    console.log("process mail ");
    console.log("messageId "+ messageId);
    console.log(threadId);
    const auth=await getAuthInstance();
    const gmail = google.gmail({ version: 'v1', auth });
    // console.log("auth in process ", auth)
    // try{
    const emailResponse = await gmail.users.messages.get({ userId: 'me', id: messageId });
    // }

    console.log("emailResponse "+emailResponse);
    const email = emailResponse.data;
    const payload = email.payload;
    let from_id = "";
    let fromFirstName = "";

    // Extract 'From' information
    payload.headers.forEach(header => {
        if (header.name === 'From') {
            fromFirstName = header.value.split(' ')[0];
            let header_value = header.value;
            for (let i = header_value.length - 2; i >= 0; i--) {
                if (header_value[i] === '<') break;
                else from_id += header_value[i];
            }
            from_id = [...from_id].reverse().join("");
        }
    });
    console.log("from "+ from_id+" from_name "+fromFirstName)
    // Process message body
    let messageBody = "";
    if (payload.body && payload.body.size > 0) {
        const body = Buffer.from(payload.body.data, 'base64').toString();
        messageBody += body + "\n";
    }

    if (payload.parts) {
        payload.parts.forEach(part => {
            if (part.body && part.body.size > 0 && part.partId === 0) {
                const partBody = Buffer.from(part.body.data, 'base64').toString();
                messageBody += partBody + "\n";
            }
        });
    }

    // Enqueue job to assign label
    emailQueue.add('assignLabelToEmailAndSendReply', {from_id,fromFirstName,messageId, messageBody,threadId});

}


async function assignLabelToEmail(messageId, labelId) {
    const auth=await getAuthInstance();
    const gmail = google.gmail({ version: 'v1', auth });
  
    gmail.users.messages.modify({
      userId: 'me',
      id: messageId,
      requestBody: {
        addLabelIds: [labelId]
      }
    }, (err, res) => {
      if (err) return console.error('Error assigning label to email:', err);
      console.log('Label assigned to email:', res.data);
    });
  }
  


  async function sendReply( to, subject, body, threadId, messageId) {
    const auth=await getAuthInstance();
    const gmail = google.gmail({ version: 'v1', auth });
  
    const message = [
      `To: ${to}`,
      'Content-Type: text/plain; charset="UTF-8"',
      'Content-Transfer-Encoding: 7bit',
      `Subject: Re: ${subject}`,
      `In-Reply-To: ${messageId}`,
      `References: ${messageId}`,
      '',
      body,
    ].join('\n');
  
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  
    try {
      await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
          threadId: threadId,
        },
      });
      console.log('Reply sent successfully.');
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  }


module.exports={sendReply,processEmail,assignLabelToEmail};