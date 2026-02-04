'use client'

import { useRef, useTransition } from 'react'
import { Loader2Icon, UploadIcon } from 'lucide-react'
import { uploadFile } from '@/actions/upload-action'

interface UploadButtonProps {
    onUploadComplete?: (file: File) => void
}

export function UploadButton({ onUploadComplete }: UploadButtonProps) {
    const [isPending, startTransition] = useTransition()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        startTransition(async () => {
            const formData = new FormData()
            formData.append('file', file)

            const result = await uploadFile(formData)

            if (result.success) {
                onUploadComplete?.(file)
            } else {
                console.error('Upload failed:', result.message)
                // Ideally display toast here
                alert(result.message || 'Upload failed')
            }

            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        })
    }

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.xlsx"
            />
            <button
                onClick={handleUploadClick}
                disabled={isPending}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
                {isPending ? (
                    <>
                        <Loader2Icon className="h-4 w-4 animate-spin" />
                        <span>Processing...</span>
                    </>
                ) : (
                    <>
                        <UploadIcon className="h-4 w-4" />
                        <span>+ Upload File</span>
                    </>
                )}
            </button>
        </>
    )
}
