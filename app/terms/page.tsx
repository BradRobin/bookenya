import { InstitutionalPage } from "@/components/institutional-page";

export default function TermsPage() {
  return (
    <InstitutionalPage eyebrow="Terms of service" title="Bookenya facilitates booking requests manually.">
      <p>
        Bookenya displays curated property information and helps guests submit
        booking inquiries. The platform does not currently process automated
        payments, issue instant confirmations, or guarantee live room inventory.
      </p>
      <p>
        Final booking details, payment instructions, cancellation terms, and
        availability are confirmed manually by support or the property partner
        before a reservation is considered complete.
      </p>
    </InstitutionalPage>
  );
}
