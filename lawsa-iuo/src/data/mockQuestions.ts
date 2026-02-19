export interface Question {
    id: string;
    text: string;
    scenario?: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    category?: string;
    difficulty?: "easy" | "medium" | "hard";
}

export const mockQuestions: Question[] = [
    // Criminal Law Questions
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
        explanation: "Receiving stolen property is a felony under Section 427 of the Criminal Code if the receiver knows or has reason to believe the property was stolen. The gross undervalue (₦5k for ₦500k) is strong evidence of 'reason to believe'.",
        category: "Criminal Law",
        difficulty: "medium"
    },
    {
        id: "2",
        text: "Which of the following is NOT an essential element of the offense of murder under Nigerian law?",
        options: [
            "Unlawful killing",
            "Of a human being",
            "With malice aforethought",
            "Premeditation for at least 24 hours"
        ],
        correctAnswer: 3,
        explanation: "Premeditation for a specific time period is not required. Malice aforethought can be formed instantaneously before the act. The essential elements are: (1) unlawful killing (2) of a human being (3) under the Queen's peace (4) with malice aforethought.",
        category: "Criminal Law",
        difficulty: "easy"
    },
    {
        id: "3",
        scenario: "Ada intentionally sets fire to her neighbor's house because she believes the neighbor is a witch who cast a spell on her family.",
        text: "What defense is Ada MOST likely to rely on?",
        options: [
            "Self-defense",
            "Insanity (M'Naghten Rules)",
            "Provocation",
            "Necessity"
        ],
        correctAnswer: 1,
        explanation: "Ada's delusional belief that her neighbor is a witch suggests a disease of the mind. Under the M'Naghten Rules, she may argue she did not know the nature/quality of her act or that it was wrong due to a defect of reason caused by disease of the mind.",
        category: "Criminal Law",
        difficulty: "hard"
    },
    {
        id: "4",
        text: "In Nigerian law, the doctrine of 'last seen' applies primarily to:",
        options: [
            "Theft cases",
            "Murder cases",
            "Contract disputes",
            "Land disputes"
        ],
        correctAnswer: 1,
        explanation: "The 'last seen' doctrine is a principle in criminal law, particularly homicide cases. It creates a presumption that the person last seen with the deceased before their death is responsible for that death if the deceased is later found dead.",
        category: "Criminal Law",
        difficulty: "medium"
    },
    // Constitutional Law Questions
    {
        id: "5",
        text: "What is the supreme law of the Federal Republic of Nigeria?",
        options: [
            "The Nigerian Criminal Code",
            "The LFN 2004",
            "The 1999 Constitution (as amended)",
            "The Supreme Court Act"
        ],
        correctAnswer: 2,
        explanation: "Section 1(1) of the 1999 Constitution states it is supreme and its provisions shall have binding force on all authorities and persons throughout the Federal Republic of Nigeria.",
        category: "Constitutional Law",
        difficulty: "easy"
    },
    {
        id: "6",
        text: "According to the principle of 'Rule of Law' as propounded by A.V. Dicey, which of the following is NOT one of its major pillars?",
        options: [
            "Supremacy of the regular law",
            "Equality before the law",
            "The Constitution is a result of the ordinary law of the land",
            "Parliamentary Sovereignty"
        ],
        correctAnswer: 3,
        explanation: "While Parliamentary Sovereignty is a key concept in UK constitutional law, it is distinct from and often in tension with the three pillars of the Rule of Law defined by Dicey.",
        category: "Constitutional Law",
        difficulty: "medium"
    },
    {
        id: "7",
        text: "Which section of the 1999 Constitution guarantees the right to fair hearing?",
        options: [
            "Section 33",
            "Section 36",
            "Section 39",
            "Section 42"
        ],
        correctAnswer: 1,
        explanation: "Section 36 of the 1999 Constitution guarantees the right to fair hearing. This includes the right to be heard within a reasonable time by an impartial court or tribunal.",
        category: "Constitutional Law",
        difficulty: "easy"
    },
    {
        id: "8",
        scenario: "The Nigerian National Assembly passes a law imposing restrictions on freedom of expression on social media.",
        text: "Under the Constitution, such a law would be:",
        options: [
            "Valid if passed by two-thirds majority",
            "Invalid as it violates Section 39",
            "Valid if reasonably justifiable in a democratic society",
            "Valid only during a state of emergency"
        ],
        correctAnswer: 2,
        explanation: "Section 39 guarantees freedom of expression. While Section 45 allows for restrictions, they must be 'reasonably justifiable in a democratic society.' A blanket restriction on social media expression would likely fail this test.",
        category: "Constitutional Law",
        difficulty: "hard"
    },
    // Contract Law Questions
    {
        id: "9",
        scenario: "Mr. Okafor offers to sell his car to Mrs. Adeleke for ₦2 million. Mrs. Adeleke responds: 'I accept your offer, but I can only pay ₦1.8 million.'",
        text: "What is the legal effect of Mrs. Adeleke's response?",
        options: [
            "It is a valid acceptance with a counter-offer",
            "It is a rejection and counter-offer",
            "It is a valid acceptance with a request for discount",
            "It creates a binding contract at ₦1.8 million"
        ],
        correctAnswer: 1,
        explanation: "Under the mirror image rule, acceptance must be absolute and unqualified. Mrs. Adeleke's response changes a material term (price), making it a rejection of the original offer and a counter-offer (Hyde v Wrench).",
        category: "Contract Law",
        difficulty: "medium"
    },
    {
        id: "10",
        text: "Which of the following is NOT essential for a valid contract?",
        options: [
            "Offer and Acceptance",
            "Consideration",
            "Written documentation",
            "Intention to create legal relations"
        ],
        correctAnswer: 2,
        explanation: "While some contracts must be in writing (e.g., land contracts under Statute of Frauds), most contracts can be oral. The essential elements are: offer, acceptance, consideration, intention to create legal relations, and capacity.",
        category: "Contract Law",
        difficulty: "easy"
    },
    {
        id: "11",
        scenario: "A 16-year-old student enters into a contract to buy textbooks worth ₦50,000 for his studies.",
        text: "This contract is:",
        options: [
            "Void ab initio",
            "Voidable at the option of the minor",
            "Valid as it is for necessaries",
            "Valid only if ratified after 18"
        ],
        correctAnswer: 2,
        explanation: "Under Nigerian law following English principles, contracts for necessaries (goods suitable to the minor's condition in life and actual requirements at the time) are binding on minors. Educational materials qualify as necessaries.",
        category: "Contract Law",
        difficulty: "medium"
    },
    {
        id: "12",
        text: "The doctrine of promissory estoppel was established in which landmark case?",
        options: [
            "Carlill v Carbolic Smoke Ball Co",
            "Central London Property Trust v High Trees House",
            "Donoghue v Stevenson",
            "Fisher v Bell"
        ],
        correctAnswer: 1,
        explanation: "Central London Property Trust v High Trees House [1947] established the modern doctrine of promissory estoppel, preventing a party from going back on a promise that the other party has relied upon.",
        category: "Contract Law",
        difficulty: "medium"
    },
    // Law of Torts
    {
        id: "13",
        text: "What is the 'neighbor principle' established in Donoghue v Stevenson?",
        options: [
            "You must love your neighbor as yourself",
            "You must take reasonable care to avoid acts or omissions you can reasonably foresee would be likely to injure your neighbor",
            "You must compensate neighbors for any harm caused",
            "Neighbors have a duty to report crimes to each other"
        ],
        correctAnswer: 1,
        explanation: "Lord Atkin's neighbor principle states: 'You must take reasonable care to avoid acts or omissions which you can reasonably foresee would be likely to injure your neighbor.' Persons closely and directly affected by the act are 'neighbors'.",
        category: "Law of Torts",
        difficulty: "easy"
    },
    {
        id: "14",
        scenario: "John publishes a false statement that David is a thief, causing David to lose his job.",
        text: "What tort has John committed?",
        options: [
            "Negligence",
            "Defamation (Slander)",
            "Defamation (Libel)",
            "Nuisance"
        ],
        correctAnswer: 2,
        explanation: "This is slander (spoken defamation). While slander is generally not actionable without proof of special damage, imputing a crime punishable by imprisonment is slander actionable per se (no damage need be proved).",
        category: "Law of Torts",
        difficulty: "medium"
    },
    {
        id: "15",
        text: "In the tort of negligence, the 'but for' test is used to establish:",
        options: [
            "Duty of care",
            "Breach of duty",
            "Causation",
            "Damages"
        ],
        correctAnswer: 2,
        explanation: "The 'but for' test (Barnett v Chelsea & Kensington Hospital) asks: 'But for the defendant's negligence, would the damage have occurred?' It establishes factual causation, the first stage of causation in negligence.",
        category: "Law of Torts",
        difficulty: "medium"
    },
    {
        id: "16",
        text: "The defense of 'volenti non fit injuria' means:",
        options: [
            "To a willing person, no injury is done",
            "The willing victim deserves compensation",
            "Consent is not a valid defense",
            "The defendant acted intentionally"
        ],
        correctAnswer: 0,
        explanation: "'Volenti non fit injuria' means 'to a willing person, no injury is done.' It is a complete defense where the plaintiff voluntarily assumes the risk of harm with full knowledge of the nature and extent of the risk.",
        category: "Law of Torts",
        difficulty: "easy"
    },
    // Evidence Law
    {
        id: "17",
        text: "Under the Evidence Act 2011, which of the following is NOT admissible as documentary evidence?",
        options: [
            "Original documents",
            "Certified true copies",
            "Photocopies",
            "Documents in electronic form"
        ],
        correctAnswer: 2,
        explanation: "The Evidence Act 2011 recognizes original documents, certified true copies, and electronic documents. However, ordinary photocopies without certification generally do not meet the authentication requirements unless admitted by consent or under specific exceptions.",
        category: "Evidence Law",
        difficulty: "hard"
    },
    {
        id: "18",
        scenario: "In a criminal trial, the defendant's wife is called to testify against him.",
        text: "Under Nigerian law, the wife:",
        options: [
            "Must testify as she has a duty to the court",
            "Can refuse to testify against her husband",
            "Can only testify with the husband's consent",
            "Must testify but her evidence has less weight"
        ],
        correctAnswer: 1,
        explanation: "Section 182 of the Evidence Act 2011 provides that a wife is a competent but not compellable witness for the prosecution against her husband. She can refuse to testify.",
        category: "Evidence Law",
        difficulty: "medium"
    },
    {
        id: "19",
        text: "The rule against hearsay evidence is primarily based on:",
        options: [
            "The risk of fabrication",
            "The inability to cross-examine the original maker",
            "The unreliability of oral testimony",
            "The need to reduce court time"
        ],
        correctAnswer: 1,
        explanation: "The fundamental objection to hearsay is that the declarant is not under oath and cannot be cross-examined. The court cannot observe the demeanor of the original maker or test their credibility through cross-examination.",
        category: "Evidence Law",
        difficulty: "medium"
    },
    {
        id: "20",
        text: "Which burden of proof applies in criminal cases in Nigeria?",
        options: [
            "Balance of probabilities",
            "Preponderance of evidence",
            "Beyond reasonable doubt",
            "Prima facie case"
        ],
        correctAnswer: 2,
        explanation: "In criminal cases, the prosecution must prove the guilt of the accused beyond reasonable doubt (Woolmington v DPP). This is a higher standard than the civil standard of 'balance of probabilities' or 'preponderance of evidence'.",
        category: "Evidence Law",
        difficulty: "easy"
    },
    // Land Law
    {
        id: "21",
        text: "Under the Land Use Act 1978, all land in each state is vested in:",
        options: [
            "The Governor of the State",
            "The President of Nigeria",
            "The Local Government Chairman",
            "The Traditional Ruler"
        ],
        correctAnswer: 0,
        explanation: "Section 1 of the Land Use Act 1978 vests all land comprised in the territory of each state (except land vested in the Federal Government) in the Governor of the State, to be held in trust and administered for the use and common benefit of all Nigerians.",
        category: "Land Law",
        difficulty: "easy"
    },
    {
        id: "22",
        scenario: "Chief Okonkwo has been farming a piece of land for 30 years without objection from anyone.",
        text: "Chief Okonkwo has likely acquired:",
        options: [
            "Legal ownership",
            "A possessory title by prescription",
            "A leasehold interest",
            "A license"
        ],
        correctAnswer: 1,
        explanation: "Under Nigerian law following English principles, possession for the requisite period (12 years for land) without permission and without objection can give rise to a possessory title through adverse possession (limitation of actions).",
        category: "Land Law",
        difficulty: "medium"
    },
    // Commercial Law
    {
        id: "23",
        text: "Which of the following is a feature of a bill of exchange?",
        options: [
            "It is a promise to pay",
            "It is an unconditional order to pay",
            "It is only used in international trade",
            "It does not require acceptance"
        ],
        correctAnswer: 1,
        explanation: "Section 3 of the Bills of Exchange Act defines a bill of exchange as 'an unconditional order in writing, addressed by one person to another, signed by the person giving it, requiring the person to whom it is addressed to pay on demand or at a fixed or determinable future time a sum certain in money to or to the order of a specified person, or to bearer.'",
        category: "Commercial Law",
        difficulty: "medium"
    },
    {
        id: "24",
        text: "In a contract of sale of goods, 'caveat emptor' means:",
        options: [
            "Let the seller beware",
            "Let the buyer beware",
            "Goods must be of merchantable quality",
            "The seller must disclose all defects"
        ],
        correctAnswer: 1,
        explanation: "'Caveat emptor' is Latin for 'let the buyer beware.' It represents the general common law rule that the buyer purchases at their own risk and must examine and judge for themselves. However, modern consumer protection laws have modified this principle.",
        category: "Commercial Law",
        difficulty: "easy"
    },
    // Jurisprudence
    {
        id: "25",
        text: "According to John Austin, law is:",
        options: [
            "The command of the sovereign backed by sanction",
            "The body of principles recognized and applied by the state in the administration of justice",
            "A system of rules recognized as binding by a political community",
            "A set of moral principles that govern human behavior"
        ],
        correctAnswer: 0,
        explanation: "John Austin (Command Theory of Law) defined law as 'a command set by a superior being to an inferior being, enforced by a sanction.' This is the classical positivist definition emphasizing the sovereign's command.",
        category: "Jurisprudence",
        difficulty: "medium"
    }
];

export default mockQuestions;
