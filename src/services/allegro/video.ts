interface VideoGenerationParams {
  refined_prompt: string;
  num_step: number;
  cfg_scale: number;
  user_prompt: string;
  rand_seed: number;
}

interface VideoResponse {
  message: string;
  data: string;
  status: number;
}

export class AllegroVideoService {
  private readonly baseUrl = 'https://api.rhymes.ai/v1';
  private readonly headers: HeadersInit;

  constructor(private readonly apiKey: string) {
    this.headers = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  async generateVideo(params: VideoGenerationParams): Promise<VideoResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/generateVideoSyn`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to generate video: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async queryVideoStatus(requestId: string): Promise<VideoResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/videoQuery?requestId=${requestId}`, {
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to query video status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 