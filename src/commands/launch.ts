import {ClientCommand} from './index';
import {RokuApp} from 'roku-client';

export class LaunchCommand extends ClientCommand {
  public async execute(args: string[]) {
    const apps = await this.instance.apps();

    const map = apps.reduce((acc, curr: RokuApp) => {
      acc[curr.name.toUpperCase()] = curr.id;
      return acc;
    }, {} as {[key: string]: string});

    const appName = args[0];

    try {
      if (appName) {
        await this.instance.launch(map[appName.toUpperCase()]);
        return;
      }
    } catch(err) {
      console.log(`No app with the name "${appName}" is installed on this device.`);
    }
  }
}