import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Save, CheckCircle } from 'lucide-react';

const surveySections = [
  { id: "governance", title: "Governance" },
  { id: "operations", title: "Operations" },
  { id: "financials", title: "Financials" },
  { id: "technology", title: "Technology" },
  { id: "participation", title: "Participation" },
  { id: "youth_curling", title: "Youth Curling" },
  { id: "diversity_inclusivity", title: "Diversity & Inclusivity" }
];

export default function SurveyForm() {
  const [formData, setFormData] = useState({});
  const [openSections, setOpenSections] = useState(['governance']);

  const handleSave = () => {
    // In a real app, this would save the formData to the backend
    alert("Survey data saved! (Simulated)");
  };
  
  const handleSubmit = () => {
    // In a real app, this would perform validation and submit
    alert("Survey submitted! (Simulated)");
  };

  return (
    <Card className="bg-brand-card-bg border-brand-border">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Survey Form</CardTitle>
        <div className="flex gap-2">
            <Button variant="outline" onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Save Progress</Button>
            <Button onClick={handleSubmit}><CheckCircle className="mr-2 h-4 w-4" /> Submit Survey</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" value={openSections} onValueChange={setOpenSections}>
          {surveySections.map(section => (
            <AccordionItem key={section.id} value={section.id}>
              <AccordionTrigger className="text-lg font-semibold text-brand-text-primary">{section.title}</AccordionTrigger>
              <AccordionContent className="p-4 space-y-4">
                {/* Example fields for one section. A real implementation would have many more. */}
                {section.id === 'financials' && (
                  <>
                    <div>
                      <Label htmlFor="annual_revenue">Annual Revenue ($)</Label>
                      <Input id="annual_revenue" type="number" placeholder="e.g., 250000" className="bg-brand-charcoal border-brand-border" />
                    </div>
                    <div>
                      <Label htmlFor="annual_expenses">Annual Expenses ($)</Label>
                      <Input id="annual_expenses" type="number" placeholder="e.g., 225000" className="bg-brand-charcoal border-brand-border" />
                    </div>
                     <div className="flex items-center space-x-2">
                        <Checkbox id="audited_financials" />
                        <Label htmlFor="audited_financials">Financials are professionally audited</Label>
                    </div>
                  </>
                )}
                 {section.id !== 'financials' && (
                  <p className="text-brand-text-secondary">Questions for the {section.title} section would appear here.</p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}