const { emailQueue,Worker,connection } = require('./queue');
const { getLabel, generateReply } = require('./open.js');
const { sendReply, assignLabelToEmail, processEmail } = require('./process_mail.js');
const {getAuthInstance}=require('./gmail_authenticate.js');
// const {authorize}=require("./gmail_authenticate.js")
const emailProcessingWorker = new Worker('emailQueue', async job => {
    // const { from_id, subject, threadId, messageBody, fromFirstName } = job.data;
    console.log("in worker with job "+ `${job.name}` );
    switch (job.name) {
        case 'processEmail':
            // const {auth, messageId}=job.data;
            await processEmail(job.data.messageId,job.data.threadId);
            break;
        case 'assignLabelToEmailAndSendReply':
            // const {auth, messageId, messageBody}=job.data;
            const labelId = await getLabel(job.data.messageBody);
            await assignLabelToEmail(job.data.messageId, labelId);
            const reply = await generateReply(labelId, job.data.messageBody, job.data.fromFirstName);
            await sendReply(job.data.from_id, "Reply from ReachInboxAI", reply, job.data.threadId, job.data.messageId);
            break;
        default:
            console.error('Unknown job type:', job.name);
    }
}, { connection });


module.exports={emailQueue};
