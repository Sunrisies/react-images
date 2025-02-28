"use client"

import { useState } from "react"
import {
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  Code,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<string>("edit")

  // This is a simplified version - in a real app, you'd use a proper rich text editor library
  const sampleContent = `
<h1>中国传统文化在现代设计中的应用</h1>

<p>中国传统文化是一座取之不尽、用之不竭的宝库，其中蕴含的美学思想、设计元素和哲学理念，为现代设计提供了丰富的灵感源泉。随着全球化的深入发展和文化自信的增强，越来越多的设计师开始关注如何将中国传统文化元素融入现代设计中，创造出既有传统韵味又符合现代审美的作品。</p>

<h2>传统元素的现代转化</h2>

<p>中国传统文化中的图案、色彩、材质和工艺技术等元素，经过设计师的创新转化，可以在现代设计中焕发新的生命力。例如，传统的青花瓷图案可以简化为现代图形，应用于品牌标识、包装设计或UI界面；传统的红色、金色等喜庆色彩可以通过调整饱和度和明度，创造出既有中国特色又符合国际审美的配色方案。</p>

<h2>传统哲学思想的应用</h2>

<p>中国传统哲学思想如"天人合一"、"阴阳平衡"等，也可以指导现代设计的创作过程。这些思想强调整体性、和谐性和平衡感，可以帮助设计师创造出更加和谐统一、富有内涵的设计作品。例如，在建筑设计中融入"天人合一"的理念，强调建筑与自然环境的和谐共生；在界面设计中应用阴阳平衡的原则，创造出动静结合、虚实相生的视觉效果。</p>

<h3>案例分析</h3>

<p>近年来，许多成功的设计案例展示了中国传统文化在现代设计中的创新应用。例如，2008年北京奥运会的视觉形象设计，将中国传统的印章、书法、剪纸等元素与现代设计语言相结合，创造出了具有强烈中国特色又被国际社会广泛认可的视觉形象。</p>

<p>又如，一些国际知名品牌如星巴克、苹果等在进入中国市场时，也会推出融合中国传统文化元素的限定产品，既尊重了本土文化，又满足了现代消费者的审美需求。</p>
  `

  return (
    <div className="border rounded-md">
      <div className="flex items-center gap-1 p-1 border-b">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Bold className="h-4 w-4" />
          <span className="sr-only">加粗</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Italic className="h-4 w-4" />
          <span className="sr-only">斜体</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Link className="h-4 w-4" />
          <span className="sr-only">链接</span>
        </Button>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Heading1 className="h-4 w-4" />
          <span className="sr-only">标题1</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Heading2 className="h-4 w-4" />
          <span className="sr-only">标题2</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Heading3 className="h-4 w-4" />
          <span className="sr-only">标题3</span>
        </Button>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <List className="h-4 w-4" />
          <span className="sr-only">无序列表</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ListOrdered className="h-4 w-4" />
          <span className="sr-only">有序列表</span>
        </Button>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <AlignLeft className="h-4 w-4" />
          <span className="sr-only">左对齐</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <AlignCenter className="h-4 w-4" />
          <span className="sr-only">居中对齐</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <AlignRight className="h-4 w-4" />
          <span className="sr-only">右对齐</span>
        </Button>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Quote className="h-4 w-4" />
          <span className="sr-only">引用</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Code className="h-4 w-4" />
          <span className="sr-only">代码</span>
        </Button>
        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Undo className="h-4 w-4" />
            <span className="sr-only">撤销</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Redo className="h-4 w-4" />
            <span className="sr-only">重做</span>
          </Button>
        </div>
      </div>
      <Tabs defaultValue="edit" className="w-full">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <TabsList>
            <TabsTrigger value="edit" onClick={() => setActiveTab("edit")}>
              编辑
            </TabsTrigger>
            <TabsTrigger value="preview" onClick={() => setActiveTab("preview")}>
              预览
            </TabsTrigger>
          </TabsList>
          <div className="text-sm text-muted-foreground">字数: 约 500 字</div>
        </div>
        <TabsContent value="edit" className="p-0">
          <textarea
            className="w-full min-h-[400px] p-4 resize-y focus:outline-none"
            value={sampleContent}
            onChange={(e) => onChange(e.target.value)}
            placeholder="开始编写文章内容..."
          />
        </TabsContent>
        <TabsContent value="preview" className="p-0">
          <div
            className="w-full min-h-[400px] p-4 prose prose-sm md:prose-base dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: sampleContent }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

