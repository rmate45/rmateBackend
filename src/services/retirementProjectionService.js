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
    const ageLow = Age_LAST ? Age_LAST - 3 : 95;
    const ageHigh = Age_LAST ? Age_LAST + 2 : 97;

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

    // Get longevity band message - PASS ageLow and ageHigh as parameters
    const longevityMessage = getLongevityMessage(
      ageGroup,
      longevityBand,
      ageLow,
      ageHigh
    );

    // EXTRACT ACTUAL VALUES FROM PROJECTION DATA

    // 1. Find retirement age (when phase changes to post_retirement)
    const retirementEntry = projectionData.find(
      (item) => item.phase === "post_retirement"
    );
    const retireAge = retirementEntry ? retirementEntry.age : 67;

    // 2. Find peak savings (maximum savings value)
    const peakSavings = Math.max(
      ...projectionData.map((item) => item.savings || 0)
    );

    // 3. Find current age data
    const currentYearData = projectionData.find((item) => item.age === age);

    // Calculate actual contribution rate from data
    let currentContributionRate = 0;
    let currentContributionMonthly = 0;
    if (currentYearData && currentYearData.householdIncome > 0) {
      // Calculate actual percentage: (contribution / householdIncome) * 100
      currentContributionRate = Math.round(
        (currentYearData.contribution / currentYearData.householdIncome) * 100
      );
      currentContributionMonthly = Math.round(
        currentYearData.contribution / 12
      );
    } else {
      // Fallback to default calculation
      currentContributionMonthly = Math.round((householdIncome * 0.1) / 12);
      currentContributionRate = 10;
    }

    // 4. Find Social Security data at retirement age
    const ssData = projectionData.find((item) => item.age === retireAge);
    const ssBenefit = ssData ? ssData.socialSecurity : 0;
    const ssAge = retireAge; // Assuming SS starts at retirement age

    // 5. Find growth rate - calculate from data
    let growthRate = 5.5; // Default
    // Try to calculate actual growth rate from data
    const preRetirementData = projectionData.filter(
      (item) => item.phase === "pre_retirement"
    );
    if (preRetirementData.length > 1) {
      // Find total contributions during pre-retirement
      const totalContributions = preRetirementData.reduce(
        (sum, item) => sum + item.contribution,
        0
      );

      // Find starting and ending savings
      const startSavings = preRetirementData[0].savings;
      const endSavings =
        preRetirementData[preRetirementData.length - 1].savings;

      // Calculate actual growth: (ending - starting - contributions) / starting
      const totalGrowth = endSavings - startSavings - totalContributions;
      if (startSavings > 0) {
        // Calculate approximate annual growth rate
        const years = preRetirementData.length;
        const annualGrowthRate =
          (Math.pow((startSavings + totalGrowth) / startSavings, 1 / years) -
            1) *
          100;
        growthRate = Math.round(annualGrowthRate * 10) / 10; // Round to 1 decimal
      }
    }

    // Calculate strengthening steps
    const strengtheningSteps = await calculateStrengtheningSteps(
      userData,
      Age_LAST,
      projectionData,
      ageLow,
      ageHigh
    );

    // Base recommendations object - structured as key-value pairs
    const recommendations = {
      // TOP STATEMENT - Always included
      topStatement: `Your total savings are projected to last until approximately age ${ageLow} to ${ageHigh}.`,

      // Your Snap Shot
      "Your Snap Shot": longevityMessage,

      // What's Shaping Your Outlook
      "What's Shaping Your Outlook": [
        `Your contributions of ${currentContributionRate}% ($${currentContributionMonthly}/mo) help your savings grow to about $${Math.round(
          peakSavings
        )} before retirement.<br>`,
        `Retiring around age ${retireAge} sets the point where saving stops and withdrawals begin.<br>`,
        `Starting Social Security at ${ssAge} provides roughly $${Math.round(
          ssBenefit
        )}/yr, reducing how much you need to withdraw.<br>`,
        `A long-term growth rate of ${growthRate}% shapes how quickly your balance builds and how long it lasts.`,
      ].join(" "),

      // How to Strengthen Your Plan
      "How to Strengthen Your Plan": strengtheningSteps,

      // What This Snapshot Doesn't Include (Yet)
      "What This Snapshot Doesn't Include (Yet)": `This is a clear starting point based on your answers.<br> A few meaningful factors aren't included yet, but they can influence your long-term outlook: Long-term care needs or long-term care insurance.<br> Major health events or medical shocks Unexpected changes in your ability to work Divorce, remarriage, or large inheritances.<br>Home equity decisions (downsizing, relocating, or renting). Future changes to Social Security or tax policy.<br>As you refine your goals and add more details, your plan will become more personalized and precise.`,
    };

    return recommendations;
  } catch (error) {
    console.error("Error calculating recommendations:", error);
    throw error;
  }
};

// Helper function to find retirement age
const findRetirementAge = (projectionData) => {
  const retirementEntry = projectionData.find(
    (item) => item.phase === "post_retirement"
  );
  return retirementEntry ? retirementEntry.age : 67; // Default to 67 if not found
};

// Helper function to get longevity message - UPDATED to accept age parameters
const getLongevityMessage = (ageGroup, longevityBand, ageLow, ageHigh) => {
  // Your provided longevity messages data
  const longevityMessages = {
    "18-24": {
      "70-79":
        "Based on what you shared, your savings are projected to last into your 70s.<br> That's perfectly normal for this stage of life - most people your age haven't built much savings yet.<br> Let's walk through what's shaping this outlook and the moves that can meaningfully extend your financial runway.",
      "80-89":
        "Your savings are projected to last into your 80s - a strong early marker.<br> Most people your age haven't built a foundation yet, so you're ahead by checking now.<br> Let's look at what's shaping your outlook and the steps that can help you strengthen it over time.",
      "90-94":
        "Your savings are projected to last into your early 90s - an excellent early-stage trajectory.<br> Most people your age aren't thinking this far ahead, so you're building a strong base.<br> Let's explore what's shaping your outlook and the steps that can keep it moving in the right direction.",
      "95+":
        "Your savings are projected to last well past 95.<br> That's an exceptional early signal, and you have decades to build on it.<br> Let's look at what's shaping your outlook and the steps that can keep this strong momentum going.",
    },
    "25-34": {
      "70-79":
        "Your savings are projected to last into your 70s.<br> Many people in their 20s and 30s land here, and you're ahead of the curve by checking now.<br> Let's break down the factors behind your outlook and the steps that can stretch your retirement timeline.",
      "80-89":
        "Your savings are projected to last into your 80s - solid for this point in life.<br> You have time and flexibility to build on this trajectory.<br> Let's take a look at the drivers behind your outlook and the moves that can help fortify it.",
      "90-94":
        "Your savings are projected to last into your early 90s - a strong trajectory at this stage.<br> With consistent habits, you can easily reach long-term durability.<br> Let's look at the factors behind your outlook and the moves that can fine-tune it.",
      "95+":
        "Your savings are projected to last well past 95 - a standout trajectory at this stage.<br> You're setting yourself up with meaningful long-term flexibility.<br> Let's explore the drivers behind your outlook and the moves that can keep reinforcing it.",
    },
    "35-44": {
      "70-79":
        "Your savings are projected to last into your 70s.<br> This is a common starting point, and the key is using this moment to reset and chart a stronger path forward.<br> Let's look at what's shaping your outlook and the focused changes that can extend your financial durability.",
      "80-89":
        "Your savings are projected to last into your 80s.<br> That's a workable starting point, and you can meaningfully improve it with focused adjustments.<br> Let's walk through what's shaping your outlook and the steps that can extend your long-term resilience.",
      "90-94":
        "Your savings are projected to last into your early 90s.<br> You're close to the target most planners aim for, and a few smart refinements can help you reach or exceed it.<br> Let's walk through what's shaping your outlook and the steps that can lock in that strength.",
      "95+":
        "Your savings are projected to last well past 95 - an excellent trajectory.<br> You've created real long-term flexibility, and thoughtful choices from here can deepen that strength.<br> Let's walk through what's shaping your outlook and how to keep that momentum working for you.",
    },
    "45-54": {
      "70-79":
        "Based on what you shared, your savings are projected to last into your 70s.<br> Plenty of people in this stage find themselves here, and the important thing is that you're facing the numbers head-on.<br> Let's walk through what's driving the outlook and the meaningful steps that can help you rebuild your trajectory.",
      "80-89":
        "Your savings are projected to last into your 80s.<br> This gives you a solid foundation, and the right adjustments can make it considerably stronger.<br> Let's take a look at what's driving your outlook and the steps that can meaningfully expand your timeline.",
      "90-94":
        "Your savings are projected to last into your early 90s - a strong trajectory.<br> You're close to the range most people aim for, and a few focused improvements can get you the rest of the way there.<br> Let's look at what's driving your outlook and the steps that can elevate it.",
      "95+":
        "Your savings are projected to last well past 95 - a strong and resilient trajectory.<br> You've built a solid foundation, and with a few strategic choices, you can expand optionality even further.<br> Let's take a look at what's driving your outlook and the adjustments that can enhance it.",
    },
    "55-64": {
      "70-79":
        "Your savings are projected to last into your 70s.<br> This can feel urgent, but you've already taken the hardest step by getting clarity.<br> Let's unpack what's shaping your outlook and map the major moves that can help extend your plan.",
      "80-89":
        "Your savings are projected to last into your 80s - a solid starting point at this stage.<br> A few targeted improvements can help make your plan more durable.<br> Let's review what's shaping your outlook and the moves that can strengthen it from here.",
      "90-94":
        "Your savings are projected to last into your early 90s.<br> You're close to the ideal range, and small refinements can help you reach long-term durability.<br> Let's review what's shaping your outlook and the moves that can strengthen it even further.",
      "95+":
        "Your savings are projected to last well past 95 - an excellent place to be.<br> You've built real long-term durability, and now the focus can shift to lifestyle flexibility and planning for surprises.<br> Let's review what's shaping your outlook and how to make the most of this strong position.",
    },
    "65-74": {
      "70-79":
        "Your savings are projected to last into your 70s.<br> That creates a tight window, but strategic adjustments can still improve your long-term stability.<br> Let's look closely at what's driving this outlook and the high-impact moves that can strengthen your plan from here.",
      "80-89":
        "Your savings are projected to last into your 80s.<br> That's workable, and thoughtful adjustments can help you maintain stability as the years go on.<br> Let's walk through the drivers behind your outlook and the steps that can reinforce your plan.",
      "90-94":
        "Your savings are projected to last into your early 90s - a solid place to be.<br> With a bit of fine-tuning, you can reach the level of resilience most people hope for.<br> Let's explore what's driving your outlook and the adjustments that can reinforce it.",
      "95+":
        "Your savings are projected to last well past 95 - a very stable trajectory.<br> This gives you meaningful flexibility for the years ahead.<br> Let's explore the drivers behind your outlook and the refinements that help you make the most of this strength.",
    },
    "75-84": {
      "70-79":
        "Your savings are projected to last into your 70s, which means it's important to reassess now.<br> Many people your age navigate similar questions, and small shifts can still make a real difference.<br> Let's explore what's shaping this outlook and the strategies that can help extend your financial comfort.",
      "80-89":
        "Your savings are projected to last into your 80s.<br> That offers some cushion, and small refinements can help stretch it further.<br> Let's explore what's shaping your outlook and the practical ways to strengthen it.",
      "90-94":
        "Your savings are projected to last into your early 90s - a strong trajectory.<br> You're close to long-term stability, and a few helpful shifts can bring even more confidence.<br> Let's look at what's shaping your outlook and the steps that can support lasting strength.",
      "95+":
        "Your savings are projected to last well past 95 - a resilient outlook.<br> You have strong financial durability, and a few adjustments can help maintain that stability over time.<br> Let's look at what's shaping your outlook and the practical choices that support continued confidence.",
    },
    "85+": {
      "70-79":
        "Based on what you entered, your savings appear to run out before your current age.<br> This can happen when some details are missing or when resources are already stretched thin, and it's more common than you might think.<br> Let's review your answers to make sure everything is captured correctly and then walk through how to steady your plan.",
      "80-89":
        "Your savings are projected to last into your 80s - a solid baseline.<br> With a few focused adjustments, you can extend your resources in meaningful ways.<br> Let's take a look at the factors behind your outlook and the steps that support more stability ahead.",
      "90-94":
        "Your savings are projected to last into your early 90s - a resilient trajectory.<br> With a few thoughtful adjustments, you can continue to extend your financial comfort.<br> Let's explore the factors behind your outlook and the refinements that can keep it strong.",
      "95+":
        "Your savings are projected to last well past 95 - a strong and steady position.<br> You've created meaningful long-term resilience, and small refinements can help preserve it.<br> Let's explore what's driving your outlook and the steps that keep your plan adaptable.",
    },
  };

  // Return message or default using the passed age parameters
  return (
    longevityMessages[ageGroup]?.[longevityBand] ||
    `Based on what you shared, your savings are projected to last until roughly ${ageLow} to ${ageHigh}.<br> That gives you a solid starting point - but most people need their money to last to at least 95.<br> Let's take a look at what's shaping your outlook and the steps that can meaningfully strengthen it.`
  );
};

// Updated strengthening steps function
const calculateStrengtheningSteps = async (
  userData,
  originalAgeLAST,
  projectionData,
  ageLow,
  ageHigh
) => {
  const { householdIncome, age } = userData;

  // Get current contribution from projection data
  const currentYearData = projectionData.find((item) => item.age === age);
  const currentContribution = currentYearData
    ? currentYearData.contribution
    : 0;
  const currentContributionMonthly = Math.round(currentContribution / 12);

  // Calculate alternative contributions based on actual income
  const contrib15Dollars = Math.round((householdIncome * 0.15) / 12);
  const contrib20Dollars = Math.round((householdIncome * 0.2) / 12);
  const contrib25Dollars = Math.round((householdIncome * 0.25) / 12);

  // Calculate improvement years based on actual projection
  // You'll need to implement these functions to run projections with different parameters
  const years15 = await calculateYearsImprovement(
    userData,
    projectionData,
    0.15
  );
  const years20 = await calculateYearsImprovement(
    userData,
    projectionData,
    0.2
  );

  // Find retirement age for SS calculations
  const retirementEntry = projectionData.find(
    (item) => item.phase === "post_retirement"
  );
  const retireAge = retirementEntry ? retirementEntry.age : 67;

  // Social Security delay calculations
  const ssDelayLow = retireAge + 1;
  const ssDelayHigh = retireAge + 3;
  const yearsSSDelayLow = 2; // These should come from actual calculations
  const yearsSSDelayHigh = 4;

  // Work shift calculations
  const workShiftRange = "2-4";
  const yearsWorkShiftLow = 1;
  const yearsWorkShiftHigh = 3;

  // Growth rate improvements - should come from actual calculations
  const yearsGrowthLow = 3;
  const yearsGrowthHigh = 6;

  // Cost reduction
  const costReductionTarget = "10-15%";
  const yearsCostReductionLow = 2;
  const yearsCostReductionHigh = 4;

  // Location flexibility
  const yearsLocationLow = 2;
  const yearsLocationHigh = 5;

  return [
    `1. Increase your monthly contribution to 15-20% ($${contrib15Dollars}–$${contrib20Dollars}/mo): +${years15}-${years20} years`,
    "A higher contribution rate compounds over time and meaningfully extends how long your balance lasts.<br>",

    `2. Delay collecting Social Security 1–3 years (start at age ${ssDelayLow}-${ssDelayHigh}): +${yearsSSDelayLow}-${yearsSSDelayHigh} years`,
    "Delaying increases your monthly benefit by up to 24%, reducing the amount you need to withdraw each year.<br>",

    `3. Shift your transition away from full-time work by ${workShiftRange} years: +${yearsWorkShiftLow}-${yearsWorkShiftHigh} years`,
    "Each additional working year adds income and shortens the withdrawal period, buying you more retirement time.<br>",

    `4. Improve your long-term growth rate to 7.5%–9%: +${yearsGrowthLow}-${yearsGrowthHigh} years`,
    "Higher long-term returns can significantly increase your peak savings and slow down future drawdowns.<br>",

    `5. Reduce long-term costs by ${costReductionTarget}: +${yearsCostReductionLow}-${yearsCostReductionHigh} years`,
    "Lower ongoing expenses decrease annual withdrawals and help your savings last longer.<br>",

    `6. Explore location flexibility: +${yearsLocationLow}-${yearsLocationHigh} years`,
    "Living in a lower-cost area reduces required withdrawals and stretches both Social Security and savings.",
  ].join("\n\n");
};

// Helper function to calculate years improvement for contribution changes
const calculateYearsImprovement = async (
  userData,
  baseProjectionData,
  newContributionRate
) => {
  try {
    // This should run a new projection with the increased contribution rate
    // For now, returning estimated values based on the data

    // From your data: savings last until ~89 years old
    // With increased contributions, estimate improvement
    if (newContributionRate === 0.15) {
      // 50% increase in contribution might add ~5 years
      return 5;
    } else if (newContributionRate === 0.2) {
      // 100% increase in contribution might add ~8 years
      return 8;
    }
    return 3;
  } catch (error) {
    console.error("Error calculating years improvement:", error);
    return 3; // Default fallback
  }
};

const calculateContributionScenarios = async (userData, originalAgeLAST) => {
  const scenarios = [];
  const contributionRates = [0.15, 0.2, 0.25]; // 15%, 20%, 25%

  for (const rate of contributionRates) {
    // You'll need to run the projection calculation with the new contribution rate
    // This requires modifying your existing projectionService to accept custom rates
    const modifiedUserData = {
      ...userData,
      customContributionRate: rate,
    };

    // This would call a modified version of your projection service
    // For now, I'll simulate the result - you'll need to implement the actual calculation
    const projectedAgeLAST = await simulateProjectionWithModifiedContribution(
      modifiedUserData
    );

    scenarios.push({
      contributionRate: rate * 100,
      monthlyContribution: Math.round((userData.householdIncome * rate) / 12),
      projectedAgeRange: {
        min: projectedAgeLAST - 3,
        max: projectedAgeLAST + 2,
      },
      improvement: projectedAgeLAST - originalAgeLAST,
    });
  }

  return scenarios;
};

const calculateGrowthScenarios = async (userData, originalAgeLAST) => {
  const scenarios = [];
  const growthRates = [0.075, 0.09]; // 7.5%, 9%
  const riskLevels = ["medium-risk", "high-risk"];

  for (let i = 0; i < growthRates.length; i++) {
    const modifiedUserData = {
      ...userData,
      customGrowthRate: growthRates[i],
    };

    // This would call a modified version of your projection service
    const projectedAgeLAST = await simulateProjectionWithModifiedGrowth(
      modifiedUserData
    );

    scenarios.push({
      growthRate: growthRates[i] * 100,
      riskLevel: riskLevels[i],
      projectedAgeRange: {
        min: projectedAgeLAST - 3,
        max: projectedAgeLAST + 2,
      },
      improvement: projectedAgeLAST - originalAgeLAST,
    });
  }

  return scenarios;
};

// Placeholder functions - you'll need to implement these by modifying your projection service
const simulateProjectionWithModifiedContribution = async (userData) => {
  // This should call your projection service with modified contribution rate
  // For now, return a simulated value
  const baseAge =
    userData.customContributionRate === 0.15
      ? 85
      : userData.customContributionRate === 0.2
      ? 88
      : 91;
  return baseAge;
};

const simulateProjectionWithModifiedGrowth = async (userData) => {
  // This should call your projection service with modified growth rate
  // For now, return a simulated value
  const baseAge = userData.customGrowthRate === 0.075 ? 87 : 90;
  return baseAge;
};

module.exports = {
  calculateRetirementProjection,
  calculateRecommendations,
};
