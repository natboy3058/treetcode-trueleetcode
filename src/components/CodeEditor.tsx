
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
}

export default function CodeEditor({ code, onChange }: CodeEditorProps) {
  return (
    <CodeMirror
      value={code}
      height="100%"
      theme={vscodeDark}
      extensions={[javascript({ jsx: true, typescript: true })]}
      onChange={onChange}
      style={{ fontSize: 14, height: '100%' }}
    />
  );
}
