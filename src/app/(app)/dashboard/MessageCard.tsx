import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Message } from "@/model/User";
import {toast} from 'sonner'
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse"; 

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete } : MessageCardProps) => {
    
    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
            toast("Message has been deleted");
            onMessageDelete(String(message._id));
        } catch (error) {
            toast.error("Failed to delete message")
        }
    }

    return (
    <Card className="group relative rounded-xl border bg-card shadow-sm transition hover:shadow-md">
        <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
                <div>
                    <CardTitle className="text-base">
                        Anonymous Message
                    </CardTitle>
                    <CardDescription className="mt-1">
                        Sent at {new Date(message.createdAt).toLocaleString()}
                    </CardDescription>
                </div>

                <AlertDialog>
                    <AlertDialogTrigger
                        render={
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        }
                    />

                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Delete this message?
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                                This action cannot be undone. This message will be
                                permanently removed.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogCancel>
                                Cancel
                            </AlertDialogCancel>

                            <AlertDialogAction onClick={handleDeleteConfirm}>
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </CardHeader>

        <CardContent>
            <div className="rounded-lg bg-muted p-4">
                <p className="text-sm leading-relaxed">
                    {message.content}
                </p>
            </div>
        </CardContent>
    </Card>
);
};

export default MessageCard;
