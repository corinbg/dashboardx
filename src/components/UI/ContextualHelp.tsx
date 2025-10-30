import React, { useState, useEffect } from 'react';
import { HelpCircle, X, ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';

interface HelpStep {
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: string;
}

interface ContextualHelpProps {
  steps: HelpStep[];
  onComplete: () => void;
  isActive: boolean;
}

export function ContextualHelp({ steps, onComplete, isActive }: ContextualHelpProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(isActive);

  useEffect(() => {
    setIsVisible(isActive);
    if (isActive) {
      setCurrentStep(0);
    }
  }, [isActive]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible || steps.length === 0) return null;

  const currentHelpStep = steps[currentStep];

  return (
    <>
      {/* Overlay scuro */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" />
      
      {/* Spotlight sul target */}
      <div 
        className="fixed z-50 pointer-events-none"
        style={{
          boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.5)',
          borderRadius: '8px',
        }}
      />

      {/* Tooltip di aiuto */}
      <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:transform md:-translate-x-1/2 md:max-w-md z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-blue-200 dark:border-blue-700 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-blue-800 dark:text-blue-200">
                Suggerimento {currentStep + 1} di {steps.length}
              </span>
            </div>
            <button
              onClick={handleComplete}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 p-1"
              title="Chiudi aiuto"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Contenuto */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">
              {currentHelpStep.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-4">
              {currentHelpStep.content}
            </p>
            
            {currentHelpStep.action && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 mb-4">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  💡 Suggerimento: {currentHelpStep.action}
                </p>
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:text-blue-600 dark:hover:text-blue-400"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Precedente
            </button>

            <div className="flex space-x-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep 
                      ? 'bg-blue-600' 
                      : 'bg-gray-300 dark:bg-gray-500'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextStep}
              className="inline-flex items-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {currentStep === steps.length - 1 ? 'Completato' : 'Avanti'}
              {currentStep !== steps.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Hook per tooltip semplici
export function useTooltip() {
  const [isVisible, setIsVisible] = useState(false);
  
  return {
    show: () => setIsVisible(true),
    hide: () => setIsVisible(false),
    isVisible
  };
}

// Componente tooltip semplice riutilizabile
interface SimpleTooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function SimpleTooltip({ content, children, position = 'top' }: SimpleTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap ${positionClasses[position]}`}>
          {content}
          <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45" />
        </div>
      )}
    </div>
  );
}