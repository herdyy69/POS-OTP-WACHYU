import Image from 'next/image'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { AxiosRequestConfig } from 'axios'
import { Accept, useDropzone } from 'react-dropzone'

import apiClient from '@/lib/apiClient'
import { cn } from '@/lib/utils'
import { fileExtensionReader, getNameFromUrl, numberToBytes } from '@/lib/file'
import { UploadFieldProps, UploadProps } from '@/interfaces/form'

import { FormLabel, FormMessage } from './form'
import { Icons } from '../icons'
import DownloadLink from '../common/downloadLink'
import { toast } from '../alert/toast'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hoverCard'
import { ScrollArea } from '@/components/ui/scrollArea'

type FileValue = {
  name: string
  url: string
  path: string
  progress?: number
  type?: string
}

interface IUpload {
  maxFiles: number
  maxSize: number
  placeholder?: string
  fileRejections?: any[]
  disabled?: boolean
  onCancel?: (index: number) => void
  files: File[] | FileValue[]
}

interface UploadItemProps {
  filename: string
  href?: string
  type?: string
  status: string
  progress?: number
  size?: string | number
  onCancel?: () => void
  disabled?: boolean
}

function parseValues({ input, keyPairs }: { input: any; keyPairs?: any }): any {
  if (!input) {
    return
  }

  if (input instanceof File) {
    return input
  }

  if (Array.isArray(input) && input.every((item) => item instanceof File)) {
    return input
  }

  // Helper function to process a single value object
  const processValue = (value: any) => {
    const url = value[keyPairs?.url] || value?.url || ''
    const name = value[keyPairs?.name] || value?.name || getNameFromUrl(url)

    return { name, url, ...value }
  }

  // Normalize input to ensure consistent processing
  const normalizeValue = (value: any) => {
    if (Array.isArray(value)) {
      return value.flat().map((item) => (typeof item === 'string' ? { url: item } : item))
    }
    if (typeof value === 'string') {
      return [{ url: value }]
    }
    if (typeof value === 'object' && value !== null) {
      return [value]
    }
    return []
  }

  const values = normalizeValue(input)

  const processedValues = values.map(processValue)

  return processedValues
}

async function onUpload({ file, config }: { file: File; config?: AxiosRequestConfig<any> | undefined }) {
  try {
    toast.info({
      title: 'Mengunggah File',
      body: `Sedang mengunggah ${file.name}...`,
    })

    const formData = new FormData()
    formData.append('file', file)
    formData.append('directory_guid', process.env.NEXT_PUBLIC_STORAGE_DIRECTORY_GUID ?? '')
    formData.append('name', file.name)
    formData.append('description', 'description')
    formData.append('path', 'general')
    formData.append('extension', '.' + file.name.substring(file.name.lastIndexOf('.') + 1))
    formData.append('mime_type', file.type)
    formData.append('size', file.size.toString())
    const apiConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    }

    const response = await apiClient.post(`${process.env.NEXT_PUBLIC_API_URL}/storage/file`, formData, apiConfig)

    toast.success({
      title: 'Unggahan Berhasil',
      body: `${file.name} berhasil diunggah.`,
    })

    return response
  } catch (error) {
    toast.error({
      title: 'Unggahan Gagal',
      body: `Gagal mengunggah ${file.name}. Silakan coba lagi.`,
    })
  }
}

const UploadContext = createContext<any>({})

const useUpload = () => {
  const context = useContext<IUpload>(UploadContext)
  if (!context) {
    throw new Error('Upload compound components must be rendered within the Upload component')
  }
  return context
}

export const Upload = ({
  className,
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024,
  disabled,
  accept,
  placeholder,
  children,
  onChange,
  keyPairs,
  values,
  status,
  message,
  isServerSide = false,
}: UploadProps & { accept?: Accept }) => {
  const [files, setFiles] = useState<File[] | FileValue[]>()
  const [fileRejections, setFileRejections] = useState<any[]>([])

  const handleDropServer = async (newFiles: File[]) => {
    const existingFiles = files ?? []

    const remainingSlots = maxFiles - existingFiles.length
    const filesToUpload = newFiles.slice(0, remainingSlots)

    const tempFiles = filesToUpload.map((file) => ({
      name: file.name,
      path: '',
      url: URL.createObjectURL(file),
      progress: 0,
    }))

    setFiles([...existingFiles, ...tempFiles] as FileValue[])

    const dataFiles = await Promise.all(
      filesToUpload.map(async (file, index) => {
        const response = await onUpload({
          file,
          config: {
            onUploadProgress: function (progressEvent: any) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)

              setFiles((prevVal: any) => {
                const updated = [...prevVal]
                const actualIndex = existingFiles.length + index
                updated[actualIndex].progress = percentCompleted
                return updated
              })
            },
          },
        })

        return response?.data
      }),
    )

    const mappedDataFiles = dataFiles.map((dataFile: any) => ({
      name: dataFile?.data?.name,
      url: dataFile?.data?.file?.url,
      path: dataFile?.data?.file?.path,
      type: dataFile?.data?.mime_type,
      progress: 100,
    }))

    setFiles((prevFiles: any) => {
      return [...prevFiles.slice(0, existingFiles.length), ...mappedDataFiles]
    })

    onChange && onChange(maxFiles === 1 ? mappedDataFiles[0] : [...(existingFiles || []), ...mappedDataFiles])
  }

  const handleDropClient = (files: File[]) => {
    setFiles(files)
    onChange && onChange(maxFiles === 1 ? files[0] : files)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: isServerSide ? handleDropServer : handleDropClient,
    disabled:
      disabled ||
      (maxFiles === 1 && files && files?.length > 0) ||
      (files instanceof File && !!files && maxFiles === 1),
    onDropRejected: (fileRejections) => setFileRejections(fileRejections),
    onFileDialogOpen: () => setFileRejections([]),
    onDragEnter: () => setFileRejections([]),
    maxFiles,
    maxSize,
    accept,
  })

  const onCancel = (index: number) => {
    setFileRejections([])
    if (files && Array.isArray(files)) {
      const filteredFiles: any = files?.filter((_: any, i: number) => i !== index)
      setFiles(maxFiles === 1 ? undefined : filteredFiles)
      onChange && onChange(maxFiles === 1 ? undefined : filteredFiles)
    } else {
      setFiles(maxFiles === 1 ? undefined : [])
      onChange && onChange(null)
    }
  }

  const contextValues = useMemo(() => {
    return {
      files,
      placeholder,
      maxFiles,
      maxSize,
      disabled,
      fileRejections,
      onCancel,
    }
  }, [files, placeholder, maxFiles, maxSize, fileRejections, onCancel, disabled])

  useEffect(() => {
    const defaultValues = parseValues({ input: values, keyPairs })

    setFiles(defaultValues)
  }, [values])

  return (
    <UploadContext.Provider value={contextValues}>
      <div className='group relative flex w-full flex-col gap-2'>
        <div className='relative z-20'>
          {maxFiles === 1 && ((files instanceof File && !!files) || (files instanceof Array && files?.length > 0)) ? (
            <SingleItem />
          ) : (
            <HoverCard openDelay={50} closeDelay={50}>
              <HoverCardTrigger asChild>
                <div
                  {...getRootProps({
                    className: cn(
                      'h-full bg-blue-0 flex items-center justify-center min-h-[136px] px-6 py-4 bg-white border border-dashed border-primary-7 rounded-md ease-in-out transition-colors duration-150 form-input',
                      isDragActive && 'border-blue-base shadow-borderGlow',
                      disabled
                        ? 'cursor-not-allowed border-text-stroke bg-[#F9FAFB]'
                        : 'cursor-pointer hover:border-blue-base hover:shadow-borderGlow',
                      fileRejections?.length > 0 && 'error',
                      status,
                      className,
                    ),
                  })}
                >
                  <input {...getInputProps()} />
                  <UploadContent />
                </div>
              </HoverCardTrigger>
              {files instanceof Array && files?.length > 0 && (
                <HoverCardContent className='bg-greyscale-0 mt-2 w-[500px] border-none p-0'>
                  <ScrollArea className='border-greyscale-5 h-[175px] w-full rounded-2xl border p-1'>
                    <div className='p-2'>
                      <UploadItems />
                    </div>
                  </ScrollArea>
                </HoverCardContent>
              )}
            </HoverCard>
          )}
        </div>
        <FormMessage>{message}</FormMessage>
        {children}
      </div>
    </UploadContext.Provider>
  )
}

const UploadItem = ({
  filename,
  href,
  type,
  status,
  progress = 0,
  size,
  disabled = false,
  onCancel,
}: UploadItemProps) => {
  const currentProgress = status === 'finished' ? 100 : progress

  return (
    <div className='border-greyscale-4 flex w-full items-start gap-3 rounded-xl border p-4'>
      <Icons.File className='mt-1 h-4 w-4' />
      <div className='flex flex-1 flex-col items-center justify-center gap-1'>
        <div className='relative flex w-full flex-col items-start gap-1'>
          <div className='flex w-full justify-between gap-2'>
            <DownloadLink href={href ?? '#'} name={filename ?? 'Unknown File'} />
            <button
              className='h-5 w-5 cursor-pointer'
              type='button'
              onClick={onCancel}
              disabled={disabled || status === 'uploading'}
            >
              <Icons.Trash className='text-red-base h-4 w-4' />
            </button>
          </div>
          {size && <div className='plabs-caption-regular-14 text-greyscale-6'>{size}</div>}
        </div>
        <div className={cn('flex w-full items-center gap-3', !size && 'mt-2')}>
          <div className='bg-greyscale-4 relative h-2 w-full flex-1 rounded-md'>
            <div
              style={{
                width: `${currentProgress}%`,
              }}
              className={`bg-blue-base absolute h-full rounded-md transition-all ease-in`}
            ></div>
          </div>
          <div className='plabs-caption-medium-sm text-greyscale-6'>{currentProgress}%</div>
        </div>
      </div>
    </div>
  )
}

const SingleItem = () => {
  const { files, placeholder, maxFiles, maxSize, disabled, onCancel } = useUpload()

  if (((files instanceof File && !!files) || (files instanceof Array && files?.length > 0)) && maxFiles === 1) {
    let file = Array.isArray(files) ? files[0] : files

    let href = file instanceof File ? URL.createObjectURL(file) : file?.url

    const type = file?.type?.includes('image') ? 'image' : fileExtensionReader(file?.name ?? '')
    //@ts-ignore
    const size = file?.size ? numberToBytes(file?.size) : ''
    //@ts-ignore
    const status =
      file instanceof File ? 'finished' : file?.progress === 100 ? 'finished' : !!file ? 'finished' : 'uploading'
    const progress = file instanceof File ? 100 : file?.progress

    if (type === 'image') {
      return (
        <div className='relative h-full w-full overflow-hidden rounded-lg border py-4'>
          <Image
            className='max-h-[200px] w-full object-contain'
            src={href}
            width={200}
            height={200}
            sizes='100vw'
            alt='image'
          />
          {!disabled && (
            <div className='absolute top-3 right-3 z-20'>
              <button
                onClick={() => onCancel && onCancel(0)}
                disabled={disabled}
                className='bg-greyscale-8 absolute top-0 right-0 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full'
              >
                <Icons.X className='text-greyscale-0 h-3 w-3' />
              </button>
            </div>
          )}
        </div>
      )
    }

    return (
      <UploadItem
        filename={file?.name}
        status={status}
        href={href}
        type={type}
        size={size}
        progress={progress}
        onCancel={() => onCancel && onCancel(0)}
        disabled={disabled}
      />
    )
  } else {
    return <></>
  }
}

const UploadItems = () => {
  const { files, maxFiles, fileRejections, disabled, onCancel } = useUpload()

  return (
    <>
      {((files?.length > 0 && maxFiles !== 1) || (fileRejections && fileRejections?.length > 0)) && (
        <ul className='flex w-full flex-col gap-2'>
          {maxFiles !== 1 &&
            files?.map((file: any, index: number) => {
              let href = file instanceof File ? URL.createObjectURL(file) : file?.url

              const finished = file?.progress === 100 || !file?.progress
              const size = file?.size ? numberToBytes(file?.size) : ''

              return (
                <UploadItem
                  key={index}
                  filename={file.name}
                  href={href}
                  type={file}
                  size={size}
                  status={finished ? 'finished' : 'uploading'}
                  progress={file?.progress}
                  onCancel={() => onCancel && onCancel(index)}
                  disabled={disabled}
                />
              )
            })}
          {fileRejections && fileRejections?.length > 0 && (
            <div className='flex max-h-28 flex-col gap-1 overflow-auto'>
              {fileRejections?.map((rejection: any, index: number) => {
                const { errors, file } = rejection
                const message = file.name + ' - ' + errors?.map((error: any) => error.message).join(', ')

                return <FormMessage key={index}>{message}</FormMessage>
              })}
            </div>
          )}
        </ul>
      )}
    </>
  )
}

const UploadContent = () => {
  const { files, placeholder, maxFiles, maxSize, disabled, onCancel } = useUpload()

  if (((files instanceof File && !!files) || (files instanceof Array && files?.length > 0)) && maxFiles === 1) {
    let file = Array.isArray(files) ? files[0] : files

    let href = file instanceof File ? URL.createObjectURL(file) : file?.url

    const type = fileExtensionReader(file?.name ?? '')

    if (type === 'image') {
      return (
        <div className='relative flex h-full w-full items-center justify-center'>
          <Image
            src={href}
            alt={file?.name ?? ''}
            width={0}
            height={0}
            className='h-full max-h-60 w-auto object-contain'
          />
          <button
            onClick={() => onCancel && onCancel(0)}
            disabled={disabled}
            className='bg-greyscale-8 absolute top-0 right-0 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full'
          >
            <Icons.X className='text-greyscale-0 h-3 w-3' />
          </button>
        </div>
      )
    }

    return (
      <div className='plabs-caption-regular-14 mx-auto flex max-w-[190px] flex-col items-center justify-center gap-1 text-center'>
        <div className='relative max-w-min'>
          <UploadIcon type={type} />
          <button
            onClick={() => onCancel && onCancel(0)}
            disabled={disabled}
            className='bg-greyscale-8 absolute top-0 right-0 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full'
          >
            <Icons.X className='text-greyscale-0 h-3 w-3' />
          </button>
        </div>
        <DownloadLink href={href ?? '#'} name={file?.name ?? 'filename'} />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'plabs-caption-regular-sm text-text-grey mx-auto flex flex-col items-center justify-center gap-3 text-center',
      )}
    >
      <div
        className='border-primary-7 flex h-10 w-10 items-center justify-center rounded-lg border bg-white'
        style={{
          boxShadow: '0px 1px 2px 0px #1018280D',
        }}
      >
        <Icons.CloudUpload className='text-primary-7' />
      </div>
      <div className='flex flex-col items-center justify-center gap-0'>
        {placeholder ? (
          <span className='plabs-title-medium-14'>{placeholder}</span>
        ) : (
          <span className='plabs-title-medium-14'>
            <span className='text-primary-7'>Click to upload</span> or drag & drop
          </span>
        )}
        <span className='plabs-body-medium-14'>{`Maximum file size ${numberToBytes(maxSize, 0)}`}</span>
      </div>
    </div>
  )
}

const UploadIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'pdf':
      return <Icons.CloudUpload className='text-blue-base h-10 w-10' />
    case 'excel':
      return <Icons.CloudUpload className='text-blue-base h-10 w-10' />
    case 'word':
      return <Icons.CloudUpload className='text-blue-base h-10 w-10' />
    default:
      return <Icons.CloudUpload className='text-blue-base h-10 w-10' />
  }
}

const UploadField = ({ name, control, defaultValue, message, status, required, label, ...rest }: UploadFieldProps) => {
  return (
    <div className={cn('flex h-full w-full flex-col gap-1.5')}>
      <FormLabel>{label}</FormLabel>
      <Upload {...rest} />
    </div>
  )
}

export default UploadField
