const projectionService = require("../services/retirementProjectionService");
const {
  successResponse,
  errorResponse,
} = require("../utils/responseHandler.util");

exports.calculateProjection = async (req, res) => {
  try {
    const { age, householdIncome, retirementSavings } = req.body;

    // Validate required parameters
    if (!age) {
      return res
        .status(400)
        .json(
          errorResponse(
            "Age, householdIncome, and retirementSavings are required"
          )
        );
    }

    if (isNaN(age) || isNaN(householdIncome) || isNaN(retirementSavings)) {
      return res
        .status(400)
        .json(errorResponse("All parameters must be valid numbers"));
    }

    if (age < 18 || age > 100) {
      return res
        .status(400)
        .json(errorResponse("Age must be between 18 and 100"));
    }

    // if (householdIncome <= 0 || retirementSavings < 0) {
    //   return res
    //     .status(400)
    //     .json(
    //       errorResponse(
    //         "Household income and retirement savings must be positive values"
    //       )
    //     );
    // }

    // Calculate projection
    const result = await projectionService.calculateRetirementProjection({
      age: parseInt(age),
      householdIncome: parseFloat(householdIncome),
      retirementSavings: parseFloat(retirementSavings),
    });

    return res
      .status(200)
      .json(
        successResponse("Retirement projection calculated successfully", result)
      );
  } catch (error) {
    console.error("ERROR::", error);

    if (
      error.message.includes("Current age must be less than retirement age")
    ) {
      return res.status(400).json(errorResponse(error.message));
    }

    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to calculate retirement projection",
          error.message
        )
      );
  }
};
