import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useEditor,
  EditorContent,
} from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import FontFamily from "@tiptap/extension-font-family";
import Placeholder from "@tiptap/extension-placeholder";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  Link as LinkIcon,
  Unlink,
  Paperclip,
  Smile,
  Image as ImageIcon,
  FileText,
  X,
  Type,
  Highlighter,
  Trash2,
} from "lucide-react";


const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
];


const EMOJIS = [
  "😀",
  "😊",
  "😂",
  "😍",
  "🥰",
  "😎",
  "🙏",
  "❤️",
  "💙",
  "💚",
  "👍",
  "👏",
  "🎉",
  "✨",
  "⭐",
  "🌟",
  "💪",
  "🤝",
  "❤️‍🩹",
  "🌍",
  "🌱",
  "📚",
  "🎓",
  "🏫",
  "👨‍👩‍👧‍👦",
  "🧡",
];


export default function RichTextEditor({
  value = "",
  onChange,
  onAttachmentsChange,
  placeholder = "Write your message...",
}) {

  const fileInputRef = useRef(null);

  const [attachments, setAttachments] =
    useState([]);

  const [showEmoji, setShowEmoji] =
    useState(false);

  const [dragging, setDragging] =
    useState(false);

  const [error, setError] =
    useState("");


  const editor = useEditor({

    extensions: [

      StarterKit,

      Underline,

      TextStyle,

      FontFamily.configure({
        types: ["textStyle"],
      }),

      Color,

      Highlight.configure({
        multicolor: true,
      }),

      TextAlign.configure({
        types: [
          "heading",
          "paragraph",
        ],
      }),

      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),

      Placeholder.configure({
        placeholder,
      }),
    ],

    content: value,

    editorProps: {

      attributes: {
        class:
          "min-h-[240px] px-5 py-4 focus:outline-none",
      },

      handleKeyDown: (
        view,
        event
      ) => {

        // CTRL + SHIFT + X
        // UPPERCASE

        if (
          event.ctrlKey &&
          event.shiftKey &&
          event.key.toLowerCase() === "x"
        ) {

          event.preventDefault();

          const {
            from,
            to,
          } = view.state.selection;

          const selectedText =
            view.state.doc.textBetween(
              from,
              to,
              " "
            );

          if (!selectedText) {
            return true;
          }

          editor
            ?.chain()
            .focus()
            .insertContentAt(
              { from, to },
              selectedText.toUpperCase()
            )
            .run();

          return true;
        }

        return false;
      },
    },

    onUpdate: ({
      editor,
    }) => {

      onChange?.(
        editor.getHTML()
      );
    },
  });


  useEffect(() => {

    if (!editor) return;

    if (
      value !== editor.getHTML() &&
      value !== undefined
    ) {

      editor.commands.setContent(
        value || "",
        false
      );
    }

  }, [value, editor]);


  useEffect(() => {

    onAttachmentsChange?.(
      attachments
    );

  }, [
    attachments,
    onAttachmentsChange,
  ]);


  if (!editor) {
    return null;
  }


  // =====================================================
  // LINK
  // =====================================================

  const setLink = () => {

    const previousUrl =
      editor.getAttributes(
        "link"
      ).href;

    const url = window.prompt(
      "Enter URL:",
      previousUrl || "https://"
    );

    if (url === null) {
      return;
    }

    if (url === "") {

      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .unsetLink()
        .run();

      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href: url,
      })
      .run();
  };


  // =====================================================
  // FILE VALIDATION
  // =====================================================

  const validateFile = (file) => {

    if (
      !ALLOWED_FILE_TYPES.includes(
        file.type
      )
    ) {

      return `${file.name} is not a supported file type.`;
    }

    if (
      file.size >
      MAX_FILE_SIZE
    ) {

      return `${file.name} is larger than 10MB.`;
    }

    return "";
  };


  // =====================================================
  // ADD FILES
  // =====================================================

  const addFiles = (files) => {

    setError("");

    const selectedFiles =
      Array.from(files);

    const validFiles = [];

    for (
      const file of selectedFiles
    ) {

      const validationError =
        validateFile(file);

      if (validationError) {

        setError(
          validationError
        );

        continue;
      }

      const exists =
        attachments.some(
          (item) =>
            item.file.name ===
              file.name &&
            item.file.size ===
              file.size
        );

      if (!exists) {

        validFiles.push({
          id:
            `${Date.now()}-${Math.random()}`,
          file,
          preview:
            file.type.startsWith(
              "image/"
            )
              ? URL.createObjectURL(
                  file
                )
              : null,
        });
      }
    }

    setAttachments((prev) => [
      ...prev,
      ...validFiles,
    ]);
  };


  // =====================================================
  // FILE INPUT
  // =====================================================

  const handleFileChange = (
    event
  ) => {

    if (
      event.target.files?.length
    ) {

      addFiles(
        event.target.files
      );
    }

    event.target.value = "";
  };


  // =====================================================
  // REMOVE FILE
  // =====================================================

  const removeAttachment = (
    id
  ) => {

    setAttachments((prev) => {

      const item =
        prev.find(
          (file) =>
            file.id === id
        );

      if (
        item?.preview
      ) {

        URL.revokeObjectURL(
          item.preview
        );
      }

      return prev.filter(
        (file) =>
          file.id !== id
      );
    });
  };


  // =====================================================
  // DRAG & DROP
  // =====================================================

  const handleDrop = (
    event
  ) => {

    event.preventDefault();

    setDragging(false);

    if (
      event.dataTransfer.files
        ?.length
    ) {

      addFiles(
        event.dataTransfer.files
      );
    }
  };


  // =====================================================
  // INSERT EMOJI
  // =====================================================

  const insertEmoji = (
    emoji
  ) => {

    editor
      .chain()
      .focus()
      .insertContent(emoji)
      .run();

    setShowEmoji(false);
  };


  // =====================================================
  // TOOLBAR BUTTON
  // =====================================================

  const ToolbarButton = ({
    onClick,
    active = false,
    title,
    children,
  }) => (

    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`
        flex h-8 w-8
        items-center
        justify-center
        rounded-md
        transition
        ${
          active
            ? "bg-blue-100 text-blue-700"
            : "text-slate-600 hover:bg-slate-200 hover:text-blue-700"
        }
      `}
    >
      {children}
    </button>
  );


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div
      className={`
        overflow-hidden
        rounded-2xl
        border
        bg-white
        shadow-sm
        ${
          dragging
            ? "border-blue-500 ring-2 ring-blue-100"
            : "border-slate-200"
        }
      `}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() =>
        setDragging(false)
      }
      onDrop={handleDrop}
    >

      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2">

        {/* FONT */}

        <select
          title="Font family"
          className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-600"
          onChange={(event) => {

            const font =
              event.target.value;

            if (!font) {

              editor
                .chain()
                .focus()
                .unsetFontFamily()
                .run();

              return;
            }

            editor
              .chain()
              .focus()
              .setFontFamily(font)
              .run();
          }}
        >

          <option value="">
            Font
          </option>

          <option value="Arial">
            Arial
          </option>

          <option value="Georgia">
            Georgia
          </option>

          <option value="Times New Roman">
            Times New Roman
          </option>

          <option value="Verdana">
            Verdana
          </option>

          <option value="Courier New">
            Courier New
          </option>

        </select>


        {/* SIZE */}

        <select
          title="Font size"
          className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-600"
          onChange={(event) => {

            const size =
              event.target.value;

            if (!size) return;

            editor
              .chain()
              .focus()
              .setMark(
                "textStyle",
                {
                  fontSize: size,
                }
              )
              .run();
          }}
        >

          <option value="">
            Size
          </option>

          <option value="12px">
            12
          </option>

          <option value="14px">
            14
          </option>

          <option value="16px">
            16
          </option>

          <option value="18px">
            18
          </option>

          <option value="20px">
            20
          </option>

          <option value="24px">
            24
          </option>

          <option value="30px">
            30
          </option>

        </select>


        {/* BOLD */}

        <ToolbarButton
          title="Bold"
          active={editor.isActive(
            "bold"
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
        >

          <Bold size={16} />

        </ToolbarButton>


        {/* ITALIC */}

        <ToolbarButton
          title="Italic"
          active={editor.isActive(
            "italic"
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }
        >

          <Italic size={16} />

        </ToolbarButton>


        {/* UNDERLINE */}

        <ToolbarButton
          title="Underline"
          active={editor.isActive(
            "underline"
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleUnderline()
              .run()
          }
        >

          <UnderlineIcon size={16} />

        </ToolbarButton>


        {/* STRIKE */}

        <ToolbarButton
          title="Strikethrough"
          active={editor.isActive(
            "strike"
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleStrike()
              .run()
          }
        >

          <Strikethrough size={16} />

        </ToolbarButton>


        <div className="mx-1 h-6 w-px bg-slate-300" />


        {/* HEADING */}

        <select
          title="Text style"
          className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs"
          onChange={(event) => {

            const value =
              event.target.value;

            if (
              value ===
              "paragraph"
            ) {

              editor
                .chain()
                .focus()
                .setParagraph()
                .run();

            } else {

              editor
                .chain()
                .focus()
                .toggleHeading({
                  level:
                    Number(
                      value.replace(
                        "h",
                        ""
                      )
                    ),
                })
                .run();
            }
          }}
        >

          <option value="paragraph">
            Normal
          </option>

          <option value="h1">
            Heading 1
          </option>

          <option value="h2">
            Heading 2
          </option>

          <option value="h3">
            Heading 3
          </option>

        </select>


        {/* ALIGN */}

        <ToolbarButton
          title="Align left"
          onClick={() =>
            editor
              .chain()
              .focus()
              .setTextAlign("left")
              .run()
          }
        >
          <AlignLeft size={16} />
        </ToolbarButton>

        <ToolbarButton
          title="Center"
          onClick={() =>
            editor
              .chain()
              .focus()
              .setTextAlign("center")
              .run()
          }
        >
          <AlignCenter size={16} />
        </ToolbarButton>

        <ToolbarButton
          title="Align right"
          onClick={() =>
            editor
              .chain()
              .focus()
              .setTextAlign("right")
              .run()
          }
        >
          <AlignRight size={16} />
        </ToolbarButton>

        <ToolbarButton
          title="Justify"
          onClick={() =>
            editor
              .chain()
              .focus()
              .setTextAlign("justify")
              .run()
          }
        >
          <AlignJustify size={16} />
        </ToolbarButton>


        <div className="mx-1 h-6 w-px bg-slate-300" />


        {/* BULLETS */}

        <ToolbarButton
          title="Bullet list"
          active={editor.isActive(
            "bulletList"
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          }
        >
          <List size={16} />
        </ToolbarButton>


        {/* NUMBERING */}

        <ToolbarButton
          title="Numbered list"
          active={editor.isActive(
            "orderedList"
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleOrderedList()
              .run()
          }
        >
          <ListOrdered size={16} />
        </ToolbarButton>


        {/* QUOTE */}

        <ToolbarButton
          title="Quote"
          active={editor.isActive(
            "blockquote"
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBlockquote()
              .run()
          }
        >
          <Quote size={16} />
        </ToolbarButton>


        {/* TEXT COLOR */}

        <label
          title="Text color"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-slate-600 hover:bg-slate-200"
        >

          <Type size={16} />

          <input
            type="color"
            className="absolute h-0 w-0 opacity-0"
            onInput={(event) =>
              editor
                .chain()
                .focus()
                .setColor(
                  event.target.value
                )
                .run()
            }
          />

        </label>


        {/* HIGHLIGHT */}

        <label
          title="Highlight"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-slate-600 hover:bg-slate-200"
        >

          <Highlighter size={16} />

          <input
            type="color"
            className="absolute h-0 w-0 opacity-0"
            onInput={(event) =>
              editor
                .chain()
                .focus()
                .toggleHighlight({
                  color:
                    event.target.value,
                })
                .run()
            }
          />

        </label>


        {/* LINK */}

        <ToolbarButton
          title="Add link"
          active={editor.isActive(
            "link"
          )}
          onClick={setLink}
        >
          <LinkIcon size={16} />
        </ToolbarButton>


        {/* UNLINK */}

        <ToolbarButton
          title="Remove link"
          onClick={() =>
            editor
              .chain()
              .focus()
              .unsetLink()
              .run()
          }
        >
          <Unlink size={16} />
        </ToolbarButton>


        <div className="mx-1 h-6 w-px bg-slate-300" />


        {/* EMOJI */}

        <div className="relative">

          <ToolbarButton
            title="Emoji"
            onClick={() =>
              setShowEmoji(
                (prev) => !prev
              )
            }
          >
            <Smile size={17} />
          </ToolbarButton>


          {showEmoji && (

            <div className="absolute left-0 top-10 z-50 grid w-64 grid-cols-8 gap-1 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">

              {EMOJIS.map(
                (emoji) => (

                  <button
                    key={emoji}
                    type="button"
                    onClick={() =>
                      insertEmoji(
                        emoji
                      )
                    }
                    className="rounded-lg p-1.5 text-xl hover:bg-slate-100"
                  >
                    {emoji}
                  </button>

                )
              )}

            </div>

          )}

        </div>


        {/* ATTACHMENT */}

        <ToolbarButton
          title="Attach file"
          onClick={() =>
            fileInputRef.current?.click()
          }
        >
          <Paperclip size={17} />
        </ToolbarButton>


        {/* IMAGE */}

        <ToolbarButton
          title="Attach image"
          onClick={() =>
            fileInputRef.current?.click()
          }
        >
          <ImageIcon size={17} />
        </ToolbarButton>


        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALLOWED_FILE_TYPES.join(
            ","
          )}
          className="hidden"
          onChange={
            handleFileChange
          }
        />


        {/* UNDO */}

        <ToolbarButton
          title="Undo"
          onClick={() =>
            editor
              .chain()
              .focus()
              .undo()
              .run()
          }
        >
          <Undo2 size={16} />
        </ToolbarButton>


        {/* REDO */}

        <ToolbarButton
          title="Redo"
          onClick={() =>
            editor
              .chain()
              .focus()
              .redo()
              .run()
          }
        >
          <Redo2 size={16} />
        </ToolbarButton>

      </div>


      {/* =================================================
          EDITOR
      ================================================= */}

      <EditorContent
        editor={editor}
      />


      {/* =================================================
          DRAG DROP MESSAGE
      ================================================= */}

      {dragging && (

        <div className="border-t border-blue-100 bg-blue-50 px-4 py-3 text-center text-sm font-medium text-blue-700">

          Drop files here to attach them

        </div>

      )}


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="mx-4 mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">

          {error}

        </div>

      )}


      {/* =================================================
          ATTACHMENTS
      ================================================= */}

      {attachments.length > 0 && (

        <div className="border-t border-slate-100 bg-slate-50 p-3">

          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">

            Attachments (
            {attachments.length}
            )

          </div>


          <div className="grid gap-2 sm:grid-cols-2">

            {attachments.map(
              (item) => (

                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2"
                >

                  {/* IMAGE PREVIEW */}

                  {item.preview ? (

                    <img
                      src={item.preview}
                      alt={item.file.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />

                  ) : (

                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-700">

                      <FileText
                        size={20}
                      />

                    </div>

                  )}


                  {/* FILE INFO */}

                  <div className="min-w-0 flex-1">

                    <p className="truncate text-sm font-medium text-slate-700">

                      {item.file.name}

                    </p>

                    <p className="text-xs text-slate-400">

                      {(
                        item.file.size /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB

                    </p>

                  </div>


                  {/* REMOVE */}

                  <button
                    type="button"
                    onClick={() =>
                      removeAttachment(
                        item.id
                      )
                    }
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    title="Remove attachment"
                  >

                    <Trash2
                      size={16}
                    />

                  </button>

                </div>

              )
            )}

          </div>

        </div>

      )}


      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-slate-50 px-4 py-2">

        <div className="flex items-center gap-3 text-[11px] text-slate-400">

          <span>
            Rich text enabled
          </span>

          <span>
            •
          </span>

          <span>
            Max file: 10MB
          </span>

        </div>


        <div className="text-[11px] text-slate-400">

          Ctrl + Shift + X =
          UPPERCASE

        </div>

      </div>


      {/* =================================================
          STYLES
      ================================================= */}

      <style>{`

        .ProseMirror {
          min-height: 240px;
          outline: none;
          color: #334155;
          font-size: 14px;
          line-height: 1.7;
        }

        .ProseMirror p {
          margin: 0 0 10px;
        }

        .ProseMirror h1 {
          margin: 18px 0 12px;
          font-size: 1.8rem;
          line-height: 1.2;
          font-weight: 800;
          color: #0f172a;
        }

        .ProseMirror h2 {
          margin: 16px 0 10px;
          font-size: 1.45rem;
          line-height: 1.3;
          font-weight: 700;
          color: #0f172a;
        }

        .ProseMirror h3 {
          margin: 14px 0 9px;
          font-size: 1.2rem;
          font-weight: 700;
          color: #0f172a;
        }

        .ProseMirror ul {
          padding-left: 25px;
          list-style: disc;
        }

        .ProseMirror ol {
          padding-left: 25px;
          list-style: decimal;
        }

        .ProseMirror blockquote {
          margin: 15px 0;
          padding: 10px 15px;
          border-left: 4px solid #2563eb;
          background: #eff6ff;
          color: #475569;
          font-style: italic;
        }

        .ProseMirror a {
          color: #2563eb;
          text-decoration: underline;
        }

        .ProseMirror strong {
          font-weight: 800;
        }

        .ProseMirror em {
          font-style: italic;
        }

        .ProseMirror u {
          text-decoration: underline;
        }

        .ProseMirror s {
          text-decoration: line-through;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #94a3b8;
          float: left;
          height: 0;
          pointer-events: none;
        }

      `}</style>

    </div>
  );
}

