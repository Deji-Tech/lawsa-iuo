import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export interface Source {
  id: string;
  title: string;
  content: string;
  type: "pdf" | "text" | "url" | "docx";
  file_path?: string;
  created_at: string;
}

export interface Citation {
  text: string;
  sourceId: string;
  sourceTitle: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  citations?: Citation[];
  timestamp: Date;
}

export class GeminiService {
  private model = genAI.getGenerativeModel({ 
    model: "gemini-pro",
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    }
  });

  async generateResponse(
    message: string, 
    sources: Source[],
    history: ChatMessage[]
  ): Promise<{ text: string; citations: Citation[] }> {
    const context = sources.map(s => `Source: ${s.title}\n${s.content}`).join("\n\n---\n\n");
    
    const prompt = `You are Professor Steve, an expert in Nigerian Law. Answer questions based ONLY on the provided sources.
    
Sources:
${context}

User Question: ${message}

Instructions:
1. Answer based ONLY on the provided sources
2. Include inline citations in format [Source: Title]
3. If information isn't in sources, say "I don't have information about that in the provided sources"
4. Provide exact quotes when relevant
5. Format response with clear paragraphs

Response:`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      // Extract citations from response
      const citations: Citation[] = [];
      const citationRegex = /\[Source: ([^\]]+)\]/g;
      let match;
      
      while ((match = citationRegex.exec(text)) !== null) {
        const sourceTitle = match[1];
        const source = sources.find(s => s.title === sourceTitle);
        if (source) {
          citations.push({
            text: match[0],
            sourceId: source.id,
            sourceTitle: source.title
          });
        }
      }
      
      return { text, citations };
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to generate response");
    }
  }

  async generateStudyGuide(sources: Source[], topic: string): Promise<string> {
    const context = sources.map(s => `Source: ${s.title}\n${s.content}`).join("\n\n---\n\n");
    
    const prompt = `Create a comprehensive study guide on "${topic}" based on the following Nigerian legal sources:

${context}

Create a study guide with:
1. Key concepts and definitions
2. Important cases and precedents
3. Summary points for exam preparation
4. Practice questions

Format with clear headings and bullet points.`;

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Study Guide Generation Error:", error);
      throw new Error("Failed to generate study guide");
    }
  }

  async generateMockQuestions(sources: Source[], numQuestions: number = 5): Promise<string> {
    const context = sources.map(s => `Source: ${s.title}\n${s.content}`).join("\n\n---\n\n");
    
    const prompt = `Generate ${numQuestions} multiple choice questions based on the following Nigerian legal sources:

${context}

For each question:
1. Provide a scenario-based question
2. Give 4 options (A, B, C, D)
3. Indicate the correct answer
4. Provide a brief explanation with citation

Format as:
Question 1: [Question text]
A) [Option]
B) [Option]
C) [Option]
D) [Option]
Correct Answer: [Letter]
Explanation: [Explanation with citation]`;

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Mock Questions Generation Error:", error);
      throw new Error("Failed to generate mock questions");
    }
  }
}

export const geminiService = new GeminiService();
