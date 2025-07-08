export const baseUrl = 'https://sistem-inventaris.my.id/be/api/'

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
    borrowingRequest: 'borrowings',
    inventoryByBarcode: 'inventories/barcode/:ID',
    dashboard: 'dashboard',
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