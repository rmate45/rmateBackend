// const calculateRetirementProjection = async (userData) => {
//   try {
//     const { age, householdIncome, retirementSavings } = userData;

//     // Constants
//     const ANNUAL_CONTRIBUTION_RATE = 0.07; // 7% of income
//     const PRE_RETIREMENT_GROWTH_RATE = 0.07; // 7% annual growth
//     const WITHDRAWAL_RATE = 0.8; // 80% of income
//     const INFLATION_RATE = 0.03; // 3% inflation
//     const POST_RETIREMENT_GROWTH_RATE = 0.03; // 3% conservative growth
//     const RETIREMENT_AGE = 67;

//     const projectionData = [];
//     let currentSavings = parseFloat(retirementSavings);
//     const annualContribution =
//       parseFloat(householdIncome) * ANNUAL_CONTRIBUTION_RATE;
//     const currentAge = parseInt(age);

//     // Validate inputs
//     if (currentAge >= RETIREMENT_AGE) {
//       throw new Error("Current age must be less than retirement age (67)");
//     }

//     if (currentAge < 18) {
//       throw new Error("Current age must be at least 18");
//     }

//     // Phase 1: Pre-Retirement (Current Age to Retirement Age)
//     for (let age = currentAge; age <= RETIREMENT_AGE; age++) {
//       const growthAmount = currentSavings * PRE_RETIREMENT_GROWTH_RATE;

//       const yearData = {
//         age: age,
//         savings: Math.round(currentSavings),
//         contribution: Math.round(annualContribution),
//         withdrawal: 0,
//         growth: Math.round(growthAmount),
//         phase: "pre_retirement",
//       };

//       // Update savings for next year: (current savings + contribution) * (1 + growth rate)
//       currentSavings =
//         (currentSavings + annualContribution) *
//         (1 + PRE_RETIREMENT_GROWTH_RATE);

//       projectionData.push(yearData);
//     }

//     // Phase 2: Post-Retirement (Retirement Age + 1 until savings depleted)
//     let yearsInRetirement = 0;
//     const initialWithdrawal = parseFloat(householdIncome) * WITHDRAWAL_RATE;

//     while (currentSavings > 0 && yearsInRetirement < 33) {
//       const currentAge = RETIREMENT_AGE + yearsInRetirement + 1;

//       // Calculate inflation-adjusted withdrawal
//       const withdrawalAmount =
//         initialWithdrawal * Math.pow(1 + INFLATION_RATE, yearsInRetirement);

//       const yearData = {
//         age: currentAge,
//         savings: Math.round(currentSavings),
//         contribution: 0,
//         withdrawal: Math.round(withdrawalAmount),
//         growth: Math.round(currentSavings * POST_RETIREMENT_GROWTH_RATE),
//         phase: "post_retirement",
//       };

//       // CORRECTED FORMULA: (current savings - withdrawal) * (1 + growth rate)
//       currentSavings =
//         (currentSavings - withdrawalAmount) * (1 + POST_RETIREMENT_GROWTH_RATE);

//       // Check if savings are depleted
//       if (currentSavings <= 0) {
//         yearData.savings = 0;
//         projectionData.push(yearData);
//         break;
//       }

//       projectionData.push(yearData);
//       yearsInRetirement++;
//     }

//     // Prepare graph data for frontend
//     const graphData = prepareGraphData(projectionData);

//     return {
//       success: true,
//       data: projectionData,
//       graphData: graphData,
//       summary: generateSummary(
//         projectionData,
//         currentAge,
//         householdIncome,
//         retirementSavings
//       ),
//     };
//   } catch (error) {
//     console.error("Error calculating retirement projection:", error);
//     throw error;
//   }
// };

// const prepareGraphData = async (projectionData) => {
//   const labels = [];
//   const savingsData = [];
//   const contributionData = [];
//   const withdrawalData = [];

//   projectionData.forEach((year) => {
//     labels.push(`Age ${year.age}`);
//     savingsData.push(year.savings);
//     contributionData.push(year.contribution);
//     withdrawalData.push(year.withdrawal);
//   });

//   return {
//     labels: labels,
//     datasets: [
//       {
//         label: "Retirement Savings ($)",
//         data: savingsData,
//         backgroundColor: "rgba(54, 162, 235, 0.2)",
//         borderColor: "rgba(54, 162, 235, 1)",
//         borderWidth: 2,
//         fill: true,
//         tension: 0.4,
//       },
//       {
//         label: "Annual Contributions ($)",
//         data: contributionData,
//         backgroundColor: "rgba(75, 192, 192, 0.2)",
//         borderColor: "rgba(75, 192, 192, 1)",
//         borderWidth: 2,
//         fill: false,
//       },
//       {
//         label: "Annual Withdrawals ($)",
//         data: withdrawalData,
//         backgroundColor: "rgba(255, 99, 132, 0.2)",
//         borderColor: "rgba(255, 99, 132, 1)",
//         borderWidth: 2,
//         fill: false,
//       },
//     ],
//   };
// };

// const generateSummary = async (
//   projectionData,
//   currentAge,
//   householdIncome,
//   retirementSavings
// ) => {
//   const retirementAge = 67;
//   const peakSavings = Math.max(...projectionData.map((item) => item.savings));
//   const peakSavingsAge = projectionData.find(
//     (item) => item.savings === peakSavings
//   ).age;

//   const depletionData = projectionData.find(
//     (item) => item.savings === 0 && item.phase === "post_retirement"
//   );
//   const depletionAge = depletionData ? depletionData.age : "Never";

//   const totalContributions = projectionData
//     .filter((item) => item.phase === "pre_retirement")
//     .reduce((sum, item) => sum + item.contribution, 0);

//   const totalWithdrawals = projectionData
//     .filter((item) => item.phase === "post_retirement")
//     .reduce((sum, item) => sum + item.withdrawal, 0);

//   return {
//     currentAge: parseInt(currentAge),
//     retirementAge: retirementAge,
//     currentHouseholdIncome: parseFloat(householdIncome),
//     currentRetirementSavings: parseFloat(retirementSavings),
//     peakSavings: peakSavings,
//     peakSavingsAge: peakSavingsAge,
//     savingsDepletionAge: depletionAge,
//     totalContributions: Math.round(totalContributions),
//     totalWithdrawals: Math.round(totalWithdrawals),
//     yearsInRetirement:
//       depletionAge !== "Never" ? depletionAge - retirementAge : "Indefinite",
//   };
// };

const calculateRetirementProjection = async (userData) => {
  try {
    const { age, householdIncome, retirementSavings, otherSavings } = userData;

    // Constants from requirements - TODO: These should be configurable from database/config
    const INFLATION_RATE = 0.02; // R3 - 2% inflation rate for income growth
    const CONTRIBUTION_RATE = 0.1; // CTR - 10% contribution rate
    const COMFORT_RATE = 0.7; // Comfort% - 70% of income needed in retirement
    const INVESTMENT_RETURN = 0.06; // ROI - 6% investment return
    const RETIREMENT_AGE = 67;
    const LIFE_EXPECTANCY = 97;

    // TODO: Social Security growth rate R4 - need to get this value from config
    const SOCIAL_SECURITY_GROWTH_RATE = 0.02; // Assuming same as inflation for now

    const projectionData = [];
    const currentAge = parseInt(age);

    // Validate inputs
    if (currentAge >= RETIREMENT_AGE) {
      throw new Error("Current age must be less than retirement age (67)");
    }

    if (currentAge < 18) {
      throw new Error("Current age must be at least 18");
    }

    // Calculate vectors
    const householdIncomeVector = calculateHouseholdIncomeVector(
      currentAge,
      householdIncome,
      INFLATION_RATE,
      RETIREMENT_AGE
    );

    const hypotheticalIncomeVector = calculateHypotheticalIncomeVector(
      householdIncomeVector,
      INFLATION_RATE,
      LIFE_EXPECTANCY
    );

    const socialSecurityVector = calculateSocialSecurityVector(
      currentAge,
      householdIncome,
      SOCIAL_SECURITY_GROWTH_RATE, // TODO: Use R4 from config
      LIFE_EXPECTANCY
    );

    const fundingNeedsVector = calculateFundingNeedsVector(
      hypotheticalIncomeVector,
      COMFORT_RATE
    );

    const contributionVector = calculateContributionVector(
      householdIncomeVector,
      CONTRIBUTION_RATE
    );

    // Calculate savings projection
    const savingsProjection = calculateSavingsProjection(
      currentAge,
      retirementSavings + otherSavings, // Total savings
      contributionVector,
      fundingNeedsVector,
      socialSecurityVector,
      INVESTMENT_RETURN,
      RETIREMENT_AGE,
      LIFE_EXPECTANCY
    );

    // Prepare projection data for response
    for (let i = 0; i <= LIFE_EXPECTANCY - currentAge; i++) {
      const currentYearAge = currentAge + i;
      const isPreRetirement = currentYearAge <= RETIREMENT_AGE;

      const yearData = {
        age: currentYearAge,
        savings: Math.round(savingsProjection.savings[i]),
        contribution: isPreRetirement
          ? Math.round(contributionVector[i] || 0)
          : 0,
        withdrawal:
          !isPreRetirement && i - (RETIREMENT_AGE - currentAge) >= 0
            ? Math.round(
                fundingNeedsVector[i - (RETIREMENT_AGE - currentAge)] -
                  socialSecurityVector[i - (RETIREMENT_AGE - currentAge)]
              )
            : 0,
        growth: Math.round(savingsProjection.growth[i]),
        phase: isPreRetirement ? "pre_retirement" : "post_retirement",
        householdIncome: Math.round(
          householdIncomeVector[i] ||
            hypotheticalIncomeVector[i - (RETIREMENT_AGE - currentAge)] ||
            0
        ),
        socialSecurity:
          currentYearAge >= RETIREMENT_AGE
            ? Math.round(
                socialSecurityVector[i - (RETIREMENT_AGE - currentAge)] || 0
              )
            : 0,
        fundingNeed:
          currentYearAge >= RETIREMENT_AGE
            ? Math.round(
                fundingNeedsVector[i - (RETIREMENT_AGE - currentAge)] || 0
              )
            : 0,
      };

      projectionData.push(yearData);
    }

    // Prepare graph data for frontend
    const graphData = prepareGraphData(projectionData);

    return {
      success: true,
      data: projectionData,
      graphData: graphData,
      summary: generateSummary(
        projectionData,
        currentAge,
        householdIncome,
        retirementSavings + otherSavings
      ),
    };
  } catch (error) {
    console.error("Error calculating retirement projection:", error);
    throw error;
  }
};

// Calculate household income vector from current age to retirement age
const calculateHouseholdIncomeVector = (
  currentAge,
  householdIncome,
  inflationRate,
  retirementAge
) => {
  const vector = [];

  for (let age = currentAge; age <= retirementAge; age++) {
    const yearsFromCurrent = age - currentAge;
    const projectedIncome =
      householdIncome * Math.pow(1 + inflationRate, yearsFromCurrent);
    vector.push(projectedIncome);
  }

  return vector;
};

// Calculate hypothetical income vector from retirement age to life expectancy
const calculateHypotheticalIncomeVector = (
  householdIncomeVector,
  inflationRate,
  lifeExpectancy
) => {
  const vector = [];
  const lastIncome = householdIncomeVector[householdIncomeVector.length - 1];
  const retirementAge = 67;

  for (let age = retirementAge; age <= lifeExpectancy; age++) {
    const yearsFromRetirement = age - retirementAge;
    const hypotheticalIncome =
      lastIncome * Math.pow(1 + inflationRate, yearsFromRetirement);
    vector.push(hypotheticalIncome);
  }

  return vector;
};

// Calculate social security vector from retirement age to life expectancy
const calculateSocialSecurityVector = (
  currentAge,
  householdIncome,
  growthRate,
  lifeExpectancy
) => {
  const vector = [];

  // Calculate initial social security at age 67 in today's dollars
  const monthlyIncome = householdIncome / 12;
  let ss67Monthly = 0;

  // Social Security calculation formula from requirements
  ss67Monthly =
    0.9 * 1174 +
    0.32 * (Math.min(7078, monthlyIncome) - 1174) +
    0.15 * Math.max(0, monthlyIncome - 7078);

  const ss67Annual = ss67Monthly * 12;
  const retirementAge = 67;

  for (let age = retirementAge; age <= lifeExpectancy; age++) {
    const yearsFromCurrent = age - currentAge;
    const socialSecurity =
      ss67Annual * Math.pow(1 + growthRate, yearsFromCurrent);
    vector.push(socialSecurity);
  }

  return vector;
};

// Calculate funding needs vector (post-retirement expenses)
const calculateFundingNeedsVector = (hypotheticalIncomeVector, comfortRate) => {
  return hypotheticalIncomeVector.map((income) => income * comfortRate);
};

// Calculate contribution vector (pre-retirement savings)
const calculateContributionVector = (
  householdIncomeVector,
  contributionRate
) => {
  return householdIncomeVector.map((income) => income * contributionRate);
};

// Calculate savings projection across entire timeline
const calculateSavingsProjection = (
  currentAge,
  initialSavings,
  contributionVector,
  fundingNeedsVector,
  socialSecurityVector,
  investmentReturn,
  retirementAge,
  lifeExpectancy
) => {
  const savings = [initialSavings];
  const growth = [0];

  let currentSavings = initialSavings;

  // Pre-retirement phase (current age to retirement age)
  for (let i = 0; i < contributionVector.length; i++) {
    const contribution = contributionVector[i];
    const yearGrowth = currentSavings * investmentReturn;

    currentSavings = (currentSavings + contribution) * (1 + investmentReturn);

    savings.push(currentSavings);
    growth.push(yearGrowth);
  }

  // Post-retirement phase (retirement age to life expectancy)
  for (let i = 0; i < fundingNeedsVector.length; i++) {
    const fundingNeed = fundingNeedsVector[i];
    const socialSecurity = socialSecurityVector[i];
    const netWithdrawal = Math.max(0, fundingNeed - socialSecurity);
    const yearGrowth = currentSavings * investmentReturn;

    // Apply withdrawal and growth
    currentSavings = (currentSavings - netWithdrawal) * (1 + investmentReturn);

    // Ensure savings don't go negative
    if (currentSavings < 0) {
      currentSavings = 0;
    }

    savings.push(currentSavings);
    growth.push(yearGrowth);
  }

  return {
    savings: savings.slice(0, -1), // Remove the extra element from final calculation
    growth: growth,
  };
};

const prepareGraphData = async (projectionData) => {
  const labels = [];
  const savingsData = [];
  const contributionData = [];
  const withdrawalData = [];
  const incomeData = [];
  const socialSecurityData = [];

  projectionData.forEach((year) => {
    labels.push(`Age ${year.age}`);
    savingsData.push(year.savings);
    contributionData.push(year.contribution);
    withdrawalData.push(year.withdrawal);
    incomeData.push(year.householdIncome);
    socialSecurityData.push(year.socialSecurity);
  });

  return {
    labels: labels,
    datasets: [
      {
        label: "Retirement Savings ($)",
        data: savingsData,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Annual Contributions ($)",
        data: contributionData,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "Annual Withdrawals ($)",
        data: withdrawalData,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "Household Income ($)",
        data: incomeData,
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "Social Security ($)",
        data: socialSecurityData,
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 2,
        fill: false,
      },
    ],
  };
};

const generateSummary = async (
  projectionData,
  currentAge,
  householdIncome,
  totalSavings
) => {
  const retirementAge = 67;
  const peakSavings = Math.max(...projectionData.map((item) => item.savings));
  const peakSavingsAge = projectionData.find(
    (item) => item.savings === peakSavings
  ).age;

  const depletionData = projectionData.find(
    (item) => item.savings === 0 && item.phase === "post_retirement"
  );
  const depletionAge = depletionData ? depletionData.age : "Never";

  const totalContributions = projectionData
    .filter((item) => item.phase === "pre_retirement")
    .reduce((sum, item) => sum + item.contribution, 0);

  const totalWithdrawals = projectionData
    .filter((item) => item.phase === "post_retirement")
    .reduce((sum, item) => sum + item.withdrawal, 0);

  return {
    currentAge: parseInt(currentAge),
    retirementAge: retirementAge,
    currentHouseholdIncome: parseFloat(householdIncome),
    currentTotalSavings: parseFloat(totalSavings),
    peakSavings: peakSavings,
    peakSavingsAge: peakSavingsAge,
    savingsDepletionAge: depletionAge,
    totalContributions: Math.round(totalContributions),
    totalWithdrawals: Math.round(totalWithdrawals),
    yearsInRetirement:
      depletionAge !== "Never" ? depletionAge - retirementAge : "Indefinite",
  };
};

module.exports = {
  calculateRetirementProjection,
};
