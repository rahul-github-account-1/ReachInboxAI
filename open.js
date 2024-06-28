require('dotenv').config();
const { OpenAI } = require("openai");

// Initialize OpenAI client with API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Function to get response based on the model's categorization of the prompt
async function getLabel(prompt) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o", // Correct model name
            max_tokens: 80,
            temperature: 0.5,
            messages: [
                {
                    role: "user",
                    content: `based on the following text just give one word answer, Categorizing the text based on the content and assign a label from the given options:  Interested (if user likes the product), Not Interested or More Information (if user wants more information). text is : ${prompt}`,
                },
            ],
        });
    
        const prediction = response.choices[0]?.message.content;
        console.log("response.choices[0].message.content", response.choices[0].message.content);
        console.log("prediction", prediction);
        if(prediction=="More Information") return "Label_2";
        else if(prediction=="Not Interested") return "Label_1";
        else return "Label_3"
    } catch (error) {
        console.error(error);
    }
}


async function generateReply(label, originalMessage, from_first_name) {

    console.log("generating reply\n");
    let prompt;
  
    if (label === 'Label_3') {
      prompt = `The user is interested in learning more about the product. Compose a reply asking if they are willing to hop on a demo call, and suggest some available times in 100 words and don't write subject of mail. Original message: ${originalMessage} and user's first name is ${from_first_name}`;
    } else if (label === 'Label_1') {
      prompt = `The user is not interested in the product. Compose a polite reply acknowledging their response in 100 words and don't write subject of mail. Original message: ${originalMessage} and user's first name is ${from_first_name}`;
    } else if (label === 'Label_2') {
      prompt = `The user needs more information about the product. Compose a reply providing additional details and asking if they have any specific questions in 100 words and don't write subject of mail. Original message: ${originalMessage} and user's first name is ${from_first_name}`;
    }
  
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o", // Correct model name
            max_tokens: 200,
            temperature: 0.5,
            messages: [
                {
                    role: "user",
                    content:`${prompt}`,
                },
            ],
        });
      console.log("our reply: ", response.choices[0]?.message.content)
      return response.choices[0]?.message.content;
    } catch (error) {
      console.error('Error generating reply:', error);
    }
  }
  
module.exports={getLabel,generateReply};