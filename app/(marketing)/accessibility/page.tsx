import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Accessibility Statement | Curling Canada",
  description: "Accessibility commitment for the Curling Canada platform",
};

export default function AccessibilityPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-curling-gold-100 dark:bg-curling-gold-900/20 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-curling-gold-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Accessibility Statement</h1>
          <p className="text-lg text-muted-foreground">
            Our commitment to making curling accessible to everyone
          </p>
        </div>

        {/* Commitment */}
        <Card>
          <CardHeader>
            <CardTitle>Our Commitment to Accessibility</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p>
              Curling Canada is committed to ensuring digital accessibility for people with disabilities. 
              We are continually improving the user experience for everyone and applying the relevant 
              accessibility standards to ensure we provide equal access to all users.
            </p>
          </CardContent>
        </Card>

        {/* Standards */}
        <Card>
          <CardHeader>
            <CardTitle>Accessibility Standards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The Button platform aims to conform to the following standards:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
              <li><strong>WCAG 2.1 Level AA:</strong> Web Content Accessibility Guidelines</li>
              <li><strong>AODA:</strong> Accessibility for Ontarians with Disabilities Act</li>
              <li><strong>Section 508:</strong> U.S. Federal accessibility standards</li>
            </ul>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Accessibility Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Visual Accessibility</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>High contrast color schemes</li>
                <li>Resizable text up to 200% without loss of functionality</li>
                <li>Clear visual focus indicators for keyboard navigation</li>
                <li>Alternative text for all images and icons</li>
                <li>Dark mode support for reduced eye strain</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Keyboard and Navigation</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Full keyboard navigation support</li>
                <li>Skip navigation links to main content</li>
                <li>Logical tab order throughout the site</li>
                <li>Consistent navigation across all pages</li>
                <li>Clear heading structure for screen readers</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Screen Reader Compatibility</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Semantic HTML markup</li>
                <li>ARIA labels and descriptions</li>
                <li>Meaningful link text</li>
                <li>Form field labels and instructions</li>
                <li>Status messages and error notifications</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Content and Design</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Clear and simple language</li>
                <li>Consistent page layouts and design patterns</li>
                <li>Adequate spacing between interactive elements</li>
                <li>Readable font sizes and line heights</li>
                <li>Color is not the only means of conveying information</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Compatible Technologies */}
        <Card>
          <CardHeader>
            <CardTitle>Compatible Technologies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              The Button platform is designed to work with the following assistive technologies:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Screen readers (JAWS, NVDA, VoiceOver, TalkBack)</li>
              <li>Screen magnification software</li>
              <li>Speech recognition software</li>
              <li>Keyboard-only navigation</li>
              <li>Alternative input devices</li>
            </ul>
          </CardContent>
        </Card>

        {/* Testing */}
        <Card>
          <CardHeader>
            <CardTitle>Accessibility Testing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We regularly test our platform using:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
              <li>Automated accessibility scanning tools</li>
              <li>Manual testing with keyboard-only navigation</li>
              <li>Screen reader testing with multiple platforms</li>
              <li>User testing with people with disabilities</li>
              <li>Regular accessibility audits by third-party experts</li>
            </ul>
          </CardContent>
        </Card>

        {/* Known Issues */}
        <Card>
          <CardHeader>
            <CardTitle>Known Limitations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              We are aware of the following limitations and are actively working to address them:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Some third-party embedded content may not be fully accessible</li>
              <li>Complex data tables are being optimized for screen readers</li>
              <li>Live streaming captions are event-dependent</li>
              <li>PDF documents are being updated to meet accessibility standards</li>
            </ul>
          </CardContent>
        </Card>

        {/* Physical Accessibility */}
        <Card>
          <CardHeader>
            <CardTitle>Physical Accessibility at Curling Clubs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              We encourage all curling clubs to provide accessible facilities:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Wheelchair-accessible entrances and washrooms</li>
              <li>Accessible seating areas with good sightlines</li>
              <li>Adaptive equipment for players with disabilities</li>
              <li>Programs for athletes with physical and intellectual disabilities</li>
              <li>Trained staff to assist participants with accessibility needs</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-3">
              Contact individual clubs for specific accessibility information.
            </p>
          </CardContent>
        </Card>

        {/* Feedback */}
        <Card>
          <CardHeader>
            <CardTitle>Feedback and Assistance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              We welcome your feedback on the accessibility of The Button platform. If you encounter 
              any accessibility barriers or have suggestions for improvement, please contact us:
            </p>
            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> accessibility@curling.ca</p>
              <p><strong>Phone:</strong> 1-800-550-2875 (toll-free)</p>
              <p><strong>Mail:</strong> Curling Canada, 1660 Vimont Court, Ottawa, ON K1G 6L2</p>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              We aim to respond to accessibility feedback within 5 business days and will work with 
              you to provide the information you need in an accessible format.
            </p>
          </CardContent>
        </Card>

        {/* Ongoing Efforts */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Ongoing Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Accessibility is an ongoing effort. We are committed to continually improving our 
              platform and will update this statement as we make progress. This statement was last 
              reviewed on November 11, 2025.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
