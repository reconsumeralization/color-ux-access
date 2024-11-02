"use client"

import React, { useState } from 'react'

interface TabsProps {
  children: React.ReactNode;
  defaultValue: string;
}

export function Tabs({ children, defaultValue }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        activeTab: activeTab,
        setActiveTab: setActiveTab,
        value: (child.props as any).value
      } as any);
    }
    return child;
  });

  return <div className="w-full">{childrenWithProps}</div>;
}

interface TabsListProps {
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (value: string) => void;
}

export function TabsList({ children, activeTab, setActiveTab }: TabsListProps) {
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        activeTab: activeTab,
        setActiveTab: setActiveTab,
        value: (child.props as any).value
      } as any);
    }
    return child;
  });

  return (
    <div className="flex space-x-2 border-b border-gray-200 mb-4">
      {childrenWithProps}
    </div>
  );
}

interface TabsTriggerProps {
  children: React.ReactNode;
  value: string;
  activeTab?: string;
  setActiveTab?: (value: string) => void;
}

export function TabsTrigger({ children, value, activeTab, setActiveTab }: TabsTriggerProps) {
  return (
    <button
      className={`px-4 py-2 font-medium rounded-t-lg ${
        activeTab === value
          ? 'bg-white text-blue-600 border-b-2 border-blue-600'
          : 'text-gray-500 hover:text-gray-700'
      }`}
      onClick={() => setActiveTab?.(value)}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  children: React.ReactNode;
  value: string;
  activeTab?: string;
}

export function TabsContent({ children, value, activeTab }: TabsContentProps) {
  if (value !== activeTab) return null;
  return <div className="py-4">{children}</div>;
} 