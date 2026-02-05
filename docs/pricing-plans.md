# BForms Pricing Plans

## Overview

BForms uses a **subscription-based pricing model** with an aggressive market positioning strategy to gain market share against competitors like Formspree, Formspark, and Basin.

---

## Pricing Tiers

### Free - $0/month

**Target:** Hobby developers, testing, small personal projects

| Feature                       | Included  |
| ----------------------------- | --------- |
| Submissions/month             | 100       |
| Forms                         | Unlimited |
| Spam protection (honeypot)    | Yes       |
| Domain restrictions           | Yes       |
| Dashboard & submission viewer | Yes       |
| Export (CSV/JSON)             | Yes       |
| Submission history            | 7 days    |
| Email notifications           | No        |
| Discord notifications         | No        |
| Webhooks                      | No        |
| File uploads                  | No        |
| Branding removal              | No        |

---

### Starter - $5/month

**Target:** Freelancers, small business websites, side projects

| Feature                       | Included  |
| ----------------------------- | --------- |
| Submissions/month             | 1,000     |
| Forms                         | Unlimited |
| Spam protection (honeypot)    | Yes       |
| Domain restrictions           | Yes       |
| Dashboard & submission viewer | Yes       |
| Export (CSV/JSON)             | Yes       |
| Submission history            | 30 days   |
| Email notifications           | Yes       |
| Discord notifications         | Yes       |
| Webhooks                      | No        |
| File uploads                  | No        |
| Branding removal              | Yes       |

---

### Pro - $12/month

**Target:** Agencies, businesses, high-traffic websites

| Feature                       | Included       |
| ----------------------------- | -------------- |
| Submissions/month             | 10,000         |
| Forms                         | Unlimited      |
| Spam protection (honeypot)    | Yes            |
| Domain restrictions           | Yes            |
| Dashboard & submission viewer | Yes            |
| Export (CSV/JSON)             | Yes            |
| Submission history            | 90 days        |
| Email notifications           | Yes            |
| Discord notifications         | Yes            |
| Webhooks                      | Yes            |
| File uploads                  | Yes (5MB/file) |
| Branding removal              | Yes            |
| Priority support              | Yes            |

---

### Business - $29/month (Future)

**Target:** Enterprises, high-volume applications

| Feature                       | Included        |
| ----------------------------- | --------------- |
| Submissions/month             | 50,000          |
| Forms                         | Unlimited       |
| Spam protection (honeypot)    | Yes             |
| Domain restrictions           | Yes             |
| Dashboard & submission viewer | Yes             |
| Export (CSV/JSON)             | Yes             |
| Submission history            | Unlimited       |
| Email notifications           | Yes             |
| Discord notifications         | Yes             |
| Webhooks                      | Yes             |
| File uploads                  | Yes (25MB/file) |
| Branding removal              | Yes             |
| Priority support              | Yes             |
| API access                    | Yes             |
| Team members                  | Up to 5         |

---

## Competitive Analysis

| Plan       | BForms       | Formspree   | Formspark    | Basin        |
| ---------- | ------------ | ----------- | ------------ | ------------ |
| Free       | 100 subs     | 50 subs     | 250 subs     | 100 subs     |
| ~$5-10/mo  | 1,000 @ $5   | 100 @ $10   | 1,000 @ $9   | 2,500 @ $8   |
| ~$12-15/mo | 10,000 @ $12 | 1,000 @ $25 | N/A          | N/A          |
| ~$25-30/mo | 50,000 @ $29 | 5,000 @ $50 | 10,000 @ $29 | 10,000 @ $24 |

**Positioning:** BForms offers significantly more submissions at lower price points, particularly at the Pro tier.

---

## Feature Gating Summary

| Feature               | Free | Starter | Pro | Business |
| --------------------- | ---- | ------- | --- | -------- |
| Email notifications   | No   | Yes     | Yes | Yes      |
| Discord notifications | No   | Yes     | Yes | Yes      |
| Webhooks              | No   | No      | Yes | Yes      |
| File uploads          | No   | No      | Yes | Yes      |
| Remove branding       | No   | Yes     | Yes | Yes      |
| API access            | No   | No      | No  | Yes      |
| Team members          | No   | No      | No  | Yes      |

---

## Implementation Requirements

### Database Changes

- Add `plan` table (id, name, slug, price, submission_limit, features)
- Add `subscription` table (user_id, plan_id, stripe_subscription_id, status, current_period_start, current_period_end)
- Add `usage` table (user_id, month, submission_count)

### Feature Flags to Implement

1. `canUseEmailNotifications` - Starter+
2. `canUseDiscordNotifications` - Starter+
3. `canUseWebhooks` - Pro+
4. `canUploadFiles` - Pro+
5. `maxFileSize` - Pro: 5MB, Business: 25MB
6. `showBranding` - Free only
7. `submissionHistoryDays` - Free: 7, Starter: 30, Pro: 90, Business: unlimited

### Third-Party Integrations

- **Stripe** - Payment processing, subscription management, billing portal
- **Stripe Webhooks** - Handle subscription events (created, updated, cancelled, payment_failed)

---

## Revenue Projections (Example)

Assuming 1,000 users after 12 months:

- 70% Free (700 users) = $0
- 20% Starter (200 users) = $1,000/mo
- 8% Pro (80 users) = $960/mo
- 2% Business (20 users) = $580/mo

**Estimated MRR:** $2,540/month

---

## Open Questions

1. Should we offer annual billing with a discount (e.g., 2 months free)?
2. Do we need a custom/enterprise tier for very high volume?
3. Should there be overage charges or hard limits when submission quota is exceeded?
4. Should we implement a trial period for paid plans (e.g., 14-day free trial)?
