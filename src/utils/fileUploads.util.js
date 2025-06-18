const financialAdvisorProcessor = require('../services/financialAdvisor').process;
const financialReferenceProcessor = require('../services/financialReference').process;
const lifestyleProcessor = require('../services/lifestyle').process;
const lifestyleByAgeProcessor = require('../services/lifestyleByAge').process;
const zipCodeProcessor = require('../services/zipCodes').process;
const surveyRangeProcessor = require('../services/surveyRange').process;

const fileHandlers = [
  {
    regex: /^financialadvisors(\d+)\.(xlsx|csv)$/i,
    handler: financialAdvisorProcessor,
    args: (match) => [parseInt(match[1], 10)],
  },
  {
    regex: /^financialreference\.(xlsx|csv)$/i,
    handler: financialReferenceProcessor,
    args: () => [],
  },
  {
    regex: /^lifestyledata\.(xlsx|csv)$/i,
    handler: lifestyleProcessor,
    args: () => [],
  },
  {
    regex: /^lifestyledatabyage\.xlsx$/i,
    handler: lifestyleByAgeProcessor,
    args: () => [],
  },
  {
    regex: /^zipcodes\.(xlsx|csv)$/i,
    handler: zipCodeProcessor,
    args: () => [],
  },
  {
    regex: /^surveyrangetovalue\.xlsx$/i,
    handler: surveyRangeProcessor,
    args: () => [],
  },
];

function getHandlerForFile(filename) {
  const lower = filename.toLowerCase();
  for (const { regex, handler, args } of fileHandlers) {
    const match = lower.match(regex);
    if (match) {
      return { handler, args: args(match) };
    }
  }
  return null;
}

module.exports = { getHandlerForFile };
