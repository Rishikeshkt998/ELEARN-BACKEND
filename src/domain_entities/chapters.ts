interface Lesson {
    _id?: string;
    title: string;
    url: string;
    createdAt?: Date;
}

interface Chapter {
    chapters: Array<{
        title: string;
        description: string;
        lessons: Lesson[];
        order: number;
        createdAt?: Date;
        updatedAt?: Date;
    }>;
}

export default Chapter;