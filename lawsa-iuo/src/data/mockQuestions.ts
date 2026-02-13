export interface Question {
    id: string;
    text: string;
    scenario?: string;
    options: string[];
    correctAnswer: number; // Index of correct option
    explanation: string;
}

export const mockQuestions: Question[] = [
    {
        id: "1",
        scenario: "Chidi, a 100L Law student, was found with a stolen laptop in his hostel. He claims he bought it from a stranger at the park for ₦5,000, even though the laptop is worth ₦500,000.",
        text: "Under the Nigerian Criminal Code, what is the most likely charge Chidi will face if he cannot prove ownership?",
        options: [
            "Armed Robbery",
            "Receiving Stolen Property",
            "Burglary",
            "Conversion"
        ],
        correctAnswer: 1,
        explanation: "Receiving stolen property is a felony under Section 427 of the Criminal Code if the receiver knows or has reason to believe the property was stolen. The gross undervalue (₦5k for ₦500k) is strong evidence of 'reason to believe'."
    },
    {
        id: "2",
        text: "What is the supreme law of the Federal Republic of Nigeria?",
        options: [
            "The Nigerian Criminal Code",
            "The LFN 2004",
            "The 1999 Constitution (as amended)",
            "The Supreme Court Act"
        ],
        correctAnswer: 2,
        explanation: "Section 1(1) of the 1999 Constitution states it is supreme and its provisions shall have binding force on all authorities and persons throughout the Federal Republic of Nigeria."
    },
    {
        id: "3",
        text: "According to the principle of 'Rule of Law' as propounded by A.V. Dicey, which of the following is NOT one of its major pillars?",
        options: [
            "Supremacy of the regular law",
            "Equality before the law",
            "The Constitution is a result of the ordinary law of the land",
            "Parliamentary Sovereignty"
        ],
        correctAnswer: 3,
        explanation: "While Parliamentary Sovereignty is a key concept in UK constitutional law, it is distinct from and often in tension with the three pillars of the Rule of Law defined by Dicey."
    }
];
