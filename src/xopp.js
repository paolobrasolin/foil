const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const { logger } = require('./logger');

const LOG_LABEL = '[XOPP]'

//==============================================================================

const buildWorkfilePath = (masterPath) =>
  path.format({
    ...path.parse(masterPath),
    base: undefined,
    ext: ".pdf.xopp",
  });

const buildAnnotationsPath = (masterPath) =>
  path.format({
    ...path.parse(masterPath),
    base: undefined,
    ext: ".pdf.xopp.xml",
  });

const unsafePeel = async (workfilePath, annotationsPath) => {
  logger.debug(`${LOG_LABEL} Reading XOPP file...`)
  const xopp = fs.readFileSync(workfilePath);

  logger.debug(`${LOG_LABEL} Extracting XOPP annotations...`)
  const xml = zlib.gunzipSync(xopp)

  logger.debug(`${LOG_LABEL} Writing XML to ${annotationsPath}`)
  await fs.promises.writeFile(annotationsPath, xml);
};

const unsafeWrap = async (workfilePath, annotationsPath) => {
  logger.debug(`${LOG_LABEL} Reading XML annotations...`)
  const xml = fs.readFileSync(annotationsPath);

  logger.debug(`${LOG_LABEL} Compressing XOPP annotations...`)
  const xopp = zlib.gzipSync(xml)

  logger.debug(`${LOG_LABEL} Writing XOPP file to ${workfilePath}`)
  await fs.promises.writeFile(workfilePath, xopp);
};

const peel = async (masterPath) => {
  logger.info(`${LOG_LABEL} Peeling procedure initiated`)

  const workfilePath = buildWorkfilePath(masterPath);
  const annotationsPath = buildAnnotationsPath(masterPath);

  if (!fs.existsSync(workfilePath)) {
    logger.info(`${LOG_LABEL} Peeling procedure canceled: no XOPP file found at ${workfilePath}`)
    return
  }

  logger.info(`${LOG_LABEL} XOPP file found at ${workfilePath}`)

  // TODO: ask for confirmation
  if (fs.existsSync(annotationsPath)) {
    logger.warn(`${LOG_LABEL} Overwriting annotations file at ${annotationsPath}`)
  }

  await unsafePeel(workfilePath, annotationsPath)

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
    logger.warn(`${LOG_LABEL} Overwriting XOPP file at ${workfilePath}`)
  }

  unsafeWrap.bind(null, workfilePath, annotationsPath)

  logger.info(`${LOG_LABEL} Wrapping procedure finished`)
};

module.exports = {
  peel: peel,
  wrap: wrap,
};
