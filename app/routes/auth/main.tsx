import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router';
import { AlertContainer, useAlert } from '~/components/ui/alert/alert';
import { useAppDispatch, useAppSelector } from '~/stores/hook';
import { loginAdmin } from '~/stores/main/auth/auth.slice';

export default function Auth() {
  const auth = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { alerts, success, error, removeAlert } = useAlert();

  const onFinish = () => {
    return form
      .validateFields()
      .then((values) => {
        dispatch(loginAdmin(values))
          .then((action) => {
            if (action.type === 'auth/login/fulfilled') {
              success('Login berhasil! Anda akan dialihkan ke dashboard.', 'Berhasil');

              setTimeout(() => {
                !auth.isLoading && navigate('/');
              }, 1000);
            } else {
              error('Login gagal. Periksa username dan password Anda.', 'Login Gagal');
            }
          })
      }).catch(err => {
        error('Mohon lengkapi semua field yang diperlukan.', 'Validasi Error');
      });
  };

  return (
    <>
      <AlertContainer
        alerts={alerts}
        onRemove={removeAlert}
        position="top-center"
      />
      <div className="w-full min-h-screen grid place-items-center bg-[#f7f9f7]">
        <div className="bg-white rounded-2xl flex flex-col justify-center px-4 py-12 lg:flex-none lg:px-6 xl:px-10">
          <div className="w-[300px] mx-auto">
            <div className="text-center">
              <img src="/logo-pelindo.webp" alt="" className="w-36 h-36 mx-auto" />
              <h2 className="mt-6 text-2xl font-bold text-neutral-600">Login</h2>
              <p className="text-sm text-black/50 mt-2">Admin Panel Web Inventory</p>
            </div>

            <div className="mt-8">
              <div className="mt-6">
                <Form
                  form={form}
                  onFinish={onFinish}
                  layout="vertical"
                  className="space-y-6"
                  requiredMark={false}
                >
                  <div>
                    <Form.Item
                      name="username"
                      rules={[{ required: true, message: 'Username is required' }]}
                      style={{ marginBottom: 0 }}
                    >
                      <div>
                        <label htmlFor="username" className="block text-sm text-neutral-600">Username</label>
                        <div className="mt-1">
                          <Input
                            id="username"
                            placeholder="Enter username"
                            className="block w-full px-5 py-2.5 placeholder-gray-300 transition duration-500 ease-in-out transform border rounded-lg text-neutral-600 bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                            size='large'
                          />
                        </div>
                      </div>
                    </Form.Item>
                  </div>

                  <div>
                    <Form.Item
                      name="password"
                      rules={[{ required: true, message: 'Password is required' }]}
                      style={{ marginBottom: 0 }}
                    >
                      <div>
                        <label htmlFor="password" className="block text-sm text-neutral-600">Password</label>
                        <div className="mt-1">
                          <Input.Password
                            id="password"
                            placeholder="Enter password"
                            className="block w-full px-5 py-2.5 placeholder-gray-300 transition duration-500 ease-in-out transform border rounded-lg text-neutral-600 bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                            size='large'
                          />
                        </div>
                      </div>
                    </Form.Item>
                  </div>

                  <div>
                    <Form.Item style={{ marginBottom: 0 }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="flex items-center justify-center text-sm w-full px-10 !py-2.5 font-bold tracking-tight text-center text-white transition duration-500 ease-in-out transform bg-black/90 rounded-xl hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.9)',
                          borderColor: 'rgba(0, 0, 0, 0.9)',
                          height: 'auto',
                          boxShadow: 'none'
                        }}
                      >
                        Login
                      </Button>
                    </Form.Item>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
  );
}