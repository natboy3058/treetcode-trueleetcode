import { useState, useEffect } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { getProblem, Problem, TestCase, compareSolutions, Submission, ExecutionResult } from "@/lib/problems";
import ProblemDescription from "@/components/ProblemDescription";
import CodeEditor from "@/components/CodeEditor";
import ExecutionPanel from "@/components/ExecutionPanel";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { loadPyodide, PyodideInterface } from "pyodide";


export default function Index() {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState("");
  const [results, setResults] = useState<ExecutionResult[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isActuallyExecuting, setIsActuallyExecuting] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<"python" | "javascript">("python");
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [isPyodideLoading, setIsPyodideLoading] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    const currentProblem = getProblem("generate-parentheses");
    if (currentProblem) {
      setProblem(currentProblem);
      const lang = currentProblem.defaultLanguage;
      setSelectedLanguage(lang);
      const variant = currentProblem.codeVariants.find(v => v.language === lang);
      if(variant) {
        setCode(variant.starterCode);
      }
    }
  }, []);

  useEffect(() => {
    async function setupPyodide() {
      try {
        console.log("Starting Pyodide setup...");
        
        // Use version 0.26.4 to match the installed package
        const pyodideInstance = await loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
        });
        
        console.log("Pyodide loaded successfully");
        setPyodide(pyodideInstance);
        toast({ title: "Python environment ready!", description: "You can now run Python code." });
      } catch (error) {
        console.error("Detailed Pyodide error:", error);
        console.error("Error type:", typeof error);
        console.error("Error message:", error instanceof Error ? error.message : String(error));
        
        toast({
          title: "Python environment failed to load",
          description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}. Python code execution will not be available.`,
          variant: "destructive",
        });
      } finally {
        setIsPyodideLoading(false);
      }
    }
    setupPyodide();
  }, [toast]);


  const handleLanguageChange = (lang: "python" | "javascript") => {
    if (!problem) return;
    setSelectedLanguage(lang);
    const variant = problem.codeVariants.find(v => v.language === lang);
    if(variant) {
      setCode(variant.starterCode);
      setResults([]);
    }
  }

  const handleRun = async () => {
    if (!problem) return;
    setIsActuallyExecuting(true);
    setResults([]);
    const exampleTestCases: TestCase[] = problem.examples.map(ex => {
        const inputVal = parseInt(ex.input.split(" = ")[1]);
        return {
            input: inputVal,
            expected: JSON.parse(ex.output.replace(/'/g, '"'))
        };
    });
    
    let newResults: ExecutionResult[];
    if (selectedLanguage === 'python') {
      newResults = await executePythonCode(exampleTestCases);
    } else {
      newResults = await executeJavaScriptCode(exampleTestCases);
    }
    setResults(newResults);
    setIsActuallyExecuting(false);
  };
  
  const handleSubmit = async () => {
    if (!problem) return;
    setIsActuallyExecuting(true);
    setResults([]);
    
    let newResults: ExecutionResult[];
    if (selectedLanguage === 'python') {
      newResults = await executePythonCode(problem.testCases);
    } else {
      newResults = await executeJavaScriptCode(problem.testCases);
    }
    setResults(newResults);
    setIsActuallyExecuting(false);

    const hasError = newResults.some(r => typeof r.actual === 'string' && r.actual.startsWith('Error:'));
    const allPassed = !hasError && newResults.length > 0 && newResults.every(r => r.passed);
    let status: Submission['status'];
    
    if (hasError) {
      status = "Error";
      toast({ title: "Execution Error", description: "Your code has a runtime error.", variant: "destructive" });
    } else if (allPassed) {
      status = "Accepted";
      toast({ title: "Accepted", description: "All test cases passed!", className: "bg-green-600 border-green-600 text-white" });
    } else {
      status = "Wrong Answer";
      toast({ title: "Wrong Answer", description: "One or more test cases failed.", variant: "destructive" });
    }

    const newSubmission: Submission = {
      id: Date.now().toString(),
      code,
      language: selectedLanguage,
      status,
      timestamp: Date.now(),
      results: newResults,
    };
    setSubmissions(prev => [newSubmission, ...prev]);
  };

  const executeJavaScriptCode = async (testCases: TestCase[]): Promise<ExecutionResult[]> => {
    if (!problem) return [];
    const variant = problem.codeVariants.find(v => v.language === "javascript");
    if (!variant) return [];

    const newResults: ExecutionResult[] = [];

    for (const tc of testCases) {
      try {
        const userFunction = new Function('n', `
          ${code}
          return ${variant.starterFunctionName}(n);
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
        break;
      }
    }
    return newResults;
  }

  const executePythonCode = async (testCases: TestCase[]): Promise<ExecutionResult[]> => {
    if (!problem || !pyodide) {
      toast({ title: "Python Not Ready", description: "The Python environment is still loading or failed to load.", variant: "destructive" });
      return [];
    }
    const variant = problem.codeVariants.find(v => v.language === "python");
    if (!variant) return [];

    const newResults: ExecutionResult[] = [];

    for (const tc of testCases) {
      try {
        const pythonCode = `
import json
${code}
result = json.dumps(${variant.starterFunctionName}(${JSON.stringify(tc.input)}))
result
`;
        const startTime = performance.now();
        const rawResult = await pyodide.runPythonAsync(pythonCode);
        const endTime = performance.now();
        const actual = JSON.parse(rawResult);
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
        break;
      }
    }
    return newResults;
  }

  const isExecuting = isActuallyExecuting || (selectedLanguage === 'python' && isPyodideLoading);

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
            <ProblemDescription problem={problem} selectedLanguage={selectedLanguage} submissions={submissions} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={55} minSize={30}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={65} minSize={20}>
              <div className="h-full w-full flex flex-col">
                <div className="p-2 border-b border-border bg-card flex items-center">
                    <Select onValueChange={handleLanguageChange} defaultValue={selectedLanguage}>
                        <SelectTrigger className="w-[180px] h-8">
                            <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="python">Python</SelectItem>
                            <SelectItem value="javascript">JavaScript</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex-grow h-0">
                    <CodeEditor code={code} onChange={setCode} language={selectedLanguage} />
                </div>
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
