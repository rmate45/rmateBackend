const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const { errorResponse, successResponse } = require("../utils/responseHandler.util")
const resMessages = require("../constants/resMessages.constants")
const { processVendorFile, processValueFile , processExcelFile} = require('../services/manageQuestionnire.service');


exports.uploadFile = async (req, res) => {
  try {
    if (!req.files || !req.files.file) { return res.status(400).json(errorResponse('No file uploaded')); }

    const file = req.files.file;

    if (path.extname(file.name) !== '.xlsx') {
      return res.status(400).json(errorResponse('Only .xlsx files are allowed.'));
    }

    const fileName = path.parse(file.name).name;
    const uploadPath = path.join(__dirname, '../uploads', file.name);
    await file.mv(uploadPath);

    const workbook = XLSX.readFile(uploadPath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });
     
    let questionsMap = await processExcelFile(data)

    if (file.name === 'VendorCommonQuestions.xlsx') {
      await processVendorFile(questionsMap);
    } else {
      await processValueFile(fileName, questionsMap);
    }

    fs.unlinkSync(uploadPath);
    return res.status(200).json(successResponse('Questions successfully processed and updated.'))

  } catch (error) {
    console.error("ERROR::", error);
    return res.status(500).json(errorResponse(resMessages.generalError.somethingWentWrong, error.message))
  }
};
