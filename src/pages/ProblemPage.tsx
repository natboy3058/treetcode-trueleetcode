
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Problem, Submission, ExecutionResult } from "@/lib/problems";
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
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { usePyodide } from "@/components/providers/PyodideProvider";
import { useCodeExecutor } from "@/hooks/useCodeExecutor";

export default function ProblemPage() {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState("");
  const [results, setResults] = useState<ExecutionResult[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<"python" | "javascript">("python");
  const [executionPanelSize, setExecutionPanelSize] = useState(35);
  const lastExecutionPanelSize = useRef(35);

  const { toast } = useToast();
  const { isPyodideLoading } = usePyodide();
  const { execute, isExecuting: isCodeExecuting } = useCodeExecutor();

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

    const loadProblem = async () => {
      try {
        // Dynamic import based on problemId
        const problemModule = await import(`../data/problems/${problemId}.ts`);
        // The actual problem object will be the first export
        const currentProblem = Object.values(problemModule)[0] as Problem;
        
        setProblem(currentProblem);
        const lang = currentProblem.defaultLanguage;
        setSelectedLanguage(lang);
        const variant = currentProblem.codeVariants.find(v => v.language === lang);
        if(variant) {
          setCode(variant.starterCode);
        }
        setResults([]);
      } catch (e) {
        console.error("Failed to load problem", e);
        toast({
            title: "Problem not found",
            description: `The problem with ID "${problemId}" does not exist.`,
            variant: "destructive"
        });
        navigate("/");
      }
    };

    loadProblem();
  }, [problemId, navigate, toast]);

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
    setResults([]);
    // Run against the first 3 test cases for speed
    const testCasesToRun = problem.testCases.slice(0, 3);
    const newResults = await execute(code, selectedLanguage, problem, testCasesToRun);
    setResults(newResults);
  };
  
  const handleSubmit = async () => {
    if (!problem) return;
    setResults([]);
    
    const newResults = await execute(code, selectedLanguage, problem, problem.testCases);
    setResults(newResults);

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

  const toggleConsole = () => {
    setExecutionPanelSize(size => size > 0 ? 0 : lastExecutionPanelSize.current);
  };

  const isExecuting = isCodeExecuting || (selectedLanguage === 'python' && isPyodideLoading);

  if (!problem) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background text-foreground">
        Loading problem...
      </div>
    );
  }

  return (
      <main className="h-[calc(100vh-4rem)] w-full">
      <div className="h-full w-full">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={45} minSize={30} className="h-full">
              <ProblemDescription problem={problem} selectedLanguage={selectedLanguage} submissions={submissions} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={55} minSize={30} className="h-full">
            <div className="h-full flex flex-col">
              <ResizablePanelGroup
                direction="vertical"
                onLayout={(sizes: number[]) => {
                  if (sizes.length > 1) {
                    setExecutionPanelSize(sizes[1]);
                  }
                }}
              >
                <ResizablePanel defaultSize={100 - executionPanelSize} minSize={20} className="h-full">
                  <div className="h-full w-full flex flex-col">
                    <div className="p-2 border-b border-border bg-card flex items-center shrink-0">
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
                    <div className="flex-1 min-h-0">
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
                  className={`${executionPanelSize === 0 ? "hidden" : ""} h-full`}
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
