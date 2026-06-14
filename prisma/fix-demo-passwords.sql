-- ============================================================
-- LiveRide — FIX DEMO USER PASSWORDS
-- Run this in Neon SQL Editor to fix the password hashes.
--
-- The first seed run had an incorrect bcrypt hash.
-- This script applies the correct hash for: ChangeMe123!
--
-- Correct bcrypt hash (cost 10, verified):
-- $2b$10$CyzGL2i/5W7grvXEHyZ1Uu/lUrIeVdg7B6QQLrGGDKK2qk9DyWgYK
-- ============================================================

-- Step 1: Update all demo account hashes
UPDATE "User"
SET
  "passwordHash" = '$2b$10$CyzGL2i/5W7grvXEHyZ1Uu/lUrIeVdg7B6QQLrGGDKK2qk9DyWgYK',
  "updatedAt"    = NOW()
WHERE
  email LIKE '%@liveride.demo';

-- Step 2: Verify — should return 5 rows with matching hash
SELECT
  email,
  role,
  LEFT("passwordHash", 29) AS hash_prefix,
  "subscriptionStatus"
FROM "User"
WHERE email LIKE '%@liveride.demo'
ORDER BY role;

-- ============================================================
-- Expected output after fix:
-- admin@liveride.demo   ADMIN         $2b$10$CyzGL2i/5W7grvXEHyZ1  ACTIVE
-- gate@liveride.demo    GATE_MARSHAL  $2b$10$CyzGL2i/5W7grvXEHyZ1  ACTIVE
-- judge@liveride.demo   JUDGE         $2b$10$CyzGL2i/5W7grvXEHyZ1  ACTIVE
-- timer@liveride.demo   TIMER         $2b$10$CyzGL2i/5W7grvXEHyZ1  ACTIVE
-- viewer@liveride.demo  VIEWER        $2b$10$CyzGL2i/5W7grvXEHyZ1  ACTIVE
--
-- Login password for all accounts: ChangeMe123!
-- ============================================================
