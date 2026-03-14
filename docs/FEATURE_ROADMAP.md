# YardLedger — Feature Roadmap

## Planned Features

### 1. Tare Weight (Gross-Net-Tare)

**Priority:** High — core workflow improvement

Every scale transaction needs this. Instead of entering net weight directly:

- Enter **gross weight** (vehicle + material on scale)
- Enter **tare weight** (empty vehicle / container weight)
- App auto-calculates **net weight** (gross − tare)
- Option to enter net weight directly (skip tare) for walk-in customers
- Save tare presets for regular trucks/containers

### 2. Multi-Ticket Quick Mode

**Priority:** High — busy yard efficiency

After saving a receipt, instead of navigating back to the list:

- Show a success confirmation with receipt summary
- "New Ticket" button immediately starts a fresh receipt
- Optionally carry over customer info (same customer, multiple loads)
- Reduces taps from 4+ to 1 between consecutive transactions

### 3. Daily Close-Out

**Priority:** Medium — admin/bookkeeping

End-of-day workflow:

- Admin taps "Close Day" from dashboard or admin panel
- Summary screen shows:
  - Total receipts created (buy count)
  - Total weight purchased (lbs)
  - Total cash paid out to customers
  - Total sales revenue
  - Net cash position (sales − payouts)
  - Discrepancies / flagged items
- Creates a snapshot record in DB (audit trail)
- Historical close-outs viewable for bookkeeping
- Optional: locks closed day's receipts from edits

### 4. Search & Filter

**Priority:** High — usability

- Search receipts by customer name, receipt number, or metal type
- Search sales by metal or date
- Filter by metal category, price range, weight range
- Persistent filter chips at top of lists

### 5. Swipe Actions

**Priority:** Medium — UX polish

- Swipe left on receipt → void / delete
- Swipe right on receipt → reprint / share
- Swipe on sale → view details
- Uses `react-native-gesture-handler` (already installed)

### 6. Haptic Feedback

**Priority:** Medium — native feel

Using `expo-haptics`:

- `ImpactFeedbackStyle.Light` — selecting a metal, category, or list item
- `ImpactFeedbackStyle.Medium` — receipt saved, sale completed
- `NotificationFeedbackType.Success` — successful operations
- `NotificationFeedbackType.Warning` — validation errors, price override alerts
- `NotificationFeedbackType.Error` — failed operations
- Tap feedback on all buttons and interactive elements

### 7. Animated Transitions

**Priority:** Medium — visual polish

- Skeleton loaders instead of spinners on data fetch
- `LayoutAnimation` for list item additions/removals
- Fade-in for cards on screen mount
- Smooth number transitions on totals (counting up animation)
- Pull-to-refresh with custom animation

### 8. Dark / Light Theme Toggle

**Priority:** Low — personalization

- Toggle in admin/settings
- Persist preference with `expo-secure-store`
- Current dark theme becomes "dark mode"
- New light theme variant of all color tokens
- System preference detection as default
- Smooth transition animation between themes

---

## Future Considerations (not yet planned)

- Dashboard home screen with charts (sparklines, bar charts, trends)
- Customer directory (save returning customers, track history)
- Ticket photos (snap load on scale)
- Hold/compliance flags (ID requirements for thresholds)
- Receipt PDF generation and share via text/email
- Cash drawer tracking
- Data export (CSV/PDF)
- Push notifications
- Offline sync (WatermelonDB already scaffolded)
