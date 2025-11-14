import * as React from "react"
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
} from "./ui/alert-dialog"
import { Button } from "./ui/button"

type ConfirmDialogProps = {
  /** The title of the dialog */
  title: string
  /** The description text */
  description: string
  /** The text for the confirm button */
  confirmText?: string
  /** The text for the cancel button */
  cancelText?: string
  /** Callback when the confirm button is clicked */
  onConfirm: () => void
  /** The trigger element. If a string is provided, it will be rendered as a Button */
  children: React.ReactNode
  /** Variant of the confirm button */
  /** Variant of the cancel button */
  /** Size of the buttons */
  /** Additional class names */
  className?: string
  /** Whether to show the dialog when the component mounts */
  open?: boolean
  /** Callback when the open state changes */
  onOpenChange?: (open: boolean) => void
}

export function ConfirmDialog({
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  children,
  className,
  open,
  onOpenChange,
}: ConfirmDialogProps) {
  const [isOpen, setIsOpen] = React.useState(open)

  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen)
    } else {
      setIsOpen(newOpen)
    }
  }

  const handleConfirm = () => {
    onConfirm()
    handleOpenChange(false)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        {typeof children === "string" ? (
          <Button variant="outline" className={className}>
            {children}
          </Button>
        ) : React.isValidElement(children) ? (
          <div
            onClick={(e: React.MouseEvent) => {
              // Call the original onClick if it exists
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const originalOnClick = (children as any).props?.onClick;
              if (typeof originalOnClick === 'function') {
                originalOnClick(e);
              }
              if (!e.isDefaultPrevented()) {
                handleOpenChange(true);
              }
            }}
          >
            {children}
          </div>
        ) : (
          children
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ConfirmDialog
