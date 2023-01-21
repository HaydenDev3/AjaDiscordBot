import * as readline from "readline";
import * as fs from "fs";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Please enter your Discord bot details:");

rl.question("Client ID: ", (clientId: string) => {
  rl.question("Client Secret: ", (clientSecret: string) => {
    rl.question("Token: ", (token: string) => {
      rl.question("MongoDB URI: ", (mongoDB: string) => {
        const config = `CLIENT_ID="${clientId}"\nCLIENT_SECRET="${clientSecret}"\nTOKEN="${token}"\nMONGOOSE_ATLAS="${mongoDB}"`;
        fs.writeFileSync(".env.example", config);
        console.log(".env file has been created!");
        rl.close();

        console.log("Now you can run : npm run dev or npm run start");
      });
    });
  });
});
