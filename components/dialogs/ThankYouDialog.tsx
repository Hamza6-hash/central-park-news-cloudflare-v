import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import Image from 'next/image';
import emailIcon from '../../assets/mail.png'

interface ThankYouDialogProps {
    openDialog: boolean;
    setOpenDialog: any;
}


const ThankYouDialog = ({ openDialog, setOpenDialog }: ThankYouDialogProps) => {

    return (
        <Dialog onOpenChange={setOpenDialog} open={openDialog}>
            <DialogTrigger asChild />
            <DialogContent className={`rounded-md flex flex-col gap-4 bg-white items-center justify-center p-10 shadow-md hide-cross-dialog`}>
                <div className='w-28 h-28 relative bg-[#1BC0001A] flex items-center justify-center rounded-full'>
                    <Image
                        src={emailIcon}
                        alt="new image"
                        height={75}
                        width={75}
                        quality={100}
                        style={{ objectFit: "cover" }}
                    />
                </div>
                <p className='text-primary-900 text-sm text-center'>Thank you for contacting us! We have received your message and will get back to you as soon as possible.</p>
            </DialogContent>
        </Dialog>
    )
}

export default ThankYouDialog;