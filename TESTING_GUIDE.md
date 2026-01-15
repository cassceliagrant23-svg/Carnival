🎭 CARNIVAL SYSTEM - STEP-BY-STEP TESTING GUIDE
================================================

This guide walks through testing every component of the CSEC SBA system.

---

## PART 1: VERIFY FILE STRUCTURE

✅ Check that these files exist:

1. index.html (261 lines)
2. style.css (816 lines)
3. script.js (486 lines)
4. database.json (75 masqueraders)
5. queries.js (10 query functions)
6. ALGORITHM.md (algorithm documentation)
7. CSEC_SBA_README.md (system documentation)

Command to verify:
```bash
ls -lh /workspaces/Carnival/*.{html,css,js,json,md}
```

---

## PART 2: OPEN THE WEB APPLICATION

✅ Step 1: Open index.html
   - Right-click on index.html
   - Select "Open with Live Server" or "Open in Default Browser"
   - OR: Double-click index.html

✅ Expected Result:
   - Beautiful carnival interface loads
   - 5 section cards visible (Army, Bells, Neverland, Carat, Engene)
   - Registration form displayed
   - Purple and blue color scheme evident
   - Statistics cards at bottom

---

## PART 3: TEST REGISTRATION FORM

✅ Test Case 1: Register with Full Payment

   Input:
   - Name: Akeem Williams
   - Section: Army
   - Payment Type: Full Payment
   
   Expected Output:
   - Costume Price: $160
   - Inclusive Fee: $25
   - Total Cost: $185
   - Discount (10%): -$18.50
   - Amount to Pay: $166.50
   - Balance: $0.00
   
   Verification: ✅ Check that discount calculated correctly

✅ Test Case 2: Register with Installment

   Input:
   - Name: Brianna Thompson
   - Section: Bells
   - Payment Type: Installment (3 payments)
   
   Expected Output:
   - Costume Price: $240
   - Inclusive Fee: $35
   - Total Cost: $275
   - Interest (15%): +$41.25
   - Total with Interest: $316.25
   - Per Payment: $105.42
   - Balance: $210.83
   
   Verification: ✅ Check that interest calculated correctly

✅ Test Case 3: Register with Highest Price Section

   Input:
   - Name: Michelle Davis
   - Section: Engene
   - Payment Type: Full Payment
   
   Expected Output:
   - Costume Price: $425
   - Inclusive Fee: $60
   - Total Cost: $485
   - Discount (10%): -$48.50
   - Amount to Pay: $436.50
   - Balance: $0.00

✅ Test Case 4: Register with Middle Section

   Input:
   - Name: Patrick Clarke
   - Section: Neverland
   - Payment Type: Installment
   
   Expected Output:
   - Costume Price: $310
   - Inclusive Fee: $45
   - Total Cost: $355
   - Interest (15%): +$53.25
   - Total with Interest: $408.25
   - Per Payment: $136.08

---

## PART 4: TEST STATISTICS DISPLAY

✅ After registering 4 masqueraders, verify statistics:

   Expected Totals:
   - Total Masqueraders: 4
   - Total Income: Sum of all "Amount to Pay" values
   - Army: 1 masquerader
   - Bells: 1 masquerader
   - Neverland: 1 masquerader
   - Carat: 0 masqueraders
   - Engene: 1 masquerader

✅ Verify the statistics cards update in real-time

---

## PART 5: TEST QUERIES IN CONSOLE

✅ Open Browser Console
   - Press F12 (or Ctrl+Shift+I on Linux)
   - Click "Console" tab

✅ Load Database First
   ```javascript
   loadDatabase()
   ```
   Expected: "Database loaded successfully" or similar message

✅ Query 1: SECTION
   ```javascript
   query_section('Army')
   ```
   Expected Output:
   - Shows all masqueraders in Army section
   - Columns: Name, Age, Size, Address, Phone
   - Should show 15 masqueraders (IDs 1-15)
   - All Jamaican-style names and addresses
   
   Verification: ✅ Check names like "Akeem Williams", "Brianna Thompson", etc.

✅ Query 2: 20S LADIES
   ```javascript
   query_20s_ladies()
   ```
   Expected Output:
   - Shows all females aged 20-30
   - Columns: ID, Name, Age
   - Multiple records
   - All ages should be between 20-30
   - All sex should be "F"
   
   Verification: ✅ Check ages range from 20-30

✅ Query 3: PAID UP
   ```javascript
   query_paid_up()
   ```
   Expected Output:
   - Shows all masqueraders with full payment
   - Columns: ID, Last Name, Section, Total Payment
   - Sorted alphabetically by last name
   - Balance should be $0.00 for all
   
   Verification: ✅ Check sorting (alphabetical by last name)

✅ Query 4: REBATE
   ```javascript
   query_rebate()
   ```
   Expected Output:
   - Shows Neverland masqueraders only
   - Columns: Name, Address, Original Total, Rebate (15%), New Total
   - Rebate = Original × 0.15
   - New Total = Original - Rebate
   - Should show 15 Neverland masqueraders
   - SUMMARY: Total rebate amount
   
   Verification: ✅ Check 15% rebate applied to each record

✅ Query 5: GIFT VOUCHER
   ```javascript
   query_gift_voucher()
   ```
   Expected Output:
   - Shows all females only
   - Columns: Name, Sex, Total Payment, 12% Voucher Value
   - Voucher = Total × 0.12
   - All sex should be "F"
   - SUMMARY: Total voucher amount
   
   Verification: ✅ Check all are females, voucher = 12% of total

✅ Run All Queries At Once
   ```javascript
   run_all_queries('Army')
   ```
   Expected: All 5 queries run and display results

---

## PART 6: TEST DATABASE.JSON

✅ Open database.json file in editor

✅ Verify Sections Table (5 records)
   - SectionID: 1, 2, 3, 4, 5
   - SectionName: Army, Bells, Neverland, Carat, Engene (EXACT NAMES)
   - CostumePrice: 160, 240, 310, 370, 425
   - InclusiveFee: 25, 35, 45, 50, 60

✅ Verify Masqueraders Table (75 records)
   - Total count: 75
   - Per section: 15 each
   - Army: MasqID 1-15
   - Bells: MasqID 16-30
   - Neverland: MasqID 31-45
   - Carat: MasqID 46-60
   - Engene: MasqID 61-75
   
   Check fields:
   - All have names (Jamaican style)
   - All have sex (M or F)
   - All have age (18+)
   - All have address (Kingston/Jamaica)
   - All have phone (876-555-XXXX format)
   - All have size (XS, S, M, L, XL)
   - All have SectionID (1-5)

✅ Verify Payments Table (5+ records)
   - PaymentID: Unique
   - MasqID: References masquerader
   - PaymentType: "Full" or "Installment"
   - TotalCost: Costume + Fee
   - AmountPaid: Discounted or with interest
   - Balance: 0 for full, remainder for installment

---

## PART 7: VERIFY ALGORITHM.MD

✅ Open ALGORITHM.md file

✅ Check 7-step algorithm:
   1. INPUT - Accept masquerader information ✅
   2. RETRIEVE - Section information ✅
   3. CALCULATE - Total cost (price + fee) ✅
   4. APPLY - Discount (10% full) or Interest (15% installment) ✅
   5. CALCULATE - Payment breakdown ✅
   6. STORE - In database ✅
   7. DISPLAY - Results to user ✅

✅ Verify pseudocode is clear and traceable

✅ Check database structure definition

✅ Verify data constraints:
   - Age: 18+
   - SectionName: Must be exact (Army, Bells, Neverland, Carat, Engene)
   - PaymentType: Full or Installment
   - Phone: Valid format

---

## PART 8: VERIFY CSEC_SBA_README.MD

✅ Open CSEC_SBA_README.md

✅ Sections included:
   - System Overview ✅
   - Band Structure ✅
   - Database Structure ✅
   - Algorithm ✅
   - Program Implementation ✅
   - CSEC Queries (all 5) ✅
   - Web Application Features ✅
   - System Integration ✅
   - Payment Examples ✅
   - Compliance Checklist ✅

✅ All band sections listed:
   - Army ✅
   - Bells ✅
   - Neverland ✅
   - Carat ✅
   - Engene ✅

---

## PART 9: VERIFY QUERIES.JS LINKING

✅ Open index.html (bottom of file)

✅ Check script links:
   ```html
   <script src="script.js"></script>
   <script src="queries.js"></script>
   </body>
   </html>
   ```
   
   Expected: Both scripts linked ✅

✅ Verify queries accessible from console

---

## PART 10: TEST RESPONSIVE DESIGN

✅ Resize browser window to test responsiveness

   Desktop (1200px+):
   - All cards visible
   - Form full width
   - Statistics in row
   
   Tablet (768px - 1199px):
   - Cards responsive
   - Form optimized
   - Statistics wrap
   
   Mobile (< 768px):
   - Single column layout
   - Form optimized
   - Cards stack
   - Touch-friendly

---

## PART 11: PAYMENT CALCULATION VERIFICATION

✅ Test calculation formulas:

   Full Payment Formula:
   Amount = (CostumePrice + InclusiveFee) × 0.90
   
   Test: Army ($160 + $25) × 0.90 = $166.50 ✅

   Installment Formula:
   Total = (CostumePrice + InclusiveFee) × 1.15
   Per Payment = Total ÷ 3
   
   Test: Bells ($240 + $35) × 1.15 = $316.25 ÷ 3 = $105.42 ✅

---

## PART 12: DEMO DATA TEST

✅ Open console and run:
   ```javascript
   loadDemoData()
   ```
   
   Expected:
   - 7 sample masqueraders loaded
   - Table populates with demo data
   - Statistics updated

---

## SUMMARY OF TESTING

After completing all 12 parts, the system should:

✅ Load beautifully in browser
✅ Accept masquerader registration
✅ Calculate payments correctly (10% discount, 15% interest)
✅ Display statistics in real-time
✅ Run all 5 CSEC queries
✅ Have accurate database (75 masqueraders, 5 sections)
✅ Show proper algorithm documentation
✅ Have comprehensive README
✅ Respond well to mobile/tablet/desktop
✅ Link all files correctly

---

## DEPLOYMENT TEST

✅ To deploy on GitHub Pages:

1. Create GitHub repository
2. Push all files to repository
3. Enable GitHub Pages in settings
4. Select main branch
5. Site goes live at: https://username.github.io/Carnival

✅ Test on GitHub Pages:
   - Open the live URL
   - System works exactly like local version
   - All files load correctly
   - Database queries work
   - No console errors

---

## FINAL VERIFICATION

If all tests pass:
✅ CSEC SBA system is complete
✅ Ready for examiner review
✅ Ready for deployment
✅ All requirements met

---

**Test Date**: January 2026
**Tester**: CSEC Examiner
**Result**: PASS/FAIL

If any test fails, reference the corresponding section for troubleshooting.

