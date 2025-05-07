import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ChevronDown, Filter, RotateCcw, Search } from "lucide-react";
import { useState } from "react";

interface MediaToolbarProps {
  totalCount: number;
  selectedCount: number;
  onSearch: (search: string) => void;
  onFilter: (type: string) => void;
}

type FileType = 'all' | 'image' | 'video' | 'document';

const fileTypes: { value: FileType; label: string }[] = [
  { value: 'all', label: '全部文件' },
  { value: 'image', label: '图片' },
  { value: 'video', label: '视频' },
  { value: 'document', label: '文档' },
];

export function MediaToolbar({ 
  totalCount, 
  selectedCount, 
  onSearch,
  onFilter 
}: MediaToolbarProps) {
  const [searchValue, setSearchValue] = useState("");
  const [activeFilter, setActiveFilter] = useState<FileType>("all");

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(searchValue);
    }
  };

  const handleFilterChange = (type: FileType) => {
    setActiveFilter(type);
    onFilter(type);
  };

  const handleReset = () => {
    setSearchValue("");
    setActiveFilter("all");
    onSearch("");
    onFilter("all");
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索媒体文件..."
            className="w-full pl-8"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="mr-2 h-4 w-4" />
              {fileTypes.find(type => type.value === activeFilter)?.label || "筛选"}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {fileTypes.map((type) => (
              <DropdownMenuItem
                key={type.value}
                onClick={() => handleFilterChange(type.value)}
                className={activeFilter === type.value ? "bg-accent" : ""}
              >
                {type.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9"
          onClick={handleReset}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          重置
        </Button>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>共 {totalCount} 个文件</span>
        {selectedCount > 0 && (
          <span className="ml-2">已选择 {selectedCount} 个文件</span>
        )}
      </div>
    </div>
  );
}