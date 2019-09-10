import React,{ Fragment, useEffect} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { getPost} from '../../actions/post';
import Spinner from '../layouts/Spinner';
import PostItem from './PostItem';

const Posts = ({ getPost, post: {
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
      <div className='posts'>
        {posts.map(post => (
          <PostItem key={post._id} post={post} />
        ))}
      </div>
    </Fragment>
  );
}

Posts.propTypes = {
getPost: PropTypes.func.isRequired,
post: PropTypes.object.isRequired
}

const mapStateToProps = state=>({
  post: state.post
})

export default connect(mapStateToProps, {
  getPost
})(Posts);