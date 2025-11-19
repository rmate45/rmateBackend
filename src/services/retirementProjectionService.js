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

    // Calculate current monthly contribution
    const current_contribution_per_month = (householdIncome * 0.1) / 12;

    // Find Age_LAST - when savings become negative in post-retirement
    const depletionData = projectionData.find(
      (item) => item.savings <= 0 && item.phase === "post_retirement"
    );
    const Age_LAST = depletionData ? depletionData.age : null;

    // Base recommendation object
    const baseRecommendation = {
      currentMonthlyContribution: Math.round(current_contribution_per_month),
      savingsDepletionAge: Age_LAST || "Never",
      scenario: null,
      recommendations: [],
      alternativeScenarios: [],
    };

    // Scenario 1: Savings Last Beyond Age 97
    if (!Age_LAST || Age_LAST > 97) {
      baseRecommendation.scenario = 1;
      baseRecommendation.recommendations = [
        `Your total savings are projected to last beyond age 97.`,
        `Your current monthly contribution of $${Math.round(
          current_contribution_per_month
        )} per month appears on track for a comfortable retirement.`,
      ];
    }
    // Scenario 2: Savings Last Between Ages 90 and 97
    else if (Age_LAST >= 90 && Age_LAST <= 97) {
      baseRecommendation.scenario = 2;
      baseRecommendation.recommendations = [
        `We project your total savings will last until approximately age ${
          Age_LAST - 3
        } to ${Age_LAST + 2}.`,
        `Your current monthly contribution of $${Math.round(
          current_contribution_per_month
        )} per month is on track for retirement.`,
      ];
    }
    // Scenario 3: Savings Run Out Before Age 90
    else if (Age_LAST < 90) {
      baseRecommendation.scenario = 3;

      // Calculate alternative scenarios for increased contributions
      const contributionScenarios = await calculateContributionScenarios(
        userData,
        Age_LAST
      );
      const growthScenarios = await calculateGrowthScenarios(
        userData,
        Age_LAST
      );

      baseRecommendation.recommendations = [
        `Your total savings are projected to last until approximately age ${
          Age_LAST - 3
        } to ${Age_LAST + 2}.`,
        `Current model assumes a 10% contribution from household income.`,
        `Increasing contributions can significantly extend your savings horizon.`,
        `You are currently saving $${Math.round(
          current_contribution_per_month
        )} per month.`,
        `Our model recommends increasing this to 15% to 25% per month to stay on track.`,
      ];

      baseRecommendation.alternativeScenarios = {
        increasedContributions: contributionScenarios,
        alternativeGrowth: growthScenarios,
      };
    }

    return baseRecommendation;
  } catch (error) {
    console.error("Error calculating recommendations:", error);
    throw error;
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
