import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
// import "md-editor-rt/lib/preview.css";
import { useState } from "react";
import rehypeSanitize from "rehype-sanitize";
import { useSidebar } from "@/components/ui/sidebar";
import { useTheme } from "@/components/theme-provider";

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
  const { open,state } = useSidebar();
  const { theme } = useTheme();

  return (
    <div className="border rounded-md overflow-hidden w-full" data-color-mode={theme === 'dark' ? 'dark' : 'light'}>
      <MdEditor
          value={value}
          style={{
            height: "calc(100vh - 160px)",
            transition: "all 300ms", // 添加过渡效果
            width: state !== "expanded" ? "100%" : "calc(100vw - 244px)",
          }}
                  onChange={onChange}
          onUploadImg={onUploadImg}
          autoDetectCode={true}
          showToolbarName={true}
          theme={theme === 'dark' ? 'dark' : 'light'}
          previewTheme={theme === 'dark' ? 'dark' : 'github'}
          codeTheme={theme === 'dark' ? 'dracula' : 'github'}
          onGetCatalog={(catalog) => {
            console.log(catalog,'获取目录');
          }}
        />
    </div>
  );
}
