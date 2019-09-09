import axios from 'axios';
import { setAlert} from './alert';
import {
  POST_ERROR,
  GET_POSTS
} from './Types'

//Get Post

export const getPost = () => async dispatch => {
  try {
    const res = await axios.get(`/api/posts`);
    dispatch({
      type: GET_POSTS,
      payload: res.data
    })
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status}
    })
  }
}