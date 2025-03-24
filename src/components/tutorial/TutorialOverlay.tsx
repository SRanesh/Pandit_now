import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

interface TutorialStep {
  title: string;
  description: string;
  image: string;
  target?: string;
}

const DEVOTEE_STEPS: TutorialStep[] = [
  {
    title: "Welcome to PanditJi",
    description: "Your trusted platform for connecting with verified pandits and scheduling religious ceremonies.",
    image: "https://images.unsplash.com/photo-1621506821957-1b50ab7787a4?auto=format&fit=crop&q=80&w=1200",
  },
  {
    title: "Find the Perfect Pandit",
    description: "Use our advanced search and filter options to find pandits based on location, languages, and specializations.",
    image: "https://images.unsplash.com/photo-1626016767119-f8b0c1bc55ee?auto=format&fit=crop&q=80&w=1200",
    target: "#search-section"
  },
  {
    title: "Book Ceremonies",
    description: "Schedule ceremonies with your chosen pandit at your preferred time and location.",
    image: "https://images.unsplash.com/photo-1626514422851-5d2d8b966f3c?auto=format&fit=crop&q=80&w=1200",
  },
  {
    title: "Track Auspicious Times",
    description: "Stay informed about muhurat timings and upcoming festivals through our Panchang feature.",
    image: "https://images.unsplash.com/photo-1623069923531-fd34d38b6a91?auto=format&fit=crop&q=80&w=1200",
  },
  {
    title: "Explore Astrology",
    description: "Generate detailed birth charts and get personalized astrological insights.",
    image: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&q=80&w=1200",
  }
];

const PANDIT_STEPS: TutorialStep[] = [
  {
    title: "Welcome to PanditJi",
    description: "Your platform for connecting with devotees and managing ceremonies efficiently.",
    image: "https://images.unsplash.com/photo-1626514422851-5d2d8b966f3c?auto=format&fit=crop&q=80&w=1200",
  },
  {
    title: "Complete Your Profile",
    description: "Add your specializations, languages, and experience to attract more devotees.",
    image: "https://images.unsplash.com/photo-1626016767119-f8b0c1bc55ee?auto=format&fit=crop&q=80&w=1200",
  },
  {
    title: "Manage Bookings",
    description: "Accept booking requests and communicate with devotees through our messaging system.",
    image: "https://images.unsplash.com/photo-1621506821957-1b50ab7787a4?auto=format&fit=crop&q=80&w=1200",
  },
  {
    title: "Track Performance",
    description: "Monitor your ratings, reviews, and booking statistics through the dashboard.",
    image: "https://images.unsplash.com/photo-1623069923531-fd34d38b6a91?auto=format&fit=crop&q=80&w=1200",
  }
];

export function TutorialOverlay() {
  const { user } = useAuth();
  const [showTutorial, setShowTutorial] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const steps = user?.role === 'pandit' ? PANDIT_STEPS : DEVOTEE_STEPS;

  useEffect(() => {
    const tutorialCompleted = localStorage.getItem('tutorial_completed');
    if (tutorialCompleted === 'true') {
      setShowTutorial(false);
    }
    setHasCheckedStorage(true);
  }, []);

  useEffect(() => {
    // Save tutorial completion status
    const completeTutorial = () => {
      try {
        localStorage.setItem('tutorial_completed', 'true');
      } catch (error) {
        console.error('Failed to save tutorial status:', error);
      }
    };

    return () => {
      if (currentStep === steps.length - 1) {
        completeTutorial();
      }
    };
  }, [currentStep, steps.length]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsVisible(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('tutorial_completed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;
  if (!hasCheckedStorage) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 overflow-hidden shadow-xl">
        <div className="relative">
          <img
            src={steps[currentStep].image}
            alt={steps[currentStep].title}
            className="w-full h-64 object-cover"
          />
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-600">
              {steps[currentStep].description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep
                      ? 'bg-orange-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-3">
              {currentStep > 0 && (
                <Button
                  variant="secondary"
                  onClick={handlePrevious}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
              )}
              <Button
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                {currentStep < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}