#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const yargs = require("yargs");
const { PDFNet } = require("@pdftron/pdfnet-node");

const logger = console;

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
  .example("$0 peel book.pdf", "Extract annotations from `book.ann.pdf` and save them to `book.xfdf`")
  .example("$0 wrap book.pdf", "Apply annotations in `book.xfdf` to `book.pdf` and save to `book.ann.pdf`")
  .demandCommand(1)
  .strict()
  .argv;

//=[ Setup filenames ]==========================================================

const originalPdfPath = argv.master;

const annotatedPdfPath = path.format({
  ...path.parse(originalPdfPath),
  base: undefined,
  ext: ".ann.pdf",
});

const annotationsPath = path.format({
  ...path.parse(originalPdfPath),
  base: undefined,
  ext: ".xfdf",
});

//=[ Peeling procedure ]========================================================

const peel = async () => {
  const pdf = await PDFNet.PDFDoc.createFromFilePath(annotatedPdfPath);
  const fdf = await pdf.fdfExtract(PDFNet.PDFDoc.ExtractFlag.e_annots_only);
  const xfdf = await fdf.saveAsXFDFAsString();
  await fs.promises.writeFile(annotationsPath, xfdf)
};

//=[ Wrapping procedure ]=======================================================

const wrap = async () => {
  const pdf = await PDFNet.PDFDoc.createFromFilePath(originalPdfPath);
  const xfdf = await PDFNet.FDFDoc.createFromXFDF(annotationsPath);
  pdf.fdfUpdate(xfdf);
  pdf.save(annotatedPdfPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
};

//=[ Main ]=====================================================================

try {
  switch (argv._[0]) {
    case "peel":
      PDFNet.runWithCleanup(peel.bind(null), null).then(() => {
        PDFNet.shutdown();
      });
      break;
    case "wrap":
      PDFNet.runWithCleanup(wrap.bind(null), null).then(() => {
        PDFNet.shutdown();
      });
      break;
  }
} catch (err) {
  logger.error(err);
}
