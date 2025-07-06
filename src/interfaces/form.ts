import { InputProps } from '@/components/ui/form/input'

export interface UploadProps {
  className?: string
  placeholder?: any
  maxFiles?: number
  maxSize?: number
  disabled?: boolean
  children?: any
  values?: any
  onChange?: (values: any) => void
  keyPairs?: {
    name?: string
    url?: string
  }
  status?: 'error' | 'warning' | 'success'
  message?: string
  isServerSide?: boolean
}

export interface UploadFieldProps extends UploadProps {
  label?: string
  required?: boolean
  defaultValue?: string
  className?: string
  name: string
  control?: any
  onChange?: (values: any) => void
  uploadClassName?: string
}

export interface TextEditorProps extends InputProps {
  name?: string
  value?: any
  width?: number | string
  height?: number | string
  onChange?: (value: any) => void
}

export interface FormProps<T> {
  onSave: (data: T) => void
  isSubmitting?: boolean
  isLoading?: boolean
  initialValues?: T
  disabled?: boolean
}
