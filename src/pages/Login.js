import { useNavigate } from 'react-router-dom';
import { login } from '../API';

export default function Login() {  
    const navigate = useNavigate();

    return (
        <div>
            <h2>This feature requires you to log in!</h2>
            <br/>
            <p>This feature makes use of user-specific data.</p>
            <br/>
            <p>Please click <a href='javascript:void(0)' onClick={login}>log in</a> to continue to sign in</p>
            <p>...or click <a href='javascript:void(0)' onClick={() => navigate(-1)}>back</a> to return to the previous page.</p>
        </div>
    );
};