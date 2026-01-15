// CARNIVAL MASQUERADER MANAGEMENT SYSTEM
// CSEC SBA - QUERIES
// These queries demonstrate data retrieval and manipulation from the database

// Global database reference
const db = {
  sections: [],
  masqueraders: [],
  payments: []
};

// Load database from database.json (simulated here)
async function loadDatabase() {
  try {
    const response = await fetch('database.json');
    const data = await response.json();
    db.sections = data.sections;
    db.masqueraders = data.masqueraders;
    db.payments = data.payments;
    console.log('Database loaded successfully');
  } catch (error) {
    console.log('Using hardcoded database');
    // Hardcoded fallback for testing
  }
}

// ============================================
// QUERY 1: SECTION
// Shows: Name, Age, Size, Address of all persons in a chosen section
// ============================================
function query_section(sectionName) {
  console.log(`\n=== QUERY 1: SECTION ===`);
  console.log(`Showing all masqueraders in: ${sectionName}\n`);
  
  // Find section ID
  const section = db.sections.find(s => s.SectionName === sectionName);
  if (!section) {
    console.log(`Section "${sectionName}" not found`);
    return [];
  }
  
  // Filter masqueraders by section
  const results = db.masqueraders
    .filter(m => m.SectionID === section.SectionID)
    .map(m => ({
      Name: m.FullName,
      Age: m.Age,
      Size: m.Size,
      Address: m.Address
    }))
    .sort((a, b) => a.Name.localeCompare(b.Name));
  
  // Display results
  console.table(results);
  console.log(`Total in ${sectionName}: ${results.length} masqueraders\n`);
  
  return results;
}

// ============================================
// QUERY 2: 20S LADIES
// Shows: ID, Name, Sex, Age of all females between 20 and 30
// ============================================
function query_20s_ladies() {
  console.log(`\n=== QUERY 2: 20S LADIES ===`);
  console.log(`Showing all females aged 20-30\n`);
  
  const results = db.masqueraders
    .filter(m => m.Sex === 'F' && m.Age >= 20 && m.Age <= 30)
    .map(m => ({
      ID: m.MasqID,
      Name: m.FullName,
      Sex: m.Sex,
      Age: m.Age
    }))
    .sort((a, b) => a.Age - b.Age);
  
  console.table(results);
  console.log(`Total females aged 20-30: ${results.length}\n`);
  
  return results;
}

// ============================================
// QUERY 3: PAID UP
// Shows: ID, Last Name, Section, Total Payment of all persons paid in full, sorted by last name
// ============================================
function query_paid_up() {
  console.log(`\n=== QUERY 3: PAID UP ===`);
  console.log(`Showing all persons with full payment, sorted by last name\n`);
  
  const results = db.payments
    .filter(p => p.PaymentType === 'Full' && p.Balance === 0)
    .map(p => {
      const masquerader = db.masqueraders.find(m => m.MasqID === p.MasqID);
      const section = db.sections.find(s => s.SectionID === masquerader.SectionID);
      const lastName = masquerader.FullName.split(' ').pop();
      
      return {
        ID: p.MasqID,
        LastName: lastName,
        FirstName: masquerader.FullName.split(' ')[0],
        Section: section.SectionName,
        TotalPayment: p.AmountPaid.toFixed(2)
      };
    })
    .sort((a, b) => a.LastName.localeCompare(b.LastName));
  
  console.table(results);
  console.log(`Total persons paid in full: ${results.length}\n`);
  
  return results;
}

// ============================================
// QUERY 4: REBATE
// Applies 15% rebate to everyone in the third section (Neverland)
// Shows: Name, Address, Total, Rebate
// ============================================
function query_rebate() {
  console.log(`\n=== QUERY 4: REBATE ===`);
  console.log(`Applying 15% rebate to all masqueraders in Neverland section\n`);
  
  const neverland = db.sections.find(s => s.SectionName === 'Neverland');
  
  const results = db.masqueraders
    .filter(m => m.SectionID === neverland.SectionID)
    .map(m => {
      const payment = db.payments.find(p => p.MasqID === m.MasqID);
      const totalPayment = payment ? payment.AmountPaid : 0;
      const rebate = totalPayment * 0.15;
      const newTotal = totalPayment - rebate;
      
      return {
        Name: m.FullName,
        Address: m.Address,
        OriginalTotal: totalPayment.toFixed(2),
        Rebate_15Percent: rebate.toFixed(2),
        NewTotal: newTotal.toFixed(2)
      };
    })
    .sort((a, b) => a.Name.localeCompare(b.Name));
  
  console.table(results);
  
  // Calculate totals
  const totalOriginal = results.reduce((sum, r) => sum + parseFloat(r.OriginalTotal), 0);
  const totalRebate = results.reduce((sum, r) => sum + parseFloat(r.Rebate_15Percent), 0);
  const totalAfterRebate = results.reduce((sum, r) => sum + parseFloat(r.NewTotal), 0);
  
  console.log(`\nSummary for Neverland Section:`);
  console.log(`Total Original Amount: $${totalOriginal.toFixed(2)}`);
  console.log(`Total Rebate: $${totalRebate.toFixed(2)}`);
  console.log(`Total After Rebate: $${totalAfterRebate.toFixed(2)}\n`);
  
  return results;
}

// ============================================
// QUERY 5: GIFT VOUCHER
// Shows: Name, Sex, Total Payment, 12% Voucher Value for all females
// ============================================
function query_gift_voucher() {
  console.log(`\n=== QUERY 5: GIFT VOUCHER ===`);
  console.log(`Calculating 12% gift voucher value for all females\n`);
  
  const results = db.masqueraders
    .filter(m => m.Sex === 'F')
    .map(m => {
      const payment = db.payments.find(p => p.MasqID === m.MasqID);
      const totalPayment = payment ? payment.AmountPaid : 0;
      const voucherValue = totalPayment * 0.12;
      
      return {
        Name: m.FullName,
        Sex: m.Sex,
        TotalPayment: totalPayment.toFixed(2),
        VoucherValue_12Percent: voucherValue.toFixed(2)
      };
    })
    .sort((a, b) => a.Name.localeCompare(b.Name));
  
  console.table(results);
  
  // Calculate total voucher value
  const totalVouchers = results.reduce((sum, r) => sum + parseFloat(r.VoucherValue_12Percent), 0);
  
  console.log(`\nTotal Females: ${results.length}`);
  console.log(`Total Voucher Value: $${totalVouchers.toFixed(2)}\n`);
  
  return results;
}

// ============================================
// ADDITIONAL UTILITY QUERIES
// ============================================

// Query: Count masqueraders per section
function query_section_count() {
  console.log(`\n=== SECTION COUNT ===\n`);
  
  const results = db.sections.map(section => {
    const count = db.masqueraders.filter(m => m.SectionID === section.SectionID).length;
    return {
      SectionName: section.SectionName,
      CostumePrice: `$${section.CostumePrice}`,
      Count: count
    };
  });
  
  console.table(results);
  return results;
}

// Query: Total income per section
function query_section_income() {
  console.log(`\n=== INCOME PER SECTION ===\n`);
  
  const results = db.sections.map(section => {
    const masqueraderIds = db.masqueraders
      .filter(m => m.SectionID === section.SectionID)
      .map(m => m.MasqID);
    
    const totalIncome = db.payments
      .filter(p => masqueraderIds.includes(p.MasqID))
      .reduce((sum, p) => sum + p.AmountPaid, 0);
    
    return {
      SectionName: section.SectionName,
      MasqueraderCount: masqueraderIds.length,
      TotalIncome: `$${totalIncome.toFixed(2)}`
    };
  });
  
  console.table(results);
  return results;
}

// Query: Payment type breakdown
function query_payment_breakdown() {
  console.log(`\n=== PAYMENT TYPE BREAKDOWN ===\n`);
  
  const fullPayments = db.payments.filter(p => p.PaymentType === 'Full').length;
  const installmentPayments = db.payments.filter(p => p.PaymentType === 'Installment').length;
  
  const results = [
    { PaymentType: 'Full', Count: fullPayments },
    { PaymentType: 'Installment', Count: installmentPayments },
    { PaymentType: 'Total', Count: fullPayments + installmentPayments }
  ];
  
  console.table(results);
  return results;
}

// Query: Age distribution
function query_age_distribution() {
  console.log(`\n=== AGE DISTRIBUTION ===\n`);
  
  const ageGroups = {
    '18-25': db.masqueraders.filter(m => m.Age >= 18 && m.Age <= 25).length,
    '26-35': db.masqueraders.filter(m => m.Age >= 26 && m.Age <= 35).length,
    '36+': db.masqueraders.filter(m => m.Age > 35).length
  };
  
  const results = Object.entries(ageGroups).map(([group, count]) => ({
    AgeGroup: group,
    Count: count
  }));
  
  console.table(results);
  return results;
}

// Query: Gender distribution
function query_gender_distribution() {
  console.log(`\n=== GENDER DISTRIBUTION ===\n`);
  
  const male = db.masqueraders.filter(m => m.Sex === 'M').length;
  const female = db.masqueraders.filter(m => m.Sex === 'F').length;
  
  const results = [
    { Gender: 'Male', Count: male, Percentage: ((male / db.masqueraders.length) * 100).toFixed(2) + '%' },
    { Gender: 'Female', Count: female, Percentage: ((female / db.masqueraders.length) * 100).toFixed(2) + '%' },
    { Gender: 'Total', Count: db.masqueraders.length, Percentage: '100%' }
  ];
  
  console.table(results);
  return results;
}

// ============================================
// RUN ALL CSEC REQUIRED QUERIES
// ============================================
function run_all_queries(sectionName = 'Army') {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║  CARNIVAL MASQUERADER MANAGEMENT SYSTEM - ALL QUERIES  ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  
  // CSEC Required Queries
  query_section(sectionName);
  query_20s_ladies();
  query_paid_up();
  query_rebate();
  query_gift_voucher();
  
  // Additional Utility Queries
  query_section_count();
  query_section_income();
  query_payment_breakdown();
  query_age_distribution();
  query_gender_distribution();
}

// ============================================
// EXPORT FOR USE IN JAVASCRIPT
// ============================================
window.carnivalQueries = {
  loadDatabase,
  query_section,
  query_20s_ladies,
  query_paid_up,
  query_rebate,
  query_gift_voucher,
  query_section_count,
  query_section_income,
  query_payment_breakdown,
  query_age_distribution,
  query_gender_distribution,
  run_all_queries
};

console.log('Carnival Queries loaded. Available functions:');
console.log('- query_section(sectionName)');
console.log('- query_20s_ladies()');
console.log('- query_paid_up()');
console.log('- query_rebate()');
console.log('- query_gift_voucher()');
console.log('- query_section_count()');
console.log('- query_section_income()');
console.log('- query_payment_breakdown()');
console.log('- query_age_distribution()');
console.log('- query_gender_distribution()');
console.log('- run_all_queries(sectionName)');
console.log('\nTo run all queries: run_all_queries("Army")');
