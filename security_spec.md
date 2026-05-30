# Security Specification

## 1. Data Invariants
- A profile document must only belong to the authenticated user.
- A profile's ID must precisely match the Firebase Auth UID.
- Nutricionista and User roles must be immutable by the user once registered. Let's make `role` immutable. Wait, actually we'll handle `role` later or just enforce schema.

## 2. The "Dirty Dozen" Payloads
1. **Empty Payload**: `{}` (Should be rejected for missing required keys)
2. **Missing required fields**: `{ name: "Test" }` (Rejected)
3. **Ghost fields**: `{ name: "Test", email: "test@test.com", isOnboarded: true, isAdmin: true }` (Rejected due to `isAdmin`)
4. **Invalid Type**: `{ name: 123 }` (Rejected)
5. **Too large field**: `{ name: "a".repeat(1000) }` (Rejected)
6. **Modifying email**: `{ email: "other@other.com" }` (Rejected)
7. **Identity Spoofing**: Creating profile for other UID (Rejected)
8. **Modifying after onboarded**: Try to set `isOnboarded: false` (Depends, might just be generic schema)

## 3. The Test Runner
N/A right now, doing basic rules first.
