import React, { useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import Image from 'next/image';
import emailIcon from '../../assets/mail.png'

interface ThankYouDialogProps {
    openDialog: boolean;
    setOpenDialog: (open: boolean) => void;
    type: "success" | "cooldown";
    cooldownRemaining: number;
}

const ThankYouDialog = ({ openDialog, setOpenDialog, type, cooldownRemaining }: ThankYouDialogProps) => {
    useEffect(() => {
        if (openDialog) {
            const timer = setTimeout(() => {
                setOpenDialog(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [openDialog, type, setOpenDialog]);

    const handleOpenChange = (open: boolean) => {
        setOpenDialog(open);
    };

    const formatCooldown = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    if (type === "success") {
        return (
            <Dialog onOpenChange={handleOpenChange} open={openDialog}>
                <DialogTrigger asChild />
                <DialogContent className={`rounded-md flex flex-col gap-6 bg-white items-center justify-center p-10 shadow-md hide-cross-dialog max-w-sm`}>
                    <div className='w-28 h-28 relative bg-[#1BC0001A] flex items-center justify-center rounded-full'>
                        <Image
                            src={emailIcon}
                            alt="email icon"
                            height={75}
                            width={75}
                            quality={100}
                            style={{ objectFit: "cover" }}
                        />
                    </div>

                    <div className='flex flex-col gap-3 items-center justify-center'>
                        <h2 className='text-lg font-bold text-[#2B4864]'>Thank You!</h2>
                        <p className='text-[#333333] text-sm text-center leading-relaxed'>
                            Thank you for contacting us! We have received your message and will get back to you as soon as possible.
                        </p>
                    </div>

                    <button
                        onClick={() => setOpenDialog(false)}
                        className='w-full bg-[#303130] hover:bg-[#1a1a1a] text-white py-2 px-4 rounded-md transition-all duration-300 text-sm font-medium'
                    >
                        Close
                    </button>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog onOpenChange={handleOpenChange} open={openDialog}>
            <DialogTrigger asChild />
            <DialogContent className={`rounded-md flex flex-col gap-6 bg-white items-center justify-center p-10 shadow-md hide-cross-dialog max-w-sm`}>
                <div className='w-28 h-28 relative bg-[#FFA50026] flex items-center justify-center rounded-full'>
                    <svg className='w-16 h-16 text-[#FF6B35]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                </div>

                <div className='flex flex-col gap-3 items-center justify-center'>
                    <h2 className='text-lg font-bold text-[#2B4864]'>Please Wait</h2>
                    <p className='text-[#333333] text-sm text-center leading-relaxed'>
                        You've already submitted recently. Please wait before submitting again.
                    </p>
                </div>

                <div className='bg-yellow-50 border border-yellow-200 rounded-md p-3 w-full text-center'>
                    <p className='text-yellow-800 text-sm font-medium'>
                        Try again After 5 Minutes
                    </p>
                </div>

                <button
                    onClick={() => setOpenDialog(false)}
                    className='w-full bg-[#303130] hover:bg-[#1a1a1a] text-white py-2 px-4 rounded-md transition-all duration-300 text-sm font-medium'
                >
                    Close
                </button>
            </DialogContent>
        </Dialog>
    );
};

export default ThankYouDialog;