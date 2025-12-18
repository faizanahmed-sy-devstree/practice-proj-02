"use client"

import * as React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import { 
  TextBoldIcon, 
  TextItalicIcon, 
  LeftToRightListNumberIcon, 
  ListViewIcon,
  QuotesIcon,
  Heading01Icon,
  Heading02Icon,
  CodeIcon,
  UndoIcon,
  RedoIcon
} from '@hugeicons/core-free-icons'
import { cn } from '@/lib/utils'

interface EditorProps {
  content: string
  onChange: (content: string) => void
}

export function Editor({ content, onChange }: EditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start typing your lesson plan...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none min-h-[500px] p-8 max-w-none',
      },
    },
  })

  // Update editor content when template changes
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-col w-full border rounded-2xl bg-background overflow-hidden shadow-xl ring-1 ring-foreground/5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/30 backdrop-blur-sm sticky top-0 z-10">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          icon={TextBoldIcon}
          label="Bold"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          icon={TextItalicIcon}
          label="Italic"
        />
        <div className="w-px h-6 bg-border mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          icon={Heading01Icon}
          label="H1"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          icon={Heading02Icon}
          label="H2"
        />
        <div className="w-px h-6 bg-border mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          icon={ListViewIcon}
          label="Bullet List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          icon={LeftToRightListNumberIcon}
          label="Ordered List"
        />
        <div className="w-px h-6 bg-border mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          icon={QuotesIcon}
          label="Quote"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          icon={CodeIcon}
          label="Code Block"
        />
        <div className="flex-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          icon={UndoIcon}
          label="Undo"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          icon={RedoIcon}
          label="Redo"
        />
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-zinc-950">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

function ToolbarButton({ 
  onClick, 
  active, 
  disabled, 
  icon, 
  label 
}: { 
  onClick: () => void, 
  active?: boolean, 
  disabled?: boolean, 
  icon: any, 
  label: string 
}) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-8 w-8 transition-all duration-200",
        active ? "bg-primary text-primary-foreground shadow-md scale-105" : "hover:bg-primary/10 hover:text-primary"
      )}
      title={label}
    >
      <HugeiconsIcon icon={icon} size={16} />
    </Button>
  )
}
