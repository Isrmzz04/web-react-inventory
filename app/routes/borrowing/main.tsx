import { Form, notification } from "antd";
import debounce from 'debounce';
import { useRef, useState, useEffect } from "react";
import Base from "~/components/shared/base/base";
import { useAppDispatch, useAppSelector } from "~/stores/hook";
import { deleteBorrowing, getAllBorrowings, getOneBorrowing } from "~/stores/main/borrowing/borrowing.slice";
import { getAllInventories } from "~/stores/main/inventory/inventory.slice";
import type { IBorrowingRequest } from "~/types/main/borrowing.types";
import Browse from "./browse";
import FormModal from "./form";

export default function Borrowings() {
  const borrowingState = useAppSelector((state) => state.borrowing)
  const inventoryState = useAppSelector((state) => state.inventory)
  const dispatch = useAppDispatch()

  const [search, setSearch] = useState<string>('')
  const [limit, setLimit] = useState<number>(10)
  const [page, setPage] = useState<number>(1)

  const [form] = Form.useForm<IBorrowingRequest>()
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)


  const loadBorrowing = () => {
    const params = {
      search,
      limit,
      page
    }
    dispatch(getAllBorrowings(params))
  }

  const loadInventoryData = () => {
    dispatch(getAllInventories({ search: '', limit: 1000, page: 1 }))
  }

  useEffect(() => {
    loadInventoryData()
  }, [])

  // useEffect(() => {
  //   loadBorrowing()
  // }, [search, limit, page])

  const handleSearch = useRef(
    debounce((value: string) => {
      setSearch(value)
      setPage(1)
    }, 1000)
  ).current

  const handleDetail = (id: number, isEdit: boolean) => {
    dispatch(getOneBorrowing(id))
      .unwrap()
      .then(() => {
        setIsModalVisible(true)
        setIsEdit(isEdit)
      })
      .catch(() => {
        notification.error({
          message: 'Error',
          description: 'Failed to load borrowing details',
          duration: 3
        })
      })
  }

  const onSubmit = () => {
    return form?.validateFields().then((values) => {
      console.log(values)
    }).catch(err => {
      notification.warning({
        message: 'Warning',
        description: err.errorFields[0].errors[0] + '. Please make sure all fields are filled',
        duration: 3
      })
    })
  }

  const onDelete = (id: number) => {
    dispatch(deleteBorrowing({
      id,
      callback: (code: number, message: string) => {
        if (code === 200) {
          notification.success({
            message: 'Success',
            description: message,
            duration: 2
          })
          loadBorrowing()
          setPage(1)
        }
      }
    }))
  }

  // const onApprove = (id: number, status: string) => {
  //   dispatch(approveBorrowing({
  //     id,
  //     status,
  //     callback: (code: number, message: string) => {
  //       if (code === 200) {
  //         notification.success({
  //           message: 'Success',
  //           description: message,
  //           duration: 2
  //         })
  //         loadBorrowing()
  //       }
  //     }
  //   }))
  // }

  // const onReturn = (id: number) => {
  //   dispatch(returnBorrowing({
  //     id,
  //     callback: (code: number, message: string) => {
  //       if (code === 200) {
  //         notification.success({
  //           message: 'Success',
  //           description: message,
  //           duration: 2
  //         })
  //         loadBorrowing()
  //       }
  //     }
  //   }))
  // }

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
              <h1 className="text-2xl font-bold text-gray-900">Borrowing Management</h1>
              <p className="text-gray-600 mt-1">
                Manage inventory borrowing requests and returns
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Total: {borrowingState.pagination?.total_records || 0} requests
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
          handleApprove={() => {}}
          handleReturn={() => {}}
        />

        <FormModal
          form={form}
          onSubmit={onSubmit}
          visible={isModalVisible}
          isEdit={isEdit}
          handleBack={() => setIsModalVisible(false)}
          onClose={handleModalClose}
          inventories={inventoryState.listInventories}
        />
      </div>
    </Base>
  )
}