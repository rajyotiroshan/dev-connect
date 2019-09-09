import React,{useEffect, Fragment} from 'react'
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layouts/Spinner'
import { getProfileById} from '../../actions/profile'
import ProfileTop from './ProfileTop'
import ProfileAbout from './ProfileAbout'
import ProfileExperience from './ProfileExperience'
import ProfileEducation from './ProfileEducaiton'
import ProfileGithub from './ProfileGithub'

const Profile = ({ match, getProfileById, auth, profile:{profile, loading}}) => {
  useEffect(() => {
    getProfileById(match.params.id);
  }, [getProfileById, match.params.id])

  return (
    <Fragment>
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to='/profiles' className='btn btn-light'>
            Back To Profiles
          </Link>
          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === profile.user._id && (
              <Link to='/edit-profile' className='btn btn-dark'>
                Edit Profile
              </Link>
            )}
          <ProfileTop profile={profile} />
          <ProfileAbout profile={profile} />
          {/**profile experience */}
          <div className='profile-exp bg-white p-2'>
            <h2 className='text-primary'>Experience</h2>
            {profile.experience.length > 0 ? (
              <Fragment>
                {profile.experience.map(experience => (
                  <ProfileExperience
                    key={experience._id}
                    experience={experience}
                  />
                ))}
              </Fragment>
            ) : (
              <h4> No Experience Credentials</h4>
            )}
          </div>
          {/** profile education */}
          <div className='profile-edu bg-white p-2'>
            <h2 className='text-primary'>Education</h2>
            {profile.education.length > 0 ? (
              <Fragment>
                {profile.education.map(edu => (
                  <ProfileEducation key={edu._id} education={edu} />
                ))}
              </Fragment>
            ) : (
              <h4>No Education Credentials</h4>
            )}
          </div>
          {/** profile github repos */}
          {profile.githubusername && <ProfileGithub username={profile.githubusername}/>}  
        </Fragment>
      )}
    </Fragment>
  );
}

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
}) 

export default connect(mapStateToProps, { getProfileById})(Profile)
