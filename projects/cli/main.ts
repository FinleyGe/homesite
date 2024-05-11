import { Command } from 'commander';
import { handleLogin, handleTest, handlePost } from './handler';
import { loadCache } from './cache';
const program = new Command();
loadCache();
program
  .name('homesite-cli')
  .version('0.0.1')
  .description('My homesite CLI tool');

program.command('login').description('Login to homesite').action(
  handleLogin);

program.command('test').description('Test command').action(
  handleTest);

program.command('post').description('post')
  .option("-l, --list", "List all posts")
  .option("-c, --create", "Create a new post")
  .option("-u, --update", "Update a post")
  .option("-d, --delete", "Delete a post")
  .action(handlePost);

program.parse();

