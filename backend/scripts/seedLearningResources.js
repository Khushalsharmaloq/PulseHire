import dotenv from "dotenv";

import connectDB from "../config/db.js";

import {
    LearningResource
} from "../models/learningResource.model.js";


dotenv.config();


const learningResources = [
    {
        skill: "React",
        title: "React Learn",
        description:
            "Learn modern React concepts including components, state, effects and application patterns.",
        resourceType: "documentation",
        difficulty: "intermediate",
        durationMinutes: 180,
        url: "https://react.dev/learn",
        provider: "React"
    },

    {
        skill: "TypeScript",
        title: "TypeScript Handbook",
        description:
            "Learn TypeScript types, interfaces, functions, generics and practical application patterns.",
        resourceType: "documentation",
        difficulty: "intermediate",
        durationMinutes: 150,
        url: "https://www.typescriptlang.org/docs/handbook/",
        provider: "TypeScript"
    },

    {
        skill: "Docker",
        title: "Docker Get Started",
        description:
            "Learn containers, images and the basic Docker workflow.",
        resourceType: "tutorial",
        difficulty: "intermediate",
        durationMinutes: 170,
        url: "https://docs.docker.com/get-started/",
        provider: "Docker"
    },

    {
        skill: "Node.js",
        title: "Node.js Learn",
        description:
            "Understand Node.js fundamentals and server-side JavaScript development.",
        resourceType: "documentation",
        difficulty: "intermediate",
        durationMinutes: 190,
        url: "https://nodejs.org/en/learn",
        provider: "Node.js"
    },

    {
        skill: "MongoDB",
        title: "MongoDB Manual",
        description:
            "Learn MongoDB documents, queries, indexes and database fundamentals.",
        resourceType: "documentation",
        difficulty: "intermediate",
        durationMinutes: 180,
        url: "https://www.mongodb.com/docs/manual/",
        provider: "MongoDB"
    },

    {
        skill: "Git",
        title: "Git Documentation",
        description:
            "Learn Git commits, branches, merging and collaborative version control.",
        resourceType: "documentation",
        difficulty: "beginner",
        durationMinutes: 140,
        url: "https://git-scm.com/doc",
        provider: "Git"
    }
];


const seedLearningResources = async () => {
    try {

        await connectDB();


        for (
            const resource
            of learningResources
        ) {

            await LearningResource.findOneAndUpdate(
                {
                    skill:
                        resource.skill,

                    title:
                        resource.title
                },
                {
                    $set:
                        resource
                },
                {
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert:
                        true
                }
            );
        }


        console.log(
            "Learning resources seeded successfully."
        );


        process.exit(0);

    } catch (error) {

        console.error(
            "Learning resource seed error:",
            error
        );


        process.exit(1);
    }
};


seedLearningResources();