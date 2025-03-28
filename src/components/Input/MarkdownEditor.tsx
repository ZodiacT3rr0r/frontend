import React, { useLayoutEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import styled from "styled-components";


interface TextEditorProps {
  className?: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (content: string) => void;
  getEditor?: (editor: { getValue: () => string }) => void;
}

const EditorCont = styled.div`
.ql-toolbar.ql-snow {
  border-radius: 4px 4px 0 0;
  border: 1px solid #dfe1e6;
  border-bottom: none;
}
.ql-container.ql-snow {
  border-radius: 0 0 4px 4px;
  border: 1px solid #dfe1e6;
  border-top: none;
  color: #172b4d;
}
.ql-editor {
  min-height: 110px;
}
`;

const TextEditor: React.FC<TextEditorProps> = ({
  className,
  placeholder,
  defaultValue,
  value: alsoDefaultValue,
  onChange = () => {},
  getEditor = () => {},
}) => {
  const $editorContRef = useRef<HTMLDivElement | null>(null);
  const $editorRef = useRef<HTMLDivElement | null>(null);
  const initialValueRef = useRef<string>(defaultValue || alsoDefaultValue || "");

  useLayoutEffect(() => {
    if (!$editorRef.current) return;
    let quill = new Quill($editorRef.current, { placeholder, ...quillConfig });

    const insertInitialValue = () => {
      quill.clipboard.dangerouslyPasteHTML(0, initialValueRef.current);
      quill.blur();
    };
    
    const getHTMLValue = () =>
      $editorContRef.current?.querySelector(".ql-editor")?.innerHTML || "";
    
    const handleContentsChange = () => {
      onChange(getHTMLValue());
    };
    
    insertInitialValue();
    getEditor({ getValue: getHTMLValue });

    quill.on("text-change", handleContentsChange);
    return () => {
      quill.off("text-change", handleContentsChange);
      // @ts-expect-error Prevent memory leaks
      quill = null;
    };
  }, []);

  return (
    <EditorCont className={className} ref={$editorContRef}>
      <div ref={$editorRef} />
    </EditorCont>
  );
};

const quillConfig = {
  theme: "snow",
  modules: {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  },
};

export default TextEditor;
