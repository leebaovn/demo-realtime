import React, { useEffect, useState, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Table, Form, Button, Modal } from 'antd'
import EditableCell from './../../components/EditableCell'
import firebase, { auth } from './../../firebase'
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
} from '@ant-design/icons'
import QRCode from 'qrcode.react'
import roomContext from './../../contexts/room/room-context'
import notification, { typeNotificaton } from './../../components/Notification'
import tinyUrl from 'tinyurl'
function RoomDetail() {
  const { id } = useParams()
  const [form] = Form.useForm()
  const [{ room }, roomDispatch] = useContext(roomContext)

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
        if (newQuestion) {
          setQuestions((pre) => [...pre, newQuestion.data])
          notification(typeNotificaton.success, 'Question created')
        } else {
          notification(typeNotificaton.error, 'Error occurs')
        }
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
      title: 'Actions',
      width: '20vw',

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
            <Button type='primary' size='small' onClick={() => show(record.id)}>
              Show
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
        inputType: col.dataIndex === 'responseTime' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })

  const exportQRCode = async () => {
    const newUrl = await tinyUrl.shorten(
      `http://localhost:3000/roomplay/${id}/login`
      // `https://realtime-demo-chart.web.app/roomplay/${id}/login`
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
        <div
          style={{
            margin: '1rem 0',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        >
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
            Create new question
          </Button>
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
            pagination={false}
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
              バック
            </Link>
          </Button>
        </div>
      </div>
      <ModalCreate
        visible={visible}
        setVisible={setVisible}
        createQuestion={createQuestion}
      />
    </div>
  )
}

export default RoomDetail
