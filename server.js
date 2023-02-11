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




const checkUserAuth = async (req, res, next) => {

  const apiKeys = process.env.API_KEY;


  function error(status, msg) {
    var err = new Error(msg);
    err.status = status;
    return err;
  }

  // const { authorization } = req.headers
  


  // var key = req.headers.api_key;

  var key = req.headers['api_key'];

  console.log(key);

  // key isn't present
  if (!key) return next(error(400, 'api key is required'));

 

  // key is invalid
  if (apiKeys.indexOf(key) === -1) return next(error(401, 'invalid api key'))


  // all good, store req.key for route access
  req.key = key;
  next();


}



app.post("/chat", checkUserAuth,(req, res) => {
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
