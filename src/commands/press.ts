import {ClientCommand} from "./index";
import {Keys} from "roku-client";

const commands: {[name: string]: any} = {
  power: Keys.POWER,
  play: Keys.PLAY,
  back: Keys.BACK,
  rewind: Keys.REVERSE,
  forward: Keys.FORWARD,
  mute: Keys.VOLUME_MUTE, // rokuTV only
  vup: Keys.VOLUME_UP, // rokuTV only
  vdown: Keys.VOLUME_DOWN, // rokuTV only
}

export class KeypressCommand extends ClientCommand {
  private commands = commands;

  execute(args: string[]) {
    if (!this.commands[args[0]]) {
      return console.log(`no "${args[0]}" key has been registered`); 
    }
    const command = this.commands[args[0]];
    this.instance.keypress(command);
  }
};
