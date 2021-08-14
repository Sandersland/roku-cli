import {Command} from './index';
import {RokuClient} from 'roku-client';

export class DiscoverCommand extends Command {
  public async execute(args: string[]) {
    let seconds: string | number = args[0] || 3;

    if (typeof seconds === "string") {
      seconds = parseInt(seconds)
    }

    try {
      const clients = await RokuClient.discoverAll(seconds * 1000);
      const clientAddresses = clients.map(({ip}) => ip);
      console.log(`The following devices have been discovered with these addresses: ${clientAddresses.join(", ")}`);
    } catch (err) {
      console.log(err.message);
    }
  }
}
