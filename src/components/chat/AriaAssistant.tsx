import { useState, useRef, useEffect } from 'react';
import { useTestConfig } from '@/stores/testConfigStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { AriaService } from '@/services/chat/AriaService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AriaAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const testConfig = useTestConfig();
  const ariaService = useRef(new AriaService(process.env.NEXT_PUBLIC_ARIA_API_KEY || ''));

  useEffect(() => {
    // Initial greeting
    addMessage({
      role: 'assistant',
      content: "Hi! I'm Aria, your accessibility testing assistant. I can help you set up tests, understand results, and implement improvements. What would you like to know?"
    });
  }, []);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const processUserMessage = async (message: string): Promise<string> => {
    return await ariaService.current.processMessage(message);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    addMessage({ role: 'user', content: userMessage });
    setIsTyping(true);

    try {
      const response = await processUserMessage(userMessage);
      setIsTyping(false);
      addMessage({ role: 'assistant', content: response });
    } catch (error) {
      setIsTyping(false);
      addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      });
    }
  };

  return (
    <div className="flex flex-col h-[500px] border rounded-lg bg-white">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="/aria-avatar.png" alt="Aria" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">Aria Assistant</h3>
            <p className="text-sm text-muted-foreground">
              Accessibility Testing Guide
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p>{message.content}</p>
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3">
                <span className="animate-pulse">Typing...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything about accessibility testing..."
            className="flex-1"
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>
    </div>
  );
}; 