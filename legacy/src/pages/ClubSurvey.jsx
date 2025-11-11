import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { FormDefinition } from '@/api/entities';
import { SurveySubmission } from '@/api/entities';
import { Club } from '@/api/entities';
import FormRenderer from '../components/forms/FormRenderer';

const CLUB_SURVEY_FORM_ID = "annual_club_survey_2024";

export default function ClubSurveyPage() {
    const [searchParams] = useSearchParams();
    const clubId = searchParams.get('clubId');

    const [club, setClub] = useState(null);
    const [surveySubmission, setSurveySubmission] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!clubId) {
            setError("No Club ID provided.");
            setIsLoading(false);
            return;
        }
        loadInitialData();
    }, [clubId]);

    const loadInitialData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const clubData = (await Club.list({ id: clubId }))[0];
            if (!clubData) {
                throw new Error("Club not found.");
            }
            setClub(clubData);
            
            const submissions = await SurveySubmission.list({ club_id: clubId, year: new Date().getFullYear() });
            if (submissions && submissions.length > 0) {
                setSurveySubmission(submissions[0]);
            } else {
                // Create a new draft submission object
                setSurveySubmission({
                    club_id: clubId,
                    club_name: clubData.name,
                    ma_region: clubData.ma_region,
                    year: new Date().getFullYear(),
                    is_complete: false,
                    survey_data: {}
                });
            }
        } catch (err) {
            console.error("Error loading survey data:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFormSubmit = async (formData) => {
        setIsSaving(true);
        try {
            const submissionPayload = {
                ...surveySubmission,
                survey_data: formData,
                is_complete: true, // Mark as complete on submit
                submission_date: new Date().toISOString(),
            };

            if (surveySubmission.id) {
                // Update existing submission
                await SurveySubmission.update(surveySubmission.id, submissionPayload);
            } else {
                // Create new submission
                await SurveySubmission.create(submissionPayload);
            }
            alert("Survey submitted successfully!");
            window.history.back(); // Or redirect to a success page
        } catch(err) {
            console.error("Failed to save survey:", err);
            alert("An error occurred while saving. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="w-12 h-12 animate-spin text-brand-red" /></div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <Card className="bg-brand-card-bg border-brand-border mb-6">
                <CardHeader>
                    <CardTitle>Annual Club Survey for {club?.name || 'Your Club'}</CardTitle>
                    <p className="text-brand-text-secondary">Please complete all sections of the survey. Your progress is saved automatically.</p>
                </CardHeader>
            </Card>

            <Suspense fallback={<div className="flex justify-center items-center p-8"><Loader2 className="w-8 h-8 animate-spin text-brand-red" /></div>}>
                <FormRenderer
                    formId={CLUB_SURVEY_FORM_ID}
                    initialData={surveySubmission.survey_data}
                    onFormSubmit={handleFormSubmit}
                    submitButtonText={isSaving ? "Saving..." : "Submit Survey"}
                    onCancel={() => window.history.back()}
                />
            </Suspense>
        </div>
    );
}