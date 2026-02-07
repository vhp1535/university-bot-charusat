// Mock API for Notebook LLM - Client-side simulation
// Simulates PDF parsing and Q&A functionality

export interface ParseResult {
  id: string;
  fileName: string;
  pages: number;
  summary: string;
}

export interface AskResult {
  question: string;
  answer: string;
  sourceSnippet: string;
}

class MockAPI {
  private documents: Map<string, ParseResult> = new Map();

  async parse(file: File): Promise<ParseResult> {
    // Simulate processing time
    await this.delay(2000 + Math.random() * 3000);

    const id = Math.random().toString(36).substring(2, 15);
    const pages = Math.floor(Math.random() * 50) + 10;
    
    const result: ParseResult = {
      id,
      fileName: file.name,
      pages,
      summary: this.generateSummary(file.name, pages)
    };

    this.documents.set(id, result);
    return result;
  }

  async ask(question: string, documentId: string): Promise<AskResult> {
    // Simulate thinking time
    await this.delay(1000 + Math.random() * 2000);

    const document = this.documents.get(documentId);
    if (!document) {
      throw new Error('Document not found');
    }

    return {
      question,
      answer: this.generateAnswer(question, document),
      sourceSnippet: this.generateSourceSnippet(document)
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateSummary(fileName: string, pages: number): string {
    const summaries = [
      `This ${pages}-page document provides a comprehensive analysis of modern artificial intelligence applications and their transformative impact across various industries. The paper explores cutting-edge methodologies in machine learning, deep learning architectures, and their practical implementations in real-world scenarios.`,
      
      `The document outlines a detailed research methodology examining the effectiveness of large language models in educational settings. Spanning ${pages} pages, it covers experimental design, data collection procedures, statistical analysis methods, and presents significant findings that contribute to the field of AI-assisted learning.`,
      
      `This technical report presents an in-depth study of blockchain technology integration in financial services. The ${pages}-page analysis covers distributed ledger implementations, smart contract development, security considerations, and regulatory compliance frameworks that are shaping the future of digital finance.`,
      
      `The document contains a comprehensive business strategy analysis focusing on sustainable development practices in corporate environments. This ${pages}-page study examines market trends, competitive landscape analysis, risk assessment frameworks, and strategic recommendations for long-term organizational growth.`,
    ];

    return summaries[Math.floor(Math.random() * summaries.length)];
  }

  private generateAnswer(question: string, document: ParseResult): string {
    const answers = [
      `Based on the analysis presented in "${document.fileName}", the key findings suggest that ${question.toLowerCase()} can be addressed through a multi-faceted approach involving systematic implementation of evidence-based practices. The document emphasizes the importance of stakeholder engagement and continuous monitoring throughout the process.`,
      
      `According to the research outlined in this ${document.pages}-page document, ${question.toLowerCase()} represents a significant opportunity for innovation. The authors recommend a phased approach that prioritizes risk mitigation while maximizing potential benefits through strategic planning and resource allocation.`,
      
      `The document provides compelling evidence that ${question.toLowerCase()} should be considered within the broader context of current industry trends. Key recommendations include developing robust frameworks for evaluation, establishing clear success metrics, and maintaining flexibility to adapt to changing conditions.`,
      
      `Research findings from "${document.fileName}" indicate that ${question.toLowerCase()} requires careful consideration of multiple variables. The study highlights the importance of data-driven decision making, collaborative approaches, and the need for continuous evaluation and refinement of implemented strategies.`,
    ];

    return answers[Math.floor(Math.random() * answers.length)];
  }

  private generateSourceSnippet(document: ParseResult): string {
    const snippets = [
      `"The implementation of these methodologies has shown remarkable success rates across diverse applications..." (Page ${Math.floor(Math.random() * document.pages) + 1})`,
      
      `"Our findings demonstrate significant improvements in efficiency and effectiveness when these principles are properly applied..." (Page ${Math.floor(Math.random() * document.pages) + 1})`,
      
      `"The data strongly supports the hypothesis that systematic approaches yield superior outcomes..." (Page ${Math.floor(Math.random() * document.pages) + 1})`,
      
      `"These results align with previous research while extending our understanding of the underlying mechanisms..." (Page ${Math.floor(Math.random() * document.pages) + 1})`,
    ];

    return snippets[Math.floor(Math.random() * snippets.length)];
  }
}

export const mockApi = new MockAPI();