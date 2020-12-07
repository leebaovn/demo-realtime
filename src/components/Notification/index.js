import { notification } from 'antd'

export const typeNotificaton = {
  error: 'error',
  success: 'success',
  info: 'info',
  warning: 'warning',
}

const openNotification = (type, description) => {
  notification[type]({
    message:
      type === typeNotificaton.error
        ? 'エラー'
        : type === typeNotificaton.success
        ? '成功'
        : type === typeNotificaton.info
        ? '情報'
        : type === typeNotificaton.warning
        ? '警告'
        : '',
    description: description?.toString() ? description?.toString() : '',
    placement: 'topRight',
  })
}

export default openNotification
