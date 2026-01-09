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

    // Constants - MATCHING SPREADSHEET VALUES
    const INFLATION_RATE = 0.025; // C10
    const CONTRIBUTION_RATE = 0.1; // C13
    const COMFORT_RATE = 0.7; // C8
    const PRE_RETIREMENT_GROWTH_RATE = 0.07; // C11
    const POST_RETIREMENT_GROWTH_RATE = 0.02; // C15
    const SOCIAL_SECURITY_GROWTH_RATE = 0.025; // C14
    const LIFESTYLE_GROWTH_RATE = 0.025; // C9
    const RETIREMENT_AGE = 67;
    const LIFE_EXPECTANCY = 97;

    const projectionData = [];
    const currentAge = parseInt(age);

    if (currentAge < 18) {
      throw new Error("Current age must be at least 18");
    }

    // Calculate base Social Security using spreadsheet formula
    const monthlyIncome = householdIncome / 12;
    const ssBaseMonthly =
      Math.min(monthlyIncome, 1174) * 0.9 +
      Math.max(0, Math.min(monthlyIncome, 7078) - 1174) * 0.32 +
      Math.max(0, monthlyIncome - 7078) * 0.15;
    const baseSocialSecurity = ssBaseMonthly * 12;

    // Calculate base Lifestyle Need
    const baseLifestyleNeed = householdIncome * COMFORT_RATE;

    let householdIncomeVector = [],
      hypotheticalIncomeVector = [],
      socialSecurityVector = [],
      fundingNeedsVector = [],
      contributionVector = [];

    if (currentAge >= RETIREMENT_AGE) {
      // FOR AGES 67+: Use spreadsheet logic

      // Generate Lifestyle Need from 67 to 97 (grows at LIFESTYLE_GROWTH_RATE)
      fundingNeedsVector = [];
      for (let age = RETIREMENT_AGE; age <= LIFE_EXPECTANCY; age++) {
        const yearsFrom67 = age - RETIREMENT_AGE;
        const lifestyleNeed =
          baseLifestyleNeed * Math.pow(1 + LIFESTYLE_GROWTH_RATE, yearsFrom67);
        fundingNeedsVector.push(lifestyleNeed);
      }

      // Generate Social Security from 67 to 97 (grows at SOCIAL_SECURITY_GROWTH_RATE)
      socialSecurityVector = [];
      for (let age = RETIREMENT_AGE; age <= LIFE_EXPECTANCY; age++) {
        const yearsFrom67 = age - RETIREMENT_AGE;
        const socialSecurity =
          baseSocialSecurity *
          Math.pow(1 + SOCIAL_SECURITY_GROWTH_RATE, yearsFrom67);
        socialSecurityVector.push(socialSecurity);
      }

      // No pre-retirement vectors needed for 67+
      householdIncomeVector = [];
      hypotheticalIncomeVector = [];
      contributionVector = [];
    } else {
      // FOR AGES < 67: USE EXISTING LOGIC (NO CHANGES)
      householdIncomeVector = calculateHouseholdIncomeVector(
        currentAge,
        householdIncome,
        INFLATION_RATE,
        RETIREMENT_AGE
      );

      hypotheticalIncomeVector = calculateHypotheticalIncomeVector(
        householdIncomeVector,
        INFLATION_RATE,
        LIFE_EXPECTANCY
      );

      socialSecurityVector = [];
      for (let age = RETIREMENT_AGE; age <= LIFE_EXPECTANCY; age++) {
        const yearsFrom67 = age - RETIREMENT_AGE;
        const socialSecurity =
          baseSocialSecurity *
          Math.pow(1 + SOCIAL_SECURITY_GROWTH_RATE, yearsFrom67);
        socialSecurityVector.push(socialSecurity);
      }

      fundingNeedsVector = calculateFundingNeedsVector(
        hypotheticalIncomeVector,
        COMFORT_RATE
      );

      contributionVector = calculateContributionVector(
        householdIncomeVector,
        CONTRIBUTION_RATE
      );
    }

    // Calculate savings projection
    const savingsProjection = calculateSavingsProjection(
      currentAge,
      retirementSavings + otherSavings,
      contributionVector,
      fundingNeedsVector,
      socialSecurityVector,
      PRE_RETIREMENT_GROWTH_RATE,
      POST_RETIREMENT_GROWTH_RATE,
      RETIREMENT_AGE,
      LIFE_EXPECTANCY
    );

    // Prepare projection data for response
    for (let i = 0; i <= LIFE_EXPECTANCY - currentAge; i++) {
      const currentYearAge = currentAge + i;
      const isPreRetirement = currentYearAge < RETIREMENT_AGE;
      const isRetirementAge = currentYearAge === RETIREMENT_AGE;
      const isPostRetirement = currentYearAge > RETIREMENT_AGE;

      const preRetirementIndex = Math.min(i, householdIncomeVector.length - 1);
      const postRetirementIndex = Math.max(0, currentYearAge - RETIREMENT_AGE);

      let displayHouseholdIncome = 0;
      let displaySocialSecurity = 0;
      let displayContribution = 0;
      let displayWithdrawal = 0;
      let displayFundingNeed = 0;

      if (currentAge >= RETIREMENT_AGE) {
        // FOR 67+: Use spreadsheet-based values
        if (postRetirementIndex < socialSecurityVector.length) {
          displaySocialSecurity = Math.round(
            socialSecurityVector[postRetirementIndex] || 0
          );
        }
        if (postRetirementIndex < fundingNeedsVector.length) {
          displayFundingNeed = Math.round(
            fundingNeedsVector[postRetirementIndex] || 0
          );
        }
        displayWithdrawal = Math.max(
          0,
          displayFundingNeed - displaySocialSecurity
        );

        // For 67+, household income is the hypothetical income (Lifestyle Need / Comfort Rate)
        if (postRetirementIndex < fundingNeedsVector.length) {
          displayHouseholdIncome = Math.round(
            fundingNeedsVector[postRetirementIndex] / COMFORT_RATE
          );
        }
      } else {
        // FOR <67: Use existing logic
        if (isPreRetirement || isRetirementAge) {
          if (preRetirementIndex < householdIncomeVector.length) {
            displayHouseholdIncome = Math.round(
              householdIncomeVector[preRetirementIndex] || 0
            );
          }
        } else {
          if (postRetirementIndex < hypotheticalIncomeVector.length) {
            displayHouseholdIncome = Math.round(
              hypotheticalIncomeVector[postRetirementIndex] || 0
            );
          }
        }

        if (isPreRetirement && preRetirementIndex < contributionVector.length) {
          displayContribution = Math.round(
            contributionVector[preRetirementIndex] || 0
          );
        }

        if (
          (isRetirementAge || isPostRetirement) &&
          postRetirementIndex < socialSecurityVector.length &&
          postRetirementIndex < fundingNeedsVector.length
        ) {
          displaySocialSecurity = Math.round(
            socialSecurityVector[postRetirementIndex] || 0
          );
          displayFundingNeed = Math.round(
            fundingNeedsVector[postRetirementIndex] || 0
          );
          displayWithdrawal = Math.max(
            0,
            Math.round(displayFundingNeed - displaySocialSecurity)
          );
        }
      }

      const phase =
        currentYearAge < RETIREMENT_AGE ? "pre_retirement" : "post_retirement";

      const yearData = {
        age: currentYearAge,
        savings: Math.round(savingsProjection.savings[i]),
        contribution: displayContribution,
        withdrawal: displayWithdrawal,
        growth: Math.round(savingsProjection.growth[i]),
        phase: phase,
        householdIncome: displayHouseholdIncome,
        socialSecurity: displaySocialSecurity,
        fundingNeed: displayFundingNeed,
      };

      projectionData.push(yearData);
    }

    const graphData = prepareGraphData(
      projectionData,
      currentAge >= RETIREMENT_AGE
    );

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

const calculateSocialSecurityVectorFor67Plus = (
  householdIncome,
  growthRate,
  retirementAge,
  lifeExpectancy
) => {
  const vector = [];

  // Social Security calculation formula
  const monthlyIncome = householdIncome / 12;
  const ssBaseMonthly =
    Math.min(monthlyIncome, 1174) * 0.9 +
    Math.max(0, Math.min(monthlyIncome, 7078) - 1174) * 0.32 +
    Math.max(0, monthlyIncome - 7078) * 0.15;
  const ssBaseAnnual = ssBaseMonthly * 12;

  // Generate from retirement age to life expectancy using INFLATION rate (not years from current)
  for (let age = retirementAge; age <= lifeExpectancy; age++) {
    const yearsFromRetirement = age - retirementAge;
    const socialSecurity =
      ssBaseAnnual * Math.pow(1 + growthRate, yearsFromRetirement);
    vector.push(socialSecurity);
  }

  return vector;
};

// Calculate household income vector from current age to retirement age
const calculateHouseholdIncomeVector = (
  currentAge,
  householdIncome,
  inflationRate,
  retirementAge
) => {
  const vector = [];
  if (currentAge >= retirementAge) {
    return vector;
  }
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

// Calculate social security vector from retirement age to life expectancy - MATCHING SPREADSHEET FORMULA
const calculateSocialSecurityVector = (
  currentAge,
  householdIncome,
  growthRate,
  lifeExpectancy
) => {
  const vector = [];
  const monthlyIncome = householdIncome / 12;
  const ssBaseMonthly =
    Math.min(monthlyIncome, 1174) * 0.9 +
    Math.max(0, Math.min(monthlyIncome, 7078) - 1174) * 0.32 +
    Math.max(0, monthlyIncome - 7078) * 0.15;
  const ssBaseAnnual = ssBaseMonthly * 12;
  const retirementAge = 67;
  for (let age = retirementAge; age <= lifeExpectancy; age++) {
    const yearsFromCurrent = age - currentAge;
    const socialSecurity =
      ssBaseAnnual * Math.pow(1 + growthRate, yearsFromCurrent);
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
  if (householdIncomeVector.length === 0) {
    return [];
  }
  return householdIncomeVector.map((income) => income * contributionRate);
};

// Calculate savings projection across entire timeline - CORRECTED VERSION
const calculateSavingsProjection = (
  currentAge,
  initialSavings,
  contributionVector,
  fundingNeedsVector,
  socialSecurityVector,
  preRetirementGrowthRate,
  postRetirementGrowthRate,
  retirementAge,
  lifeExpectancy
) => {
  const savings = [initialSavings];
  const growth = [0];
  const withdrawals = [0];

  let currentSavings = initialSavings;

  if (currentAge >= retirementAge) {
    // USER IS 67+: Use exact spreadsheet logic
    const startIndex = currentAge - retirementAge;

    // First year (current age)
    if (startIndex < fundingNeedsVector.length) {
      const fundingNeed = fundingNeedsVector[startIndex] || 0;
      const socialSecurity = socialSecurityVector[startIndex] || 0;
      const netWithdrawal = Math.max(0, fundingNeed - socialSecurity);

      // Calculate growth for first year
      const yearGrowth = currentSavings * postRetirementGrowthRate;

      // Apply spreadsheet formula: F[next] = (F[current] - G[current]) * (1 + C15)
      currentSavings =
        (currentSavings - netWithdrawal) * (1 + postRetirementGrowthRate);

      savings.push(currentSavings);
      growth.push(yearGrowth);
      withdrawals.push(netWithdrawal);
    }

    // Subsequent years
    for (let i = startIndex + 1; i < fundingNeedsVector.length; i++) {
      const fundingNeed = fundingNeedsVector[i] || 0;
      const socialSecurity = socialSecurityVector[i] || 0;
      const netWithdrawal = Math.max(0, fundingNeed - socialSecurity);

      // SPREADSHEET FORMULA: F[next] = F[current] * (1 + C15) - G[next]
      const yearGrowth = currentSavings * postRetirementGrowthRate;
      currentSavings =
        currentSavings * (1 + postRetirementGrowthRate) - netWithdrawal;

      savings.push(currentSavings);
      growth.push(yearGrowth);
      withdrawals.push(netWithdrawal);
    }

    // Remove initial element
    savings.shift();
    growth.shift();
    withdrawals.shift();
  } else {
    // FOR AGES < 67: USE EXISTING LOGIC (NO CHANGES)
    // Pre-retirement phase (current age to 66)
    for (let i = 0; i < retirementAge - currentAge - 1; i++) {
      const contribution = contributionVector[i] || 0;
      const yearGrowth = currentSavings * preRetirementGrowthRate;
      currentSavings =
        (currentSavings + contribution) * (1 + preRetirementGrowthRate);
      savings.push(currentSavings);
      growth.push(yearGrowth);
      withdrawals.push(0);
    }

    // Age 66 (last pre-retirement year)
    const age66Index = retirementAge - currentAge - 1;
    const age66Contribution = contributionVector[age66Index] || 0;
    const age66Growth = currentSavings * preRetirementGrowthRate;
    currentSavings =
      (currentSavings + age66Contribution) * (1 + preRetirementGrowthRate);
    savings.push(currentSavings);
    growth.push(age66Growth);
    withdrawals.push(0);

    // Age 67 - First year of post-retirement
    const age67FundingNeed = fundingNeedsVector[0] || 0;
    const age67SocialSecurity = socialSecurityVector[0] || 0;
    const age67Withdrawal = Math.max(0, age67FundingNeed - age67SocialSecurity);
    const age67Growth = currentSavings * postRetirementGrowthRate;
    currentSavings =
      (currentSavings - age67Withdrawal) * (1 + postRetirementGrowthRate);
    savings.push(currentSavings);
    growth.push(age67Growth);
    withdrawals.push(age67Withdrawal);

    // Age 68 onwards
    for (let i = 1; i <= lifeExpectancy - retirementAge; i++) {
      const fundingNeed = fundingNeedsVector[i] || 0;
      const socialSecurity = socialSecurityVector[i] || 0;
      const netWithdrawal = Math.max(0, fundingNeed - socialSecurity);
      const yearGrowth = currentSavings * postRetirementGrowthRate;
      currentSavings =
        (currentSavings - netWithdrawal) * (1 + postRetirementGrowthRate);
      savings.push(currentSavings);
      growth.push(yearGrowth);
      withdrawals.push(netWithdrawal);
    }
  }

  return {
    savings: savings,
    growth: growth,
    withdrawals: withdrawals,
  };
};

const prepareGraphData = async (projectionData, is67Plus = false) => {
  const labels = [];
  const savingsData = [];
  const withdrawalData = [];
  const socialSecurityData = [];

  projectionData.forEach((year) => {
    labels.push(`Age ${year.age}`);
    savingsData.push(year.savings);
    withdrawalData.push(year.withdrawal);
    socialSecurityData.push(year.socialSecurity);
  });

  if (is67Plus) {
    // For 67+: Show only Savings, Withdrawal, Social Security
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
          label: "Annual Withdrawals ($)",
          data: withdrawalData,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
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
  } else {
    // For <67: Show all data (existing behavior)
    const contributionData = [];
    const incomeData = [];

    projectionData.forEach((year) => {
      contributionData.push(year.contribution);
      incomeData.push(year.householdIncome);
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
  }
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
    (item) => item.savings <= 0 && item.phase === "post_retirement"
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

const calculateRecommendations = async (
  projectionData,
  userData,
  originalScenario
) => {
  try {
    const { age, householdIncome, retirementSavings, otherSavings } = userData;

    // Find Age_LAST - when savings become negative in post-retirement
    const depletionData = projectionData.find(
      (item) => item.savings <= 0 && item.phase === "post_retirement"
    );
    const Age_LAST = depletionData ? depletionData.age : null;

    // Calculate age range
    const LONGEVITY_LOW = Age_LAST ? Age_LAST - 3 : 95;
    const LONGEVITY_HIGH = Age_LAST ? Age_LAST + 2 : 97;

    // Determine longevity band based on Age_LAST
    let longevityBand;
    if (!Age_LAST || Age_LAST >= 95) {
      longevityBand = "95+";
    } else if (Age_LAST >= 90) {
      longevityBand = "90-94";
    } else if (Age_LAST >= 80) {
      longevityBand = "80-89";
    } else {
      longevityBand = "70-79";
    }

    // Determine age group
    let ageGroup;
    if (age >= 85) ageGroup = "85+";
    else if (age >= 75) ageGroup = "75-84";
    else if (age >= 65) ageGroup = "65-74";
    else if (age >= 55) ageGroup = "55-64";
    else if (age >= 45) ageGroup = "45-54";
    else if (age >= 35) ageGroup = "35-44";
    else if (age >= 25) ageGroup = "25-34";
    else ageGroup = "18-24";

    // Get longevity band message
    const longevityMessage = getLongevityMessage(
      ageGroup,
      longevityBand,
      LONGEVITY_LOW,
      LONGEVITY_HIGH
    );

    // EXTRACT ACTUAL VALUES FROM PROJECTION DATA

    // 1. Find retirement age
    const retirementEntry = projectionData.find(
      (item) => item.phase === "post_retirement"
    );
    const RETIRE_AGE = retirementEntry ? retirementEntry.age : 67;

    // 2. Find peak savings
    const PEAK_SAVINGS = Math.max(
      ...projectionData.map((item) => item.savings || 0)
    );

    // 3. Find current age data
    const currentYearData = projectionData.find((item) => item.age === age);

    // Calculate actual contribution rate from data
    let currentContributionRate = 0;
    let CONTRIB_DOLLARS = 0;
    if (currentYearData && currentYearData.householdIncome > 0) {
      currentContributionRate = Math.round(
        (currentYearData.contribution / currentYearData.householdIncome) * 100
      );
      CONTRIB_DOLLARS = Math.round(currentYearData.contribution / 12);
    } else {
      CONTRIB_DOLLARS = Math.round((householdIncome * 0.1) / 12);
      currentContributionRate = 10;
    }

    // Calculate contribution variables for 15% and 20%
    const CONTRIB_15_DOLLARS = Math.round((householdIncome * 0.15) / 12);
    const CONTRIB_20_DOLLARS = Math.round((householdIncome * 0.2) / 12);

    // 4. Find Social Security data at retirement age
    const ssData = projectionData.find((item) => item.age === RETIRE_AGE);
    const SS_BENEFIT = ssData ? Math.abs(ssData.socialSecurity || 0) : 0;

    // 5. Find withdrawal amount at retirement age (W67) - FIXED
    // Look for withdrawal or calculate from savings change if withdrawal is 0
    const withdrawalData = projectionData.find(
      (item) => item.age === RETIRE_AGE
    );
    let W67 = 0;

    if (withdrawalData) {
      // Try to get withdrawal directly
      W67 = Math.abs(withdrawalData.withdrawal || 0);

      // If withdrawal is 0, try to calculate it from savings change
      if (W67 === 0) {
        // Find the year before retirement
        const preRetirementData = projectionData.find(
          (item) => item.age === RETIRE_AGE - 1
        );

        if (preRetirementData && withdrawalData.savings > 0) {
          // Calculate withdrawal as 4% of savings (common retirement withdrawal rate)
          W67 = Math.round(preRetirementData.savings * 0.04);
        }
      }

      // Ensure minimum withdrawal if still 0
      if (W67 === 0 && SS_BENEFIT > 0) {
        // Calculate as 70% of income minus social security
        const incomeAtRetirement = withdrawalData.householdIncome || 0;
        W67 = Math.max(0, Math.round(incomeAtRetirement * 0.7 - SS_BENEFIT));
      }
    }

    console.log("DEBUG - Retirement Age:", RETIRE_AGE);
    console.log("DEBUG - SS_BENEFIT:", SS_BENEFIT);
    console.log("DEBUG - W67:", W67);

    // 6. Fixed growth rate at 5.5% as per Excel
    const GROWTH_RATE = 5.5;

    // Calculate Retirement Paycheck variables - USING CORRECT FORMULA FROM EXCEL TAB 2
    const paycheckVariables = calculateRetirementPaycheckVariables(
      SS_BENEFIT,
      W67
    );

    console.log("DEBUG - Paycheck Variables:", paycheckVariables);

    // Calculate Annual Costs variables - USING CORRECT FORMULA FROM EXCEL TAB 2
    const RP = paycheckVariables.RP; // Retirement Paycheck total
    const annualCostsVariables = calculateAnnualCostsVariables(RP);

    // Calculate strengthening steps variables
    const strengtheningVariables = await calculateStrengtheningVariables(
      userData,
      projectionData,
      RETIRE_AGE,
      {
        CONTRIB_15_DOLLARS,
        CONTRIB_20_DOLLARS,
      }
    );

    // Base recommendations object
    const recommendations = {
      // TOP STATEMENT
      topStatement: `Your total savings are projected to last until approximately age ${LONGEVITY_LOW} to ${LONGEVITY_HIGH}.`,

      // Your Snap Shot
      "Your Snap Shot": [
        `Based on what you shared, your savings are projected to last until roughly age ${LONGEVITY_LOW}–${LONGEVITY_HIGH}.`,
        `That gives you a solid starting point — but most people need their money to last to at least 95.`,
        `Let's take a look at what's shaping your outlook and the steps that can meaningfully strengthen it.`,
      ].join("<br>"),

      // What's Shaping Your Outlook
      "What's Shaping Your Outlook": [
        `Your contributions of 10% ($${CONTRIB_DOLLARS}/mo) help your savings grow to about $${Math.round(
          PEAK_SAVINGS
        ).toLocaleString()} before retirement.`,
        `Retiring around age ${RETIRE_AGE} sets the point where saving stops and withdrawals begin.`,
        `Starting Social Security at 67 provides roughly $${Math.round(
          SS_BENEFIT
        ).toLocaleString()}/yr, reducing how much you need to withdraw.`,
        `A long-term growth rate of ${GROWTH_RATE}% shapes how quickly your balance builds and how long it lasts.`,
      ].join("<br>"),

      // Your Retirement Paycheck - USING CORRECT CALCULATIONS
      "Your Retirement Paycheck": [
        `Your Retirement Paycheck represents the core income you can plan around in retirement—estimated at $${paycheckVariables.RETIREMENT_PAYCHECK_LOW}–$${paycheckVariables.RETIREMENT_PAYCHECK_HIGH} per year.`,
        `This includes predictable, recurring sources of income that form the baseline for your day-to-day spending.`,
        `Social Security: You may receive about $${paycheckVariables.Social_Security_X} - $${paycheckVariables.Social_Security_Y} per year.`,
        `Retirement Accounts: You can withdraw approximately $${paycheckVariables.RIA_X} - $${paycheckVariables.RIA_Y} per year from your retirement accounts.`,
        `Investment Accounts: You can withdraw approximately $${paycheckVariables.Investment_X} - $${paycheckVariables.Investment_Y} per year from your investment accounts.`,
        `Using both retirement and investment accounts can help manage taxes over time and give your money more room to grow.`,
        `Keep in mind: some of your retirement paycheck may go toward federal and state taxes, depending on where you live.`,
      ].join("<br>"),

      // Other Sources of Retirement Income
      "Other Sources of Retirement Income": [
        `These aren't part of your core retirement paycheck - but they're common ways people add flexibility and income in retirement.`,
        `Full/Part-time work: About 20% of seniors 65+ work part- or full-time to supplement retirement income.`,
        `Annuities: Products designed to convert savings into steady, lifelong monthly income.`,
        `Whole Life Insurance: Permanent insurance that provides lifelong coverage and may build cash value you can access.`,
        `Tangible Assets: Physical items—such as real estate, gold, or collectibles—that may hold value or generate income.`,
        `Reverse Mortgage: A potential option for homeowners 62+ to access home equity as cash or income while remaining in their home.`,
        `Whether any of these make sense depends on your goals, health, and lifestyle—and many people never use them at all.`,
      ].join("<br>"),

      // What You're Likely to Spend in Retirement - USING CORRECT CALCULATIONS
      "What You're Likely to Spend in Retirement": [
        `This estimate reflects what retirement may cost you each year based on lifestyle assumptions, healthcare expectations, and where you plan to live.`,
        `Understanding your expected spending helps put your income—and any gaps—into context.`,
        `These ranges reflect typical annual spending patterns for households like yours—your actual costs may be higher or lower.`,
        `Housing: $${annualCostsVariables.H1} - $${annualCostsVariables.H2}`,
        `Food & Groceries: $${annualCostsVariables.F1} - $${annualCostsVariables.F2}`,
        `Transportation: $${annualCostsVariables.T1} - $${annualCostsVariables.T2}`,
        `Healthcare: approximately $${annualCostsVariables.HC}`,
        `Entertainment & Travel: $${annualCostsVariables.E1} - $${annualCostsVariables.E2}`,
        `Other Everyday Expenses: $${annualCostsVariables.O1} - $${annualCostsVariables.O2}`,
        `Spending in retirement varies widely, and many people adjust these categories over time as their priorities change.`,
      ].join("<br>"),

      // How to Strengthen Your Plan - WITH CORRECT FORMATTING
      "How to Strengthen Your Plan": strengtheningVariables,

      // How RetireMate Guides You Forward
      "How RetireMate Guides You Forward": [
        `RetireMate is designed to help you move forward with clarity, not overwhelm.`,
        `Instead of giving you everything at once, it focuses on the next steps that matter most based on your situation.`,
        `As your life changes—whether that's work, health, family, or goals—you can revisit your roadmap and see how those changes affect your outlook.`,
        `RetireMate updates alongside you, helping you explore options, test scenarios, and make informed decisions over time.`,
      ].join("<br>"),

      // What This Snapshot Doesn't Include (Yet)
      "What This Snapshot Doesn't Include (Yet)": [
        `This snapshot is built from the information you shared, but it doesn't capture everything that could shape your retirement over time.`,
        `Some important factors aren't included yet:`,
        `Long-term care needs or insurance`,
        `Major health changes or unexpected medical costs`,
        `Changes in your ability or desire to work`,
        `Divorce, remarriage, or significant inheritances`,
        `Decisions involving home equity (downsizing, relocating, renting)`,
        `Future changes to Social Security, tax rules, or other policies`,
        `This doesn't mean your plan is incomplete—it means it's a starting point.`,
        `As you refine your goals and add more details, your roadmap can become more personalized, realistic, and useful.`,
      ].join("<br>"),
    };

    return recommendations;
  } catch (error) {
    console.error("Error calculating recommendations:", error);
    throw error;
  }
};

// Helper function to get longevity message - UPDATED
const getLongevityMessage = (ageGroup, longevityBand, ageLow, ageHigh) => {
  const longevityMessages = {
    "18-24": {
      "70-79":
        "Based on what you shared, your savings are projected to last into your 70s. That's perfectly normal for this stage of life - most people your age haven't built much savings yet. Let's walk through what's shaping this outlook and the moves that can meaningfully extend your financial runway.",
      "80-89":
        "Based on what you shared, your savings are projected to last into your 80s - a strong early marker. Most people your age haven't built a foundation yet, so you're ahead by checking now. Let's look at what's shaping your outlook and the steps that can help you strengthen it over time.",
      "90-94":
        "Based on what you shared, your savings are projected to last into your early 90s - an excellent early-stage trajectory. Most people your age aren't thinking this far ahead, so you're building a strong base. Let's explore what's shaping your outlook and the steps that can keep it moving in the right direction.",
      "95+":
        "Based on what you shared, your savings are projected to last well past 95. That's an exceptional early signal, and you have decades to build on it. Let's look at what's shaping your outlook and the steps that can keep this strong momentum going.",
    },
    "25-34": {
      "70-79":
        "Based on what you shared, your savings are projected to last into your 70s. Many people in their 20s and 30s land here, and you're ahead of the curve by checking now. Let's break down the factors behind your outlook and the steps that can stretch your retirement timeline.",
      "80-89":
        "Based on what you shared, your savings are projected to last into your 80s - solid for this point in life. You have time and flexibility to build on this trajectory. Let's take a look at the drivers behind your outlook and the moves that can help fortify it.",
      "90-94":
        "Based on what you shared, your savings are projected to last into your early 90s - a strong trajectory at this stage. With consistent habits, you can easily reach long-term durability. Let's look at the factors behind your outlook and the moves that can fine-tune it.",
      "95+":
        "Based on what you shared, your savings are projected to last well past 95 - a standout trajectory at this stage. You're setting yourself up with meaningful long-term flexibility. Let's explore the drivers behind your outlook and the moves that can keep reinforcing it.",
    },
    // ... other age groups remain similar but all starting with "Based on what you shared..."
  };

  return (
    longevityMessages[ageGroup]?.[longevityBand] ||
    `Based on what you shared, your savings are projected to last until roughly ${ageLow} to ${ageHigh}. That gives you a solid starting point - but most people need their money to last to at least 95. Let's take a look at what's shaping your outlook and the steps that can meaningfully strengthen it.`
  );
};

// Calculate Retirement Paycheck variables - CORRECTED AS PER EXCEL TAB 2
const calculateRetirementPaycheckVariables = (SS67, W67) => {
  try {
    console.log(
      "DEBUG - calculateRetirementPaycheckVariables - SS67:",
      SS67,
      "W67:",
      W67
    );

    // RP = W67 + SS67 (Retirement Paycheck total)
    const RP = SS67 + W67;

    // Retirement Paycheck Range
    const RETIREMENT_PAYCHECK_LOW = Math.round(RP * 0.95);
    const RETIREMENT_PAYCHECK_HIGH = Math.round(RP * 1.1);

    // Social Security Range
    const Social_Security_X = Math.round(SS67 * 0.95);
    const Social_Security_Y = Math.round(SS67 * 1.1);

    // Withdrawal Allocation Breakdown
    const RIA_X = Math.round(W67 * 0.3);
    const RIA_Y = Math.round(W67 * 0.4);
    const Investment_X = Math.round(W67 * 0.6);
    const Investment_Y = Math.round(W67 * 0.7);

    const result = {
      RP: RP,
      RETIREMENT_PAYCHECK_LOW: RETIREMENT_PAYCHECK_LOW.toLocaleString(),
      RETIREMENT_PAYCHECK_HIGH: RETIREMENT_PAYCHECK_HIGH.toLocaleString(),
      Social_Security_X: Social_Security_X.toLocaleString(),
      Social_Security_Y: Social_Security_Y.toLocaleString(),
      RIA_X: RIA_X.toLocaleString(),
      RIA_Y: RIA_Y.toLocaleString(),
      Investment_X: Investment_X.toLocaleString(),
      Investment_Y: Investment_Y.toLocaleString(),
    };

    console.log("DEBUG - calculateRetirementPaycheckVariables result:", result);
    return result;
  } catch (error) {
    console.error("Error calculating retirement paycheck variables:", error);
    return {
      RP: 0,
      RETIREMENT_PAYCHECK_LOW: "0",
      RETIREMENT_PAYCHECK_HIGH: "0",
      Social_Security_X: "0",
      Social_Security_Y: "0",
      RIA_X: "0",
      RIA_Y: "0",
      Investment_X: "0",
      Investment_Y: "0",
    };
  }
};

// Calculate Annual Costs variables - CORRECTED AS PER EXCEL TAB 2
const calculateAnnualCostsVariables = (RP) => {
  try {
    // Calculate as per Excel Tab 2 percentages
    const H1 = Math.round(RP * 0.3); // 30% of RP
    const H2 = Math.round(RP * 0.4); // 40% of RP
    const F1 = Math.round(RP * 0.08); // 8% of RP
    const F2 = Math.round(RP * 0.18); // 18% of RP
    const T1 = Math.round(RP * 0.1); // 10% of RP
    const T2 = Math.round(RP * 0.2); // 20% of RP
    const E1 = Math.round(RP * 0.02); // 2% of RP
    const E2 = Math.round(RP * 0.09); // 9% of RP
    const O1 = Math.round(RP * 0.12); // 12% of RP
    const O2 = Math.round(RP * 0.23); // 23% of RP
    const HC = Math.round(RP * 0.13); // 13% of RP

    return {
      H1: H1.toLocaleString(),
      H2: H2.toLocaleString(),
      F1: F1.toLocaleString(),
      F2: F2.toLocaleString(),
      T1: T1.toLocaleString(),
      T2: T2.toLocaleString(),
      E1: E1.toLocaleString(),
      E2: E2.toLocaleString(),
      O1: O1.toLocaleString(),
      O2: O2.toLocaleString(),
      HC: HC.toLocaleString(),
    };
  } catch (error) {
    console.error("Error calculating annual costs variables:", error);
    return {
      H1: "0",
      H2: "0",
      F1: "0",
      F2: "0",
      T1: "0",
      T2: "0",
      E1: "0",
      E2: "0",
      O1: "0",
      O2: "0",
      HC: "0",
    };
  }
};

// Calculate Strengthening Variables - WITH CORRECT FORMATTING
const calculateStrengtheningVariables = async (
  userData,
  projectionData,
  retirementAge,
  contributionData
) => {
  try {
    const { CONTRIB_15_DOLLARS, CONTRIB_20_DOLLARS } = contributionData;

    // These should come from your actual calculations - using placeholders
    const YEARS_15 = 3;
    const YEARS_20 = 5;
    const YEARS_SS_DELAY_LOW = 2;
    const YEARS_SS_DELAY_HIGH = 4;
    const WORK_SHIFT_RANGE = "2-4";
    const YEARS_WORK_SHIFT_LOW = 1;
    const YEARS_WORK_SHIFT_HIGH = 3;
    const YEARS_GROWTH_LOW = 3;
    const YEARS_GROWTH_HIGH = 6;
    const COST_REDUCTION_TARGET = "10-15%";
    const YEARS_COST_REDUCTION_LOW = 2;
    const YEARS_COST_REDUCTION_HIGH = 4;
    const YEARS_LOCATION_LOW = 2;
    const YEARS_LOCATION_HIGH = 5;

    // Format as per your screenshot - each point and its description on same line with line break
    return [
      `The options below show how different changes could extend how long your savings last.<br><br>`,
      `Each one stands on its own, and the impact will vary depending on which changes you choose and how they're combined.<br><br>`,
      `1. Increase your monthly contribution to 15%-20% ($${CONTRIB_15_DOLLARS}–$${CONTRIB_20_DOLLARS}/mo): +${YEARS_15}-${YEARS_20} years\n`,
      `A higher contribution rate compounds over time and meaningfully extends how long your balance lasts.<br><br>`,
      `2. Delay collecting Social Security 1–3 years (start at age 68-70): +${YEARS_SS_DELAY_LOW}-${YEARS_SS_DELAY_HIGH} years\n`,
      `Delaying increases your monthly benefit by up to 24%, reducing the amount you need to withdraw each year.<br><br>`,
      `3. Shift your transition away from full-time work by ${WORK_SHIFT_RANGE} years: +${YEARS_WORK_SHIFT_LOW}-${YEARS_WORK_SHIFT_HIGH} years\n`,
      `Each additional working year adds income and shortens the withdrawal period, buying you more retirement time.<br><br>`,
      `4. Improve your long-term growth rate to 7.5%–9%: +${YEARS_GROWTH_LOW}-${YEARS_GROWTH_HIGH} years\n`,
      `Higher long-term returns can significantly increase your peak savings and slow down future drawdowns.<br><br>`,
      `5. Reduce long-term costs by ${COST_REDUCTION_TARGET}: +${YEARS_COST_REDUCTION_LOW}-${YEARS_COST_REDUCTION_HIGH} years\n`,
      `Lower ongoing expenses decrease annual withdrawals and help your savings last longer.<br><br>`,
      `6. Explore location flexibility: +${YEARS_LOCATION_LOW}-${YEARS_LOCATION_HIGH} years<br>`,
      `Living in a lower-cost area reduces required withdrawals and stretches both Social Security and savings.<br><br>`,
      `You don't need to do everything—many people see meaningful improvements by focusing on just one or two changes that fit their life right now.`,
    ].join("");
  } catch (error) {
    console.error("Error calculating strengthening variables:", error);
    return "Unable to calculate strengthening steps.";
  }
};

module.exports = {
  calculateRetirementProjection,
  calculateRecommendations,
};
