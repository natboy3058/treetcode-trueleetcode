
import { useState } from 'react';
import { usePyodide } from '@/components/providers/PyodideProvider';
import { Problem, TestCase, ExecutionResult, compareSolutions } from '@/lib/problems';
import { useToast } from '@/hooks/use-toast';

export function useCodeExecutor() {
  const { pyodide } = usePyodide();
  const [isExecuting, setIsExecuting] = useState(false);
  const { toast } = useToast();
  
  const execute = async (
    code: string,
    language: 'javascript' | 'python',
    problem: Problem,
    testCases: TestCase[]
  ): Promise<ExecutionResult[]> => {
    setIsExecuting(true);
    let results: ExecutionResult[] = [];

    if (language === 'javascript') {
      results = await executeJavaScriptCode(code, problem, testCases);
    } else if (language === 'python') {
      if (!pyodide) {
        toast({ 
          title: "Python Not Ready", 
          description: "The Python environment is still loading or failed to load.", 
          variant: "destructive" 
        });
        setIsExecuting(false);
        return [];
      }
      results = await executePythonCode(code, problem, testCases, pyodide);
    }

    setIsExecuting(false);
    return results;
  };

  const executeJavaScriptCode = async (
    code: string,
    problem: Problem,
    testCases: TestCase[]
  ): Promise<ExecutionResult[]> => {
    const variant = problem.codeVariants.find(v => v.language === "javascript");
    if (!variant) return [];

    const newResults: ExecutionResult[] = [];

    for (const tc of testCases) {
      try {
        let actualInput;
        
        // Handle NBA trade problem format where last element is the trade_exception_value
        if (problem.id === "nba-team-trade") {
          const salaries = tc.input.slice(0, -1);
          const tradeException = tc.input[tc.input.length - 1];
          actualInput = [salaries, tradeException];
        } else {
          actualInput = tc.input;
        }
        
        const userFunction = new Function('...args', `
          ${code}
          return ${variant.starterFunctionName}(...args);
        `);
        const startTime = performance.now();
        const actual = userFunction(...actualInput);
        const endTime = performance.now();
        const passed = compareSolutions(actual, tc.expected);
        newResults.push({
          input: actualInput,
          expected: tc.expected,
          actual,
          passed,
          runtime: (endTime - startTime).toFixed(2) + "ms",
        });
      } catch (error: any) {
        newResults.push({
          input: tc.input,
          expected: tc.expected,
          actual: `Error: ${error.message}`,
          passed: false,
          runtime: "N/A",
        });
        break;
      }
    }
    return newResults;
  };

  const executePythonCode = async (
    code: string,
    problem: Problem,
    testCases: TestCase[],
    pyodideInstance: any
  ): Promise<ExecutionResult[]> => {
    const variant = problem.codeVariants.find(v => v.language === "python");
    if (!variant) return [];

    const newResults: ExecutionResult[] = [];

    for (const tc of testCases) {
      try {
        let argsString;
        let actualInput;
        
        // Handle NBA trade problem format - pass salaries as first argument, trade_exception as second
        if (problem.id === "nba-team-trade") {
          const salaries = tc.input.slice(0, -1).flat(); // Flatten in case it's nested
          const tradeException = tc.input[tc.input.length - 1];
          argsString = `${JSON.stringify(salaries)}, ${tradeException}`;
          actualInput = [salaries, tradeException];
        } else {
          argsString = tc.input.map(arg => JSON.stringify(arg)).join(',');
          actualInput = tc.input;
        }
        
        const pythonCode = `
import json
${code}
result = json.dumps(${variant.starterFunctionName}(${argsString}))
result
`;
        const startTime = performance.now();
        const rawResult = await pyodideInstance.runPythonAsync(pythonCode);
        const endTime = performance.now();
        const actual = JSON.parse(rawResult);
        const passed = compareSolutions(actual, tc.expected);
        newResults.push({
          input: actualInput,
          expected: tc.expected,
          actual,
          passed,
          runtime: (endTime - startTime).toFixed(2) + "ms",
        });
      } catch (error: any) {
        newResults.push({
          input: tc.input,
          expected: tc.expected,
          actual: `Error: ${error.message}`,
          passed: false,
          runtime: "N/A",
        });
        break;
      }
    }
    return newResults;
  };

  return { execute, isExecuting };
}
