/* ============================================
   CARNIVAL MASQUERADERS - JAVASCRIPT
   Algorithm for Masquerader Management System
   ============================================ */

// ============================================
// DATA STRUCTURES
// ============================================

// Main data store for all masqueraders
const masqueraders = [];

// Section mappings based on costume prices
const sections = {
    160: { name: "Army", price: 160, id: 1 },
    240: { name: "Bells", price: 240, id: 2 },
    310: { name: "Neverland", price: 310, id: 3 },
    370: { name: "Carat", price: 370, id: 4 },
    425: { name: "Engene", price: 425, id: 5 }
};

// ============================================
// ALGORITHM: PAYMENT CALCULATION
// ============================================

/**
 * Calculate final payment amount based on payment type
 * INPUT: costumeCost (number), paymentType (string: 'full' or 'installment')
 * PROCESSING: Apply discount or interest calculation
 * OUTPUT: Object with payment details
 */
function calculatePayment(costumeCost, paymentType) {
    const cost = parseFloat(costumeCost);
    let finalAmount = cost;
    let paymentDetails = {};

    if (paymentType === 'full') {
        // 10% discount for full payment
        const discount = cost * 0.10;
        finalAmount = cost - discount;
        paymentDetails = {
            type: 'Full Payment',
            originalCost: cost,
            discount: discount,
            finalAmount: finalAmount,
            installmentAmount: null,
            interest: 0
        };
    } else if (paymentType === 'installment') {
        // 15% interest for installment payments
        const interest = cost * 0.15;
        finalAmount = cost + interest;
        const installmentAmount = finalAmount / 3;
        paymentDetails = {
            type: '3 Installments',
            originalCost: cost,
            discount: 0,
            interest: interest,
            finalAmount: finalAmount,
            installmentAmount: installmentAmount
        };
    }

    return paymentDetails;
}

// ============================================
// ALGORITHM: SECTION ASSIGNMENT
// ============================================

/**
 * Determine which section a masquerader belongs to
 * INPUT: costumeCost (number)
 * OUTPUT: Section object with name and ID
 */
function getSectionInfo(costumeCost) {
    const cost = parseFloat(costumeCost);
    return sections[cost] || null;
}

// ============================================
// ALGORITHM: MASQUERADER REGISTRATION
// ============================================

/**
 * Register a new masquerader and store their information
 * INPUT: name (string), costumeCost (number), paymentType (string)
 * PROCESSING: Calculate payment, assign section, store in array
 * OUTPUT: Masquerader object
 */
function registerMasquerader(name, costumeCost, paymentType) {
    const sectionInfo = getSectionInfo(costumeCost);
    const paymentInfo = calculatePayment(costumeCost, paymentType);

    if (!sectionInfo) {
        return { error: 'Invalid costume price' };
    }

    const masquerader = {
        id: masqueraders.length + 1,
        name: name,
        section: sectionInfo.name,
        sectionId: sectionInfo.id,
        costumeCost: parseFloat(costumeCost),
        paymentType: paymentType,
        amountToPay: paymentInfo.finalAmount,
        discount: paymentInfo.discount,
        interest: paymentInfo.interest,
        registrationDate: new Date().toLocaleDateString()
    };

    masqueraders.push(masquerader);
    return masquerader;
}

// ============================================
// ALGORITHM: SECTION STATISTICS
// ============================================

/**
 * Generate statistics for each section
 * INPUT: None (uses global masqueraders array)
 * PROCESSING: Count masqueraders per section, sum income per section
 * OUTPUT: Array of section statistics
 */
function calculateSectionStatistics() {
    const stats = {};

    // Initialize stats for all sections
    Object.values(sections).forEach(section => {
        stats[section.price] = {
            name: section.name,
            sectionId: section.id,
            masqueraderCount: 0,
            totalIncome: 0,
            averagePayment: 0
        };
    });

    // Process each masquerader
    masqueraders.forEach(masquerader => {
        const price = masquerader.costumeCost;
        if (stats[price]) {
            stats[price].masqueraderCount++;
            stats[price].totalIncome += masquerader.amountToPay;
        }
    });

    // Calculate averages
    Object.values(stats).forEach(stat => {
        if (stat.masqueraderCount > 0) {
            stat.averagePayment = stat.totalIncome / stat.masqueraderCount;
        }
    });

    return Object.values(stats).sort((a, b) => a.sectionId - b.sectionId);
}

// ============================================
// ALGORITHM: OVERALL STATISTICS
// ============================================

/**
 * Calculate overall carnival statistics
 * INPUT: None (uses global masqueraders array)
 * PROCESSING: Sum all data
 * OUTPUT: Object with totals
 */
function calculateOverallStatistics() {
    const totalMasqueraders = masqueraders.length;
    const totalIncome = masqueraders.reduce((sum, m) => sum + m.amountToPay, 0);
    const fullPaymentCount = masqueraders.filter(m => m.paymentType === 'full').length;
    const installmentCount = masqueraders.filter(m => m.paymentType === 'installment').length;
    const totalDiscount = masqueraders.reduce((sum, m) => sum + m.discount, 0);
    const totalInterest = masqueraders.reduce((sum, m) => sum + m.interest, 0);

    return {
        totalMasqueraders,
        totalIncome,
        fullPaymentCount,
        installmentCount,
        totalDiscount,
        totalInterest,
        averagePayment: totalMasqueraders > 0 ? totalIncome / totalMasqueraders : 0
    };
}

// ============================================
// UI UPDATE FUNCTIONS
// ============================================

/**
 * Display calculation results in the calculator output area
 * INPUT: Masquerader object
 * OUTPUT: Updates DOM
 */
function displayCalculatorOutput(masquerader) {
    const calculatorOutput = document.getElementById('calculatorOutput');
    const paymentInfo = calculatePayment(masquerader.costumeCost, masquerader.paymentType);

    let calculationHTML = `
        <div class="calculation-result">
            <h4>💰 Payment Calculation for ${masquerader.name}</h4>
            <div class="calculation-row">
                <span>Costume Price:</span>
                <span>$${masquerader.costumeCost.toFixed(2)}</span>
            </div>
    `;

    if (masquerader.paymentType === 'full') {
        calculationHTML += `
            <div class="calculation-row">
                <span>10% Discount:</span>
                <span>-$${masquerader.discount.toFixed(2)}</span>
            </div>
        `;
    } else {
        calculationHTML += `
            <div class="calculation-row">
                <span>15% Interest:</span>
                <span>+$${masquerader.interest.toFixed(2)}</span>
            </div>
            <div class="calculation-row">
                <span>Per Installment (÷ 3):</span>
                <span>$${(masquerader.amountToPay / 3).toFixed(2)}</span>
            </div>
        `;
    }

    calculationHTML += `
        <div class="calculation-row">
            <span><strong>Total Amount to Pay:</strong></span>
            <span><strong>$${masquerader.amountToPay.toFixed(2)}</strong></span>
        </div>
        </div>
    `;

    calculatorOutput.innerHTML = calculationHTML;
    calculatorOutput.classList.add('active');
}

/**
 * Update the masqueraders table with all registered masqueraders
 * INPUT: None (uses global masqueraders array)
 * OUTPUT: Updates DOM table
 */
function updateMasqueradersTable() {
    const tbody = document.getElementById('masqueradersBody');
    
    if (masqueraders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #999;">No masqueraders registered yet</td></tr>';
        return;
    }

    tbody.innerHTML = masqueraders.map(m => `
        <tr>
            <td><strong>${m.name}</strong></td>
            <td>${m.section}</td>
            <td>$${m.costumeCost.toFixed(2)}</td>
            <td>${m.paymentType === 'full' ? '✓ Full Payment' : '📅 Installments'}</td>
            <td><strong class="success">$${m.amountToPay.toFixed(2)}</strong></td>
        </tr>
    `).join('');
}

/**
 * Update the section summary cards
 * INPUT: None (uses calculated statistics)
 * OUTPUT: Updates DOM
 */
function updateSectionSummary() {
    const sectionSummary = document.getElementById('sectionSummary');
    const stats = calculateSectionStatistics();

    const summaryHTML = stats.map(stat => `
        <div class="summary-item">
            <h4>${stat.name}</h4>
            <div class="summary-item-count">${stat.masqueraderCount}</div>
            <p style="font-size: 0.9rem; color: #666;">Masqueraders</p>
            <div class="summary-item-income">$${stat.totalIncome.toFixed(2)}</div>
        </div>
    `).join('');

    sectionSummary.innerHTML = summaryHTML;
}

/**
 * Update overall statistics display
 * INPUT: None (uses calculated statistics)
 * OUTPUT: Updates DOM
 */
function updateOverallStatistics() {
    const stats = calculateOverallStatistics();
    
    document.getElementById('totalMasqueraders').textContent = stats.totalMasqueraders;
    document.getElementById('totalIncome').textContent = '$' + stats.totalIncome.toFixed(2);
}

/**
 * Show results section and update all displays
 * INPUT: None
 * OUTPUT: Updates DOM and shows results section
 */
function displayResults() {
    const resultsSection = document.getElementById('results');
    resultsSection.style.display = 'block';
    
    // Scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    // Update all sections
    updateMasqueradersTable();
    updateSectionSummary();
    updateOverallStatistics();
}

// ============================================
// FORM HANDLING
// ============================================

/**
 * Handle form submission
 * INPUT: Form submission event
 * PROCESSING: Extract form data, validate, register masquerader
 * OUTPUT: Display results
 */
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // INPUT: Get form values
    const masqueraderName = document.getElementById('masqueraderName').value.trim();
    const costumeCost = document.getElementById('costumeCost').value;
    const paymentType = document.querySelector('input[name="paymentType"]:checked').value;

    // PROCESSING: Validate inputs
    if (!masqueraderName || !costumeCost || !paymentType) {
        alert('Please fill in all required fields');
        return;
    }

    // Register masquerader
    const newMasquerader = registerMasquerader(masqueraderName, costumeCost, paymentType);

    if (newMasquerader.error) {
        alert('Error: ' + newMasquerader.error);
        return;
    }

    // OUTPUT: Display calculation and results
    displayCalculatorOutput(newMasquerader);
    displayResults();

    // Show success message
    showSuccessMessage(`${masqueraderName} registered successfully in ${newMasquerader.section}!`);

    // Reset form
    this.reset();
});

/**
 * Show temporary success message
 * INPUT: Message text
 * OUTPUT: Displays message in UI
 */
function showSuccessMessage(message) {
    const calculatorOutput = document.getElementById('calculatorOutput');
    const originalContent = calculatorOutput.innerHTML;

    const messageHTML = `
        <div style="background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 1rem; border-radius: 8px; text-align: center;">
            <strong>✓ ${message}</strong>
        </div>
    `;

    calculatorOutput.innerHTML = messageHTML;
    
    setTimeout(() => {
        calculatorOutput.innerHTML = originalContent;
    }, 3000);
}

// ============================================
// DATA CLEARING
// ============================================

/**
 * Clear all registered masqueraders and reset displays
 * INPUT: None
 * OUTPUT: Clears all data and resets UI
 */
function clearAllData() {
    if (masqueraders.length === 0) {
        alert('No data to clear');
        return;
    }

    if (confirm('Are you sure you want to clear all registered masqueraders? This cannot be undone.')) {
        masqueraders.length = 0; // Clear the array
        
        // Reset UI
        document.getElementById('calculatorOutput').innerHTML = 'Registration data will appear here...';
        document.getElementById('calculatorOutput').classList.remove('active');
        document.getElementById('registrationForm').reset();
        document.getElementById('results').style.display = 'none';
        
        // Reset payment type radio selection
        document.querySelector('input[name="paymentType"]').checked = false;
        
        alert('All data has been cleared');
    }
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize the application on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    // Set initial calculator message
    const calculatorOutput = document.getElementById('calculatorOutput');
    calculatorOutput.innerHTML = '<p>👤 Register a masquerader to see payment calculations...</p>';

    // Ensure results section is hidden initially
    document.getElementById('results').style.display = 'none';

    console.log('Carnival Masqueraders System Initialized');
    console.log('Sections available:', Object.values(sections).map(s => `${s.name} ($${s.price})`).join(', '));
});

// ============================================
// EXPORT FUNCTIONS FOR TESTING/DEMO
// ============================================

// Make functions available globally for testing
window.carnivalSystem = {
    registerMasquerader,
    calculatePayment,
    calculateSectionStatistics,
    calculateOverallStatistics,
    getSectionInfo,
    getMasqueraders: () => masqueraders,
    clearData: () => {
        masqueraders.length = 0;
        document.getElementById('registrationForm').reset();
        document.getElementById('results').style.display = 'none';
    }
};

// ============================================
// DEMO DATA FUNCTION (for testing)
// ============================================

/**
 * Load demo data for testing and demonstration
 * Useful for CSEC SBA presentation
 */
function loadDemoData() {
    const demoMasqueraders = [
        { name: 'Anya Ramjohn', costumeCost: '160', paymentType: 'full' },
        { name: 'David Singh', costumeCost: '240', paymentType: 'installment' },
        { name: 'Maria Santos', costumeCost: '310', paymentType: 'full' },
        { name: 'Javier Gomez', costumeCost: '370', paymentType: 'installment' },
        { name: 'Alicia Brown', costumeCost: '425', paymentType: 'full' },
        { name: 'Kevin Williams', costumeCost: '160', paymentType: 'installment' },
        { name: 'Tanya Johnson', costumeCost: '240', paymentType: 'full' },
    ];

    demoMasqueraders.forEach(m => {
        registerMasquerader(m.name, m.costumeCost, m.paymentType);
    });

    displayResults();
    showSuccessMessage('Demo data loaded with 7 masqueraders!');
}

console.log('%c📊 Carnival Masqueraders Management System', 'color: #6B46C1; font-size: 16px; font-weight: bold;');
console.log('%cAlgorithm Features:', 'color: #3B82F6; font-size: 14px; font-weight: bold;');
console.log('✓ Input: Masquerader name, costume price, payment type');
console.log('✓ Processing: Payment calculation (10% discount / 15% interest)');
console.log('✓ Processing: Section assignment based on price');
console.log('✓ Output: Individual and aggregated statistics');
console.log('%cBand Sections: Army, Bells, Neverland, Carat, Engene', 'color: #10B981; font-size: 12px;');
console.log('%cTo load demo data, run: loadDemoData()', 'color: #10B981; font-size: 12px;');
