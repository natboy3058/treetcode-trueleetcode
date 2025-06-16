
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TestCase, ExecutionResult } from "@/lib/problems";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams } from "react-router-dom";
import { formatTestCaseInput, formatTestCaseOutput } from "@/lib/formatters";

interface ExecutionPanelProps {
  testCases: TestCase[];
  results: ExecutionResult[];
  isExecuting: boolean;
}

export default function ExecutionPanel({ testCases, results, isExecuting }: ExecutionPanelProps) {
  const { problemId } = useParams<{ problemId: string }>();
  const [activeTab, setActiveTab] = useState("testcase");
  const [activeResultCaseIndex, setActiveResultCaseIndex] = useState(0);

  useEffect(() => {
    if (results.length > 0) {
      setActiveTab("result");
      setActiveResultCaseIndex(0);
    } else {
      setActiveTab("testcase");
    }
  }, [results]);

  const getOverallStatus = () => {
    if (!results || results.length === 0) return { text: "", className: "" };
    const hasError = results.some(r => typeof r.actual === 'string' && r.actual.startsWith('Error:'));
    if (hasError) return { text: "Runtime Error", className: "text-red-500" };
    const allPassed = results.every(r => r.passed);
    if (allPassed) return { text: "Accepted", className: "text-green-500" };
    return { text: "Wrong Answer", className: "text-red-500" };
  }

  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  const activeResult = results[activeResultCaseIndex];

  return (
    <div className="h-full bg-card border-t border-border">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList className="bg-card px-4 border-b rounded-none justify-start shrink-0 h-12">
          <TabsTrigger value="testcase" className="px-4 py-2">Test Case</TabsTrigger>
          <TabsTrigger value="result" disabled={results.length === 0} className="px-4 py-2">Output</TabsTrigger>
        </TabsList>
        <TabsContent value="testcase" className="flex-1 mt-0 min-h-0">
          <ScrollArea className="h-full">
            <div className="p-6">
              {testCases.map((tc, index) => (
                 <div key={index} className="mb-6 p-4 bg-background rounded-lg border">
                  <p className="font-semibold text-sm mb-3 text-muted-foreground">Case {index + 1}</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Input:</p>
                      <div className="bg-muted/50 p-3 text-sm font-mono rounded-md break-all">
                        {formatTestCaseInput(tc.input, problemId)}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Expected Output:</p>
                      <div className="bg-muted/50 p-3 text-sm font-mono rounded-md break-all">
                        {formatTestCaseOutput(tc.expected, problemId)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="result" className="flex-1 mt-0 min-h-0">
           <ScrollArea className="h-full">
            <div className="p-6 flex flex-col gap-6">
              {results.length > 0 && activeResult && (
                <>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <h2 className={`text-2xl font-bold ${getOverallStatus().className}`}>{getOverallStatus().text}</h2>
                    <p className="text-sm font-medium bg-muted px-3 py-1 rounded-full">
                      Passed: {passedCount} / {totalCount}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    {results.map((result, index) => (
                      <Button
                        key={index}
                        variant={activeResultCaseIndex === index ? (result.passed ? 'default' : 'destructive') : 'outline'}
                        size="sm"
                        onClick={() => setActiveResultCaseIndex(index)}
                        className={`${activeResultCaseIndex === index && result.passed && 'bg-green-600 hover:bg-green-700'}`}
                      >
                        Case {index + 1}
                      </Button>
                    ))}
                  </div>

                   <div className="font-mono space-y-6">
                     {typeof activeResult.actual === 'string' && activeResult.actual.startsWith('Error:') && (
                       <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                         <p className="font-semibold text-destructive mb-2">Runtime Error:</p>
                         <pre className="text-destructive text-sm whitespace-pre-wrap break-all">{activeResult.actual}</pre>
                       </div>
                     )}
                     
                     <div className="space-y-4">
                       <div className="p-4 bg-muted/30 rounded-lg">
                         <p className="font-semibold mb-2 text-sm">Input:</p>
                         <pre className="text-sm whitespace-pre-wrap break-all">
                           {formatTestCaseInput(activeResult.input, problemId)}
                         </pre>
                       </div>
                       
                       <div className="p-4 bg-muted/30 rounded-lg">
                         <p className="font-semibold mb-2 text-sm">Expected Output:</p>
                         <pre className="text-sm whitespace-pre-wrap break-all">
                           {formatTestCaseOutput(activeResult.expected, problemId)}
                         </pre>
                       </div>
                       
                       {!activeResult.passed && !(typeof activeResult.actual === 'string' && activeResult.actual.startsWith('Error:')) && (
                          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="font-semibold mb-2 text-sm text-red-700">Your Output:</p>
                            <pre className="text-sm whitespace-pre-wrap break-all text-red-600">
                              {formatTestCaseOutput(activeResult.actual, problemId)}
                            </pre>
                          </div>
                       )}
                       
                       {activeResult.passed && (
                         <div className="flex items-center gap-2 text-green-600 text-sm">
                           <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                           <span>Test case passed in {activeResult.runtime}</span>
                         </div>
                       )}
                     </div>
                   </div>
                </>
              )}
            </div>
           </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
