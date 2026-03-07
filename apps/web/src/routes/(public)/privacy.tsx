import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/(public)/privacy")({
  head: () => ({
    meta: [{ title: "Privacy Policy | BForms" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
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

      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="text-muted-foreground mt-2">Last updated: February 13, 2026</p>

      <div className="mt-8 max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold">1. Information We Collect</h2>
          <p className="text-muted-foreground mt-2">
            We collect information you provide directly to us when you create an
            account, upload content, or communicate with us.
          </p>
          <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-1">
            <li>Account information (name, email, password)</li>
            <li>Profile information</li>
            <li>Payment information</li>
            <li>Content you upload (forms, submissions, metadata)</li>
            <li>Communications with us</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
          <p className="text-muted-foreground mt-2">
            We use the information we collect to provide, maintain, and improve our
            services:
          </p>
          <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-1">
            <li>To provide and deliver the services you request</li>
            <li>To process transactions and send related information</li>
            <li>To send you technical notices, updates, and support messages</li>
            <li>To respond to your comments and questions</li>
            <li>To monitor and analyze trends, usage, and activities</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">3. Account Registration</h2>
          <p className="text-muted-foreground mt-2">
            When you create an account, we collect your name, email address, and
            password. This information is required to create and maintain your account
            and provide you with access to our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">4. Information Sharing</h2>
          <p className="text-muted-foreground mt-2">
            We do not sell or rent your personal information to third parties. We may
            share your information in the following circumstances:
          </p>
          <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-1">
            <li>With your consent</li>
            <li>With service providers who perform services on our behalf</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and prevent fraud</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">5. How We Share Your Information</h2>
          <p className="text-muted-foreground mt-2">
            We work with third-party service providers to help us operate our business
            and provide services to you. These providers include cloud storage
            providers, payment processors, and analytics services. We ensure these
            providers are contractually obligated to protect your information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">6. Data Retention</h2>
          <p className="text-muted-foreground mt-2">
            We retain your information for as long as your account is active or as
            needed to provide you services. If you wish to delete your account, please
            contact us. We will delete your information within 30 days of your request,
            except where we are required to retain it for legal purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">7. Children&apos;s Privacy</h2>
          <p className="text-muted-foreground mt-2">
            Our services are not directed to children under 13 years of age. We do not
            knowingly collect personal information from children under 13. If you become
            aware that a child has provided us with personal information, please contact
            us.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">8. Changes to This Privacy Policy</h2>
          <p className="text-muted-foreground mt-2">
            We may update this Privacy Policy from time to time. We will notify you of
            any changes by posting the new Privacy Policy on this page and updating the
            &quot;Last Updated&quot; date. You are advised to review this Privacy Policy
            periodically for any changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">9. Contact Us</h2>
          <p className="text-muted-foreground mt-2">
            If you have any questions about this Privacy Policy, please contact us at:
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
