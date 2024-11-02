import { 
  AutoTokenizer,
  AutoModelForCausalLM,
  PreTrainedTokenizer,
  PreTrainedModel,
  PretrainedOptions,
  ModelOutput,
  Tensor
} from '@huggingface/transformers';
import { TestResult } from '@/types';

interface GenerationOutput extends ModelOutput {
  sequences: Tensor;
  attentions?: Tensor;
}

export interface AnalysisTask {
  type: 'contrast' | 'readability' | 'elements' | 'accessibility';
  options?: Record<string, any>;
}

export interface AnalysisResult {
  visibility_score: number;
  contrast_ratio: number;
  readability_score: number;
  recommendations: string[];
  elements?: {
    interactive: number;
    focusable: number;
    animated: number;
  };
  issues?: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    element?: string;
  }>;
}

export class AriaService {
  private tokenizer: PreTrainedTokenizer | null = null;
  private model: PreTrainedModel | null = null;
  private context: {
    currentTest?: TestResult[];
    testInProgress: boolean;
    lastQuestion?: string;
  };

  constructor(private apiKey: string) {
    this.context = {
      testInProgress: false
    };
    this.initializeAria();
  }

  async analyzeImage(config: {
    image: Buffer;
    tasks: string[];
  }): Promise<AnalysisResult> {
    try {
      // Implement actual analysis logic here
      // For now, returning mock data
      return {
        visibility_score: 0.85,
        contrast_ratio: 4.5,
        readability_score: 0.9,
        recommendations: [
          "Increase contrast for text elements",
          "Add alternative text to images",
          "Ensure interactive elements are keyboard accessible"
        ],
        elements: {
          interactive: 5,
          focusable: 8,
          animated: 2
        }
      };
    } catch (error) {
      console.error('ARIA analysis failed:', error);
      throw new Error('Failed to analyze image');
    }
  }

  async generateRecommendations(config: {
    globalAnalysis: any;
    elementAnalysis: any[];
    format: string;
  }): Promise<string[]> {
    try {
      return [
        "Increase color contrast for better visibility",
        "Add patterns or textures to distinguish elements",
        "Ensure proper focus indicators"
      ];
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      throw new Error('Failed to generate recommendations');
    }
  }

  private async initializeAria() {
    try {
      this.model = await AutoModelForCausalLM.from_pretrained('rhymes-ai/Aria', {
        device: 'auto',
        torch_dtype: 'bfloat16',
        trust_remote_code: true
      } as PretrainedOptions);

      this.tokenizer = await AutoTokenizer.from_pretrained('rhymes-ai/Aria', {
        trust_remote_code: true
      } as PretrainedOptions);
    } catch (error) {
      console.error('Failed to initialize Aria:', error);
      throw new Error('Failed to initialize Aria chat service');
    }
  }

  async processMessage(message: string): Promise<string> {
    try {
      if (!this.tokenizer || !this.model) {
        throw new Error('Aria service not initialized');
      }

      const messages = [
        {
          role: "system",
          content: `You are Aria, an AI assistant specializing in web accessibility testing. 
                   Current context: ${this.getContextString()}`,
        },
        {
          role: "user",
          content: message,
        },
      ];

      // Convert messages to model input format
      const inputText = messages.map(m => `${m.role}: ${m.content}`).join('\n');
      const inputs = await this.tokenizer(inputText, {
        return_tensors: 'pt',
        padding: true,
        truncation: true,
        max_length: 512
      });

      // Generate response
      const output = await this.model.generate(inputs);

      // Handle different output types
      let outputSequence: Tensor;
      if (this.isGenerationOutput(output)) {
        outputSequence = output.sequences;
      } else {
        outputSequence = output as Tensor;
      }

      // Decode the output
      const response = await this.tokenizer.decode(outputSequence, {
        skip_special_tokens: true
      });

      return this.extractAssistantResponse(response);
    } catch (error: unknown) {
      console.error('Failed to process message:', error);
      throw new Error('Failed to generate response');
    }
  }

  private isGenerationOutput(output: ModelOutput | Tensor): output is GenerationOutput {
    return (output as GenerationOutput).sequences !== undefined;
  }

  private extractAssistantResponse(fullResponse: string): string {
    const parts = fullResponse.split('assistant:');
    return parts.length > 1 ? parts[parts.length - 1].trim() : fullResponse.trim();
  }

  updateContext(results?: TestResult[]) {
    if (results) {
      this.context.currentTest = results;
    }
  }

  private getContextString(): string {
    const contextParts = [];

    if (this.context.testInProgress) {
      contextParts.push('A test is currently running.');
    }

    if (this.context.currentTest) {
      contextParts.push(`Test results are available for ${this.context.currentTest.length} colorblind types.`);
      
      const totalIssues = this.context.currentTest.reduce(
        (sum, result) => sum + result.issues.length, 
        0
      );
      contextParts.push(`There are ${totalIssues} total accessibility issues identified.`);
    }

    return contextParts.join(' ');
  }
} 