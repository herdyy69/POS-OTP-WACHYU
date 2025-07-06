'use client'
import { useEffect, useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { cn } from '@/lib/utils'
import { TextEditorProps } from '@/interfaces/form'

export const TextEditor = ({ children, disabled, className, height, width, value, onChange }: TextEditorProps) => {
  const editorRef = useRef<any>(null)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className='flex flex-col gap-2'>
      <div className={cn('overflow-hidden rounded-lg border border-transparent', className)}>
        <Editor
          tinymceScriptSrc='/tinymce/js/tinymce/tinymce.min.js'
          value={value ?? ''}
          init={{
            width: width ?? '100%',
            height: height ?? 350,
            menubar: true,
            plugins: 'code image link media lists',
            toolbar:
              'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image uploadimage ',
            automatic_uploads: true,
            file_picker_types: 'image',
            file_picker_callback: function (cb: any, value: any, meta: any) {
              let input = document.createElement('input')
              input.setAttribute('type', 'file')
              input.setAttribute('accept', 'image/*')
              input.onchange = function () {
                //@ts-ignore
                let file = this.files[0]

                let reader = new FileReader()
                reader.onload = function () {
                  let id = 'blobid' + new Date().getTime()
                  //@ts-ignore
                  let blobCache = tinymce.activeEditor.editorUpload.blobCache
                  //@ts-ignore
                  let base64 = reader.result.split(',')[1]
                  let blobInfo = blobCache.create(id, file, base64)
                  blobCache.add(blobInfo)

                  cb(blobInfo.blobUri(), { title: file.name })
                }
                reader.readAsDataURL(file)
              }

              input.click()
            },
            htmlAllowedTags: ['.*'],
            htmlAllowedAttrs: ['.*'],
            draggable_modal: true,
            setup: function (editor: any) {
              editorRef.current = editor
            },
          }}
          onEditorChange={(value: any, _editor: any) => {
            onChange && onChange(value)
          }}
          disabled={disabled}
        />
      </div>
      {children}
    </div>
  )
}

export default TextEditor
