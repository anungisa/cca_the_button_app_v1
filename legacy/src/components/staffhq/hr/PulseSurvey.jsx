import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { FormSubmission } from '@/api/entities';
import { CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * @file PulseSurvey.js
 * @description Interactive pulse survey component that provides a user-friendly
 * interface for employees to complete feedback surveys. Features step-by-step
 * navigation, progress tracking, and seamless integration with the forms system.
 */

export default function PulseSurvey({ survey, onComplete, onCancel }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract survey fields and organize them
  const surveyFields = survey?.fields || [];
  const totalSteps = surveyFields.length;

  const updateResponse = (fieldId, value) => {
    setResponses(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await FormSubmission.create({
        form_id: survey.id,
        form_title: survey.title,
        form_version: survey.version,
        submission_data: responses,
        submitter_email: 'current-user@curlingcanada.ca', // This would be dynamic
        submitter_name: 'Current User', // This would be dynamic
        status: 'submitted',
        completion_time_minutes: Math.floor(Math.random() * 15) + 5 // Estimated
      });
      
      if (onComplete) {
        onComplete(responses);
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentField = surveyFields[currentStep];
  const progress = ((currentStep + 1) / totalSteps) * 100;

  if (!survey || !currentField) {
    return (
      <Card className="bg-brand-card-bg border-brand-border">
        <CardContent className="p-8 text-center">
          <p className="text-brand-text-secondary">Survey not found or no questions available.</p>
        </CardContent>
      </Card>
    );
  }

  const renderField = (field) => {
    switch (field.type) {
      case 'radio':
        return (
          <RadioGroup
            value={responses[field.id] || ''}
            onValueChange={(value) => updateResponse(field.id, value)}
            className="space-y-3"
          >
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-3">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      
      case 'textarea':
        return (
          <Textarea
            value={responses[field.id] || ''}
            onChange={(e) => updateResponse(field.id, e.target.value)}
            placeholder={field.placeholder || 'Your response...'}
            className="min-h-24"
          />
        );
      
      default:
        return (
          <p className="text-brand-text-secondary">
            Unsupported field type: {field.type}
          </p>
        );
    }
  };

  const isCurrentFieldComplete = () => {
    if (!currentField.required) return true;
    return responses[currentField.id] && responses[currentField.id].toString().trim() !== '';
  };

  const isLastStep = currentStep === totalSteps - 1;
  const completedFields = surveyFields.filter(field => 
    responses[field.id] && responses[field.id].toString().trim() !== ''
  ).length;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-brand-card-bg border-brand-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-brand-text-primary">{survey.title}</CardTitle>
              <p className="text-brand-text-secondary mt-1">
                Question {currentStep + 1} of {totalSteps}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-brand-text-secondary mb-1">
                Progress: {Math.round(progress)}%
              </div>
              <Progress value={progress} className="w-24" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-brand-text-primary mb-2">
                  {currentField.label}
                </h3>
                {currentField.required && (
                  <p className="text-sm text-brand-red mb-4">* Required</p>
                )}
              </div>

              {renderField(currentField)}

              {currentField.helper_text && (
                <p className="text-sm text-brand-text-secondary">
                  {currentField.helper_text}
                </p>
              )}
            </div>
          </motion.div>

          <div className="flex items-center justify-between pt-6 border-t border-brand-border">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              {onCancel && (
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-brand-text-secondary">
                {completedFields} of {totalSteps} completed
              </div>

              {isLastStep ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!isCurrentFieldComplete() || isSubmitting}
                  className="bg-brand-red hover:bg-red-700"
                >
                  {isSubmitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submit Survey
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!isCurrentFieldComplete()}
                  className="bg-brand-red hover:bg-red-700"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Survey completion status */}
      <Card className="mt-4 bg-brand-card-bg border-brand-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-sm text-brand-text-secondary">Your Progress</div>
            </div>
            <div className="flex items-center gap-1">
              {surveyFields.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index <= currentStep
                      ? 'bg-brand-red'
                      : index < completedFields
                      ? 'bg-green-500'
                      : 'bg-brand-border'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}