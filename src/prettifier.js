const prettifyXml = require("prettify-xml");

const XML_CFG = { indent: 2, newline: "\n" };

const xml = (input) => {
  return prettifyXml(input, XML_CFG);
};

module.exports = {
  xml: xml,
};
