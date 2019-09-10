import axios from 'axios';
import { setAlert} from './alert';
import {
  POST_ERROR,
  GET_POSTS,
  UPDATE_LIKES,
  DELETE_POST
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

//Update likes
export const addLike = (post_id) => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/like/${post_id}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: {post_id, likes: res.data}
    })
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status}
    })
  }
}

//REmove alike
export const removeLike = (post_id) => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/unlike/${post_id}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: {post_id, likes: res.data}
    })
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status}
    })
  }
}

//Delete post

export const deletePost= (post_id) => async dispatch => {
  try {
    const res = await axios.delete(`/api/posts/${post_id}`);
    dispatch({
      type: DELETE_POST,
      payload: post_id
    })
    dispatch(setAlert('Post Removed', 'succcess'))
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status}
    })
  }
}
