"use strict";
const fetch = require("node-fetch");
module.exports.hello = async event => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html"
    },
    body: "<b>Go Serverless v1.0! Your function executed successfully!</b>"
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
