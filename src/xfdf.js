const fs = require("fs");
const path = require("path");

const { PDFNet } = require("@pdftron/pdfnet-node");

const { logger } = require('./logger');

const LOG_LABEL = '[XFDF]'

//==============================================================================

const buildWorkfilePath = (masterPath) =>
  path.format({
    ...path.parse(masterPath),
    base: undefined,
    ext: ".ann.pdf",
  });

const buildAnnotationsPath = (masterPath) =>
  path.format({
    ...path.parse(masterPath),
    base: undefined,
    ext: ".xfdf",
  });

const unsafePeel = async (workfilePath, annotationsPath) => {
  logger.debug(`${LOG_LABEL} Reading annotated PDF file...`)
  const pdf = await PDFNet.PDFDoc.createFromFilePath(workfilePath);

  logger.debug(`${LOG_LABEL} Extracting FDF annotations...`)
  const fdf = await pdf.fdfExtract(PDFNet.PDFDoc.ExtractFlag.e_annots_only);

  logger.debug(`${LOG_LABEL} Serializing annotations as XFDF...`)
  const xfdf = await fdf.saveAsXFDFAsString();

  logger.debug(`${LOG_LABEL} Writing XFDF to ${annotationsPath}`)
  await fs.promises.writeFile(annotationsPath, xfdf);
};

const unsafeWrap = async (masterPath, workfilePath, annotationsPath) => {
  logger.debug(`${LOG_LABEL} Reading master PDF file...`)
  const pdf = await PDFNet.PDFDoc.createFromFilePath(masterPath);

  logger.debug(`${LOG_LABEL} Reading XFDF annotations...`)
  const xfdf = await PDFNet.FDFDoc.createFromXFDF(annotationsPath);

  logger.debug(`${LOG_LABEL} Applying annotations...`)
  pdf.fdfUpdate(xfdf);

  logger.debug(`${LOG_LABEL} Writing annotated PDF to ${workfilePath}`)
  pdf.save(workfilePath, PDFNet.SDFDoc.SaveOptions.e_linearized);
};

const peel = async (masterPath) => {
  logger.info(`${LOG_LABEL} Peeling procedure initiated`)

  const workfilePath = buildWorkfilePath(masterPath);
  const annotationsPath = buildAnnotationsPath(masterPath);

  if (!fs.existsSync(workfilePath)) {
    logger.info(`${LOG_LABEL} Peeling procedure canceled: no annotated PDF found at ${workfilePath}`)
    return
  }

  logger.info(`${LOG_LABEL} Annotated PDF found at ${workfilePath}`)

  // TODO: ask for confirmation
  if (fs.existsSync(annotationsPath)) {
    logger.warn(`${LOG_LABEL} Overwriting annotations file at ${annotationsPath}`)
  }

  await PDFNet.runWithCleanup(unsafePeel.bind(null, workfilePath, annotationsPath), null)

  logger.debug(`${LOG_LABEL} Cleaning up PDFNet resources`)
  PDFNet.shutdown();

  logger.info(`${LOG_LABEL} Peeling procedure finished`)
};

const wrap = async (masterPath) => {
  logger.info(`${LOG_LABEL} Wrapping procedure initiated`)

  const workfilePath = buildWorkfilePath(masterPath);
  const annotationsPath = buildAnnotationsPath(masterPath);

  if (!fs.existsSync(annotationsPath)) {
    logger.info(`${LOG_LABEL} Wrapping procedure canceled: no annotations file found at ${annotationsPath}`)
    return
  }

  logger.info(`${LOG_LABEL} Annotations file found at ${workfilePath}`)

  // TODO: ask for confirmation
  if (fs.existsSync(workfilePath)) {
    logger.warn(`${LOG_LABEL} Overwriting annotated PDF at ${workfilePath}`)
  }

  await PDFNet.runWithCleanup(unsafeWrap.bind(null, masterPath, workfilePath, annotationsPath), null)

  logger.debug(`${LOG_LABEL} Cleaning up PDFNet resources`)
  PDFNet.shutdown();

  logger.info(`${LOG_LABEL} Wrapping procedure finished`)
};

module.exports = {
  peel: peel,
  wrap: wrap,
};
