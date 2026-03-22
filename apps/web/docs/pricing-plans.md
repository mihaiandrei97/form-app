# BForms Pricing Plans

## Overview

BForms uses a **subscription-based pricing model** with an aggressive market positioning strategy to gain market share against competitors like Formspree, Formspark, and Basin.

---

## Pricing Tiers

### Free - $0/month

**Target:** Hobby developers, testing, small personal projects

| Feature                       | Included |
| ----------------------------- | -------- |
| Submissions/month             | 100      |
| Forms                         | 5        |
| Spam protection (honeypot)    | Yes      |
| Domain restrictions           | Yes      |
| Dashboard & submission viewer | Yes      |
| Export (CSV/JSON)             | Yes      |
| Submission history            | 7 days   |
| Email notifications           | No       |
| Discord notifications         | No       |
| Webhooks                      | No       |
| File uploads                  | No       |

---

### Starter - $5/month

**Target:** Freelancers, small business websites, side projects

| Feature                       | Included                    |
| ----------------------------- | --------------------------- |
| Submissions/month             | 2,000                       |
| Forms                         | Unlimited                   |
| Spam protection (honeypot)    | Yes                         |
| Domain restrictions           | Yes                         |
| Dashboard & submission viewer | Yes                         |
| Export (CSV/JSON)             | Yes                         |
| Submission history            | 30 days                     |
| Email notifications           | Limited (20/day, 500/month) |
| Discord notifications         | Yes                         |
| Webhooks                      | No                          |
| File uploads                  | No                          |

---

### Pro - $15/month

**Target:** Agencies, businesses, high-traffic websites

| Feature                       | Included       |
| ----------------------------- | -------------- |
| Submissions/month             | 15,000         |
| Forms                         | Unlimited      |
| Spam protection (honeypot)    | Yes            |
| Domain restrictions           | Yes            |
| Dashboard & submission viewer | Yes            |
| Export (CSV/JSON)             | Yes            |
| Submission history            | 90 days        |
| Email notifications           | 100/day, 3000/month |
| Discord notifications         | Yes            |
| Webhooks                      | Yes            |
| File uploads                  | No             |
| Priority support              | Yes            |

---

## Competitive Analysis

| Plan       | BForms       | Formspree   | Formspark  | Basin      |
| ---------- | ------------ | ----------- | ---------- | ---------- |
| Free       | 100 subs     | 50 subs     | 250 subs   | 100 subs   |
| ~$5-10/mo  | 2,000 @ $5   | 100 @ $10   | 1,000 @ $9 | 2,500 @ $8 |
| ~$12-15/mo | 15,000 @ $15 | 1,000 @ $25 | N/A        | N/A        |

**Positioning:** BForms offers significantly more submissions at lower price points, particularly at the Pro tier.

---

## Feature Gating Summary

| Feature               | Free | Starter | Pro       |
| --------------------- | ---- | ------- | --------- |
| Email notifications   | No   | Limited (20/day, 500/month) | Limited (100/day, 3000/month) |
| Discord notifications | No   | Yes     | Yes       |
| Webhooks              | No   | No      | Yes       |
| File uploads          | No   | No      | No        |

---

## Implementation Requirements

### Database Changes

- Add `plan` table (id, name, slug, price, submission_limit, features)
- Add `subscription` table (user_id, plan_id, stripe_subscription_id, status, current_period_start, current_period_end)
- Add `usage` table (user_id, month, submission_count)

### Feature Flags to Implement

1. `canUseEmailNotifications` - Starter+ (Starter: 20/day, 500/month; Pro: 100/day, 3000/month)
2. `emailDailyLimit` - 20 for Starter, 100 for Pro
3. `emailMonthlyLimit` - 500 for Starter, 3000 for Pro
4. `canUseDiscordNotifications` - Starter+
5. `canUseWebhooks` - Pro+
6. `canUploadFiles` - Disabled for all plans (for now)
7. `submissionHistoryDays` - Free: 7, Starter: 30, Pro: 90

### Third-Party Integrations

- **Stripe** - Payment processing, subscription management, billing portal
- **Stripe Webhooks** - Handle subscription events (created, updated, cancelled, payment_failed)

---

## Revenue Projections (Example)

Assuming 1,000 users after 12 months:

- 70% Free (700 users) = $0
- 22% Starter (220 users) = $1,100/mo
- 8% Pro (80 users) = $960/mo

**Estimated MRR:** $2,060/month

---

## Open Questions

1. Should we offer annual billing with a discount (e.g., 2 months free)?
2. Do we need a custom/enterprise tier for very high volume?
3. Should there be overage charges or hard limits when submission quota is exceeded?
4. Should we implement a trial period for paid plans (e.g., 14-day free trial)?
