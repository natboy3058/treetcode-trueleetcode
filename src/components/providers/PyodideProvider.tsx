
import { createContext, useContext, useEffect, useState } from 'react';
import { loadPyodide, PyodideInterface } from 'pyodide';
import { useToast } from '@/hooks/use-toast';

interface PyodideContextType {
  pyodide: PyodideInterface | null;
  isPyodideLoading: boolean;
}

const PyodideContext = createContext<PyodideContextType>({
  pyodide: null,
  isPyodideLoading: true,
});

export const usePyodide = () => useContext(PyodideContext);

export function PyodideProvider({ children }: { children: React.ReactNode }) {
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [isPyodideLoading, setIsPyodideLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function setupPyodide() {
      try {
        console.log("Starting Pyodide setup...");
        
        const pyodideInstance = await loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
        });
        
        console.log("Pyodide loaded successfully");
        setPyodide(pyodideInstance);
        toast({ title: "Python environment ready!", description: "You can now run Python code." });
      } catch (error) {
        console.error("Detailed Pyodide error:", error);
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

  return (
    <PyodideContext.Provider value={{ pyodide, isPyodideLoading }}>
      {children}
    </PyodideContext.Provider>
  );
}
