'use client'

import { createContext, useContext, useMemo } from 'react'
import { SubmitErrorHandler, SubmitHandler, UseFormReturn } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form as FormPrimitive,
} from '@/components/ui/form/form'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { RadioGroupProps } from '@radix-ui/react-radio-group'
import { CheckboxProps } from '@radix-ui/react-checkbox'
import { SelectProps } from '@radix-ui/react-select'

import { Option } from '@/interfaces/shared'

import { Input, InputNumber, InputPassword, InputProps } from './input'
import { Button } from '../button/button'
import { Icons } from '../icons'
import { Switch } from './switch'
import { Textarea, TextareaProps } from './textarea'
import { RadioGroup, RadioGroupItem } from './radio-group'
import { Checkbox } from './checkbox'
import { Calendar, CalendarProps } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../popover/popover'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './select'
import Combobox from './combobox'
import Loader from '../loader'
import { Upload } from './upload'
import { Accept } from 'react-dropzone'
import { TextEditorProps, UploadFieldProps } from '@/interfaces/form'
import TextEditor from './textEditor'

interface IForm {
  children: any
  form: UseFormReturn<any>
  disabled?: boolean
  isLoading?: boolean
}

interface FormProps extends IForm {
  onSave: SubmitHandler<any>
  onError?: SubmitErrorHandler<any>
}

const FormContext = createContext<any>({})

const useForm = () => {
  const context = useContext<IForm>(FormContext)
  if (!context) {
    throw new Error('Form compound components must be rendered within the Form component')
  }
  return context
}

const Form = ({
  id,
  form,
  className,
  children,
  disabled,
  isLoading,
  onSave,
  onError = (err: any) => console.log(err),
}: React.FormHTMLAttributes<HTMLFormElement> & FormProps) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.stopPropagation()
    form.handleSubmit(onSave, onError)(event)
  }

  const value = useMemo(
    () => ({
      form,
      children,
      disabled,
      isLoading,
    }),
    [form, children, disabled, isLoading],
  )

  return (
    <FormContext.Provider value={value}>
      <FormPrimitive {...form}>
        <form id={id} className={cn('flex flex-col gap-3', className)} onSubmit={handleSubmit}>
          {children}
        </form>
      </FormPrimitive>
    </FormContext.Provider>
  )
}

const InputField = ({
  name,
  label,
  placeholder,
  type = 'text',
  className,
  disabled: isDisabled,
  ...rest
}: InputProps & { label?: string; name: string; disabled?: boolean }) => {
  const { form, disabled, isLoading } = useForm()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            {isLoading ? (
              <Loader.Skeleton className='h-10 w-full' />
            ) : (
              <Input placeholder={placeholder} {...field} type={type} disabled={disabled || isDisabled} {...rest} />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const InputPasswordField = ({
  name,
  label,
  placeholder,
  type = 'text',
  className,
  disabled: isDisabled,
  ...rest
}: InputProps & { label?: string; name: string; disabled?: boolean }) => {
  const { form, disabled, isLoading } = useForm()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            {isLoading ? (
              <Loader.Skeleton className='h-10 w-full' />
            ) : (
              <InputPassword
                placeholder={placeholder}
                {...field}
                type={type}
                disabled={disabled || isDisabled}
                {...rest}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const InputNumberField = ({
  name,
  label,
  placeholder,
  className,
  disabled: isDisabled,
  ...rest
}: InputProps & { label?: string; name: string; disabled?: boolean }) => {
  const { form, disabled, isLoading } = useForm()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            {isLoading ? (
              <Loader.Skeleton className='h-10 w-full' />
            ) : (
              <InputNumber placeholder={placeholder} {...field} disabled={disabled || isDisabled} {...rest} />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const SwitchField = ({
  name,
  label,
  className,
  disabled: isDisabled,
}: {
  label?: string
  name: string
  className?: string
  disabled?: boolean
}) => {
  const { form, disabled } = useForm()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Switch disabled={disabled || isDisabled} checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const TextareaField = ({
  name,
  label,
  placeholder,
  className,
  disabled: isDisabled,
  ...rest
}: TextareaProps & { label?: string; name: string; disabled?: boolean }) => {
  const { form, disabled, isLoading } = useForm()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            {isLoading ? (
              <Loader.Skeleton className='h-20 w-full' />
            ) : (
              <Textarea placeholder={placeholder} {...field} disabled={disabled || isDisabled} {...rest} />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const RadioField = ({
  name,
  label,
  className,
  inputClassName,
  options,
  isOptionsLoading = false,
  disabled: isDisabled,
  ...rest
}: RadioGroupProps & {
  label?: string
  name: string
  inputClassName?: string
  options: Option[]
  isOptionsLoading?: boolean
  disabled?: boolean
}) => {
  const { form, disabled, isLoading } = useForm()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            {isLoading || isOptionsLoading ? (
              <Loader.Skeleton className='h-10 w-full' />
            ) : (
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className={cn('flex items-start gap-4', inputClassName)}
                disabled={disabled || isOptionsLoading || isDisabled}
                {...rest}
              >
                {options.map((option) => (
                  <FormItem key={option.value} className='flex flex-row items-center gap-2'>
                    <FormControl>
                      <RadioGroupItem value={option.value} />
                    </FormControl>
                    <FormLabel className='!plabs-caption-regular-14'>{option.label}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const CheckboxField = ({
  name,
  label,
  className,
  inputClassName,
  containerClassName,
  options,
  isOptionsLoading = false,
  disabled: isDisabled,
}: CheckboxProps & {
  label?: string
  name: string
  containerClassName?: string
  inputClassName?: string
  options: Option[]
  isOptionsLoading?: boolean
  disabled?: boolean
}) => {
  const { form, disabled, isLoading } = useForm()

  return (
    <FormField
      control={form.control}
      name={name}
      render={(_) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormItem className={containerClassName}>
            {isLoading || isOptionsLoading ? (
              <Loader.Skeleton className='h-10 w-full' />
            ) : (
              options.map((item) => (
                <FormField
                  key={item.value}
                  control={form.control}
                  name={name}
                  render={({ field }) => {
                    const values = field.value ?? []

                    return (
                      <FormItem className={cn('flex flex-row items-center gap-2', inputClassName)}>
                        <FormControl>
                          <Checkbox
                            checked={values?.includes(item.value)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...values, item.value])
                                : field.onChange(values?.filter((value: any) => value !== item.value))
                            }}
                            disabled={disabled || isOptionsLoading || isDisabled}
                          />
                        </FormControl>
                        <FormLabel className='!plabs-caption-regular-14'>{item.label}</FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))
            )}
          </FormItem>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const CalendarField = ({
  name,
  label,
  placeholder,
  className,
  mode = 'single' as 'single' | 'range',
  disabled: isDisabled,
  disabledDate,
  ...rest
}: CalendarProps & {
  label?: string
  name: string
  placeholder?: string
  mode?: 'single' | 'range'
  disabled?: boolean
  disabledDate?: boolean | any
}) => {
  const { form, disabled, isLoading } = useForm()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          {isLoading ? (
            <Loader.Skeleton className='h-10 w-full' />
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <button
                    className={cn(
                      'form-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:border-[#F2F2F2] disabled:bg-[#F8F9FB] disabled:text-[#C7C7C8]',
                      !field.value && 'text-muted-foreground',
                      fieldState?.error && 'error',
                    )}
                    disabled={disabled || isDisabled}
                  >
                    {mode === 'single' ? (
                      field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>{placeholder}</span>
                      )
                    ) : field.value ? (
                      <span>
                        {field.value?.from ? format(field.value.from, 'PPP') : ''} -{' '}
                        {field.value.to ? format(field.value.to, 'PPP') : ''}
                      </span>
                    ) : (
                      <span>{placeholder}</span>
                    )}
                    <Icons.Calendar className={cn('h-4 w-4')} />
                  </button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className='bg-greyscale-0 w-auto p-0' align='start'>
                <Calendar
                  mode={mode as any}
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={disabledDate}
                  {...(rest as any)}
                />
              </PopoverContent>
            </Popover>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const SelectField = ({
  name,
  label,
  placeholder,
  className,
  options,
  isOptionsLoading = false,
  disabled: isDisabled,

  ...rest
}: SelectProps & {
  label?: string
  name: string
  placeholder?: string
  className?: string
  options: Option[]
  isOptionsLoading?: boolean
  disabled?: boolean
}) => {
  const { form, disabled, isLoading } = useForm()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            {isLoading ? (
              <Loader.Skeleton className='h-10 w-full' />
            ) : (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={disabled || isOptionsLoading || isDisabled}
                {...rest}
              >
                <SelectTrigger className={fieldState?.error && 'error'}>
                  <SelectValue placeholder={placeholder ?? 'Select an option'} />
                </SelectTrigger>
                <SelectContent className='bg-greyscale-0 border-greyscale-4'>
                  <SelectGroup>
                    {options.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                        className={cn('!plabs-caption-regular-14')}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const ComboboxField = ({
  name,
  label,
  placeholder,
  searchPlaceholder,
  className,
  options,
  isOptionsLoading = false,
  multiple,
  createable,
  disabled: isDisabled,
}: {
  name: string
  label?: string
  className?: string
  placeholder?: string
  searchPlaceholder?: string
  options: Option[]
  isOptionsLoading?: boolean
  multiple?: boolean
  createable?: boolean
  disabled?: boolean
}) => {
  const { form, disabled, isLoading } = useForm()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          {isLoading ? (
            <Loader.Skeleton className='h-10 w-full' />
          ) : (
            <Combobox
              options={options}
              value={field.value}
              onChange={field.onChange}
              placeholder={placeholder ?? 'Select an option'}
              searchPlaceholder={searchPlaceholder}
              error={!!fieldState?.error}
              disabled={disabled || isDisabled}
              multiple={multiple}
              createable={createable}
              isOptionsLoading={isOptionsLoading}
            />
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const UploadField = ({
  label,
  required,
  className,
  status,
  message,
  name,
  uploadClassName,
  disabled: isDisabled,
  ...rest
}: UploadFieldProps & { accept?: Accept; disabled?: boolean }) => {
  const { form, disabled, isLoading } = useForm()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            {isLoading ? (
              <Loader.Skeleton className='h-[136px] w-full' />
            ) : (
              <Upload
                className={cn('max-h-[136px]', [uploadClassName, !!fieldState?.error && 'error'])}
                values={field.value}
                onChange={field.onChange}
                disabled={disabled || isDisabled}
                {...rest}
              />
            )}
          </FormControl>
        </FormItem>
      )}
    />
  )
}

const TextEditorField = ({
  label,
  required,
  className,
  name,
  disabled: isDisabled,

  ...rest
}: TextEditorProps & { label?: string; name: string; disabled?: boolean }) => {
  const { form, disabled, isLoading } = useForm()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            {isLoading ? (
              <Loader.Skeleton className='h-[136px] w-full' />
            ) : (
              <TextEditor
                className={cn('', [!!fieldState?.error && 'border-red-base'])}
                value={field.value}
                onChange={field.onChange}
                disabled={disabled || isDisabled}
                {...rest}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const FormButton = ({
  className,
  children,
  disabled: isDisabled,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { disabled?: boolean }) => {
  const { disabled, isLoading } = useForm()

  return (
    <Button disabled={isLoading || disabled || isDisabled} className={className} {...rest}>
      {isLoading ? (
        <div className='flex items-center gap-2'>
          <Icons.LoaderCircle className='h-5 w-5 animate-spin' />
          <div>Loading...</div>
        </div>
      ) : (
        children
      )}
    </Button>
  )
}

Form.Input = InputField
Form.Password = InputPasswordField
Form.Number = InputNumberField
Form.Switch = SwitchField
Form.Textarea = TextareaField
Form.Radio = RadioField
Form.Checkbox = CheckboxField
Form.Calendar = CalendarField
Form.Select = SelectField
Form.Combobox = ComboboxField
Form.Upload = UploadField
Form.TextEditor = TextEditorField
Form.Button = FormButton

export default Form
