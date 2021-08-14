import * as fs from "fs";

import inquirer from "inquirer";
import {Command} from './index';
import {RokuClient} from 'roku-client';

class ClientSelector {
  public static async prompt(promptText: string, choices: string[]) {
    const prompt = inquirer.createPromptModule();
    return await prompt([{
      name: "selected-client",
      prompt: promptText,
      type: "list",
      choices: choices
    }]);
  }
}

export class SelectCommand extends Command {

  constructor(private configPath: string) {
    super();
    this.configPath = configPath;
  }

  // TODO: introduce argument for device url
  public async execute(args: string[]) {
    let clientAddress: string | undefined = undefined;
    const configObject = require(this.configPath);

    try {
      const options = await RokuClient.discoverAll(3000);

      if (!options.length) {
        console.log("No devices found");
        return;
      }

      if (options.length === 1) {
        clientAddress = options[0].ip;
      }
      
      if (!clientAddress) {
        const possibleAddresses = options.map(({ip}) => ip);
        clientAddress = await ClientSelector.prompt("Please choose one device address.", possibleAddresses);
      }

      configObject.clientIp = clientAddress;

      const configJson = JSON.stringify(configObject, null, 2);

      fs.writeFileSync(this.configPath, configJson);
    
      console.log(`address "${clientAddress}" was selected.`);
    } catch(err) {
      console.error(err);
    }
  }
}