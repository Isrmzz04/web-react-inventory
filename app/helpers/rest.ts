export const baseUrl = 'https://sistem-inventaris.my.id/api/'

export const rest = {
  global: {
    menus: 'menus',
    functionPermission: 'permission'
  },
  main: {
    auth: {
      login: 'login',
      logout: 'logout'
    },
    dashboard: {
      totalInventories: 'dashboard/total-inventories',
      totalCategories: 'dashboard/total-categories',
      totalLocations: 'dashboard/total-locations',
      totalSuppliers: 'dashboard/total-suppliers',
      totalBorrowings: 'dashboard/total-borrowings',
      pendingApprovals: 'dashboard/pending-approvals',
      borrowingToday: 'dashboard/borrowing-today',
      mostBorrowed: 'dashboard/most-borrowed'
    },
    inventory: {
      index: 'inventories',
      show: 'inventories/:ID',
      store: 'inventories',
      update: 'inventories/:ID',
      destroy: 'inventories/:ID',
    },
    category: {
      index: 'categories',
      show: 'categories/:ID',
      store: 'categories',
      update: 'categories/:ID',
      destroy: 'categories/:ID',
    },
    location: {
      index: 'locations',
      show: 'locations/:ID',
      store: 'locations',
      update: 'locations/:ID',
      destroy: 'locations/:ID',
    },
    supplier: {
      index: 'suppliers',
      show: 'suppliers/:ID',
      store: 'suppliers',
      update: 'suppliers/:ID',
      destroy: 'suppliers/:ID',
    },
    borrowing: {
      index: 'borrowings',
      show: 'borrowings/:ID',
      store: 'borrowings',
      update: 'borrowings/:ID',
      destroy: 'borrowings/:ID',
    }
  }
}