import React from "react";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import { ClassList, ClassCreate, ClassEdit } from '../index.js'

const styles = theme => ({
  wrapper: {
    textAlign: "left",
  }
});

function ClassPage(props) {
  return (
    <Grid>
      <ClassList />
      <ClassCreate />
      <ClassEdit />
    </Grid>
  )
}

export default withStyles(styles)(ClassPage);