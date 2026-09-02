const LAST_UPDATED = "August 27, 2026"
const CONTACT_EMAIL = "privacy@rosemary-n-thyme.com"

/**
 * Provides the PrivacyPolicy function.
 */
export default function PrivacyPolicy() {
  return (
    <main class="max-w-2xl mx-2 md:mx-auto mt-20 mb-20 px-2 flex flex-col gap-6">
      <h1 class="text-2xl md:text-5xl border-b-3 md:border-b-4 border-foreground2 pb-2 leading-tight">
        Privacy Policy
      </h1>
      <p class="text-sm text-foreground3">Last updated: {LAST_UPDATED}</p>

      <p class="text-foreground3">
        Rosemary &amp; Thyme ("we", "us") operates rosemary-n-thyme.com. This
        policy explains what data we collect, why, and how you can control it.
      </p>

      <Section title="1. Information We Collect">
        <ul class="list-disc pl-5 flex flex-col gap-1">
          <li>
            <strong>Account data:</strong> email address, display name, and
            (if you sign in with a password) a securely hashed password. We
            never store your password in plain text.
          </li>
          <li>
            <strong>Google Sign-In:</strong> if you use "Continue with
            Google", we receive your Google account's email, name, and a
            unique account identifier (subject ID) from Google, used only to
            create or link your account. We do not receive your Google
            password or access any other Google data.
          </li>
          <li>
            <strong>Content you create:</strong> recipes, ingredients, and
            images you add while using the app.
          </li>
          <li>
            <strong>Session data:</strong> a session identifier stored in a
            cookie, used to keep you signed in.
          </li>
        </ul>
      </Section>

      <Section title="2. Cookies We Use">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-sm">
            <thead>
              <tr class="border-b-2 border-foreground3">
                <th class="py-2 pr-4">Cookie</th>
                <th class="py-2 pr-4">Purpose</th>
                <th class="py-2">Duration</th>
              </tr>
            </thead>
            <tbody class="text-foreground3">
              <tr class="border-b border-foreground2">
                <td class="py-2 pr-4 whitespace-nowrap">session_cookie</td>
                <td class="py-2 pr-4">Keeps you signed in</td>
                <td class="py-2 whitespace-nowrap">30 days</td>
              </tr>
              <tr class="border-b border-foreground2">
                <td class="py-2 pr-4 whitespace-nowrap">post_login_redirect</td>
                <td class="py-2 pr-4">
                  Remembers which page to return you to after Google sign-in
                </td>
                <td class="py-2 whitespace-nowrap">10 minutes</td>
              </tr>
              <tr>
                <td class="py-2 pr-4 whitespace-nowrap">JSESSIONID</td>
                <td class="py-2 pr-4">
                  Temporary, set only during the Google sign-in handshake
                </td>
                <td class="py-2 whitespace-nowrap">Session</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="text-foreground3">
          These cookies are strictly necessary for the app to function
          (signing you in and keeping you signed in) - we do not use cookies
          for advertising or cross-site tracking, and do not currently use
          any analytics cookies.
        </p>
      </Section>

      <Section title="3. How We Use Your Data">
        <ul class="list-disc pl-5 flex flex-col gap-1">
          <li>To create and secure your account</li>
          <li>To let you sign in (via password or Google)</li>
          <li>To store and display the recipes you create</li>
          <li>To keep you signed in across visits</li>
        </ul>
        <p class="text-foreground3">
          We do not sell your data or share it with third parties for
          advertising.
        </p>
      </Section>

      <Section title="4. Third-Party Services">
        <p class="text-foreground3">
          We use Google Sign-In (Google LLC) for authentication. When you
          choose to sign in with Google, your use of that feature is also
          subject to Google's own Privacy Policy:{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            class="text-orange underline"
          >
            policies.google.com/privacy
          </a>
          .
        </p>
      </Section>

      <Section title="5. Data Retention">
        <p class="text-foreground3">
          We keep your account data for as long as your account exists.
          Recipes remain until you delete them or delete your account.
        </p>
      </Section>

      <Section title="6. Your Rights">
        <ul class="list-disc pl-5 flex flex-col gap-1">
          <li>Edit or delete your recipes at any time</li>
          <li>
            Request deletion of your account and all associated data by
            contacting us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} class="text-orange underline">
              {CONTACT_EMAIL}
            </a>
          </li>
          <li>Ask what data we hold about you</li>
        </ul>
      </Section>

      <Section title="7. Data Security">
        <p class="text-foreground3">
          Passwords are hashed (BCrypt), never stored in plain text. Session
          cookies are httpOnly and transmitted only over HTTPS.
        </p>
      </Section>

      <Section title="8. Changes to This Policy">
        <p class="text-foreground3">
          We may update this policy occasionally. The "Last updated" date
          above reflects the latest revision.
        </p>
      </Section>

      <Section title="9. Contact">
        <p class="text-foreground3">
          Questions about this policy or your data:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} class="text-orange underline">
            {CONTACT_EMAIL}
          </a>
        </p>
      </Section>
    </main>
  )
}

function Section(props: { title: string; children: any }) {
  return (
    <section class="flex flex-col gap-2">
      <h2 class="text-lg md:text-2xl font-bold">{props.title}</h2>
      {props.children}
    </section>
  )
}
