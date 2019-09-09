import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileEducation = ({
  education: { school, degree, fieldofstudy, from, to, description }
}) => {
  return (
    <div>
      <h3>{school}</h3>
      <p><Moment format='DD/MM/YYYY'>{from}</Moment>-{!to?('currently pursuing'):(<Moment format='DD/MM/YYYY'>{to}</Moment>)}</p>
      <p>
        <strong>Degree: </strong>{degree}
      </p>
      <p>
        <strong>Field Of Study: </strong>{fieldofstudy}
      </p>
      <p>
        <strong>Description: </strong>{description}
      </p>
    </div>
  );
};

ProfileEducation.propTypes = {
  education: PropTypes.array.isRequired
};

export default ProfileEducation;
