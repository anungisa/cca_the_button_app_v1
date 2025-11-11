import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code2, Key, Network } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const CodeBlock = ({ children }) => (
    <pre className="bg-gray-900 rounded-md p-4 overflow-x-auto text-sm text-white font-mono">
        <code>{children}</code>
    </pre>
);

export default function DeveloperPortal() {
    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
            <header className="text-center">
                <h1 className="text-4xl font-bold text-brand-text-primary">Developer Portal</h1>
                <p className="mt-2 text-lg text-brand-text-secondary">
                    Integrate with The Button to build the future of curling technology.
                </p>
            </header>

            <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Key className="w-5 h-5 text-brand-red" />
                        Getting Started
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>
                        Welcome to The Button API. Our ecosystem allows trusted partners to interact with our platform data to create innovative experiences for the curling community.
                    </p>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>
                            <Link to={createPageUrl('PartnerRegistration')} className="text-brand-red hover:underline">
                                Register your application
                            </Link> to get your development API key.
                        </li>
                        <li>Review our API documentation below to understand available endpoints.</li>
                        <li>Build and test your integration against our sandbox environment.</li>
                        <li>Once approved, you'll receive a production API key.</li>
                    </ol>
                </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Code2 className="w-5 h-5 text-blue-400" />
                        Authentication
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>
                        All API requests must be authenticated using an API key provided in the `Authorization` header.
                    </p>
                    <CodeBlock>
                        {`// Example HTTP Header
Authorization: Bearer YOUR_API_KEY`}
                    </CodeBlock>
                </CardContent>
            </Card>

            <Card className="bg-brand-card-bg border-brand-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Network className="w-5 h-5 text-green-400" />
                        Example Endpoints
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Badge variant="outline" className="text-green-400 border-green-400">GET</Badge>
                            /api/v1/clubs
                        </h3>
                        <p className="text-sm text-brand-text-secondary mt-1 mb-2">
                            Retrieves a list of all active curling clubs.
                        </p>
                        <CodeBlock>
{`curl "https://api.thebutton.ca/v1/clubs" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                        </CodeBlock>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Badge variant="outline" className="text-blue-400 border-blue-400">POST</Badge>
                            /api/v1/incidents
                        </h3>
                        <p className="text-sm text-brand-text-secondary mt-1 mb-2">
                            Creates a new incident record from an external source.
                        </p>
                        <CodeBlock>
{`curl "https://api.thebutton.ca/v1/incidents" \\
  -X POST \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
        "title": "Technical Issue with Registration",
        "category": "technical_issue",
        "description": "User reported an error on the event registration form.",
        "source": "partner_app_name"
      }'`}
                        </CodeBlock>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}