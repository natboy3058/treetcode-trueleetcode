
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

interface CodeEditorProps {
  code: string;
  onChange?: (value: string) => void;
  language: "javascript" | "python";
  readOnly?: boolean;
}

export default function CodeEditor({ code, onChange, language, readOnly = false }: CodeEditorProps) {
  const extensions =
    language === "javascript"
      ? [javascript({ jsx: true, typescript: true })]
      : [python()];

  return (
    <CodeMirror
      value={code}
      height="100%"
      theme={vscodeDark}
      extensions={extensions}
      onChange={onChange}
      readOnly={readOnly}
      style={{ fontSize: 14, height: '100%' }}
    />
  );
}
