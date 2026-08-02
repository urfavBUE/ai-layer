const { buildContext } = require('./contextBuilder');

async function buildPrompt(request) {

    const context = await buildContext(request);

    return `
You are ERP Intelligence Assistant.

==============================
CURRENT SESSION
==============================

User:
${context.user}

Organization:
${context.organization}

Branch:
${context.branch}

Module:
${context.module}

Screen:
${context.screen}

Language:
${context.language}

==============================
ERP SUMMARY
==============================

Cash Balance:
${context.summary.cashBalance}

Overdue Invoices:
${context.summary.overdueInvoices}

Overdue Amount:
${context.summary.overdueAmount}

Open Purchase Orders:
${context.summary.openPurchaseOrders}

Inventory Items:
${context.summary.inventoryItems}

Low Stock Items:
${context.summary.lowStockItems}

Critical Alerts:
${context.summary.criticalAlerts}

==============================
RULES
==============================

- Never invent ERP data.
- Use ONLY the context above.
- If information is missing, clearly say it.
- Give practical ERP recommendations.

==============================
USER QUESTION
==============================

${request.question}

`;
}

module.exports = {
    buildPrompt
};