#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const yargs = require("yargs");

const XFDF = require("./xfdf");

const { logger, adjustLevel } = require('./logger');

//=[ CLI options parsing ]======================================================

const argv = yargs
  .usage("Usage: $0 <command> [master] [options]")
  .command("peel [master]", "Extract annotations from PDF", (yargs) => {
    yargs.positional("master", {
      describe: "name of the master PDF file",
      type: "string",
    });
  })
  .command("wrap [master]", "Apply annotations to PDF", (yargs) => {
    yargs.positional("master", {
      describe: "name of the master PDF file",
      type: "string",
    });
  })
  .count('verbose').alias('v', 'verbose').describe('v', 'increase logging level')
  .count('quiet').alias('q', 'quiet').describe('q', 'decrease logging level')
  .example("$0 peel book.pdf", "Extract annotations from `book.ann.pdf` and save them to `book.xfdf`")
  .example("$0 wrap book.pdf", "Apply annotations in `book.xfdf` to `book.pdf` and save to `book.ann.pdf`")
  .demandCommand(1)
  .strict()
  .argv;

//=[ Main ]=====================================================================

adjustLevel(argv.verbose - argv.quiet)

try {
  const masterPath = path.resolve(argv.master)
  const command = argv._[0]
  if (!fs.existsSync(masterPath)) {
    logger.error(`Master file not found at ${masterPath}`)
    process.exit(1)
  } else {
    logger.info(`Master file found at ${masterPath}`)
  }
  switch (command) {
    case "peel":
      XFDF.peel(masterPath)
      break;
    case "wrap":
      XFDF.wrap(masterPath)
      break;
  }
} catch (err) {
  logger.error(err);
}
