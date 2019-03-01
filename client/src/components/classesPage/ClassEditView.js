import React, { useState, useEffect } from 'react';
import {
  Grid,
  Checkbox,
  Card,
  Select,
  MenuItem,
  Button
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';
import axios from 'axios';

const styles = theme => ({
  wrapper: {
    color: 'white',
    marginTop: 50
  },
  cardList: {
    display: 'flex'
  },
  card: {
    width: 200,
    height: 200,
    border: '1px solid white',
    margin: theme.spacing.unit * 3
  },
  studentList: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid white',
    flexWrap: 'wrap',
    height: '30vh'
  }
});

function ClassEditView(props) {
  const { classes } = props;
  const classId = props.match.params.id;
  const ax = axios.create({
    baseURL: 'https://refreshr.herokuapp.com' // development
  });
  const [students, setStudents] = useState([]);
  const [refreshrs, setRefreshrs] = useState([]);
  const [teacherRefs, setTeacherRefs] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // get class details on mount
  useEffect(() => {
    fetchStudents();
    fetchRefreshrs();
    fetchTeacherRefreshrs();
  }, []);

  useEffect(() => {
    console.log('students:', students);
  }, [students]);

  useEffect(() => {
    console.log('refreshrs:', refreshrs);
  }, [refreshrs]);

  useEffect(() => {
    console.log('teacherRefs:', teacherRefs);
  }, [teacherRefs]);

  useEffect(() => {
    console.log(
      'selectedStudents:',
      selectedStudents,
      typeof selectedStudents[0]
    );
  }, [selectedStudents]);

  async function fetchStudents() {
    console.log(classId);
    const res = await ax.get(`/classes/${classId}/students`);
    console.log(res);
    setStudents(res.data);
  }

  async function fetchRefreshrs() {
    const res = await ax.get(`/classes/${classId}/refreshrs`);
    console.log(res);
    setRefreshrs(res.data);
  }

  async function fetchTeacherRefreshrs(id) {
    // this should be user id, not 35
    const res = await ax.get('/refreshrs/teachers/35');
    const unassignedRefreshrs = res.data.filter(r => !refreshrs.includes(r)); // unsure if this filter will work, need to test
    setTeacherRefs(unassignedRefreshrs);
  }

  function addRefreshr(id) {
    const addedRefreshr = teacherRefs.filter(r => r.id === id);
    // const updatedRefreshrs = refreshrs.concat(addedRefreshr); // this is messy :(
    setRefreshrs([...refreshrs, ...addedRefreshr]);
    setTeacherRefs(teacherRefs.filter(r => r.id !== id));
  }

  function removeRefreshr(id) {
    const removedRefreshr = refreshrs.filter(r => r.id === id);
    setTeacherRefs([...teacherRefs, ...removedRefreshr]);
    setRefreshrs(refreshrs.filter(r => r.id !== id));
  }

  function selectStudent(e) {
    const studentId = parseInt(e.target.value, 10);
    let updatedStudents = selectedStudents;
    if (e.target.checked) {
      updatedStudents = selectedStudents.concat(studentId);
    } else {
      updatedStudents = selectedStudents.filter(s => s !== studentId);
    }
    setSelectedStudents(updatedStudents);
  }

  function dropStudents() {
    // change endpoint to accept array
    // endpoint is /classes/:id/drop/studentId
    // clear selectedStudents
  }

  return (
    <Grid className={props.classes.wrapper}>
      <h1>Students</h1>
      <Grid className={classes.studentList}>
        {selectedStudents.length ? (
          <Button variant="outlined" onClick={dropStudents}>
            Remove selected from class
          </Button>
        ) : null}
        {students.map(s => (
          <Grid key={s.id}>
            <span>{`${s.first_name} ${s.last_name}`}</span>
            <Checkbox value={`${s.id}`} onClick={e => selectStudent(e)} />
          </Grid>
        ))}
      </Grid>

      <Grid className={classes.refreshrList}>
        <h1>Refreshrs</h1>
        {teacherRefs.length ? (
          <span>Add a refreshr to this class</span>
        ) : (
          <Link to="/refreshrs">
            Create a new refreshr to assign it to the class
          </Link>
        ) // this link should go to the create refreshr page, but not sure what the route is
        }
        <Select onChange={e => addRefreshr(e.target.value)}>
          {teacherRefs.map(r => (
            <MenuItem value={r.id}>{r.name}</MenuItem>
          ))}
        </Select>
        <Grid className={classes.cardList}>
          {refreshrs.map(r => (
            <Card className={classes.card} key={r.id} raised>
              {r.name}
              <DeleteIcon onClick={() => removeRefreshr(r.id)} />
            </Card>
          ))}
        </Grid>
      </Grid>
      <Button variant="outlined">Save Changes</Button>
    </Grid>
  );
}

export default withStyles(styles)(ClassEditView);
