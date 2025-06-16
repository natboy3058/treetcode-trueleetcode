
export const formatTestCaseInput = (input: any[], problemId?: string): string => {
  // Handle NBA trade problem format where last element is the trade_exception_value
  if (problemId === "nba-team-trade" && input.length >= 2) {
    const salaries = input.slice(0, -1).flat();
    const tradeException = input[input.length - 1];
    return `salaries = [${salaries.join(', ')}], trade_exception_value = ${tradeException}`;
  }
  
  // Handle NVIDIA stock problem - display as single array
  if (problemId === "nvidia-stock-highs" && input.length === 1 && Array.isArray(input[0])) {
    return `prices = [${input[0].join(', ')}]`;
  }
  
  // Handle Generate Parentheses - display as single number
  if (problemId === "generate-parentheses" && input.length === 1) {
    return `n = ${input[0]}`;
  }
  
  // Handle Two Sum - display as array and target
  if (problemId === "two-sum" && input.length === 2) {
    return `nums = [${input[0].join(',')}], target = ${input[1]}`;
  }
  
  // Default formatting
  if (input.length === 1) {
    return Array.isArray(input[0]) ? `[${input[0].join(', ')}]` : String(input[0]);
  }
  
  return input.map(item => 
    Array.isArray(item) ? `[${item.join(', ')}]` : String(item)
  ).join(', ');
};

export const formatTestCaseOutput = (output: any, problemId?: string): string => {
  if (Array.isArray(output)) {
    // For parentheses generation, format as array of strings
    if (problemId === "generate-parentheses") {
      return `[${output.map(s => `"${s}"`).join(',')}]`;
    }
    // For other arrays, format normally
    return `[${output.join(',')}]`;
  }
  
  return String(output);
};
