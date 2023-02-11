// const { response } = require('express');
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.port || 3003;

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  // organization: "org-5kVIrXWGBuLkVj4B4EsjEv7o",
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
//  openai.listEngines().then((response)=>{
//     console.log(response);
//  })

app.use(cors());
app.use(express.json());


app.post("/chat", (req, res) => {
  const question = req.body.question;

  openai
    .createCompletion({
      model: "text-davinci-003",
      prompt: question,
      max_tokens: 4000,
      temperature: 0,
    })
    .then((response) => {
      return response?.data?.choices?.[0]?.text;
    })
    .then((answer) => {
      const array = answer
        ?.split("\n")
        .filter((value) => value)
        .map((value) => value.trim());

        return array;
    })
    .then((answers) => {
      res.json({
        answer: answers,
        prompt: question,
      });
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
