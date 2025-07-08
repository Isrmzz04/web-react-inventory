import { Form, notification, Spin } from "antd";
import debounce from 'debounce';
import { useRef, useState, useEffect } from "react";
import Base from "~/components/shared/base/base";
import { useAppDispatch, useAppSelector } from "~/stores/hook";
import { createInventory, deleteInventory, getAllInventories, getOneInventory, updateInventory } from "~/stores/main/inventory/inventory.slice";
import { getAllCategories } from "~/stores/main/category/category.slice";
import { getAllLocations } from "~/stores/main/location/location.slice";
import { getAllSuppliers } from "~/stores/main/supplier/supplier.slice";
import type { IInventoryRequest } from "~/types/main/inventory.types";
import Browse from "./browse";
import FormModal from "./form";

export default function Inventories() {
  const inventoryState = useAppSelector((state) => state.inventory)
  const categoryState = useAppSelector((state) => state.category)
  const locationState = useAppSelector((state) => state.location)
  const supplierState = useAppSelector((state) => state.supplier)
  const dispatch = useAppDispatch()

  const [search, setSearch] = useState<string>('')
  const [limit, setLimit] = useState<number>(10)
  const [page, setPage] = useState<number>(1)

  const [form] = Form.useForm<IInventoryRequest>()
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)


  const loadInventory = () => {
    const params = {
      search,
      limit,
      page
    }
    dispatch(getAllInventories(params))
  }

  const loadDropdownData = () => {
    dispatch(getAllCategories({ search: '', limit: 1000, page: 1 }))
    dispatch(getAllLocations({ search: '', limit: 1000, page: 1 }))
    dispatch(getAllSuppliers({ search: '', limit: 1000, page: 1 }))
  }

  useEffect(() => {
    loadDropdownData()
  }, [])

  useEffect(() => {
    loadInventory()
  }, [search, limit, page])

  const handleSearch = useRef(
    debounce((value: string) => {
      setSearch(value)
      setPage(1)
    }, 1000)
  ).current

  const handleDetail = (id: number, isEdit: boolean) => {
    dispatch(getOneInventory(id))
      .unwrap()
      .then(() => {
        setIsModalVisible(true)
        setIsEdit(isEdit)
      })
      .catch(() => {
        notification.error({
          message: 'Error',
          description: 'Failed to load inventory details',
          duration: 3
        })
      })
  }


  const onSubmit = () => {
    return form?.validateFields().then((values) => {
      if (!isEdit) {
        dispatch(createInventory({
          payload: values,
          callback: (code: number, message: string) => {
            if (code === 201) {
              notification.success({
                message: 'Success',
                description: message,
                duration: 2
              })
              loadInventory()
              setPage(1)
              form.resetFields()
              setIsModalVisible(false)
              setIsEdit(false)
            }
          }
        }))
      } else {
        dispatch(updateInventory({
          id: inventoryState.detailInventory.id,
          payload: values,
          callback: (code: number, message: string) => {
            if (code === 200) {
              notification.success({
                message: 'Success',
                description: message,
                duration: 2
              })
              loadInventory()
              setPage(1)
              form.resetFields()
              setIsModalVisible(false)
              setIsEdit(false)
            }
          }
        }))
      }
    }).catch(err => {
      notification.warning({
        message: 'Warning',
        description: err.errorFields[0].errors[0] + '. Please make sure all fields are filled',
        duration: 3
      })
    })
  }

  const onDelete = (id: number) => {
    dispatch(deleteInventory({
      id,
      callback: (code: number, message: string) => {
        if (code === 200) {
          notification.success({
            message: 'Success',
            description: message,
            duration: 2
          })
          loadInventory()
          setPage(1)
        }
      }
    }))
  }

  const handleModalClose = () => {
    setIsModalVisible(false)
    setIsEdit(false)
    form.resetFields()
  }

  const handleSetLimit = (size: number) => {
    setLimit(size)
    setPage(1)
  }

  const handleSetPage = (newPage: number) => {
    setPage(newPage)
  }

  return (
    <Base>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
              <p className="text-gray-600 mt-1">
                Manage your inventory items here
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Total: {inventoryState.pagination?.total_records || 0} items
            </div>
          </div>
        </div>

        <Browse
          limit={limit}
          setLimit={handleSetLimit}
          setPage={handleSetPage}
          handleSearch={handleSearch}
          handleCreate={() => setIsModalVisible(true)}
          handleDetail={handleDetail}
          handleDelete={onDelete}
        />

        <FormModal
          form={form}
          onSubmit={onSubmit}
          visible={isModalVisible}
          isEdit={isEdit}
          handleBack={() => setIsModalVisible(false)}
          onClose={handleModalClose}
          categories={categoryState.listCategories}
          locations={locationState.listLocations}
          suppliers={supplierState.listSuppliers}
        />
      </div>
    </Base>
  )
}