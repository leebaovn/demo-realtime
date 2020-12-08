import React, { useEffect, useState, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Table, Form, Button, Modal, Tooltip, Popconfirm } from 'antd'
import EditableCell from './../../components/EditableCell'
import firebase, { firestore } from './../../firebase'
import axios from './../../apis'
import ModalCreate from './../../components/Modal/create_question'
import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
  QrcodeOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import QRCode from 'qrcode.react'
import roomContext from './../../contexts/room/room-context'
import notification, { typeNotificaton } from './../../components/Notification'
import tinyUrl from 'tinyurl'
import './room.style.css'
function RoomDetail() {
  const { id } = useParams()
  const [form] = Form.useForm()
  const [{ room }, roomDispatch] = useContext(roomContext)
  const roomRef = firestore.collection('room')
  const roomTitle = room?.title
  //define state section
  const [questions, setQuestions] = useState([])
  const [editingKey, setEditingKey] = useState('')
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const isEditing = (record) => record.id === editingKey
  const fetchQuestions = async () => {
    setLoading(true)
    const question = await axios.get(`/question/${id}`)
    setQuestions(question.data)
    setLoading(false)
  }
  const createQuestion = async (questionData) => {
    setLoading(true)
    try {
      if (questionData) {
        const newQuestion = await axios.post(
          `/question/create/${id}`,
          questionData
        )
        setQuestions((pre) => [...pre, newQuestion.data])
        notification(typeNotificaton.success, 'Question created')
      }
    } catch (err) {
      notification(typeNotificaton.error, 'Error occurs')
    }

    setLoading(false)
  }
  const deleteQuestion = async (id) => {
    try {
      await axios.delete(`/question/${id}`)
      const newData = [...questions]
      const index = newData.findIndex((item) => id === item.id)
      if (index > -1) {
        newData.splice(index, 1)
        setQuestions(newData)
      } else {
        setQuestions(newData)
      }
      notification(typeNotificaton.success, 'Question deleted')
    } catch (err) {
      notification(typeNotificaton.error, 'Error occurs')
    }
  }

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        fetchQuestions()
      }
    })
  }, [])

  const listenForActiveUser = async () => {
    // if (!!currentUserId) {
    roomRef.doc(id).onSnapshot((snapshot) => {
      const roomSnapshot = Object.assign({}, snapshot.data(), {
        id: snapshot.id,
      })
      if (roomSnapshot) {
        roomDispatch({ type: 'MODIFIED', payload: { data: roomSnapshot } })
      }
    })
    // }
  }

  useEffect(() => {
    listenForActiveUser()
  }, [])

  const edit = (record) => {
    form.setFieldsValue({
      question: '',
      correctAns: '',
      answerA: '',
      responseTime: '',
      answerB: '',
      answerC: '',
      answerD: '',
      ...record,
    })
    setEditingKey(record.id)
  }
  const cancel = () => {
    setEditingKey('')
  }

  const show = async (id) => {
    try {
      await axios.post(`/question/${id}`)
      notification(typeNotificaton.success, 'Question showed')
    } catch (err) {
      notification(typeNotificaton.error, 'Error occurs')
    }
  }

  const save = async (id) => {
    try {
      const row = await form.validateFields()
      await axios.patch(`/question/${id}`, row)
      const newData = [...questions]
      const index = newData.findIndex((item) => id === item.id)
      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...row,
        })
        setQuestions(newData)
        setEditingKey('')
      } else {
        newData.push(row)
        setQuestions(newData)
        setEditingKey('')
      }
      notification(typeNotificaton.success, 'Question editted')
    } catch (errInfo) {
      notification(typeNotificaton.error, 'Error occurs')
    }
  }

  const columns = [
    {
      title: '質問',
      dataIndex: 'question',
      editable: true,
      width: '14vw',
    },

    {
      title: '期限',
      dataIndex: 'responseTime',
      editable: true,
      width: '10vw',

      render: (time) => {
        return `${time}s`
      },
    },
    {
      title: 'A',
      dataIndex: 'answerA',
      editable: true,
      width: '14vw',
    },
    {
      title: 'B',
      dataIndex: 'answerB',
      width: '14vw',
      editable: true,
    },
    {
      title: 'C',
      dataIndex: 'answerC',
      width: '14vw',
      editable: true,
    },
    {
      title: 'D',
      dataIndex: 'answerD',
      width: '14vw',
      editable: true,
    },

    {
      title: '行動',
      width: '20vw',

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
              title='Wanna delete this question?'
              cancelText='キャンセル'
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={() => deleteQuestion(record.id)}
            >
              <Tooltip placement='top' title={'削除'}>
                <Button style={{ marginRight: '1rem' }} danger size='small'>
                  <DeleteOutlined />
                </Button>
              </Tooltip>
            </Popconfirm>
            <Tooltip placement='top' title={'アンケートを始める'}>
              <Button
                type='primary'
                size='small'
                onClick={() => show(record.id)}
              >
                Show
              </Button>
            </Tooltip>
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
        inputType: col.dataIndex === 'responseTime' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })

  const exportQRCode = async () => {
    const newUrl = await tinyUrl.shorten(
      `https://realtime-demo-chart.web.app/roomplay/${id}/login`
    )
    Modal.info({
      title: <p>{roomTitle}</p>,
      centered: true,

      content: (
        <>
          <QRCode level='H' size={256} value={newUrl} />
          <a href={newUrl} target='_blank'>
            {newUrl}
          </a>
        </>
      ),
      onOk() {},
    })
  }

  return (
    <div className='wrapper'>
      <div>
        <div className='room-info'>
          <Button
            style={{ marginRight: 'auto', textTransform: 'uppercase' }}
            type='dashed'
          >
            {room?.title}
          </Button>
          <Button onClick={exportQRCode} style={{ marginRight: '1rem' }}>
            <QrcodeOutlined />
            Export QRCode
          </Button>
          <Button onClick={() => setVisible(true)} type='primary'>
            <PlusOutlined />
            質問の追加
          </Button>
        </div>
        <div className='user-count'>
          <span>{room?.members.length}</span>
          ユーザがアンケートに参加しています。
        </div>
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            dataSource={questions}
            columns={mergedColumns}
            loading={loading}
            pagination={{
              pageSize: 6,
              hideOnSinglePage: true,
              simple: true,
            }}
            rowKey='id'
          />
        </Form>
        <div style={{ width: '100%', textAlign: 'right' }}>
          <Button
            style={{ margin: '1rem 0', textTransform: 'uppercase' }}
            type='dashed'
            danger
          >
            <Link to='/'>
              <ArrowLeftOutlined />
              戻る
            </Link>
          </Button>
        </div>
      </div>
      <ModalCreate
        visible={visible}
        setVisible={setVisible}
        createQuestion={createQuestion}
        loading={loading}
      />
    </div>
  )
}

export default RoomDetail
