import { argv } from "node:process";

function main() {
  const args = argv.slice(2);
  if (args.length > 1) {
    console.log("Too many arguments. Provide one URL please.");
    process.exit(1);
  }

  if (args.length < 1) {
    console.log("No arguments provides. Provide one URL please.");
    process.exit(1);
  }

  console.log(`Crawling starting at ${args[0]}`);
  process.exit(0);
}

main();
