class ERPRepository {

    async getERPContext(session) {

        return {

            organization: session.organizationName,

            branch: session.branchName,

            module: session.module,

            screen: session.screen,

            language: session.language,

            user: session.userName,

            summary: {

                cashBalance: 1250000,

                overdueInvoices: 18,

                overdueAmount: 420000,

                openPurchaseOrders: 26,

                inventoryItems: 2145,

                lowStockItems: 31,

                criticalAlerts: 4

            }

        };

    }

}

module.exports = new ERPRepository();