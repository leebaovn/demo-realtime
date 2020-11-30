import React from 'react'
import { Button, Input, Table } from 'antd'
import { Link } from 'react-router-dom'
import './room.style.css'
const { Search } = Input

const columns = [
  {
    title: '#',
    key: '',
  },
  {
    title: 'room-title',
    dataIndex: 'title',
    key: '',
    render: (_, record) => {
      return <Link to={`/${record.id}`}>{record.title}</Link>
    },
  },
  {
    title: 'room-description',
    dataIndex: 'description',
    key: '',
  },
  {
    title: 'number of questions',
    dataIndex: 'questionCount',
    key: '',
  },
]

const dataFake = [
  {
    id: 1,
    title: 'new room',
    description: 'this is new room',
    questionCount: 10,
  },
  {
    id: 123,

    title: 'new room1',
    description: 'this is new room1',
    questionCount: 101,
  },
  {
    id: 1512,

    title: 'new room2',
    description: 'this is new room2',
    questionCount: 102,
  },
  {
    id: 16622,

    title: 'new room3',
    description: 'this is new room3',
    questionCount: 103,
  },
]
function Room() {
  const onSearch = () => {}
  const onCreateRoom = () => {}
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
          <Button onClick={onCreateRoom}>Create room</Button>
        </div>
        <div className='room-list'>
          <Table dataSource={dataFake} columns={columns} pagination={false} />
        </div>
      </div>
    </div>
  )
}

export default Room
