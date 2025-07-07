import { Form, notification } from "antd";
import debounce from 'debounce';
import { useRef, useState } from "react";
import Base from "~/components/shared/base/base";
import { useAppDispatch, useAppSelector } from "~/stores/hook";
import { deleteCategory, getAllCategories, getOneCategory } from "~/stores/main/category/category.slice";
import type { ICategoryRequest } from "~/types/main/category.types";
import Browse from "./browse";
import FormModal from "./form";

export default function Categories() {
  const categoryState = useAppSelector((state) => state.category)
  const dispatch = useAppDispatch()

  const [search, setSearch] = useState<string>('')
  const [limit, setLimit] = useState<number>(10)
  const [page, setPage] = useState<number>(1)

  const [form] = Form.useForm<ICategoryRequest>()
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)


  const loadCategory = () => {
    const params = {
      search,
      limit,
      page
    }
    dispatch(getAllCategories(params))
  }

  // useEffect(() => {
  //   loadCategory()
  // }, [search, limit, page])

  const handleSearch = useRef(
    debounce((value: string) => {
      setSearch(value)
      setPage(1)
    }, 1000)
  ).current


  const handleDetail = (id: number, isEdit: boolean) => {
    dispatch(getOneCategory(id))
      .unwrap()
      .then(() => {
        setIsModalVisible(true)
      })
      .catch(() => {
        notification.error({
          message: 'Error',
          description: 'Failed to load category details',
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
    dispatch(deleteCategory({
      id,
      callback: (code: number, message: string) => {
        if (code === 200) {
          notification.success({
            message: 'Success',
            description: message,
            duration: 2
          })
          loadCategory()
          setPage(1)
        }
      }
    }))
  }
  const handleModalClose = () => {
    setIsModalVisible(false)
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
              <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
              <p className="text-gray-600 mt-1">
                Manage your categories here
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Total: {categoryState.pagination?.total_records || 0} items
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
        />
      </div>
    </Base>
  )
}