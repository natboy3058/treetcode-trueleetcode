import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TestCase, ExecutionResult } from "@/lib/problems";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ExecutionPanelProps {
  testCases: TestCase[];
  results: ExecutionResult[];
  isExecuting: boolean;
}

export default function ExecutionPanel({ testCases, results, isExecuting }: ExecutionPanelProps) {
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
    <div className="flex flex-col h-full bg-card">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
        <TabsList className="bg-card px-2 border-b rounded-none justify-start shrink-0">
          <TabsTrigger value="testcase">Test Case</TabsTrigger>
          <TabsTrigger value="result" disabled={results.length === 0}>Output</TabsTrigger>
        </TabsList>
        <TabsContent value="testcase" className="flex-grow mt-0 overflow-hidden">
          <ScrollArea className="h-full w-full p-2">
            {testCases.map((tc, index) => (
               <div key={index} className="mb-2">
                <p className="font-semibold text-sm">Case {index + 1}</p>
                <div className="mt-1 bg-background p-2 text-xs font-mono rounded-md break-words">
                  Input: {JSON.stringify(tc.input)}
                </div>
              </div>
            ))}
          </ScrollArea>
        </TabsContent>
        <TabsContent value="result" className="flex-grow mt-0 overflow-hidden">
           <ScrollArea className="h-full w-full">
            <div className="p-4 flex flex-col gap-4">
              {results.length > 0 && activeResult && (
                <>
                  <div className="flex justify-between items-center">
                    <h2 className={`text-xl font-bold ${getOverallStatus().className}`}>{getOverallStatus().text}</h2>
                    <p className="text-sm font-medium">Passed: {passedCount} / {totalCount}</p>
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

                   <div className="font-mono text-sm space-y-4">
                     {typeof activeResult.actual === 'string' && activeResult.actual.startsWith('Error:') && (
                       <div>
                         <p className="font-semibold text-red-500">Stderr:</p>
                         <pre className="bg-destructive/20 text-destructive p-2 rounded-md mt-1 text-xs whitespace-pre-wrap">{activeResult.actual}</pre>
                       </div>
                     )}
                     <div>
                       <p className="font-semibold">Input:</p>
                       <pre className="bg-background p-2 rounded-md mt-1 text-xs whitespace-pre-wrap">{JSON.stringify(activeResult.input)}</pre>
                     </div>
                     <div>
                       <p className="font-semibold">Expected Output:</p>
                       <pre className="bg-background p-2 rounded-md mt-1 text-xs whitespace-pre-wrap">{JSON.stringify(activeResult.expected)}</pre>
                     </div>
                     {!activeResult.passed && !(typeof activeResult.actual === 'string' && activeResult.actual.startsWith('Error:')) && (
                        <div>
                          <p className="font-semibold">Your Output:</p>
                          <pre className="bg-background p-2 rounded-md mt-1 text-xs whitespace-pre-wrap">{JSON.stringify(activeResult.actual)}</pre>
                        </div>
                     )}
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
