'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DocumentationPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Documentation</h1>
          <p className="text-muted-foreground">Learn how to use the accessibility testing tools</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
              <TabsTrigger value="api">API Reference</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="mb-4">
                Our accessibility testing tools help you identify and fix accessibility issues in your web applications,
                with a focus on color blindness simulation and WCAG compliance checking.
              </p>
            </TabsContent>
            <TabsContent value="getting-started">
              <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
              <p className="mb-4">
                To begin testing your website, simply enter your URL in the test page and select the type of
                colorblindness simulation you want to run. The tool will analyze your site and provide detailed feedback.
              </p>
            </TabsContent>
            <TabsContent value="api">
              <h2 className="text-2xl font-bold mb-4">API Reference</h2>
              <p className="mb-4">
                Our API allows you to integrate accessibility testing directly into your development workflow.
                Refer to the API documentation for detailed information about available endpoints and parameters.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
