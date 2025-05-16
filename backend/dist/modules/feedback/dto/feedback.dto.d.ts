export declare enum FeedbackType {
    APPROVAL = "\u627F\u8A8D",
    REJECTION = "\u8FD4\u623B",
    SUGGESTION = "\u63D0\u6848",
    OTHER = "\u305D\u306E\u4ED6"
}
export declare enum FeedbackStatus {
    PENDING = "\u51E6\u7406\u5F85\u3061",
    PROCESSED = "\u51E6\u7406\u6E08\u307F",
    ARCHIVED = "\u30A2\u30FC\u30AB\u30A4\u30D6\u6E08\u307F"
}
export declare class CreateFeedbackDto {
    receiptId: string;
    type: FeedbackType;
    content: string;
    additionalNotes?: string;
}
export declare class ReportResultDto {
    feedbackId: string;
    status: FeedbackStatus;
    processingResult: string;
    processedAt: Date;
}
export declare class SearchFeedbackDto {
    type?: FeedbackType;
    status?: FeedbackStatus;
    startDate?: Date;
    endDate?: Date;
    keyword?: string;
    receiptId?: string;
}
