import React, { useEffect, useState, useContext } from 'react'
import { Button, Table, Form, Tooltip, Popconfirm } from 'antd'
import { Link } from 'react-router-dom'
import './room.style.css'
import axios from './../../apis'
import ModalCreate from './../Modal/create_room'
import firebase, { performance } from './../../firebase'
import EditableCell from './../EditableCell'
import roomContext from './../../contexts/room/room-context'
import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import notification, { typeNotificaton } from './../Notification'

function Room() {
  const [roomState, roomDispatch] = useContext(roomContext)
  const createRoomTracking = performance.trace('createRoom')
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingKey, setEditingKey] = useState('')
  const isEditing = (record) => record.id === editingKey
  const fetchRoom = async () => {
    setLoading(true)
    const room = await axios.get('/room')
    setRooms(room.data)
    setLoading(false)
  }
  const createRoom = async (title, description) => {
    setLoading(true)
    createRoomTracking.start()
    try {
      const newRoom = await axios.post('/room', { title, description })

      setRooms((pre) => [...pre, newRoom.data])
      notification(typeNotificaton.success, 'Room created')
    } catch (err) {
      notification(typeNotificaton.error, 'Error occurs when creating room!')
    }
    createRoomTracking.stop()

    setLoading(false)
  }

  const deleteRoom = async (id) => {
    try {
      await axios.delete(`/room/${id}`)
      const newData = [...rooms]
      const index = newData.findIndex((item) => id === item.id)
      if (index > -1) {
        newData.splice(index, 1)
        setRooms(newData)
      } else {
        setRooms(newData)
      }
      notification(typeNotificaton.success, 'Room deleted')
    } catch (err) {
      notification(typeNotificaton.error, 'Error occurs')
    }
  }

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        fetchRoom()
      }
    })
  }, [])

  const edit = (record) => {
    form.setFieldsValue({
      title: '',
      description: '',
      ...record,
    })
    setEditingKey(record.id)
  }
  const cancel = () => {
    setEditingKey('')
  }

  const save = async (id) => {
    try {
      const row = await form.validateFields()
      await axios.patch(`/room/${id}`, row)
      const newData = [...rooms]
      const index = newData.findIndex((item) => id === item.id)
      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...row,
        })
        setRooms(newData)
        setEditingKey('')
      } else {
        newData.push(row)
        setRooms(newData)
        setEditingKey('')
      }
      notification(typeNotificaton.success, 'Room updated')
    } catch (errInfo) {
      notification(typeNotificaton.error, 'Error occurs!')
    }
  }

  const handleChooseRoom = (room) => {
    roomDispatch({ type: 'CHOOSE', payload: { data: room } })
  }

  const columns = [
    {
      title: 'アンケート名',
      dataIndex: 'title',
      editable: true,
      render: (_, record) => {
        return (
          <Link to={`/${record.id}`} onClick={() => handleChooseRoom(record)}>
            {record.title}
          </Link>
        )
      },
    },
    {
      title: '説明',
      dataIndex: 'description',
      editable: true,
    },
    {
      title: '質問数',
      dataIndex: 'questions',
      render: (_, record) => record?.questions?.length || 0,
    },

    {
      title: '行動',
      render: (_, record) => {
        const editable = isEditing(record)
        return editable ? (
          <>
            <Tooltip placement='top' title={'キャンセル'}>
              <Button
                style={{ marginRight: '1rem' }}
                onClick={cancel}
                size='small'
              >
                <CloseOutlined />
              </Button>
            </Tooltip>
            <Tooltip placement='top' title={'OK'}>
              <Button
                type='primary'
                onClick={() => save(record.id)}
                size='small'
              >
                <SaveOutlined />
              </Button>
            </Tooltip>
          </>
        ) : (
          <>
            <Tooltip placement='top' title={'編集'}>
              <Button
                style={{ marginRight: '1rem' }}
                onClick={() => edit(record)}
                size='small'
              >
                <EditOutlined />
              </Button>
            </Tooltip>
            <Popconfirm
              title={'Wanna delete this room ?'}
              cancelText='キャンセル'
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={() => deleteRoom(record.id)}
            >
              <Tooltip placement='top' title={'削除'}>
                <Button style={{ marginRight: '1rem' }} danger size='small'>
                  <DeleteOutlined />
                </Button>
              </Tooltip>
            </Popconfirm>
          </>
        )
      },
    },
  ]

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })
  return (
    <div className='wrapper'>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <div className='room-actions'>
          <div></div>
          <Button onClick={() => setVisible(true)} type='primary'>
            <PlusOutlined />
            アンケートの追加
          </Button>
        </div>
        <div className='room-list'>
          <Form form={form} component={false}>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              rowKey='id'
              dataSource={rooms}
              columns={mergedColumns}
              pagination={{
                pageSize: 6,
                hideOnSinglePage: true,
                simple: true,
              }}
              loading={loading}
            />
          </Form>
        </div>
      </div>
      <ModalCreate
        visible={visible}
        setVisible={setVisible}
        createRoom={createRoom}
        loading={loading}
      />
    </div>
  )
}

export default Room
