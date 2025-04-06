"use client";

// import MDEditor, { commands } from "@uiw/react-md-editor";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import { useState } from "react";
import rehypeSanitize from "rehype-sanitize";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onUploadImg: (files: File[], callback: (urls: string[]) => void) => void; // 图片上传回调
}

export function RichTextEditor({
  value,
  onChange,
  onUploadImg,
}: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  return (
    <div className="border rounded-md overflow-hidden" data-color-mode="light">
      <div>
        <MdEditor
          value={value}
          style={{
            height: "calc(100vh - 160px)",
            maxWidth: "calc(100vw - 300px)",
          }}
          onChange={onChange}
          onUploadImg={onUploadImg}
          // className={styles.mdEditor}
          autoDetectCode={true}
          showToolbarName={true}
        />
      </div>
    </div>
  );
}
