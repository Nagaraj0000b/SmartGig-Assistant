require("dotenv").config();
const { extractData } = require("./services/conversationService");

async function test() {
  const result = await extractData("earnings", "I made around 1200 rupees today");
  console.log("Extracted:", result, "Type:", typeof result);
}

test();
