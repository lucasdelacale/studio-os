"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useEffect } from "react"

export function TipTapEditor({ content, onChange }: { content: any; onChange: (json: any) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => { onChange(editor.getJSON()) },
  })
  useEffect(() => {
    if (editor && content && !editor.isDestroyed) {
      const current = JSON.stringify(editor.getJSON())
      const target = JSON.stringify(typeof content === "string" ? JSON.parse(content) : content)
      if (current !== target) editor.commands.setContent(content)
    }
  }, [content, editor])
  return <EditorContent editor={editor} className="prose prose-sm max-w-none" />
}
