import {RokuClient, Keys} from 'roku-client';
import {ClientCommand} from './index';

interface KeyboardKey {
  name: string;
  shift: boolean;
  ctrl: boolean;
}

export class KeyboardCommand extends ClientCommand {

  private keybindings: {[key: string]: string} = {};

  constructor(instance: RokuClient, keybindings: {[key: string]: string}) {
    super(instance);
    this.keybindings = keybindings;
  }

  private getPressedKey (key: KeyboardKey) {

    const pressedKeyString = key.shift ? `shift+${key.name}` : key.name;
    
    const pressedKey = this.keybindings[pressedKeyString];

    return {
      "backspace": Keys.BACKSPACE,
      "select": Keys.SELECT,
      "up": Keys.UP,
      "down": Keys.DOWN,
      "left": Keys.LEFT,
      "right": Keys.RIGHT,
      "home": Keys.HOME,
      "shift+backpace": Keys.BACK,
    }[pressedKey];
  };

  execute() {
    const readline = require('readline');
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    process.stdin.on('keypress', (str, key) => {
      if (key.ctrl && key.name === 'c') {
        // leave exit the terminal
        return process.exit()
      };

      if (/^[a-z]$/.test(key.name) && !key.ctrl) {
        const keyString = key.shift ? key.name.toUpperCase() : key.name;
        return this.instance.text(keyString);
      }

      if (/^space$/.test(key.name) && !key.ctrl) {
        return this.instance.text(" ");
      }

      const pressedKey = this.getPressedKey(key);
      if (pressedKey) return this.instance.keypress(pressedKey);

      console.log(key);
    });
  }
}
