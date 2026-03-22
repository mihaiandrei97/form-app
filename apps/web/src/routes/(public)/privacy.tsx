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
          <h2 className="text-xl font-semibold">1. Data Controller</h2>
          <p className="text-muted-foreground mt-2">
            <strong className="text-foreground">WatermelonTech SRL</strong>{" "}
            (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is the Data Controller
            for the personal information collected through the BForms platform. We are a
            company registered in Romania (EU) and are committed to protecting your
            privacy in accordance with the General Data Protection Regulation (GDPR).
          </p>
          <div className="text-muted-foreground mt-3 space-y-1 text-sm">
            <p>
              <strong className="text-foreground">Registration Code:</strong> RO48895393
            </p>
            <p>
              <strong className="text-foreground">Address:</strong> Alexandru Obregia 8,
              Sector 4, Bucharest, Romania
            </p>
            <p>
              <strong className="text-foreground">Email:</strong>{" "}
              watermelontech.dev@gmail.com
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold">2. Data Collection &amp; Legal Basis</h2>
          <p className="text-muted-foreground mt-2">
            We collect data to provide the Service. Under GDPR Article 6, we rely on
            specific legal grounds for processing your data:
          </p>
          <div className="mt-3 overflow-hidden rounded-md border">
            <table className="text-muted-foreground w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-foreground px-4 py-2 text-left font-medium">
                    Data Type
                  </th>
                  <th className="text-foreground px-4 py-2 text-left font-medium">
                    Legal Basis
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-2">Account Info (Email, Name)</td>
                  <td className="px-4 py-2">
                    <strong className="text-foreground">Contractual Necessity</strong> (to
                    provide the Service)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Billing Data (via Creem)</td>
                  <td className="px-4 py-2">
                    <strong className="text-foreground">Legal Obligation</strong>{" "}
                    (Tax/Accounting) &amp; Contract
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Usage Logs</td>
                  <td className="px-4 py-2">
                    <strong className="text-foreground">Legitimate Interest</strong>{" "}
                    (Security &amp; Service Improvement)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Marketing Consent</td>
                  <td className="px-4 py-2">
                    <strong className="text-foreground">Consent</strong> (Explicit Opt-in)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold">3. Payment Information</h2>
          <p className="text-muted-foreground mt-2">
            <strong className="text-foreground">Important:</strong> We do not collect,
            store, or process your credit card numbers or financial details on our
            servers.
          </p>
          <p className="text-muted-foreground mt-2">
            We partner with <strong className="text-foreground">Creem.io</strong>, an
            authorized reseller and Merchant of Record, to handle all billing and
            subscriptions. When you subscribe to a paid plan, you interact directly with
            Creem.io. We share only your email address and a unique user ID with them to
            link the payment to your BForms account. Their handling of your financial data
            is governed by the{" "}
            <a
              href="https://www.creem.io/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline"
            >
              Creem.io Privacy Policy
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">4. Service Providers (Sub-processors)</h2>
          <p className="text-muted-foreground mt-2">
            We engage trusted third-party service providers to help us operate BForms.
            Your data is stored on servers located within the EU.
          </p>
          <div className="mt-3 overflow-hidden rounded-md border">
            <table className="text-muted-foreground w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-foreground px-4 py-2 text-left font-medium">
                    Provider
                  </th>
                  <th className="text-foreground px-4 py-2 text-left font-medium">
                    Purpose
                  </th>
                  <th className="text-foreground px-4 py-2 text-left font-medium">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-2 font-medium">Hetzner</td>
                  <td className="px-4 py-2">Hosting &amp; Infrastructure</td>
                  <td className="px-4 py-2">EU (Germany / Finland)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">Creem.io</td>
                  <td className="px-4 py-2">Payments &amp; Subscriptions</td>
                  <td className="px-4 py-2">EU / Global</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold">5. Security of Data</h2>
          <p className="text-muted-foreground mt-2">
            The security of your data is important to us. We implement industry-standard
            security measures, including:
          </p>
          <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-1">
            <li>
              <strong className="text-foreground">Encryption:</strong> All data is
              encrypted in transit (via SSL/TLS) and at rest within our database.
            </li>
            <li>
              <strong className="text-foreground">Access Control:</strong> Access to
              personal data is restricted to authorized personnel who need it to operate
              the Service.
            </li>
            <li>
              <strong className="text-foreground">Authentication:</strong> We use secure,
              token-based authentication to protect your account.
            </li>
          </ul>
          <p className="text-muted-foreground mt-2">
            No method of transmission over the Internet is 100% secure. While we strive to
            use commercially acceptable means to protect your data, we cannot guarantee
            its absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">6. Marketing Communications</h2>
          <p className="text-muted-foreground mt-2">
            We only send marketing emails (newsletters, product updates) if you have{" "}
            <strong className="text-foreground">explicitly opted in</strong> to receive
            them. You have the right to withdraw your consent at any time by clicking the
            &quot;Unsubscribe&quot; link in any marketing email or by contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">7. Data Retention and Backups</h2>
          <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-1">
            <li>
              <strong className="text-foreground">Active Accounts:</strong> We retain your
              data for as long as your account remains active.
            </li>
            <li>
              <strong className="text-foreground">Deleted Accounts:</strong> If you delete
              your account, your personal data is removed from our live production
              database within 30 days of your request, except where we are required to
              retain it for legal purposes.
            </li>
            <li>
              <strong className="text-foreground">Backups:</strong> To prevent accidental
              data loss, we maintain encrypted backups. Data from deleted accounts may
              persist in these secure archives for up to{" "}
              <strong className="text-foreground">30 days</strong> before being
              overwritten.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">8. Your Rights (GDPR)</h2>
          <p className="text-muted-foreground mt-2">
            As a resident of the EU/EEA, under the GDPR you have the right to:
          </p>
          <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-1">
            <li>
              <strong className="text-foreground">Access:</strong> Request a copy of the
              data we hold about you.
            </li>
            <li>
              <strong className="text-foreground">Rectification:</strong> Correct
              inaccurate data via your account settings or by contacting us.
            </li>
            <li>
              <strong className="text-foreground">Erasure:</strong> Request the deletion
              of your account and associated data (&quot;Right to be Forgotten&quot;).
            </li>
            <li>
              <strong className="text-foreground">Portability:</strong> Request your data
              in a machine-readable format.
            </li>
            <li>
              <strong className="text-foreground">Objection:</strong> Object to processing
              based on legitimate interests.
            </li>
            <li>
              <strong className="text-foreground">Lodge a complaint:</strong> You have the
              right to lodge a complaint with the Romanian data protection authority
              (ANSPDCP) at{" "}
              <a
                href="https://www.dataprotection.ro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline"
              >
                www.dataprotection.ro
              </a>
              .
            </li>
          </ul>
          <p className="text-muted-foreground mt-2">
            To exercise any of these rights, please contact us at
            watermelontech.dev@gmail.com.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">9. Children&apos;s Privacy</h2>
          <p className="text-muted-foreground mt-2">
            Our Service is not directed to anyone under the age of 16. We do not knowingly
            collect personally identifiable information from anyone under 16. If you are a
            parent or guardian and believe your child has provided us with personal data,
            please contact us and we will take steps to remove that information from our
            servers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">10. Changes to This Privacy Policy</h2>
          <p className="text-muted-foreground mt-2">
            We may update this Privacy Policy from time to time. We will notify you of any
            changes by posting the new Privacy Policy on this page and updating the
            &quot;Last Updated&quot; date. You are advised to review this Privacy Policy
            periodically for any changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">11. Contact Us</h2>
          <p className="text-muted-foreground mt-2">
            If you have any questions about this Privacy Policy or wish to exercise your
            rights, please contact us at:
          </p>
          <p className="text-muted-foreground mt-2">
            <strong className="text-foreground">Email:</strong> contact@bforms.dev
          </p>
        </section>
      </div>
    </main>
  );
}
