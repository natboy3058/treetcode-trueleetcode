
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";


export default function ProblemPage() {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState("");
  const [results, setResults] = useState<ExecutionResult[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isActuallyExecuting, setIsActuallyExecuting] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<"python" | "javascript">("python");
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [isPyodideLoading, setIsPyodideLoading] = useState(true);
  const [executionPanelSize, setExecutionPanelSize] = useState(35);
  const lastExecutionPanelSize = useRef(35);

  const { toast } = useToast();

  useEffect(() => {
    if (executionPanelSize > 0) {
      lastExecutionPanelSize.current = executionPanelSize;
    }
  }, [executionPanelSize]);

  useEffect(() => {
    if (!problemId) {
        navigate("/");
        return;
    }
    const currentProblem = getProblem(problemId);
    if (currentProblem) {
      setProblem(currentProblem);
      const lang = currentProblem.defaultLanguage;
      setSelectedLanguage(lang);
      const variant = currentProblem.codeVariants.find(v => v.language === lang);
      if(variant) {
        setCode(variant.starterCode);
      }
      setResults([]);
    } else {
        toast({
            title: "Problem not found",
            description: `The problem with ID "${problemId}" does not exist.`,
            variant: "destructive"
        })
        navigate("/");
    }
  }, [problemId, navigate, toast]);

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
  };

  const handleRun = async () => {
    if (!problem) return;
    setIsActuallyExecuting(true);
    setResults([]);
    // Run against the first 3 test cases for speed
    const testCasesToRun = problem.testCases.slice(0, 3);
    
    let newResults: ExecutionResult[];
    if (selectedLanguage === 'python') {
      newResults = await executePythonCode(testCasesToRun);
    } else {
      newResults = await executeJavaScriptCode(testCasesToRun);
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
        const userFunction = new Function('...args', `
          ${code}
          return ${variant.starterFunctionName}(...args);
        `);
        const startTime = performance.now();
        const actual = userFunction(...tc.input);
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
        const argsString = tc.input.map(arg => JSON.stringify(arg)).join(',');
        const pythonCode = `
import json
${code}
result = json.dumps(${variant.starterFunctionName}(${argsString}))
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

  const toggleConsole = () => {
    setExecutionPanelSize(size => size > 0 ? 0 : lastExecutionPanelSize.current);
  };

  const isExecuting = isActuallyExecuting || (selectedLanguage === 'python' && isPyodideLoading);

  if (!problem) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background text-foreground">
        Loading problem...
      </div>
    );
  }

  return (
    <main className="h-[calc(100vh-3.5rem)] w-screen overflow-hidden">
      <div className="h-full w-full min-w-[900px]">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={45} minSize={30}>
              <ProblemDescription problem={problem} selectedLanguage={selectedLanguage} submissions={submissions} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={55} minSize={30}>
            <div className="h-full flex flex-col">
              <ResizablePanelGroup
                direction="vertical"
                onLayout={(sizes: number[]) => {
                  if (sizes.length > 1) {
                    setExecutionPanelSize(sizes[1]);
                  }
                }}
              >
                <ResizablePanel defaultSize={100 - executionPanelSize} minSize={20}>
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
                <ResizablePanel
                  defaultSize={executionPanelSize}
                  collapsible
                  collapsedSize={0}
                  minSize={0}
                  className={executionPanelSize === 0 ? "hidden" : ""}
                >
                  {executionPanelSize > 0 && (
                    <ExecutionPanel
                      testCases={problem.testCases.slice(0,3)}
                      results={results}
                      isExecuting={isExecuting}
                    />
                  )}
                </ResizablePanel>
              </ResizablePanelGroup>
              <div className="p-2 border-t border-border flex justify-between items-center shrink-0 bg-card">
                <Button variant="ghost" onClick={toggleConsole} className="text-muted-foreground">
                  Console
                  {executionPanelSize > 0 ? <ChevronDown className="h-4 w-4 ml-1" /> : <ChevronUp className="h-4 w-4 ml-1" />}
                </Button>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handleRun} disabled={isExecuting}>
                    {isExecuting ? 'Running...' : 'Run'}
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700 text-primary-foreground" onClick={handleSubmit} disabled={isExecuting}>
                    {isExecuting ? 'Submitting...' : 'Submit'}
                  </Button>
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </main>
  );
}
