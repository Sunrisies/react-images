import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
// import "md-editor-rt/lib/preview.css";
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
  const customStyle = {
    '--md-editor-ordered-list-style': 'decimal !important',
    '--md-editor-unordered-list-style': 'disc !important',
    '--md-editor-list-margin': '1em',
    '--md-editor-list-padding': '0 0 0 2em',
  } as React.CSSProperties;
  return (
    <div className="border rounded-md overflow-hidden" data-color-mode="light">
      <div >
        {/* <MdEditor
          value={value}
          style={{
            height: "calc(100vh - 160px)",
            maxWidth: "calc(100vw - 300px)",
          }}
          onChange={onChange}
          onUploadImg={onUploadImg}
          autoDetectCode={true}
          showToolbarName={true}
        /> */}
        <MdEditor
          
          value={value}
          style={{
            height: "calc(100vh - 160px)",
            maxWidth: "calc(100vw - 300px)",
          }}
          onChange={onChange}
          onUploadImg={onUploadImg}
          autoDetectCode={true}
          showToolbarName={true}
          theme="light"
          previewTheme="github"
          codeTheme="github"
          onGetCatalog={(catalog) => {
            console.log(catalog,'获取目录');
          }}
         
          // formatCopiedText={true}
          // previewOnly={false}
          // toolbarsExclude={[]}
        />
      </div>
    </div>
  );
}
