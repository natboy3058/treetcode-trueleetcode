
import { useState, useEffect } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { getProblem, Problem, TestCase, compareSolutions } from "@/lib/problems";
import ProblemDescription from "@/components/ProblemDescription";
import CodeEditor from "@/components/CodeEditor";
import ExecutionPanel from "@/components/ExecutionPanel";
import { useToast } from "@/hooks/use-toast";

export default function Index() {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const currentProblem = getProblem("generate-parentheses");
    if (currentProblem) {
      setProblem(currentProblem);
      setCode(currentProblem.starterCode);
    }
  }, []);

  const handleRun = async () => {
    if (!problem) return;
    
    // "Run" uses the examples from the problem description as test cases.
    const exampleTestCases: TestCase[] = problem.examples.map(ex => {
        const inputVal = parseInt(ex.input.split(" = ")[1]);
        return {
            input: inputVal,
            expected: JSON.parse(ex.output.replace(/'/g, '"'))
        };
    });

    await executeCode(exampleTestCases, "run");
  };
  
  const handleSubmit = async () => {
    if (!problem) return;
    // "Submit" uses the full, potentially hidden test suite.
    await executeCode(problem.testCases, "submit");
  };

  const executeCode = async (testCases: TestCase[], type: "run" | "submit") => {
    if (!problem) return;
    
    setIsExecuting(true);
    setResults([]);
    const newResults = [];

    for (const tc of testCases) {
      try {
        // Warning: Using new Function() is insecure and should not be used in production.
        // It's used here for demonstration purposes in a controlled environment.
        const userFunction = new Function('n', `
          ${code}
          return ${problem.starterFunctionName}(n);
        `);
        
        const startTime = performance.now();
        const actual = userFunction(tc.input);
        const endTime = performance.now();
        
        const passed = compareSolutions(actual, tc.expected);
        
        newResults.push({
          input: tc.input,
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
        toast({
          title: "Execution Error",
          description: error.message,
          variant: "destructive",
        });
        break; // Stop on first error
      }
    }
    
    setResults(newResults);
    setIsExecuting(false);

    if (type === 'submit') {
        const allPassed = newResults.length > 0 && newResults.every(r => r.passed);
        const someFailed = newResults.some(r => !r.passed);

        if (allPassed) {
            toast({ title: "Accepted", description: "All test cases passed!", className: "bg-green-600 border-green-600 text-white" });
        } else if (someFailed) {
            toast({ title: "Wrong Answer", description: "One or more test cases failed.", variant: "destructive" });
        }
    }
  };

  if (!problem) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background text-foreground">
        Loading problem...
      </div>
    );
  }

  return (
    <main className="h-screen w-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={45} minSize={30}>
            <ProblemDescription problem={problem} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={55} minSize={30}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={65} minSize={20}>
              <div className="h-full w-full">
                <CodeEditor code={code} onChange={setCode} />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={35} minSize={20}>
              <ExecutionPanel
                testCases={problem.examples.map(ex => ({input: parseInt(ex.input.split(" = ")[1]), expected: JSON.parse(ex.output.replace(/'/g, '"'))}))}
                results={results}
                onRun={handleRun}
                onSubmit={handleSubmit}
                isExecuting={isExecuting}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
