const { Queue, Worker, QueueScheduler } = require('bullmq');
// const { workloadmanager } = require('googleapis/build/src/apis/workloadmanager');
const IORedis = require('ioredis');
const connection = new IORedis({
    host: '127.0.0.1',
    port: 6379,
    maxRetriesPerRequest: null
  });

const emailQueue = new Queue('emailQueue', { connection });


module.exports={emailQueue,connection,Worker,QueueScheduler};