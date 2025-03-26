import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { uploadFileApi } from "@/services/media";

interface Props {
  showUploadDialog: boolean;
  setShowUploadDialog: (value: boolean) => void;
  handleSuccess: () => void;
}
const UploadFiles: FC<Props> = ({ showUploadDialog, setShowUploadDialog }) => {
  const { mutateAsync } = uploadFileApi();

  // 在现有状态后添加
  const [selectedFiles, setSelectedFiles] = useState<File>();
  // 添加文件选择处理函数
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log(files);
    if (files && files.length > 0) {
      setSelectedFiles(() => files[0]);
      console.log("Selected Files:", selectedFiles);
    }
  };
  const handleUpload = async () => {
    if (!selectedFiles) return toast.error("请选择文件");
    const data = await mutateAsync(selectedFiles);
    setSelectedFiles(() => undefined);
    setShowUploadDialog(false);
  };
  return (
    <Dialog
      open={showUploadDialog}
      onOpenChange={() => {
        setShowUploadDialog(false);
        setSelectedFiles(undefined);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>上传文件</DialogTitle>
          <DialogDescription>选择要上传到媒体库的文件</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <label
            htmlFor="file-upload"
            className="border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer w-full hover:border-primary transition-colors"
          >
            {!selectedFiles ? (
              <>
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium">
                    拖放文件到此处或点击上传
                  </p>
                  <p className="text-xs text-muted-foreground">
                    支持 JPG, PNG, GIF, PDF, MP4 等格式，单个文件最大 20MB
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center space-y-2">
                {selectedFiles.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(selectedFiles)}
                    alt="预览"
                    className="max-h-32 mx-auto object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-12 w-12 text-primary mb-4" />
                    <span className="text-sm">{selectedFiles.name}</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  点击此处重新选择文件
                </p>
              </div>
            )}
          </label>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".jpg,.jpeg,.png,.gif,.pdf,.mp4"
            onChange={handleFileChange}
          />
          <div className="space-y-2">
            <Label htmlFor="title">文件标题</Label>
            <Input id="title" placeholder="输入文件标题（可选）" />
          </div>
        </div>
        <DialogFooter className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedFiles(undefined);
              setShowUploadDialog(false);
            }}
          >
            取消
          </Button>
          <Button className="bg-primary" onClick={handleUpload}>
            上传
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default UploadFiles;
