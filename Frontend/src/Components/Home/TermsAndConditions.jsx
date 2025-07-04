import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
      <p className="text-sm text-gray-500 mb-8">Last Updated: [Insert Date]</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
        <p>
          Smart Dairy is an advanced dairy management solution developed by
          Vikern Smart Invent Software Technology Pvt. Ltd. It helps dairy
          businesses streamline milk collection, supplier/customer tracking,
          reporting, and record-keeping to boost efficiency and profitability.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">2. Company Information</h2>
        <p>
          <strong>Company:</strong> Vikern Smart Invent Software Technology Pvt.
          Ltd.
        </p>
        <p>
          <strong>Address:</strong> Nimon, Tal-Sangamner, Dist-Ahmednagar,
          Maharashtra, India – 422605
        </p>
        <p>
          <strong>Phone:</strong> (02425) 223344
        </p>
        <p>
          <strong>WhatsApp:</strong> +91 9822180270, +91 9403228344
        </p>
        <p>
          <strong>Email:</strong> help@vsitrade.com, vikern@vsitrade.com
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">3. Use of Our Services</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>
            You agree to use Smart Dairy only for lawful, legitimate business
            purposes.
          </li>
          <li>You must keep login credentials confidential and secure.</li>
          <li>You must notify us in case of any unauthorized access.</li>
        </ul>
        <p className="mt-3 font-semibold">You must not:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>Engage in fraudulent or illegal activities.</li>
          <li>Reverse-engineer, resell, or tamper with the platform.</li>
          <li>Attempt unauthorized access to the system or data.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">4. Intellectual Property</h2>
        <p>
          All content, trademarks, and intellectual property on Smart Dairy are
          the property of Vikern Smart Invent Software Technology Pvt. Ltd. and
          may not be used without permission.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">5. Data Privacy</h2>
        <p>
          We prioritize user data protection. Information collected is securely
          stored and used only to deliver services. For full details, refer to
          our Privacy Policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          6. Subscription & Payment
        </h2>
        <p>
          Some Smart Dairy features may require paid subscriptions. You agree to
          the applicable fees, billing cycles, and terms specified in your plan.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          7. Cancellation & Termination
        </h2>
        <p>
          We may suspend or terminate your account for violations of these
          Terms. You may cancel anytime by contacting support. Refunds, if any,
          are subject to our subscription policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          8. Limitation of Liability
        </h2>
        <p>
          Smart Dairy is provided “as is” without warranties. We are not liable
          for any damages resulting from use or inability to use the service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">9. Modifications</h2>
        <p>
          We may update these Terms periodically. Continued use after changes
          means you accept the revised Terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">10. Governing Law</h2>
        <p>
          These Terms are governed by the laws of India. Disputes shall be
          subject to the jurisdiction of courts in Sangamner, Maharashtra.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">11. Contact Us</h2>
        <p>For questions regarding these Terms, please contact:</p>
        <ul className="list-none ml-0 mt-2">
          <li>📧 Email: help@vsitrade.com | vikern@vsitrade.com</li>
          <li>📞 Phone: (02425) 223344</li>
          <li>📱 WhatsApp: +91 9822180270, +91 9403228344</li>
        </ul>
      </section>
    </div>
  );
};

export default TermsAndConditions;
