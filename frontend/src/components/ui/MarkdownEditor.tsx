"use client";

import { marked } from "marked";
import type { Ref } from "react";
import { useEffect, useImperativeHandle, useRef } from "react";
import TurndownService from "turndown";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

function htmlToMarkdown(html: string): string {
  return turndown.turndown(html);
}

function markdownToHtml(md: string): string {
  return marked.parse(md, { async: false }) as string;
}

export type MarkdownEditorRef = {
  appendText: (text: string) => void;
};

type MarkdownEditorProps = {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  className?: string;
  ref?: Ref<MarkdownEditorRef>;
};

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Start typing...",
  className,
  ref,
}: MarkdownEditorProps) {
  const isExternalUpdate = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value ? markdownToHtml(value) : "",
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none text-black outline-none min-h-40 ${className ?? ""}`,
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (isExternalUpdate.current) return;
      const md = htmlToMarkdown(ed.getHTML());
      onChange(md);
    },
  });

  useImperativeHandle(
    ref,
    () => ({
      appendText(text: string) {
        if (!editor) return;
        editor.commands.focus("end");
        editor.commands.insertContent(" " + text);
      },
    }),
    [editor],
  );

  useEffect(() => {
    if (!editor) return;
    const currentMd = htmlToMarkdown(editor.getHTML());
    if (currentMd !== value) {
      isExternalUpdate.current = true;
      editor.commands.setContent(value ? markdownToHtml(value) : "");
      isExternalUpdate.current = false;
    }
  }, [editor, value]);

  return <EditorContent editor={editor} />;
}
