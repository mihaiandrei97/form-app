import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/(public)/terms")({
  head: () => ({
    meta: [{ title: "Terms of Service | BForms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6"
        nativeButton={false}
        render={<a href="/" />}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>

      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="text-muted-foreground mt-2">Last updated: February 13, 2026</p>

      <div className="mt-8 max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold">1. Introduction</h2>
          <p className="text-muted-foreground mt-2">
            Welcome to BForms. These Terms of Service (&quot;Terms&quot;) constitute a
            legally binding agreement between you (&quot;User&quot;) and{" "}
            <strong className="text-foreground">WatermelonTech SRL</strong>{" "}
            (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;),
            governing your use of the BForms platform (the &quot;Service&quot;).
          </p>
          <div className="text-muted-foreground mt-3 space-y-1 text-sm">
            <p>
              <strong className="text-foreground">Registration Code:</strong> RO48895393
            </p>
            <p>
              <strong className="text-foreground">Address:</strong> Alexandru Obregia 8,
              Sector 4, Bucharest, Romania
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold">2. Acceptance of Terms</h2>
          <p className="text-muted-foreground mt-2">
            By accessing or using the Service, you acknowledge that you have read,
            understood, and agree to be bound by these Terms. If you do not agree, you
            must not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">3. Changes to Terms</h2>
          <p className="text-muted-foreground mt-2">
            We reserve the right to modify these terms at any time. We will notify users
            of any material changes via email or through a notice on our website. Your
            continued use of the service after such modifications constitutes your
            acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">4. Account Registration</h2>
          <p className="text-muted-foreground mt-2">
            To use our services, you must create an account. When creating an account, you
            agree to:
          </p>
          <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-1">
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and promptly update your account information</li>
            <li>Maintain the security of your password</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of any unauthorized use</li>
            <li>
              Not register using bots or automated methods — accounts must be created by
              humans
            </li>
            <li>Not maintain more than one free account to circumvent usage limits</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">5. User Conduct and Acceptable Use</h2>
          <p className="text-muted-foreground mt-2">
            You agree to use our services only for lawful purposes and in accordance with
            these terms. You agree not to:
          </p>
          <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-1">
            <li>Upload content that infringes on intellectual property rights</li>
            <li>Upload content that is unlawful, harmful, or offensive</li>
            <li>
              Host phishing content, malware, or deceptive schemes intended to steal user
              data
            </li>
            <li>Use the service to distribute spam</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>
              Reverse engineer, decompile, or attempt to derive the source code of the
              Service
            </li>
            <li>Interfere with or disrupt the service</li>
            <li>Use the service for any commercial purpose without authorization</li>
          </ul>
          <p className="text-muted-foreground mt-2">
            <strong className="text-foreground">API Throttling &amp; Limits:</strong> We
            reserve the right to temporarily throttle or limit your access to the Service
            if your usage exceeds reasonable limits or significantly impacts the stability
            of the Service, even if such usage is technically within the quotas of your
            subscription plan.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">6. Subscriptions and Payments</h2>
          <h3 className="text-foreground mt-3 font-medium">6.1. Merchant of Record</h3>
          <p className="text-muted-foreground mt-2">
            We use <strong className="text-foreground">Creem.io</strong> as our authorized
            reseller and Merchant of Record. You acknowledge that while WatermelonTech SRL
            provides the software service, the contractual relationship regarding payment
            processing, tax collection, and invoicing is solely between you and Creem.io.
          </p>
          <p className="text-muted-foreground mt-2">
            By subscribing, you agree to be bound by Creem.io&apos;s{" "}
            <a
              href="https://www.creem.io/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="https://www.creem.io/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline"
            >
              Privacy Policy
            </a>
            .
          </p>
          <h3 className="text-foreground mt-3 font-medium">
            6.2. Management and Refunds
          </h3>
          <p className="text-muted-foreground mt-2">
            Subscription management (cancellations, upgrades, payment methods) is handled
            exclusively via the Creem.io Customer Portal linked in your settings.{" "}
            <strong className="text-foreground">Payments are non-refundable</strong>{" "}
            unless strictly required by law.
          </p>
          <h3 className="text-foreground mt-3 font-medium">6.3. Plan Limit Updates</h3>
          <p className="text-muted-foreground mt-2">
            We reserve the right to modify the usage limits, quotas, and features included
            in both Free and Paid plans at any time. While we will attempt to notify users
            of significant changes, we are not required to provide prior notice for such
            adjustments.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">7. Privacy and Data Collection</h2>
          <p className="text-muted-foreground mt-2">
            Your use of our services is also governed by our Privacy Policy. We collect,
            use, and protect your personal information as described in our Privacy Policy.
            By using our services, you consent to our collection and use of personal data
            as outlined in the Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">8. Electronic Communications</h2>
          <p className="text-muted-foreground mt-2">
            By creating an account, you consent to receive electronic communications from
            us. These communications may include:
          </p>
          <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-1">
            <li>
              <strong className="text-foreground">Transactional Emails:</strong> Notices
              about your account, password changes, billing information, and other
              administrative information. These are mandatory for the provision of the
              Service.
            </li>
            <li>
              <strong className="text-foreground">Marketing Emails:</strong> If you have
              opted in, we may send you newsletters, special offers, and promotions. You
              may opt out at any time by following the unsubscribe link in the email.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">9. Intellectual Property</h2>
          <p className="text-muted-foreground mt-2">
            You retain all rights to the content you upload to our service. By uploading
            content, you grant us a limited license to:
          </p>
          <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-1">
            <li>Store and process your content to provide the service</li>
            <li>Display your content back to you</li>
            <li>Make backups of your content</li>
          </ul>
          <p className="text-muted-foreground mt-2">
            All rights in the Service, including software, design, and trademarks, are and
            will remain the exclusive property of WatermelonTech SRL and its licensors.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">10. Termination</h2>
          <p className="text-muted-foreground mt-2">
            We reserve the right to suspend or terminate your access to the Service
            immediately, without prior notice, if you breach these Terms (e.g., hosting
            phishing schemas or attempting unauthorized access to our systems). Upon
            termination, your right to use the service will cease immediately. You may
            also terminate your account at any time by contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">
            11. Disclaimers and Limitation of Liability
          </h2>
          <p className="text-muted-foreground mt-2">
            The service is provided &quot;as is&quot; and &quot;as available&quot; without
            warranties of any kind, either express or implied. We do not warrant that the
            service will be uninterrupted, secure, or error-free.
          </p>
          <p className="text-muted-foreground mt-2">
            To the maximum extent permitted by law, WatermelonTech SRL shall not be liable
            for any indirect, incidental, special, consequential, or punitive damages, or
            any loss of profits or revenues, whether incurred directly or indirectly, or
            any loss of data, use, goodwill, or other intangible losses.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">12. Force Majeure</h2>
          <p className="text-muted-foreground mt-2">
            WatermelonTech SRL shall not be liable for any failure to perform its
            obligations where such failure results from any cause beyond our reasonable
            control, including without limitation mechanical, electronic or communications
            failure or degradation, natural disasters, or third-party service provider
            failures (e.g., infrastructure or payment processor outages).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">13. Governing Law</h2>
          <p className="text-muted-foreground mt-2">
            These Terms shall be governed by and construed in accordance with the laws of{" "}
            <strong className="text-foreground">Romania</strong>. Any legal suit, action,
            or proceeding arising out of or related to these Terms shall be instituted
            exclusively in the courts of{" "}
            <strong className="text-foreground">Bucharest, Romania</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">14. Contact Us</h2>
          <p className="text-muted-foreground mt-2">
            If you have any questions about these Terms and Conditions, please contact us
            at:
          </p>
          <p className="text-muted-foreground mt-2">
            <strong className="text-foreground">Email:</strong> contact@bforms.dev
          </p>
        </section>
      </div>
    </main>
  );
}
