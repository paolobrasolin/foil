const fs = require("fs");
const path = require("path");

const { PDFNet } = require("@pdftron/pdfnet-node");

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

const unsafePeel = async (masterPath) => {
  const workfilePath = buildWorkfilePath(masterPath);
  const annotationsPath = buildAnnotationsPath(masterPath);
  const pdf = await PDFNet.PDFDoc.createFromFilePath(workfilePath);
  const fdf = await pdf.fdfExtract(PDFNet.PDFDoc.ExtractFlag.e_annots_only);
  const xfdf = await fdf.saveAsXFDFAsString();
  await fs.promises.writeFile(annotationsPath, xfdf);
};

const unsafeWrap = async (masterPath) => {
  const workfilePath = buildWorkfilePath(masterPath);
  const annotationsPath = buildAnnotationsPath(masterPath);
  const pdf = await PDFNet.PDFDoc.createFromFilePath(masterPath);
  const xfdf = await PDFNet.FDFDoc.createFromXFDF(annotationsPath);
  pdf.fdfUpdate(xfdf);
  pdf.save(workfilePath, PDFNet.SDFDoc.SaveOptions.e_linearized);
};

const peel = async (masterPath) => {
  PDFNet.runWithCleanup(unsafePeel.bind(null, masterPath), null).then(() => {
    PDFNet.shutdown();
  });
};

const wrap = async (masterPath) => {
  PDFNet.runWithCleanup(unsafeWrap.bind(null, masterPath), null).then(() => {
    PDFNet.shutdown();
  });
};

module.exports = {
  peel: peel,
  wrap: wrap,
};
