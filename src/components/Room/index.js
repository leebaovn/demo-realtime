import React, { useEffect, useState, useContext } from 'react'
import { Button, Input, Table, Form } from 'antd'
import { Link } from 'react-router-dom'
import './room.style.css'
import axios from './../../apis'
import ModalCreate from './../Modal/create_room'
import firebase from './../../firebase'
import EditableCell from './../EditableCell'
import roomContext from './../../contexts/room/room-context'
import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
  PlusOutlined,
} from '@ant-design/icons'
const { Search } = Input

function Room() {
  const [roomState, roomDispatch] = useContext(roomContext)
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingKey, setEditingKey] = useState('')
  const onSearch = () => {}
  const isEditing = (record) => record.id === editingKey
  const fetchRoom = async () => {
    setLoading(true)
    const room = await axios.get('/room')
    setRooms(room.data)
    setLoading(false)
  }
  const createRoom = async (title, description) => {
    setLoading(true)
    const newRoom = await axios.post('/room', { title, description })
    setRooms((pre) => [...pre, newRoom.data])
    setLoading(false)
  }

  const deleteQuestion = async (id) => {
    await axios.delete(`/room/${id}`)
    const newData = [...rooms]
    const index = newData.findIndex((item) => id === item.id)
    if (index > -1) {
      newData.splice(index, 1)
      setRooms(newData)
    } else {
      setRooms(newData)
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
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const handleChooseRoom = (room) => {
    roomDispatch({ type: 'CHOOSE', payload: { data: room } })
  }

  const columns = [
    {
      title: 'room-title',
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
      title: 'room-description',
      dataIndex: 'description',
      editable: true,
    },
    {
      title: 'number of questions',
      dataIndex: 'questions',
      render: (_, record) => record?.questions?.length || 0,
    },
    {
      title: 'actions',
      render: (_, record) => {
        const editable = isEditing(record)
        return editable ? (
          <>
            <Button
              style={{ marginRight: '1rem' }}
              onClick={cancel}
              size='small'
            >
              <CloseOutlined />
            </Button>
            <Button type='primary' onClick={() => save(record.id)} size='small'>
              <SaveOutlined />
            </Button>
          </>
        ) : (
          <>
            <Button
              style={{ marginRight: '1rem' }}
              onClick={() => edit(record)}
              size='small'
            >
              <EditOutlined />
            </Button>
            <Button
              style={{ marginRight: '1rem' }}
              onClick={() => deleteQuestion(record.id)}
              danger
              size='small'
            >
              <DeleteOutlined />
            </Button>
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
          <Search
            placeholder='search your room'
            allowClear
            onSearch={onSearch}
            style={{ width: 200, margin: '0' }}
          />
          <Button onClick={() => setVisible(true)} type='primary'>
            <PlusOutlined />
            Create room
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
              pagination={false}
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
