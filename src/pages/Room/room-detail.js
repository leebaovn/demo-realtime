import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Table, Input, InputNumber, Popconfirm, Form, Button } from 'antd'
import EditableCell from './../../components/EditableCell'

// const columns = [
//   {
//     title: 'Question',
//     dataIndex: 'question',
//     editable: true,
//   },
//   {
//     title: 'Correct Ans',
//     dataIndex: 'correctAns',
//     editable: true,
//   },
//   {
//     title: 'Response time',
//     dataIndex: 'responseTime',
//     editable: true,

//     render: (time) => {
//       return `${time}s`
//     },
//   },
//   {
//     title: 'A',
//     dataIndex: 'answerA',
//     editable: true,
//   },
//   {
//     title: 'B',
//     dataIndex: 'answerB',
//     editable: true,
//   },
//   {
//     title: 'C',
//     dataIndex: 'answerC',
//     editable: true,
//   },
//   {
//     title: 'D',
//     dataIndex: 'answerD',
//     editable: true,
//   },
//   {
//     title: 'Actions',
//     editable: true,

//     render: (_, record) => {
//       return (
//         <>
//           <Button style={{ marginRight: '1rem' }} onClick={() => edit(record)}>
//             Edit
//           </Button>
//           <Button type='primary'>Show</Button>
//         </>
//       )
//     },
//   },
// ]

const fakeData = [
  {
    id: 123,
    question: 'hello world',
    responseTime: 34,
    correctAns: 'A',
    answerA: 'fromA',
    answerB: 'fromB',
    answerC: 'fromC',
    answerD: 'fromD',
  },
  {
    id: 122133,
    question: 'hello world',
    responseTime: 30,
    correctAns: 'A',
    answerA: 'fromA2',
    answerB: 'fromB2',
    answerC: 'fromC2',
    answerD: 'fromD2',
  },
  {
    id: 122133,
    question: 'hello world',
    correctAns: 'A',
    responseTime: 34,

    answerA: 'fromA3',
    answerB: 'fromB3',
    answerC: 'fromC3',
    answerD: 'fromD3',
  },
  {
    id: 1232323,
    question: 'hello world',
    correctAns: 'A',
    answerA: 'fromA4',
    responseTime: 34,

    answerB: 'fromB4',
    answerC: 'fromC4',
    answerD: 'fromD4',
  },
]

function RoomDetail() {
  const { id } = useParams()
  const [form] = Form.useForm()
  const [editingKey, setEditingKey] = useState('')
  const [data, setData] = useState(fakeData)
  const isEditing = (record) => record.id === editingKey

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

  const save = async (id) => {
    try {
      const row = await form.validateFields()

      const newData = [...data]
      const index = newData.findIndex((item) => id === item.id)
      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...row,
        })
        setData(newData)
        setEditingKey('')
      } else {
        newData.push(row)
        setData(newData)
        setEditingKey('')
      }
      console.log(newData, '222222222')
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const columns = [
    {
      title: 'Question',
      dataIndex: 'question',
      editable: true,
    },
    {
      title: 'Correct Ans',
      dataIndex: 'correctAns',
      editable: true,
    },
    {
      title: 'Response time',
      dataIndex: 'responseTime',
      editable: true,

      render: (time) => {
        return `${time}s`
      },
    },
    {
      title: 'A',
      dataIndex: 'answerA',
      editable: true,
    },
    {
      title: 'B',
      dataIndex: 'answerB',
      editable: true,
    },
    {
      title: 'C',
      dataIndex: 'answerC',
      editable: true,
    },
    {
      title: 'D',
      dataIndex: 'answerD',
      editable: true,
    },
    {
      title: 'Actions',

      render: (_, record) => {
        const editable = isEditing(record)
        return editable ? (
          <>
            <Button style={{ marginRight: '1rem' }} onClick={cancel}>
              cancel
            </Button>
            <Button type='primary' onClick={() => save(record.id)}>
              Save
            </Button>
          </>
        ) : (
          <>
            <Button
              style={{ marginRight: '1rem' }}
              onClick={() => edit(record)}
            >
              Edit
            </Button>
            <Button type='primary'>Show</Button>
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
        <Button>+Create new question</Button>
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            dataSource={data}
            columns={mergedColumns}
            pagination={false}
          />
        </Form>
      </div>
    </div>
  )
}

export default RoomDetail
