const calculateRetirementProjection = async (userData) => {
  try {
    const { age, householdIncome, retirementSavings } = userData;

    // Constants
    const ANNUAL_CONTRIBUTION_RATE = 0.07; // 7% of income
    const PRE_RETIREMENT_GROWTH_RATE = 0.07; // 7% annual growth
    const WITHDRAWAL_RATE = 0.8; // 80% of income
    const INFLATION_RATE = 0.03; // 3% inflation
    const POST_RETIREMENT_GROWTH_RATE = 0.03; // 3% conservative growth
    const RETIREMENT_AGE = 67;

    const projectionData = [];
    let currentSavings = parseFloat(retirementSavings);
    const annualContribution =
      parseFloat(householdIncome) * ANNUAL_CONTRIBUTION_RATE;
    const currentAge = parseInt(age);

    // Validate inputs
    if (currentAge >= RETIREMENT_AGE) {
      throw new Error("Current age must be less than retirement age (67)");
    }

    if (currentAge < 18) {
      throw new Error("Current age must be at least 18");
    }

    // Phase 1: Pre-Retirement (Current Age to Retirement Age)
    for (let age = currentAge; age <= RETIREMENT_AGE; age++) {
      const yearData = {
        age: age,
        savings: Math.round(currentSavings),
        contribution: Math.round(annualContribution),
        withdrawal: 0,
        growth: Math.round(currentSavings * PRE_RETIREMENT_GROWTH_RATE),
        phase: "pre_retirement",
      };

      // Update savings for next year: (current savings + contribution) * growth
      currentSavings =
        (currentSavings + annualContribution) *
        (1 + PRE_RETIREMENT_GROWTH_RATE);

      projectionData.push(yearData);
    }

    // Phase 2: Post-Retirement (Retirement Age + 1 until savings depleted)
    let yearsInRetirement = 0;
    const initialWithdrawal = parseFloat(householdIncome) * WITHDRAWAL_RATE;

    while (currentSavings > 0 && yearsInRetirement < 50) {
      const currentAge = RETIREMENT_AGE + yearsInRetirement + 1;

      // Calculate inflation-adjusted withdrawal
      const withdrawalAmount =
        initialWithdrawal * Math.pow(1 + INFLATION_RATE, yearsInRetirement);

      // Calculate growth on current savings BEFORE withdrawal
      const growthAmount = currentSavings * POST_RETIREMENT_GROWTH_RATE;

      const yearData = {
        age: currentAge,
        savings: Math.round(currentSavings),
        contribution: 0,
        withdrawal: Math.round(withdrawalAmount),
        growth: Math.round(growthAmount),
        phase: "post_retirement",
      };

      // Update savings for next year: (current savings + growth - withdrawal)
      currentSavings = currentSavings + growthAmount - withdrawalAmount;

      // Check if savings are depleted
      if (currentSavings <= 0) {
        yearData.savings = 0;
        projectionData.push(yearData);
        break;
      }

      projectionData.push(yearData);
      yearsInRetirement++;
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
        retirementSavings
      ),
    };
  } catch (error) {
    console.error("Error calculating retirement projection:", error);
    throw error;
  }
};

const prepareGraphData = async (projectionData) => {
  const labels = [];
  const savingsData = [];
  const contributionData = [];
  const withdrawalData = [];

  projectionData.forEach((year) => {
    labels.push(`Age ${year.age}`);
    savingsData.push(year.savings);
    contributionData.push(year.contribution);
    withdrawalData.push(year.withdrawal);
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
    ],
  };
};

const generateSummary = async (
  projectionData,
  currentAge,
  householdIncome,
  retirementSavings
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
    currentRetirementSavings: parseFloat(retirementSavings),
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
  prepareGraphData,
  generateSummary,
};
