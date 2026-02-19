import { Source, Citation, ChatMessage } from "./gemini";

interface GroqResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Available Groq models with descriptions
export const GROQ_MODELS = {
  "openai/gpt-oss-120b": {
    name: "GPT OSS 120B",
    description: "OpenAI's flagship open model - best quality for legal analysis",
    maxTokens: 65536,
    recommended: true,
  },
  "llama-3.3-70b-versatile": {
    name: "Llama 3.3 70B",
    description: "Excellent for legal reasoning and complex analysis",
    maxTokens: 32768,
    recommended: true,
  },
  "llama-3.1-8b-instant": {
    name: "Llama 3.1 8B",
    description: "Ultra-fast responses, good for quick questions",
    maxTokens: 131072,
    recommended: false,
  },
  "openai/gpt-oss-20b": {
    name: "GPT OSS 20B",
    description: "OpenAI's fast model - balanced speed and quality",
    maxTokens: 65536,
    recommended: false,
  },
} as const;

export type GroqModel = keyof typeof GROQ_MODELS;

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export class GroqService {
  private apiKey: string;
  private model: GroqModel;

  constructor(model: GroqModel = "openai/gpt-oss-120b") {
    this.apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || "";
    this.model = model;
  }

  setModel(model: GroqModel) {
    this.model = model;
  }

  getCurrentModel(): GroqModel {
    return this.model;
  }

  async generateResponse(
    message: string,
    sources: Source[],
    history: ChatMessage[]
  ): Promise<{ text: string; citations: Citation[] }> {
    // Build context from all sources (both text files and extracted PDF content)
    const validSources = sources.filter(s => s.content && s.content.length > 50);
    
    let contextText = "";
    if (validSources.length > 0) {
      contextText = validSources
        .map((s) => `Source: ${s.title}\n${s.content.slice(0, 4000)}`)
        .join("\n\n---\n\n");
    }

    const systemPrompt = `You are Professor Steve, an expert in Nigerian Law. Answer questions based on the provided sources.

If the answer is found in the sources, cite them using [Source: Title]. If the answer requires knowledge beyond the sources, clearly state that you're providing general legal information.

Be thorough, accurate, and cite relevant sections of Nigerian law when applicable.`;

    const messages = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: validSources.length > 0 
          ? `Sources:\n${contextText}\n\nUser Question: ${message}`
          : `User Question: ${message}`
      },
    ];

    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: 0.7,
          max_tokens: 2048,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Groq API Error:", error);
        throw new Error(
          error.error?.message || "Failed to generate response"
        );
      }

      const data: GroqResponse = await response.json();
      const text = data.choices[0]?.message?.content || "";

      // Extract citations from the response
      const citations = this.extractCitations(text, sources);

      return { text, citations };
    } catch (error) {
      console.error("Error calling Groq API:", error);
      throw error;
    }
  }

  async generateStudyGuide(
    sources: Source[],
    subject: string
  ): Promise<string> {
    const context = sources
      .map((s) => `Source: ${s.title}\n${s.content.slice(0, 5000)}`)
      .join("\n\n---\n\n");

    const systemPrompt = `You are Professor Steve, a Nigerian law professor. Create comprehensive study guides that help law students understand complex legal concepts.

Structure your study guides with:
1. Key Concepts & Definitions
2. Important Cases & Precedents
3. Legal Principles & Rules
4. Study Tips & Memory Aids
5. Practice Questions

Make it engaging and easy to understand for law students.`;

    const messages = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Create a comprehensive study guide for ${subject} based on these sources:\n\n${context}`,
      },
    ];

    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: 0.7,
          max_tokens: 4096,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error?.message || "Failed to generate study guide"
        );
      }

      const data: GroqResponse = await response.json();
      return data.choices[0]?.message?.content || "";
    } catch (error) {
      console.error("Error generating study guide:", error);
      throw error;
    }
  }

  async summarizeDocument(content: string, title: string): Promise<string> {
    const systemPrompt = `You are Professor Steve, a Nigerian law expert. Summarize legal documents clearly and concisely.

Provide:
1. Executive Summary (2-3 sentences)
2. Key Legal Points
3. Important Sections
4. Practical Implications

Be thorough but concise. Focus on what law students need to know.`;

    const messages = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Summarize this legal document titled "${title}":\n\n${content.slice(
          0,
          15000
        )}`,
      },
    ];

    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: 0.5,
          max_tokens: 2048,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error?.message || "Failed to summarize document"
        );
      }

      const data: GroqResponse = await response.json();
      return data.choices[0]?.message?.content || "";
    } catch (error) {
      console.error("Error summarizing document:", error);
      throw error;
    }
  }

  async analyzeCase(
    caseContent: string,
    caseTitle: string
  ): Promise<string> {
    const systemPrompt = `You are Professor Steve, an expert in Nigerian case law. Analyze legal cases thoroughly.

Provide:
1. Case Summary
2. Facts of the Case
3. Legal Issues
4. Court's Decision
5. Ratio Decidendi (reasoning)
6. Legal Principles Established
7. Significance & Impact

Be precise and cite relevant legal doctrines.`;

    const messages = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Analyze this case titled "${caseTitle}":\n\n${caseContent.slice(
          0,
          15000
        )}`,
      },
    ];

    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: 0.6,
          max_tokens: 2048,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to analyze case");
      }

      const data: GroqResponse = await response.json();
      return data.choices[0]?.message?.content || "";
    } catch (error) {
      console.error("Error analyzing case:", error);
      throw error;
    }
  }

  private extractCitations(text: string, sources: Source[]): Citation[] {
    const citations: Citation[] = [];
    const citationPattern = /\[Source:\s*([^\]]+)\]/g;
    let match;

    while ((match = citationPattern.exec(text)) !== null) {
      const sourceTitle = match[1].trim();
      const source = sources.find(
        (s) =>
          s.title.toLowerCase().includes(sourceTitle.toLowerCase()) ||
          sourceTitle.toLowerCase().includes(s.title.toLowerCase())
      );

      if (source) {
        citations.push({
          text: match[0],
          sourceId: source.id,
          sourceTitle: source.title,
        });
      }
    }

    return citations;
  }
}

// Create a singleton instance
export const groqService = new GroqService();

// Function to create service with specific model
export function createGroqService(model: GroqModel) {
  return new GroqService(model);
}
