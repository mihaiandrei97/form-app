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
          <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground mt-2">
            By accessing and using our app, you accept and agree to be bound by the
            terms and provision of this agreement. If you do not agree to these terms,
            please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">2. Changes to Terms</h2>
          <p className="text-muted-foreground mt-2">
            We reserve the right to modify these terms at any time. We will notify users
            of any material changes via email or through a notice on our website. Your
            continued use of the service after such modifications constitutes your
            acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">3. Account Registration</h2>
          <p className="text-muted-foreground mt-2">
            To use our services, you must create an account. When creating an account,
            you agree to:
          </p>
          <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-1">
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and promptly update your account information</li>
            <li>Maintain the security of your password</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of any unauthorized use</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">4. User Obligations</h2>
          <p className="text-muted-foreground mt-2">
            You agree to use our services only for lawful purposes and in accordance
            with these terms. You agree not to:
          </p>
          <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-1">
            <li>Upload content that infringes on intellectual property rights</li>
            <li>Upload content that is unlawful, harmful, or offensive</li>
            <li>Use the service to distribute malware or spam</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with or disrupt the service</li>
            <li>Use the service for any commercial purpose without authorization</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">5. Privacy and Data Collection</h2>
          <p className="text-muted-foreground mt-2">
            Your use of our services is also governed by our Privacy Policy. We collect,
            use, and protect your personal information as described in our Privacy
            Policy. By using our services, you consent to our collection and use of
            personal data as outlined in the Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">6. Intellectual Property</h2>
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
            All rights in the service, including software, design, and trademarks, are
            owned by our app or our licensors.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">7. Termination</h2>
          <p className="text-muted-foreground mt-2">
            We may terminate or suspend your account and access to the service
            immediately, without prior notice or liability, for any reason, including if
            you breach these terms. Upon termination, your right to use the service will
            cease immediately. You may also terminate your account at any time by
            contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">
            8. Disclaimers and Limitation of Liability
          </h2>
          <p className="text-muted-foreground mt-2">
            The service is provided &quot;as is&quot; without warranties of any kind,
            either express or implied. We do not warrant that the service will be
            uninterrupted, secure, or error-free.
          </p>
          <p className="text-muted-foreground mt-2">
            To the maximum extent permitted by law, our app shall not be liable for any
            indirect, incidental, special, consequential, or punitive damages, or any
            loss of profits or revenues, whether incurred directly or indirectly, or any
            loss of data, use, goodwill, or other intangible losses.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">9. Governing Law</h2>
          <p className="text-muted-foreground mt-2">
            These terms shall be governed by and construed in accordance with the laws
            of the jurisdiction in which our app operates, without regard to its
            conflict of law provisions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">10. Contact Us</h2>
          <p className="text-muted-foreground mt-2">
            If you have any questions about these Terms and Conditions, please contact
            us at:
          </p>
          <p className="text-muted-foreground mt-2">
            <strong className="text-foreground">Email:</strong>{" "}
            watermelontech.dev@gmail.com
          </p>
        </section>
      </div>
    </main>
  );
}
