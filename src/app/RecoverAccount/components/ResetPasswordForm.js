import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import FadeInGroup from 'animations/FadeInGroup'

const ResetPasswordForm = ({ handleSubmit }) => {
    return(
        <form className="animated fadeIn" onSubmit={handleSubmit}>
            <FadeInGroup>
                <header>
                    <h3>Reset Password</h3>
                </header>
    
                <label htmlFor="new_password">New Password</label>
                <input id="new_password" name="new_password" type="password" required/>
    
                <label htmlFor="confirm">Confirm Password</label>
                <input id="confirm" name="confirm" type="password" required/>
    
                <input type="submit" className="btn" value="Regain Access"/>
                <div className="prompt">
                    <Link className="link" to="/recover">Resend recovery link</Link>
                </div>
            </FadeInGroup>
        </form>
    )
}

ResetPasswordForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired
}

export default ResetPasswordForm