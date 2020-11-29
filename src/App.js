import './App.css';
import ColumnChart from './../src/ColumnChart';
import firebase, { firestore } from './firebase';
import React, { useEffect, useState } from 'react';
const pairData = (arrData) => {
  let arr = [];
  arrData?.forEach((ans) => {
    switch (ans) {
      case 'A':
        if (arr[0]) {
          arr[0] += 1;
        } else {
          arr[0] = 1;
        }
        break;
      case 'B':
        if (arr[1]) {
          arr[1] += 1;
        } else {
          arr[1] = 1;
        }
        break;
      case 'C':
        if (arr[2]) {
          arr[2] += 1;
        } else {
          arr[2] = 1;
        }
        break;
      case 'D':
        if (arr[3]) {
          arr[3] += 1;
        } else {
          arr[3] = 1;
        }
        break;

      default:
        break;
    }
  });
  arr[0] = arr[0] ?? 0;
  arr[1] = arr[1] ?? 0;
  arr[2] = arr[2] ?? 0;
  arr[3] = arr[3] ?? 0;
  return arr;
};
function App() {
  const roomRef = firestore.collection('room');
  const [data, setData] = useState([]);
  // const getData = async () => {
  //   const data = await roomRef.doc('1zFvzHq93RiczxRtrnPM').get();
  //   return data.data().answers;
  // };
  useEffect(() => {
    listenForVoting();
  }, []);
  // roomRef.onSnapshot((snapshot) => {
  //   console.log('imhere');
  //   const docChanges = snapshot.docChanges().forEach((change) => {
  //     if (change.type === 'modified') {
  //       const newData = change.doc.data().answers;
  //       const arrAns = pairData(newData);

  //       setData(arrAns);
  //     }
  //   });
  // });

  const listenForVoting = async () => {
    roomRef.onSnapshot(
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const newData = change.doc.data().answers;
          const arrAns = pairData(newData);
          setData(arrAns);
        });
      },
      (err) => console.log(err)
    );
  };
  const handleAns = async (ans) => {
    const data = await firestore
      .collection('room')
      .doc('1zFvzHq93RiczxRtrnPM')
      .get();
    const answerList = data.data().answers;
    answerList.push(ans);
    await firestore.collection('room').doc('1zFvzHq93RiczxRtrnPM').update({
      answers: answerList,
    });
  };
  return (
    <div className='App'>
      <ColumnChart data={data} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          maxWidth: '90%',
          margin: 'auto',
        }}
      >
        {['A', 'B', 'C', 'D'].map((ans, ind) => (
          <div
            key={ind}
            onClick={() => handleAns(ans)}
            style={{
              padding: '8px 16px',
              border: '1px solid #000',
              width: '100px',
              cursor: 'pointer',
            }}
          >
            {ans}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
