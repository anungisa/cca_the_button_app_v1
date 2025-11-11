import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfUse() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card className="bg-brand-card-bg border-brand-border text-brand-text-primary">
        <CardHeader>
          <CardTitle>Terms of Use & Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none">
          <h2>Terms of Use</h2>
          <p>
            Welcome to The Button. By using this application, you agree to comply with and be bound by the following terms and conditions of use...
          </p>
          
          {/* ... other terms ... */}

          <h3 id="ai-policy">AI-Powered Features and Data Usage</h3>
          <h4>English</h4>
          <p>
            The Button includes AI-powered features that personalize your experience. These features use anonymized behavioral data, with no personal identity or freeform content stored, to provide you with relevant recommendations, performance feedback, and support. You can disable AI assistance at any time in your settings. Your privacy and data security are our top priorities.
          </p>
          
          <h4>Français</h4>
          <p>
            The Button inclut des fonctionnalités alimentées par l'IA qui personnalisent votre expérience. Ces fonctionnalités utilisent des données comportementales anonymisées, sans qu'aucune identité personnelle ou contenu libre ne soit stocké, pour vous fournir des recommandations pertinentes, des commentaires sur vos performances et du soutien. Vous pouvez désactiver l'assistance par IA à tout moment dans vos paramètres. Votre confidentialité et la sécurité de vos données sont nos priorités absolues.
          </p>

          <h2>Privacy Policy</h2>
          <p>
            Your privacy is important to us. It is The Button's policy to respect your privacy regarding any information we may collect from you across our application...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}