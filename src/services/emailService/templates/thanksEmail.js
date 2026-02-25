const config = require("../../../config/env.config");

const createThanksEmailParams = (userEmail) => {
  const fromAddress = config.ses.fromEmail;
  const replyToAddress = config.ses.replyTo;

  const subject = "Thanks for exploring RetireMate";

  const textBody = `Hi there,

Thanks for taking a few minutes to explore your retirement — and for sharing your email so we can stay in touch.

You just completed our "Check if you're prepared" experience and reviewed your RetireMate Roadmap - a snapshot of where you stand today and what matters most next.

What happens now
We've launched the first version of RetireMate and are building the system to email a more in‑depth copy of your Roadmap. Once it's ready, we'll send yours straight away.

Why RetireMate exists
Retirement can feel overwhelming - many don't know where to start. We're building RetireMate to bring everything together in one place - from financial planning and Medicare to where you live, insurance, and estate planning - so you can get instant, personalized answers without bouncing between sites.

We're also making it easy to explore how people like you are preparing for retirement, and to find trusted professionals when you want hands‑on help.

We'd value your feedback
If anything felt confusing, helpful, or missing, we'd love to hear it. Your input directly shapes what we build next.

Thanks again for exploring RetireMate. We'll be here, every step of the way.

- John Turner (Co-Founder/CEO)
and the RetireMate Team`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .section-title { font-weight: 600; color: #2563eb; margin-bottom: 8px; margin-top: 20px; }
    .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea; }
  </style>
</head>
<body>
  <p>Hi there,</p>
  
  <p>Thanks for taking a few minutes to explore your retirement — and for sharing your email so we can stay in touch.</p>
  <p>You just completed our "Check if you're prepared" experience and reviewed your RetireMate Roadmap - a snapshot of where you stand today and what matters most next.</p>
  
  <div class="section-title">What happens now</div>
  <p>We've launched the first version of RetireMate and are building the system to email a more in‑depth copy of your Roadmap. Once it's ready, we'll send yours straight away.</p>
  
  <div class="section-title">Why RetireMate exists</div>
  <p>Retirement can feel overwhelming - many don't know where to start. We're building RetireMate to bring everything together in one place - from financial planning and Medicare to where you live, insurance, and estate planning - so you can get instant, personalized answers without bouncing between sites.</p>
  <p>We're also making it easy to explore how people like you are preparing for retirement, and to find trusted professionals when you want hands‑on help.</p>
  
  <div class="section-title">We'd value your feedback</div>
  <p>If anything felt confusing, helpful, or missing, we'd love to hear it. Your input directly shapes what we build next.</p>
  
  <p>Thanks again for exploring RetireMate. We'll be here, every step of the way.</p>
  
  <div class="signature">
    <p>- John Turner (Co-Founder/CEO)</p>
    <p>and the RetireMate Team</p>
  </div>
</body>
</html>
  `;

  return {
    Destination: {
      ToAddresses: [userEmail],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: htmlBody,
        },
        Text: {
          Charset: "UTF-8",
          Data: textBody,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },

    Source: fromAddress,
    From: `"RetireMate" <${fromAddress}>`,
    ReplyToAddresses: [replyToAddress],
  };
};

module.exports = { createThanksEmailParams };
