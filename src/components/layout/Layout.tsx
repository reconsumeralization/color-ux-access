import { AriaAssistant } from '../chat/AriaAssistant';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {children}
          </div>
          <div className="lg:col-span-1">
            <AriaAssistant />
          </div>
        </div>
      </div>
    </div>
  );
}; 