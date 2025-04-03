"use client";

import MDEditor, { commands } from "@uiw/react-md-editor";
import { useState } from "react";
import rehypeSanitize from "rehype-sanitize";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  return (
    <div className="border rounded-md overflow-hidden" data-color-mode="light">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex gap-2">
          <button
            type="button"
            className={`px-3 py-1 rounded-md ${
              activeTab === "edit" ? "bg-muted" : "hover:bg-muted/50"
            }`}
            onClick={() => setActiveTab("edit")}
          >
            编辑
          </button>
          <button
            type="button"
            className={`px-3 py-1 rounded-md ${
              activeTab === "preview" ? "bg-muted" : "hover:bg-muted/50"
            }`}
            onClick={() => setActiveTab("preview")}
          >
            预览
          </button>
        </div>
      </div>

      <div>
        {activeTab === "edit" ? (
          <MDEditor
            value={value}
            onChange={(val) => onChange(val || "")}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
            }}
            height={700}
            visibleDragbar={false}
            extraCommands={[
              commands.codeEdit,
              commands.codeLive,
              commands.codePreview,
            ]}
          />
        ) : (
          <div className="p-6">
            <MDEditor.Markdown
              source={value}
              style={{ whiteSpace: "pre-wrap" }}
              className="!bg-transparent"
            />
          </div>
        )}
      </div>
    </div>
  );
}
