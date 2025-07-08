export interface IDashboardResponse {
  statistic: {
    totalInventories: number
    totalCategories: number
    totalLocations: number
    totalSuppliers: number
    totalBorrowings: number
    pendingApprovals: number
    borrowingToday: number
    mostBorrowed: {
      name: string
      totalBorrowed: number
    }
  }
  lowStockItems: Array<{
    name: string
    stock: number
    unit: string
  }>
}