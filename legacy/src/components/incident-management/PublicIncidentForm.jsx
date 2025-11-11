import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Incident } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';

export default function PublicIncidentForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const incidentData = {
        title: data.title,
        description: data.description,
        category: 'safe_sport',
        status: 'new',
        priority: 'high', // Default to high for all safe sport submissions
        is_confidential: true,
        source: 'public_form',
        reporter_name: isAnonymous ? 'Anonymous' : data.reporter_name,
        reporter_email: isAnonymous ? '' : data.reporter_email,
      };

      const newIncident = await Incident.create(incidentData);

      toast({
        title: "Report Submitted Successfully",
        description: `Your confidential report (ID: ${newIncident.id}) has been received.`,
      });
      reset();
    } catch (error) {
      console.error("Failed to submit incident report:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="title">Subject of Report</Label>
        <Input 
          id="title"
          placeholder="e.g., Incident at Main Street Curling Club"
          {...register("title", { required: "A subject is required." })}
          className="bg-brand-charcoal"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="description">Detailed Description</Label>
        <Textarea 
          id="description"
          rows={8}
          placeholder="Please provide as much detail as possible, including dates, times, locations, individuals involved, and any witnesses. Your report is confidential."
          {...register("description", { required: "A description of the incident is required." })}
          className="bg-brand-charcoal"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="anonymous" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
        <Label htmlFor="anonymous">I want to submit this report anonymously</Label>
      </div>

      {!isAnonymous && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="reporter_name">Your Name</Label>
            <Input 
              id="reporter_name"
              placeholder="Jane Doe"
              {...register("reporter_name", { required: !isAnonymous && "Your name is required for follow-up." })}
              className="bg-brand-charcoal"
            />
            {errors.reporter_name && <p className="text-red-500 text-sm mt-1">{errors.reporter_name.message}</p>}
          </div>
          <div>
            <Label htmlFor="reporter_email">Your Email</Label>
            <Input 
              id="reporter_email"
              type="email"
              placeholder="jane.doe@example.com"
              {...register("reporter_email", { 
                required: !isAnonymous && "Your email is required for follow-up.",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Please enter a valid email address."
                }
              })}
              className="bg-brand-charcoal"
            />
            {errors.reporter_email && <p className="text-red-500 text-sm mt-1">{errors.reporter_email.message}</p>}
          </div>
        </div>
      )}
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="bg-brand-red hover:bg-red-700">
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Submit Confidential Report
        </Button>
      </div>
    </form>
  );
}