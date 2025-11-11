import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Curling Canada",
  description: "Privacy policy for the Curling Canada platform",
};

export default function PrivacyPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-curling-red-100 dark:bg-curling-red-900/20 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-curling-red-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground">
            Last updated: November 11, 2025
          </p>
        </div>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle>Our Commitment to Your Privacy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p>
              Curling Canada ("we", "us", or "our") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your 
              information when you use The Button platform.
            </p>
          </CardContent>
        </Card>

        {/* Information Collection */}
        <Card>
          <CardHeader>
            <CardTitle>1. Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Personal Information</h3>
              <p className="text-sm text-muted-foreground">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                <li>Name, email address, and contact information</li>
                <li>Account credentials and profile information</li>
                <li>Club membership and team affiliations</li>
                <li>Event registrations and participation history</li>
                <li>Payment information (processed securely through third-party providers)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Usage Information</h3>
              <p className="text-sm text-muted-foreground">
                We automatically collect certain information about your device and how you interact with our platform:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                <li>Device information (type, operating system, browser)</li>
                <li>IP address and location data</li>
                <li>Pages visited and features used</li>
                <li>Performance metrics and error reports</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card>
          <CardHeader>
            <CardTitle>2. How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Provide, maintain, and improve our services</li>
              <li>Process registrations and manage event participation</li>
              <li>Communicate with you about events, updates, and promotions</li>
              <li>Administer loyalty programs and rewards</li>
              <li>Analyze usage patterns and optimize user experience</li>
              <li>Ensure platform security and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </CardContent>
        </Card>

        {/* Information Sharing */}
        <Card>
          <CardHeader>
            <CardTitle>3. Information Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We do not sell your personal information. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
              <li><strong>With Your Consent:</strong> When you explicitly agree to share information</li>
              <li><strong>Service Providers:</strong> With trusted third parties who assist in operating our platform</li>
              <li><strong>Club and Event Organizers:</strong> When you register for events or join clubs</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with mergers or acquisitions</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card>
          <CardHeader>
            <CardTitle>4. Data Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We implement industry-standard security measures to protect your information, including:
              encryption, secure servers, access controls, and regular security audits. However, no 
              method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card>
          <CardHeader>
            <CardTitle>5. Your Rights and Choices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Access and update your personal information</li>
              <li>Request deletion of your account and data</li>
              <li>Opt-out of marketing communications</li>
              <li>Restrict certain data processing activities</li>
              <li>Export your data in a portable format</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription>
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Email:</strong> privacy@curling.ca</p>
            <p><strong>Address:</strong> Curling Canada, 1660 Vimont Court, Ottawa, ON K1G 6L2</p>
            <p><strong>Phone:</strong> 1-800-550-2875</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
