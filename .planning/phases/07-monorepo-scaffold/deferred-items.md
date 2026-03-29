# Phase 07 Deferred Items

## Pre-existing Test Failures (Out of Scope for Plan 01)

These test failures existed before the monorepo migration and are not caused by path changes.

### tests/physics.test.ts - rotation assertion
- **File:** `apps/portfolio/tests/physics.test.ts:79`
- **Error:** `AssertionError: expected 1.5707963267948966 to be less than 1.5707963267948966`
- **Cause:** Test expects rotation to lerp but physics uses instant rotation (`lerpAngle` with `t=1`)
- **Impact:** Test logic mismatch with implementation — pre-existing before migration

### tests/useViewportTransform.test.ts - Konva mock
- **File:** `apps/portfolio/tests/useViewportTransform.test.ts`
- **Error:** `TypeError: stage.scaleX is not a function`
- **Cause:** Test mock for Konva Stage is incomplete — `scaleX` not mocked as a function
- **Impact:** 3 tests fail — pre-existing before migration

### tests/useSpaceshipPhysics.test.ts - Konva mock
- **File:** `apps/portfolio/tests/useSpaceshipPhysics.test.ts`
- **Error:** `TypeError: stage.scaleX is not a function`
- **Cause:** Same Konva mock incompleteness as above
- **Impact:** 1 test fails — pre-existing before migration

**Action needed:** Fix in a future cleanup task or Phase 8 as part of test infrastructure work.
