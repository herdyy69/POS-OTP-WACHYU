import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/dialog/alert-dialog'

export const DeleteConfirmation = ({
  trigger,
  title,
  description,
  confirmText = 'Hapus',
  cancelText = 'Batalkan',
  onConfirm,
  onCancel,
}: {
  trigger: React.ReactNode
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel?: () => void
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger className='w-full' asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent className='bg-greyscale-0'>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='btn-outline-greyscale' onClick={onCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction className='btn-red' onClick={onConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
