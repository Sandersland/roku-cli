import {RokuClient} from 'roku-client';

interface ICommand {
  execute: (args: string[]) => void;
  undo?: (args: string[]) => void;
}


export abstract class Command implements ICommand {
  abstract execute(args: string[]): void;
}

export abstract class ClientCommand extends Command {
  protected instance: RokuClient;

  constructor(instance: RokuClient) {
    super();
    this.instance = instance;
  }

  abstract execute (args: string[]): void; 
}

export type CommandsRegistery = {[name: string]: Command};

export abstract class CommandInvoker {
  protected commands: CommandsRegistery = {};

  constructor(commands?: CommandsRegistery) {
    if (!commands) return;
    this.commands = commands;
  }

  registerCommand(name: string, command: Command) {
    this.commands[name] = command;
  }

  abstract execute(command: string, args: string[]): void;
}