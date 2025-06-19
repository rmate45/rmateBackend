const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const {
  uploadFinancialAdvisorData,
  getFinancialAdvisors,
  processFinancialReferenceExcel,
  calculateRetirementProjection,
  parseAndInsertZipCodes,
  processLifestyleExcelRows,
  calculateComfortMean,
  getLifestyleDetails,
  processSurveyRangeExcel,
  uploadSavingByAge,
  getSavingByAgeDetails
} = require('../services/financial.service');

const { errorResponse, successResponse } = require('../utils/responseHandler.util');
const resMessages = require('../constants/resMessages.constants');


exports.uploadFinancialAdvisorFile = async (req, res) => {
  try {
    const file = req.files?.file;

    if (!file) { return res.status(400).json(errorResponse("No file uploaded.")); }

    const filename = file.name;
    const ext = path.extname(filename).toLowerCase();
    const baseName = path.basename(filename, ext).toLowerCase();

    if (baseName !== 'financialadvisors' || ext !== '.xlsx') {
      return res.status(400).json(errorResponse("Filename must be 'financialAdvisors.xlsx'."));
    }

    const uploadPath = path.join(__dirname, '../uploads', file.name);

    await file.mv(uploadPath);

    await uploadFinancialAdvisorData(uploadPath);

    fs.unlinkSync(uploadPath);

    return res.status(200).json(successResponse("File uploaded and data saved successfully"));
  } catch (error) {
    console.error("ERROR::", error);
    return res.status(500).json(errorResponse(resMessages.generalError.somethingWentWrong, error.message));
  }
};


exports.getFinancialAdvisors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 3

    const financialAdvisors = await getFinancialAdvisors(page, limit)

    return res.status(200).json(successResponse('Details fetched successfully.', financialAdvisors))
  } catch (error) {
    console.error("ERROR::", error);
    return res.status(500).json(errorResponse(resMessages.generalError.somethingWentWrong, error.message));
  }
}


exports.uploadFinancialReference = async (req, res) => {
  try {
  if (!req.files || !req.files.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const file = req.files.file;

  const ext = path.extname(file.name).toLowerCase();
  const baseName = path.basename(file.name, ext).toLowerCase();

  if (baseName !== 'financialreference' || ext !== '.xlsx') {
  return res.status(400).json({
    success: false,
    message: "Filename must be 'financialReference.xlsx'",
  });
  }

    const uploadPath = path.join(__dirname, '../uploads', file.name);
    await file.mv(uploadPath);

    const workbook = XLSX.readFile(uploadPath);
    const sheetName = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });

    await processFinancialReferenceExcel(rows);

    fs.unlinkSync(uploadPath);
    return res.status(200).json({ success: true, message: 'Financial reference data uploaded successfully' });

  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({ success: false, message: 'Something went wrong', error: error.message });
  }
};

exports.uploadSavingByAge = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const file = req.files.file;

   const expectedFilename = 'savingsByAge.xlsx';
   if (file.name.toLowerCase() !== expectedFilename.toLowerCase()) {
   return res.status(400).json({ success: false, message: `Filename must be '${expectedFilename}'` });
   }

   if (!file.name.toLowerCase().endsWith('.xlsx')) {
   return res.status(400).json({ success: false, message: 'Only .xlsx files are supported' });
   }

   await uploadSavingByAge(file.data);

    return res.status(200).json({ success: true, message: 'Savings by age data uploaded successfully' });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.uploadSurveyRangeFile = async (req, res) => {
  try {
    const file = req.files?.file;
    if (!file) { return res.status(400).json(errorResponse("No file uploaded.")); }

    if (path.extname(file.name) !== '.xlsx') {
      return res.status(400).json(errorResponse("Only .xlsx files are allowed."));
    }

    if (file.name.toLowerCase() !== 'surveyrangetovalue.xlsx') {
      return res.status(400).json(errorResponse("Invalid filename. Only 'SurveyRangeToValue.xlsx' is allowed."));
    }

    await processSurveyRangeExcel(file, path.join(__dirname, '../uploads'));

    return res.status(200).json(successResponse("File uploaded and data saved successfully."));

  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong.", error: error.message });
  }
};

exports.uploadZipCodes = async (req, res) => {
  try {
    const file = req.files?.file;
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const expectedFilename = 'zipCodes.csv';
    if (file.name.toLowerCase() !== expectedFilename.toLowerCase()) {
    return res.status(400).json({ success: false, message: `Filename must be exactly '${expectedFilename}'` });
    }

    const uploadDir = path.join(__dirname, '../uploads');
    const filePath = path.join(uploadDir, `${Date.now()}-${file.name}`);

    const fs = require('fs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    await file.mv(filePath);

    await parseAndInsertZipCodes(filePath);

    fs.unlinkSync(filePath);

    res.status(200).json({ success: true, message: 'Zip codes uploaded successfully' });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};


exports.savingsAt67 = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const file = req.files.file; 

    const expectedFilename = 'savingAt67.xlsx';
    if (file.name !== expectedFilename) {
      return res.status(400).json({ success: false, message: `Filename must be exactly '${expectedFilename}'` });
    }

    if (path.extname(file.name).toLowerCase() !== '.xlsx') {
      return res.status(400).json({ success: false, message: 'Only .xlsx files are allowed' });
    }

    const uploadPath = path.join(__dirname, '../uploads', file.name);
    await file.mv(uploadPath);

    const workbook = XLSX.readFile(uploadPath);
    const sheetName = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });

    await processLifestyleExcelRows(rows);

    fs.unlinkSync(uploadPath);

    return res.status(200).json({ success: true, message: 'Savings at 67 data inserted successfully' });
  } catch (error) {
    console.error('Upload Error:', error);
    return res.status(500).json({ success: false, message: 'Something went wrong', error: error.message });
  }
};


exports.calculateResultsLevel1 = async (req, res) => {
  try {
    const details = req.body.details;

    const exactAge = details.userRangeAnswers['How old are you?']
    
    const result = await calculateRetirementProjection(details.userRangeAnswers);

    const questionKey = "Where do you currently live? Please enter your zip code";
    const zipCode = details.userAnswers[questionKey];
    
    const getComfortMean = await calculateComfortMean(zipCode);
    const lifestyleDetails = await getLifestyleDetails(zipCode);
  
    const SAVERET = result.projectedRetirementValue;
    const medianLifestyle = lifestyleDetails.medianLifestyle;
    const RETIREMENT_YEARS = 20;
  
    //can retire at 67
    const canRetireAt67 = SAVERET >= getComfortMean ? "Yes" : "No";
    

    //how long money last
    const SAVELAST = parseFloat((SAVERET / medianLifestyle).toFixed(1));
    const DELTA = parseFloat((RETIREMENT_YEARS - SAVELAST).toFixed(1));


    const retirementMessage = SAVELAST >= RETIREMENT_YEARS
      ? 'Good job! You’re on track for retirement.'
      : `Get on track now — your savings may fall short by approximately ${DELTA} year${DELTA !== 1 ? 's' : ''}.`;

    // Can retire today
    const savingByAge = await getSavingByAgeDetails(exactAge, zipCode)
    const MedianLife = savingByAge.medianLife
    
    const DELTA1 = parseFloat((MedianLife - SAVERET).toFixed(2));
    const canRetireToday = DELTA1 <= 0 ? "YES" : "NO";
    const retireTodayMessage = DELTA1 <= 0
      ? 'YES — you can afford to retire today.'
      : `NO — you need approximately $${Math.abs(DELTA1).toLocaleString()} more to retire comfortably.`;


    // Final structured response
    const data = {
      canRetireAt67: {
        "Can I retire at 67?": canRetireAt67,
        "Your Projected Savings at 67": SAVERET,
        "Savings Required at 67": getComfortMean,
        "Savings Deficit / Surplus": parseFloat((SAVERET - getComfortMean).toFixed(2))
      },
      savingRequiredAt67: {
        "For Budget LifeStyle": lifestyleDetails.budget.mean,
        "For Comfortable Lifestyle": lifestyleDetails.comfort.mean,
        "For Luxury Lifestyle": lifestyleDetails.luxury.mean
      },
      howLongMoneyLast: {
        "How Long will my money last?": SAVELAST,
        "Years Extra": DELTA,
        "Message": retirementMessage
      },
      canIRetireToday: {
        "Can I Retire Today?": canRetireToday,
        "Savings Today": SAVERET,
        "Amount Needed to Retire Today": medianLifestyle,
        "Message": retireTodayMessage
      }
    };

    return res.status(200).json({
      success: true,
      message: "Retirement projection calculated successfully.",
      data
    });

  } catch (error) {
    console.error("Retirement Calculation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to calculate retirement projection.",
      error: error.message
    });
  }
};


