import * as path from "path";
import * as fs from "fs";

import {RokuClient} from "roku-client";
import {Command, CommandInvoker, CommandsRegistery} from './commands';
import {KeyboardCommand} from './commands/keyboard';
import {SelectCommand} from './commands/select';
import {LaunchCommand} from './commands/launch';
import {DiscoverCommand} from './commands/discover';
import {KeypressCommand} from './commands/press';

class VersionCommand extends Command {
  private name: string;
  private version: string;

  constructor(program: Program) {
    super();
    this.name = program.name;
    this.version = program.version;
  }

  execute(args: string[]) {
    console.log(`${this.name}@${this.version}`);
  }
}

export class Program extends CommandInvoker {
  public name: string;
  public version: string;

  constructor(commands?: CommandsRegistery) {
    super(commands);
    const {name, version} = require("../package.json");
    this.name = name;
    this.version = version;
  }

  execute(command: string, args: string[]) {
    if (!this.commands[command]) {
      console.log(`${command} is not a valid command, please try one of these: ${Object.keys(this.commands).join(", ")}.`);
      return;
    }
    this.commands[command].execute(args);
  }

  public static main(argv: string[]) {
    const [command, ...args] = argv.splice(2);
    const program = new Program();
    
    const configPath = path.join(__dirname, "config.json");

    if (!fs.existsSync(configPath)) {

      // seed default config file
      const configJson = JSON.stringify({
        "clientIp": "",
        "keyBindings": {
          "delete": "backspace",
          "return": "select",
          "up": "up",
          "down": "down",
          "left": "left",
          "right": "right",
          "escape": "home",
          "backspace": "backspace",
          "shift+backpace": "back"
        }
      }, null, 2);
      
      fs.writeFileSync(configPath, configJson);
    }

    const {clientIp, keyBindings} = require(configPath);

    program.registerCommand("version", new VersionCommand(program));
    program.registerCommand("select", new SelectCommand(configPath));
    program.registerCommand("discover", new DiscoverCommand());

    if (!clientIp) {
      console.log("No ip address saved, searching for devices...");
      program.execute("select", []);
      return;
    }

    const client = new RokuClient(clientIp);

    program.registerCommand("launch", new LaunchCommand(client));
    program.registerCommand("press", new KeypressCommand(client));
    program.registerCommand("keyboard", new KeyboardCommand(client, keyBindings));

    program.execute(command, args);
  }
}
