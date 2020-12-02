import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Table, Form, Button } from 'antd'
import EditableCell from './../../components/EditableCell'
import firebase, { auth } from './../../firebase'
import axios from './../../apis'
import ModalCreate from './../../components/Modal/create_question'
import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
} from '@ant-design/icons'
function RoomDetail() {
  const { id } = useParams()
  const [form] = Form.useForm()

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
    if (questionData) {
      const newQuestion = await axios.post(
        `/question/create/${id}`,
        questionData
      )
      setQuestions((pre) => [...pre, newQuestion.data])
    }

    setLoading(false)
  }

  const deleteQuestion = async (id) => {
    await axios.delete(`/question/${id}`)
    const newData = [...questions]
    const index = newData.findIndex((item) => id === item.id)
    if (index > -1) {
      newData.splice(index, 1)
      setQuestions(newData)
    } else {
      setQuestions(newData)
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
    await axios.post(`/question/${id}`)
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
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const columns = [
    {
      title: 'Question',
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

  return (
    <div className='wrapper'>
      <div>
        <Button onClick={() => setVisible(true)} style={{ margin: '1rem 0' }}>
          +Create new question
        </Button>
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
