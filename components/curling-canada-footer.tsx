import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function CurlingCanadaFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-curling-red-500" />
              <span className="text-lg font-bold">
                <span className="text-curling-red-600">Curling</span>{" "}
                <span className="text-curling-blue-600">Canada</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              The official governing body for curling in Canada
            </p>
            <div className="flex gap-4">
              <Link 
                href="https://facebook.com/curlingcanada" 
                target="_blank"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link 
                href="https://twitter.com/CurlingCanada" 
                target="_blank"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link 
                href="https://instagram.com/curlingcanada" 
                target="_blank"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link 
                href="https://youtube.com/curlingcanada" 
                target="_blank"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Events */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Events</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/events" className="text-muted-foreground hover:text-foreground transition-colors">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link href="/events/register" className="text-muted-foreground hover:text-foreground transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/events/championships" className="text-muted-foreground hover:text-foreground transition-colors">
                  Championships
                </Link>
              </li>
              <li>
                <Link href="/events/schedule" className="text-muted-foreground hover:text-foreground transition-colors">
                  Schedule
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Community</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/teams" className="text-muted-foreground hover:text-foreground transition-colors">
                  Teams
                </Link>
              </li>
              <li>
                <Link href="/clubs" className="text-muted-foreground hover:text-foreground transition-colors">
                  Clubs
                </Link>
              </li>
              <li>
                <Link href="/athletes" className="text-muted-foreground hover:text-foreground transition-colors">
                  Athletes
                </Link>
              </li>
              <li>
                <Link href="/coaches" className="text-muted-foreground hover:text-foreground transition-colors">
                  Coaches
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-muted-foreground hover:text-foreground transition-colors">
                  News & Articles
                </Link>
              </li>
              <li>
                <Link href="/learn" className="text-muted-foreground hover:text-foreground transition-colors">
                  Learn to Curl
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Curling Canada. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/accessibility" className="text-muted-foreground hover:text-foreground transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
