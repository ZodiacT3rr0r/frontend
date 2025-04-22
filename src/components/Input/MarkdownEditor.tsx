import React, { useEffect, useRef } from "react";
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
    color: #ffffff;
  }
  .ql-editor {
    min-height: 110px;
    color: #ffffff;
  }
  .ql-snow .ql-stroke {
    stroke: #ffffff;
  }
  .ql-snow .ql-fill {
    fill: #ffffff;
  }
  .ql-snow .ql-picker {
    color: #ffffff;
  }
  .ql-snow .ql-picker-options {
    background-color: #1a1a1a;
    color: #ffffff;
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
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const initialValue = useRef(defaultValue || alsoDefaultValue || "");

  useEffect(() => {
    const container = editorRef.current;

    if (!container) return;

    container.innerHTML = "";

    const quillDiv = document.createElement("div");
    container.appendChild(quillDiv);

    const quill = new Quill(quillDiv, {
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
      placeholder: placeholder || "",
    });

    quill.clipboard.dangerouslyPasteHTML(0, initialValue.current);
    quill.blur();

    quillRef.current = quill;

    const getHTML = () =>
      container.querySelector(".ql-editor")?.innerHTML || "";

    quill.on("text-change", () => {
      onChange(getHTML());
    });

    getEditor({ getValue: getHTML });

    return () => {
      quill.off("text-change");
      container.innerHTML = "";
      quillRef.current = null;
    };
  }, []);

  return (
    <EditorCont className={className}>
      <div ref={editorRef} />
    </EditorCont>
  );
};

export default TextEditor;
