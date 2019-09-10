import React,{ Fragment, useEffect} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { getPost} from '../../actions/post';
import Spinner from '../layouts/Spinner';
import PostItem from './PostItem';
import PostForm from './PostForm';

const Posts = ({ getPost, posts: {
  posts, loading
}}) => {

  useEffect(()=>{
    getPost();
  },[getPost])
  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Posts</h1>
      <p className='lead'>
        <i className='fa fa-user'></i>Welcome to the community
      </p>
      {/** PostForm */}
      <PostForm/>
      {/**Post Item */}
      <div className='posts'>
        {posts && posts.map(post => (
          <PostItem key={post._id} post={post} />
        ))}
      </div>
    </Fragment>
  );
}

Posts.propTypes = {
getPost: PropTypes.func.isRequired,
posts: PropTypes.object.isRequired
}

const mapStateToProps = state=>({
  posts: state.post
})

export default connect(mapStateToProps, {
  getPost
})(Posts);
