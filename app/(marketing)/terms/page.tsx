import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Curling Canada",
  description: "Terms of service for the Curling Canada platform",
};

export default function TermsPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-curling-blue-100 dark:bg-curling-blue-900/20 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-curling-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-lg text-muted-foreground">
            Last updated: November 11, 2025
          </p>
        </div>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle>Agreement to Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p>
              By accessing or using The Button platform ("Service"), you agree to be bound by these 
              Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.
            </p>
          </CardContent>
        </Card>

        {/* User Accounts */}
        <Card>
          <CardHeader>
            <CardTitle>1. User Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Account Creation</h3>
              <p className="text-sm text-muted-foreground">
                To access certain features, you must create an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Account Eligibility</h3>
              <p className="text-sm text-muted-foreground">
                You must be at least 13 years old to create an account. Users under 18 require 
                parental or guardian consent to use certain features.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Acceptable Use */}
        <Card>
          <CardHeader>
            <CardTitle>2. Acceptable Use</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful or malicious code</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Impersonate others or misrepresent affiliations</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Collect user data without consent</li>
              <li>Use the Service for unauthorized commercial purposes</li>
            </ul>
          </CardContent>
        </Card>

        {/* Events and Registrations */}
        <Card>
          <CardHeader>
            <CardTitle>3. Events and Registrations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Event Registration</h3>
              <p className="text-sm text-muted-foreground">
                When you register for an event through our platform:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                <li>You commit to attending or participating as registered</li>
                <li>Payment obligations are binding upon registration</li>
                <li>Cancellation policies vary by event and organizer</li>
                <li>Refunds are subject to individual event policies</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Event Organizer Responsibilities</h3>
              <p className="text-sm text-muted-foreground">
                Event organizers are responsible for their events. Curling Canada is not liable for 
                event cancellations, changes, or organizer conduct.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payments and Fees */}
        <Card>
          <CardHeader>
            <CardTitle>4. Payments and Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              When making payments through our platform:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
              <li><strong>Payment Processing:</strong> Payments are processed through secure third-party providers</li>
              <li><strong>Pricing:</strong> All prices are in Canadian dollars unless otherwise stated</li>
              <li><strong>Fees:</strong> Processing fees may apply to certain transactions</li>
              <li><strong>Refunds:</strong> Subject to our refund policy and event-specific terms</li>
              <li><strong>Disputes:</strong> Payment disputes must be raised within 30 days</li>
            </ul>
          </CardContent>
        </Card>

        {/* Loyalty Program */}
        <Card>
          <CardHeader>
            <CardTitle>5. Granite Circle Loyalty Program</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              The Granite Circle loyalty program is subject to the following terms:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Points are earned through eligible activities and purchases</li>
              <li>Point values and redemption options may change</li>
              <li>Points expire after 24 months of account inactivity</li>
              <li>Points have no cash value and are non-transferable</li>
              <li>We reserve the right to modify or terminate the program</li>
              <li>Fraudulent point accumulation may result in account termination</li>
            </ul>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card>
          <CardHeader>
            <CardTitle>6. Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              All content on The Button platform, including text, graphics, logos, and software, 
              is the property of Curling Canada or its licensors and is protected by copyright 
              and trademark laws. You may not reproduce, distribute, or create derivative works 
              without explicit permission.
            </p>
          </CardContent>
        </Card>

        {/* Disclaimers */}
        <Card>
          <CardHeader>
            <CardTitle>7. Disclaimers and Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Service "As Is"</h3>
              <p className="text-sm text-muted-foreground">
                The Service is provided "as is" without warranties of any kind. We do not guarantee 
                that the Service will be uninterrupted, secure, or error-free.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Limitation of Liability</h3>
              <p className="text-sm text-muted-foreground">
                To the maximum extent permitted by law, Curling Canada shall not be liable for any 
                indirect, incidental, special, or consequential damages arising from your use of the Service.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card>
          <CardHeader>
            <CardTitle>8. Termination</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We may suspend or terminate your account at any time for violations of these Terms or 
              for any other reason. You may terminate your account at any time through account settings. 
              Certain provisions of these Terms survive termination.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card>
          <CardHeader>
            <CardTitle>9. Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We reserve the right to modify these Terms at any time. We will notify users of material 
              changes via email or platform notification. Continued use of the Service after changes 
              constitutes acceptance of the updated Terms.
            </p>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card>
          <CardHeader>
            <CardTitle>10. Governing Law</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              These Terms are governed by the laws of Ontario, Canada. Any disputes shall be resolved 
              in the courts of Ontario.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription>
              If you have questions about these Terms of Service, please contact us:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Email:</strong> legal@curling.ca</p>
            <p><strong>Address:</strong> Curling Canada, 1660 Vimont Court, Ottawa, ON K1G 6L2</p>
            <p><strong>Phone:</strong> 1-800-550-2875</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
