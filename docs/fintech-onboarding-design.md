# Fintech Onboarding UI/UX Design Proposal

## Design Philosophy

**"Trust through elegance"** - Every pixel serves clarity. Fintech users need confidence, not complexity.

---

## Visual Design System

### Color Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| **Primary** | Deep Navy | `#0F172A` | Headers, primary text, CTAs |
| **Secondary** | Slate Blue | `#334155` | Secondary text, borders |
| **Accent** | Electric Blue | `#0EA5E9` | Interactive elements, links |
| **Success** | Emerald | `#10B981` | Positive states, growth |
| **Warning** | Amber | `#F59E0B` | Alerts, pending states |
| **Error** | Coral Red | `#EF4444` | Errors, critical alerts |
| **Background** | Snow White | `#FAFBFC` | Page background |
| **Surface** | Pure White | `#FFFFFF` | Cards, modals |
| **Dark Mode BG** | Charcoal | `#0B1120` | Dark mode background |

### Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| **Headlines** | SF Pro Display | 700 (Bold) | 32px / 28px / 24px |
| **Subheadlines** | SF Pro Display | 600 (Semibold) | 20px / 18px |
| **Body** | Inter | 400 (Regular) | 16px / 14px |
| **Captions** | Inter | 500 (Medium) | 12px |
| **Numbers** | JetBrains Mono | 500 | 24px / 18px / 16px |

### Spacing System (8px grid)

- `xs`: 4px
- `sm`: 8px  
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

### Border Radius

- `sm`: 6px (inputs)
- `md`: 10px (buttons, cards)
- `lg`: 16px (modals, panels)
- `xl`: 24px (large containers)
- `full`: 9999px (avatars, pills)

---

## Onboarding Flow Design

### Step 1: Welcome & Value Prop
```
┌─────────────────────────────────────────────┐
│  🏦  FINCORP                               │
│                                             │
│     Your finances,                         │
│     unified and effortless.                │
│                                             │
│     [Get Started] →                        │
│                                             │
│     Already have an account? [Sign In]     │
│                                             │
│  ─────────────────────────────────────     │
│  🔒 Bank-grade security   ✓ SOC 2 certified│
└─────────────────────────────────────────────┘
```

### Step 2: Account Type Selection
```
┌─────────────────────────────────────────────┐
│  Step 1 of 4                               │
│  ████████░░░░░░░░  25%                      │
│                                             │
│  How will you use FinCorp?                  │
│                                             │
│  ┌─────────────┐  ┌─────────────┐          │
│  │   👤        │  │   🏢        │          │
│  │  Personal   │  │   Business  │          │
│  │             │  │             │          │
│  │ For everyday│  │ For company │          │
│  │  spending   │  │  expenses   │          │
│  └─────────────┘  └─────────────┘          │
│                                             │
│  [← Back]                    [Continue →]  │
└─────────────────────────────────────────────┘
```

### Step 3: Email & Phone (Progressive KYC)
```
┌─────────────────────────────────────────────┐
│  Step 2 of 4                               │
│  ████████████░░░░  50%                      │
│                                             │
│  Let's get you set up                      │
│                                             │
│  📧  email@company.com                      │
│                                             │
│  We'll send a verification code            │
│                                             │
│  ✓ Check your inbox for confirmation       │
│                                             │
│  [← Back]                    [Continue →]  │
│                                             │
│  By continuing, you agree to our           │
│  Terms of Service and Privacy Policy       │
└─────────────────────────────────────────────┘
```

### Step 4: Identity Verification (Micro-step)
```
┌─────────────────────────────────────────────┐
│  Step 3 of 4  (~45 seconds)                │
│  ████████████████░░  75%                    │
│                                             │
│  Verify your identity                       │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  📷  Scan your ID                   │   │
│  │      Takes 30 seconds               │   │
│  │                                     │   │
│  │      [Start Scanning]               │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  🔐  Use biometric                  │   │
│  │      Faster, more secure            │   │
│  │                                     │   │
│  │      [Use Face ID]                  │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Your data is encrypted and secure.        │
│  We never share your information.          │
└─────────────────────────────────────────────┘
```

### Step 5: Funding Source
```
┌─────────────────────────────────────────────┐
│  Step 4 of 4                               │
│  ████████████████████  100%                │
│                                             │
│  How will you fund your account?           │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  🏦  Link Bank Account              │   │
│  │                                     │   │
│  │  Instant transfers, no fees        │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  💳  Add Debit Card                 │   │
│  │                                     │   │
│  │  Visa, Mastercard accepted          │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  ⏭️  Skip for now                   │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Success State
```
┌─────────────────────────────────────────────┐
│                                             │
│              ✓✓✓                            │
│                                             │
│       You're all set!                       │
│                                             │
│  Welcome to FinCorp, Alex!                  │
│                                             │
│  Your account is ready. Let's make         │
│  your first transfer.                      │
│                                             │
│  [Make Your First Transfer →]              │
│                                             │
│  [Skip for now]                            │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Component Specifications

### Primary Button
```
Height: 48px
Padding: 16px 24px
Background: #0EA5E9 (Electric Blue)
Text: White, 16px, 600 weight
Border-radius: 10px
Shadow: 0 4px 12px rgba(14, 165, 233, 0.25)
Hover: scale(1.02), shadow increases
Active: scale(0.98)
```

### Input Fields
```
Height: 48px
Padding: 12px 16px
Background: #FFFFFF
Border: 1px solid #E2E8F0
Border-radius: 6px
Focus: Border #0EA5E9, shadow 0 0 0 3px rgba(14,165,233,0.1)
Error: Border #EF4444
Label: 14px, 500 weight, #334155
Placeholder: 14px, #94A3B8
```

### Progress Stepper
```
Container height: 4px
Background: #E2E8F0
Progress bar: #0EA5E9
Step indicators: 32px circles above
Active: #0EA5E9 filled
Completed: #10B981 with checkmark
Pending: #CBD5E1 outline
```

### Cards
```
Background: #FFFFFF
Border: 1px solid #E2E8F0
Border-radius: 16px
Padding: 24px
Shadow: 0 1px 3px rgba(0,0,0,0.05)
Hover: Shadow increases, border #0EA5E9
```

### Security Badges
```
Icon: Lock, Shield, Verified
Color: #10B981 (success) or #334155 (neutral)
Size: 16px icon + 12px text
Position: Below CTA or in footer
```

---

## Animation Guidelines

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Page transitions | Slide + fade | 300ms | ease-out |
| Button hover | Scale + shadow | 150ms | ease-in-out |
| Input focus | Border glow | 200ms | ease-out |
| Progress bar | Width expand | 400ms | ease-in-out |
| Success checkmark | Draw + bounce | 500ms | spring |
| Error shake | Horizontal shake | 300ms | ease-in-out |
| Skeleton loading | Pulse | 1500ms | infinite |

---

## Trust & Security UI Patterns

1. **Security indicators visible** - Lock icons, encryption badges
2. **Compliance mentions** - "SOC 2", "FDIC insured", "256-bit encryption"
3. **Transparent fees** - Always show costs before action
4. **Confirmation summaries** - Show transaction details before confirm
5. **Undo patterns** - "Sending... 5s" with cancel option
6. **Biometric prompts** - Face ID, fingerprint as primary auth
7. **Timeout warnings** - "Session expires in 2 minutes"

---

## Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|-------------|-------|----------------|
| Mobile | < 640px | Single column, bottom nav |
| Tablet | 640-1024px | Two column where appropriate |
| Desktop | > 1024px | Centered max-width 480px for forms |

---

## Accessibility (WCAG 2.1 AA)

- All text contrast ratio ≥ 4.5:1
- Touch targets ≥ 44x44px
- Focus states visible
- Screen reader labels
- Keyboard navigation support
- Color not sole indicator of meaning