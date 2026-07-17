import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConversationSummary } from "./page";

type ConversationCardProps = {
    conversation: ConversationSummary;
    onClick: () => void
}


const ConversationCard = ({ conversation, onClick } : ConversationCardProps) => {

    return (
    <Card
    onClick={onClick}
    className="group cursor-pointer rounded-xl border bg-card shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
>
    <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
            <div>
                <CardTitle className="flex items-center gap-2 text-base">
                    Anonymous Conversation  

                    {conversation.recipientHasUnread && (
                        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                    )}
                </CardTitle>

                <CardDescription className="mt-1">
                    Last activity{" "}
                    {new Date(conversation.lastActivityAt).toLocaleString()}
                </CardDescription>
            </div>

            <Badge
                variant={
                    conversation.status === "open"
                        ? "default"
                        : "secondary"
                }
            >
                {conversation.status}
            </Badge>
        </div>
    </CardHeader>

    <CardContent>
        <div className="rounded-lg bg-muted p-4 transition-colors duration-200 group-hover:bg-muted/80">
            <p className="line-clamp-2 text-sm leading-relaxed">
                {conversation.lastMessage.content}
            </p>
        </div>
    </CardContent>
</Card>
);
};

export default ConversationCard;
