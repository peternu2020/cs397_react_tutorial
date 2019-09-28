import React, { useState, useEffect } from 'react';
import 'rbx/index.css';
import { Button, Container, Message, Title } from 'rbx';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { getCourseTerm, hasConflict, timeParts } from './times';


const firebaseConfig = {
  apiKey: "AIzaSyBtQ8eOdLnb6Gl10xwAr358J2khCszZrd8",
  authDomain: "nu-cs397-react-quick-tutorial.firebaseapp.com",
  databaseURL: "https://nu-cs397-react-quick-tutorial.firebaseio.com",
  projectId: "nu-cs397-react-quick-tutorial",
  storageBucket: "",
  messagingSenderId: "588607198122",
  appId: "1:588607198122:web:ef7110fb3537a2119451d3"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref();

const useSelection = () => {
  const [selected, setSelected] = useState([]);
  const toggle = (x) => {
    setSelected(selected.includes(x) ? selected.filter(y => y !== x) : [x].concat(selected))
  };
  return [ selected, toggle ];
};

const buttonColor = selected => (
  selected ? 'success' : null
);

const getCourseNumber = course => (
  course.id.slice(1, 4)
)


const moveCourse = course => {
  const meets = prompt('Enter new meeting data, in this format:', course.meets);
  if (!meets) return;
  const {days} = timeParts(meets);
  if (days) saveCourse(course, meets); 
  else moveCourse(course);
};

const saveCourse = (course, meets) => {
  db.child('courses').child(course.id).update({meets})
    .catch(error => alert(error));
};
  
const Course = ({ course, state, user }) => (
  <Button color={ buttonColor(state.selected.includes(course)) }
    onClick={ () => state.toggle(course) }
    onDoubleClick={ user ? () => moveCourse(course) : null }
    disabled={ hasConflict(course, state.selected) }
    >
    { getCourseTerm(course) } CS { getCourseNumber(course) }: { course.title }
  </Button>
);


export default Course;
