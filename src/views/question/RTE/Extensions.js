import {
  TiptapImage,
  TiptapLink,
  UpdatedImage,
  TaskList,
  TaskItem,
  HorizontalRule,
  StarterKit,
  Placeholder,
  AIHighlight,
  CodeBlockLowlight,
  CharacterCount,
  Youtube
} from "novel/extensions";
import { UploadImagesPlugin } from "novel/plugins";
import { common, createLowlight } from "lowlight";

import { cx } from "class-variance-authority";

const aiHighlight = AIHighlight;
const placeholder = Placeholder;
const tiptapLink = TiptapLink.configure({
  HTMLAttributes: {
    class: cx(
      "text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer"
    )
  }
});

const tiptapImage = TiptapImage.extend({
  addProseMirrorPlugins() {
    return [
      UploadImagesPlugin({
        imageClass: cx("opacity-40 rounded-lg border border-stone-200")
      })
    ];
  }
}).configure({
  allowBase64: true,
  HTMLAttributes: {
    class: cx("rounded-lg border border-muted")
  }
});

const updatedImage = UpdatedImage.configure({
  HTMLAttributes: {
    class: cx("rounded-lg border border-muted")
  }
});

const taskList = TaskList.configure({
  HTMLAttributes: {
    class: cx("not-prose pl-2 ")
  }
});
const taskItem = TaskItem.configure({
  HTMLAttributes: {
    class: cx("flex gap-2 items-start my-4")
  },
  nested: true
});

const horizontalRule = HorizontalRule.configure({
  HTMLAttributes: {
    class: cx("mt-4 mb-6 border-t border-muted-foreground")
  }
});

const starterKit = StarterKit.configure({
  bulletList: {
    HTMLAttributes: {
      class: cx("list-disc list-outside leading-3 -mt-2")
    }
  },
  orderedList: {
    HTMLAttributes: {
      class: cx("list-decimal list-outside leading-3 -mt-2")
    }
  },
  listItem: {
    HTMLAttributes: {
      class: cx("leading-normal -mb-2")
    }
  },
  blockquote: {
    HTMLAttributes: {
      class: cx("border-l-4 border-primary")
    }
  },
  code: {
    HTMLAttributes: {
      class: cx("rounded-md bg-muted  px-1.5 py-1 font-mono font-medium"),
      spellcheck: "false"
    }
  },
  horizontalRule: false,
  dropcursor: {
    color: "#DBEAFE",
    width: 4
  },
  gapcursor: false
});

export const CodeBlock = CodeBlockLowlight.extend({
  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => {
        if (editor.isActive("codeBlock")) {
          editor.commands.command(({ tr }) => {
            tr.insertText("\t", tr.selection.from, tr.selection.to);
            return true;
          });
          return true;
        }
        return false;
      }
    };
  }
});

const codeBlockLowlight = CodeBlock.configure({
  lowlight: createLowlight(common)
});

const youtube = Youtube.configure({
  HTMLAttributes: {
    class: cx("rounded-lg border border-muted")
  },
  inline: false
});

const characterCount = CharacterCount.configure();

export const defaultExtensions = [
  starterKit,
  placeholder,
  tiptapLink,
  tiptapImage,
  updatedImage,
  taskList,
  taskItem,
  horizontalRule,
  aiHighlight,
  codeBlockLowlight,
  youtube,
  characterCount
];
